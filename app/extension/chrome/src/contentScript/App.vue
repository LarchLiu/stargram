<script setup lang="ts">
import { ref } from 'vue'
import { GITHUB_DOMAIN, GITHUB_URL, starFillSrc, starSrc } from '~/const'
import type { ListenerSendResponse, PageInfo, SwRequest } from '~/types'

const notification = ref()
const offset = 100
const duration = 3000
let twinkTimer: NodeJS.Timer
let starred = false
let twinkStarred = false
let notionPageId = ''
const id = 'star-nexus'

function init() {
  const button = document.querySelector(`#${id}`)
  if (button)
    return

  if (location.host === GITHUB_DOMAIN) {
    const regexGithubPath = /https:\/\/github.com\/([^\/]*\/[^\/]*)/g // match github.com/user/repo/
    const pathMatch = regexGithubPath.exec(location.href)
    const path = pathMatch ? pathMatch[1] : ''
    if (path) {
      chrome.runtime.sendMessage(
        {
          action: 'checkStarred',
          data: { webUrl: `${GITHUB_URL}/${path}` },
        },
      )
    }
  }
}

init()

async function getDataFromPage(): Promise<{ data?: PageInfo; error?: string }> {
  const result = await chrome.storage.sync.get(['pictureBed', 'webHub'])
  // const pictureBed = result.pictureBed ?? ''
  const webHub = result.webHub ?? ''

  return {
    data: {
      webUrl: location.href,
      // picBed: pictureBed,
      webHub,
      notionPageId,
      starred,
    },
  }
}

function startTwink() {
  const snBtn = document.querySelector(`#${id}`)
  if (snBtn) {
    const icon = snBtn.querySelector('img')
    twinkStarred = starred
    twinkTimer = setInterval(() => {
      twinkStarred = !twinkStarred
      if (twinkStarred)
        icon!.src = starFillSrc
      else
        icon!.src = starSrc
    }, 500)
  }
}

async function handleSaveToNotion() {
  // console.log('Handling save to Notion in the content script', document)
  startTwink()

  const { data: pageInfo, error } = await getDataFromPage()
  if (error) {
    if (twinkTimer)
      clearInterval(twinkTimer)
    ElNotification({
      title: 'StarNexus',
      type: 'error',
      message: error,
      offset,
      duration,
      appendTo: notification.value,
    })
    return
  }

  chrome.runtime.sendMessage(
    {
      action: 'saveToNotion',
      data: pageInfo,
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
    if (data) {
      if (data.error) {
        ElNotification({
          title: 'StarNexus',
          type: 'error',
          message: data.error,
          offset,
          duration,
          appendTo: notification.value,
        })
      }
      else {
        if (twinkTimer)
          clearInterval(twinkTimer)
        starred = data.starred
        notionPageId = data.notionPageId!
        createStarButton(starred)
      }
    }

    sendResponse({ message: 'ok', error: false })
  }
  else if (action === 'savedStatusToContent') {
    if (twinkTimer)
      clearInterval(twinkTimer)
    if (data) {
      if (data.error) {
        starred = data.starred
        ElNotification({
          title: 'StarNexus',
          type: 'error',
          message: data.error,
          offset,
          duration,
          appendTo: notification.value,
        })
      }
      else {
        starred = data.starred
        notionPageId = data.notionPageId!
        ElNotification({
          title: 'StarNexus',
          type: 'success',
          message: starred ? 'Starred this page 🎉' : 'Unstarred this page 👌',
          offset,
          duration,
          appendTo: notification.value,
        })
      }
    }

    const snBtn = document.querySelector(`#${id}`)
    if (snBtn) {
      const icon = snBtn.querySelector('img')
      if (starred)
        icon!.src = starFillSrc
      else
        icon!.src = starSrc
    }

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

function createButton(starred: boolean) {
  const a = document.createElement('a')
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
</script>

<template>
  <div ref="notification" />
</template>
