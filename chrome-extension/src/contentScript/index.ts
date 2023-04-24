import { getWebsiteInfo } from '@starnexus/core'
import { GITHUB_DOMAIN, GITHUB_HOST, starFillSrc, starSrc } from '~/const'
import type { ListenerSendResponse, PageData, SwRequest } from '~/types'

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

async function getDataFromPage(): Promise<{ data?: PageData; error?: string }> {
  const result = await chrome.storage.sync.get(['pictureBed'])
  const pictureBed = result.pictureBed ?? ''
  const info = await getWebsiteInfo(location.href, pictureBed)

  return { data: { ...info.data, notionPageId, starred }, error: info.error }
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
  startTwink()

  const { data: pageData, error } = await getDataFromPage()
  if (error) {
    if (twinkTimer)
      clearInterval(twinkTimer)
    alert(error)
    return
  }

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
