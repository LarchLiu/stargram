import { GITHUB_DOMAIN, GITHUB_HOST, GITHUB_RAW_DOMAIN, GITHUB_REPOS_API, starFillSrc, starSrc } from '~/const'
import type { GithubMeta, ListenerSendResponse, PageData, SwRequest } from '~/types'

let twinkTimer = null
let starred = false
let twinkStarred = false
let notionPageId = ''
const id = 'star-nexus'

function init() {
  const button = document.querySelector(`#${id}`)
  if (button)
    return

  if (location.host === GITHUB_HOST) {
    const regexGithubPath = /https:\/\/github.com\/([^\/]*\/[^\/]*)/g // match github.com/user/repo/
    const pathMatch = regexGithubPath.exec(location.href)
    const path = pathMatch ? pathMatch[1] : ''
    if (path) {
      chrome.runtime.sendMessage(
        {
          action: 'checkStarred',
          data: { url: `${GITHUB_DOMAIN}/${path}` },
        },
      )
    }
  }
}

init()

async function getDataFromPage(): Promise<PageData> {
  const regexGithubPath = /https:\/\/github.com\/([^\/]*\/[^\/]*)/g // match github.com/user/repo/
  let title = document.title
  let url = location.href
  const host = location.host
  const githubMeta: GithubMeta = {}
  let content = ''
  const githubPathMatch = regexGithubPath.exec(url)
  const githubPath = githubPathMatch ? githubPathMatch[1] : ''

  if (host === GITHUB_HOST && githubPath) {
    const repoJson = await fetch(`${GITHUB_REPOS_API}/${githubPath}`).then(r => r.json()).catch(e => e.message || 'error fetch repo')
    title = `${repoJson.full_name}: ${repoJson.description}`
    url = repoJson.html_url
    const tags = repoJson.topics
    // const tagsJson = await fetch(`${GITHUB_REPOS_API}/${path}/topics`).then(r => r.json()).catch(e => e.message || 'error fetch tags')
    const languagesJson = await fetch(`${GITHUB_REPOS_API}/${githubPath}/languages`).then(r => r.json()).catch(e => e.message || 'error fetch languages')
    if (tags && tags.length > 0)
      githubMeta.tags = tags

    if (languagesJson)
      githubMeta.languages = Object.keys(languagesJson)
    // fetch readme
    const res = await fetch(`${GITHUB_RAW_DOMAIN}/${githubPath}/main/README.md`)
    let readme = ''
    if (res.status === 200)
      readme = await res.text()

    content = `${title}\n\n${readme}`
    if (content.length > 1000) {
      content = content.substring(0, 1000)
      content += '...'
    }
  }
  return { title, url, content, starred, github: githubMeta, notionPageId }
}

function startTwink() {
  const snBtn = document.querySelector(`#${id}`)
  const icon = snBtn.querySelector('img')
  twinkStarred = starred
  twinkTimer = setInterval(() => {
    twinkStarred = !twinkStarred
    if (twinkStarred)
      icon.src = starFillSrc
    else
      icon.src = starSrc
  }, 500)
}

async function handleSaveToNotion() {
  // console.log('Handling save to Notion in the content script')
  const pageData = await getDataFromPage()
  startTwink()

  chrome.runtime.sendMessage(
    {
      action: 'saveToNotion',
      data: pageData,
    },
  )
}

chrome.runtime.onMessage.addListener(async (request: SwRequest, sender, sendResponse: ListenerSendResponse) => {
  const action = request.action
  const data = request.data

  // TODO: remove saveToNotion from popup
  if (action === 'saveToNotion') {
    handleSaveToNotion()
    sendResponse({ message: 'Handling save to Notion in the content script', error: false })
  }
  else if (action === 'starredStatusToContent') {
    if (data && data.error) {
      alert(data.error)
    }
    else {
      if (twinkTimer)
        clearInterval(twinkTimer)
      starred = data.starred
      notionPageId = data.notionPageId
      createStarButton(starred)
    }

    sendResponse({ message: 'ok', error: false })
  }
  else if (action === 'savedStatusToContent') {
    const snBtn = document.querySelector(`#${id}`)
    const icon = snBtn.querySelector('img')
    if (twinkTimer)
      clearInterval(twinkTimer)
    if (data) {
      if (data.error) {
        starred = data.starred
        alert(data.error)
      }
      else {
        starred = data.starred
        notionPageId = data.notionPageId
      }
    }

    if (starred)
      icon.src = starFillSrc
    else
      icon.src = starSrc

    sendResponse({ message: 'ok', error: false })
  }
  else {
    sendResponse({ message: 'Unknow action', error: true })
  }
  return true // 添加这一行以确保响应可以在异步操作完成后发送
})

// https://github.com/antfu/open-in-codeflow/blob/main/index.js
const css = [
  // Hide comments from codeflow bot
  '.js-timeline-item:has(* > .author[href="/apps/codeflowapp"]) { display: none; }',
].join('')

const style = document.createElement('style')
style.innerHTML = css
document.head.appendChild(style)

function updateButtonHref(button) {
  // button.href = location.href.replace('https://github.com/', 'https://pr.new/')
}

function createButton(starred: boolean) {
  const a = document.createElement('a')
  updateButtonHref(a)
  a.target = '_blank'
  a.classList.add('btn')
  a.classList.add('btn-sm')
  a.innerText = ' StarNexus'
  a.id = id
  Object.assign(a.style, {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5em',
  })
  a.addEventListener('click', () => {
    handleSaveToNotion()
  })
  const icon = document.createElement('img')
  icon.src = starred ? starFillSrc : starSrc
  icon.height = 18
  icon.classList.add('octicon')
  a.prepend(icon)
  return a
}

function createStarButton(starred: boolean) {
  const repoActions = document.querySelector('#repository-details-container ul')
  if (repoActions) {
    const li = document.createElement('li')
    li.appendChild(createButton(starred))
    repoActions.prepend(li)
    return
  }

  const prActions = document.querySelector('.gh-header-actions')
  if (prActions)
    prActions.prepend(createButton(starred))
}

// run()
// setTimeout(run, 500) // deduped, no harm in making sure the dom is ready

// listen to github page loaded event
document.addEventListener('pjax:end', () => init())
document.addEventListener('turbo:render', () => init())
