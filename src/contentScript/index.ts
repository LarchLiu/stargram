import { GITHUB_HOST } from '~/const'
import type { GithubMeta, ListenerSendResponse, PageData, SwRequest } from '~/types'

let twinkTimer = null
let starred = false
let twinkStarred = false
let notionPageId = ''
const id = 'star-nexus'
const starSrc = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="256" height="256" viewBox="0 0 256 256"%3E%3Cpath fill="currentColor" d="M237.47 70.71a11.18 11.18 0 0 0-9.73-7.71l-38.43-3.25l-15-35a11.24 11.24 0 0 0-20.63 0l-15 35L100.27 63a11.12 11.12 0 0 0-6.36 19.54L123 107.38l-8.72 36.92a11.09 11.09 0 0 0 4.26 11.5a11.23 11.23 0 0 0 12.42.6l33-19.64l33.05 19.64a11.22 11.22 0 0 0 12.42-.6a11.07 11.07 0 0 0 4.25-11.5L205 107.38l29.08-24.83a11.08 11.08 0 0 0 3.39-11.84Zm-40.66 27.9a11.05 11.05 0 0 0-3.61 11l8.39 35.55l-31.83-18.92a11.23 11.23 0 0 0-11.52 0l-31.82 18.92l8.38-35.56a11 11 0 0 0-3.6-11l-27.89-23.81l36.85-3.12a11.2 11.2 0 0 0 9.37-6.74L164 31.17l14.48 33.76a11.19 11.19 0 0 0 9.36 6.74l36.86 3.12ZM84.24 124.24l-56 56a6 6 0 0 1-8.48-8.48l56-56a6 6 0 0 1 8.48 8.48Zm16 47.52a6 6 0 0 1 0 8.48l-56 56a6 6 0 0 1-8.48-8.48l56-56a6 6 0 0 1 8.48 0Zm72 0a6 6 0 0 1 0 8.48l-56 56a6 6 0 0 1-8.48-8.48l56-56a6 6 0 0 1 8.49 0Z"%2F%3E%3C%2Fsvg%3E'
const starFillSrc = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="256" height="256" viewBox="0 0 256 256"%3E%3Cpath fill="currentColor" d="m235.39 84.07l-28.15 24l8.43 35.73a13.09 13.09 0 0 1-5 13.58a13.25 13.25 0 0 1-14.63.7l-32-19l-32 19a13.25 13.25 0 0 1-14.63-.7a13.1 13.1 0 0 1-5-13.58l8.43-35.73l-28.16-24A13.13 13.13 0 0 1 100.1 61l37.23-3.15L151.85 24a13.24 13.24 0 0 1 24.31 0l14.52 33.87L227.9 61a13.12 13.12 0 0 1 7.49 23.06ZM85.66 114.34a8 8 0 0 0-11.32 0l-56 56a8 8 0 0 0 11.32 11.32l56-56a8 8 0 0 0 0-11.32Zm16 56a8 8 0 0 0-11.32 0l-56 56a8 8 0 0 0 11.32 11.32l56-56a8 8 0 0 0 0-11.32Zm60.69 0l-56 56a8 8 0 0 0 11.32 11.32l56-56a8 8 0 0 0-11.31-11.32Z"%2F%3E%3C%2Fsvg%3E'

chrome.runtime.sendMessage(
  {
    action: 'checkStarred',
    data: { url: location.href },
  },
)

async function getDataFromPage(): Promise<PageData> {
  const title = document.title
  const url = location.href
  const host = location.host
  const githubMeta: GithubMeta = {}
  let content = ''

  if (host === GITHUB_HOST) {
    const path = location.pathname
    const readmeEl = document.getElementById('readme')
    const titleArr = title.split(':')
    const tags = []
    const languages = []
    let about = ''
    if (titleArr.length > 1) {
      titleArr.shift()
      about = titleArr.join(':')
    }

    const tagsEl = document.getElementsByClassName('topic-tag')
    for (let i = 0; i < tagsEl.length; i++)
      tags.push((tagsEl[i] as HTMLElement).innerText)

    const languagesEl = document.querySelectorAll('.Layout-sidebar .BorderGrid-row .color-fg-default.text-bold.mr-1')
    for (let i = 0; i < languagesEl.length; i++)
      languages.push((languagesEl[i] as HTMLSpanElement).textContent)

    if (tags.length)
      githubMeta.tags = tags
    if (languages.length)
      githubMeta.languages = languages
    if (readmeEl) {
      const branchMenu = document.getElementById('branch-select-menu')
      const branchEl = branchMenu.querySelector('.css-truncate-target') as HTMLElement
      const branch = (branchEl && branchEl.innerText) ? branchEl.innerText : 'main'
      const readmePath = `https://raw.githubusercontent.com/${path}/${branch}/README.md`
      // fetch readme
      const res = await fetch(readmePath)
      const readme = await res.text()
      content = `${about}\n\n${readme}`
      if (content.length > 1000) {
        content = content.substring(0, 1000)
        content += '...'
      }
      // console.log(category)
    }
    else {
      content = about || title
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
  const button = document.querySelector(`#${id}`)
  if (button) {
    // Always update the link to support GitHub SPA navigations
    updateButtonHref(button)
    return
  }

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
// document.addEventListener('pjax:end', () => run())
// document.addEventListener('turbo:render', () => run())
