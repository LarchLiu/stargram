<script setup lang="ts">
import { fail } from 'assert';
import { ref } from 'vue'
import { GITHUB_DOMAIN, GITHUB_URL, starFillSrc, starSrc } from '~/const'
import type { ListenerSendResponse, PageInfo, SwRequest } from '~/types'

const notification = ref()
const offset = 100
const duration = 3000
let twinkTimer: NodeJS.Timer
let starred = false
let twinkStarred = false
let storageId = ''
const id = 'stargram'

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
  return {
    data: {
      webUrl: location.href,
      storageId,
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

async function handleSaveToDB() {
  // console.log('Handling save to Notion in the content script', document)
  startTwink()

  const { data: pageInfo, error } = await getDataFromPage()
  if (error) {
    if (twinkTimer)
      clearInterval(twinkTimer)
    ElNotification({
      title: 'Stargram',
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
      action: 'saveToDB',
      data: pageInfo,
    },
  )
}

chrome.runtime.onMessage.addListener(async (request: SwRequest, sender, sendResponse: ListenerSendResponse) => {
  const action = request.action
  const data = request.data

  // TODO: remove saveToDB from popup
  if (action === 'saveToDB') {
    handleSaveToDB()
    sendResponse({ message: 'Handling save to Notion in the content script', error: false })
  }
  else if (action === 'starredStatusToContent') {
    if (data) {
      if (data.error) {
        ElNotification({
          title: 'Stargram',
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
        storageId = data.storageId!
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
          title: 'Stargram',
          type: 'error',
          message: data.error,
          offset,
          duration,
          appendTo: notification.value,
        })
      }
      else {
        starred = data.starred
        storageId = data.storageId!
        ElNotification({
          title: 'Stargram',
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
  else if (action === 'syncBookmarksStatus') {
    const status = request.syncStatus
    if (status && status.isEnd) {
      const offset = 100
      const duration = 3000
      const successCount = status.successCount
      const failCount = status.failCount
      ElNotification({
        title: 'Stargram',
        type: 'success',
        message: `Sync Bookmars Finished 🎉\nSuccess: ${successCount}\nFail: ${failCount}`,
        offset,
        duration,
        appendTo: notification.value,
      })
    }
  }
  else if (action === 'syncGithubStatus') {
    const status = request.syncStatus
    if (status && status.isEnd) {
      const offset = 100
      const duration = 3000
      const successCount = status.successCount
      const failCount = status.failCount
      ElNotification({
        title: 'Stargram',
        type: 'success',
        message: `Sync Github Starred Finished 🎉\nSuccess: ${successCount}\nFail: ${failCount}`,
        offset,
        duration,
        appendTo: notification.value,
      })
    }
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
  a.innerText = ' Stargram'
  a.id = id
  Object.assign(a.style, {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5em',
  })
  a.addEventListener('click', () => {
    handleSaveToDB()
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
