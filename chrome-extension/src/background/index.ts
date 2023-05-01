import { saveToNotion as saveNotion, summarizeContent } from '@starnexus/core'
import type { ContentRequest, ListenerSendResponse, PageData, SwResponse } from '~/types'

async function sendSavedStatus(res: SwResponse) {
  if (res.tabId) {
    chrome.tabs.sendMessage(res.tabId, {
      action: 'savedStatusToContent',
      data: res,
    })
  }
  else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0)
        return
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'sendResponseToContent',
        data: res,
      })
    })
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId', 'openaiApiKey', 'pictureBed', 'webHub'])
  const notionApiKey = result.notionApiKey ?? ''
  const notionDatabaseId = result.notionDatabaseId ?? ''
  const openaiApiKey = result.openaiApiKey ?? ''
  const pictureBed = result.pictureBed ?? ''
  const webHub = result.webHub ?? ''
  await chrome.storage.sync.set({ notionApiKey, notionDatabaseId, openaiApiKey, pictureBed, webHub })
})

chrome.runtime.onMessage.addListener(async (request: ContentRequest, sender, sendResponse: ListenerSendResponse) => {
  const action = request.action
  if (action === 'saveToNotion') {
    if (request.data) {
      const tabId = sender.tab?.id
      const pageData = request.data
      pageData.tabId = tabId
      saveToNotion(pageData).then((res) => {
        sendSavedStatus(res)
      }).catch((err) => {
        sendSavedStatus(err)
      })
      sendResponse({ message: 'handling save to notion' })
    }
    else {
      // console.log('Error: request.data is undefined.')
      sendResponse({ message: 'Error: request.data is undefined.', error: true })
    }
  }
  else if (action === 'checkStarred') {
    const tabId = sender.tab?.id
    const url = request.data.url

    checkStarredStatus(url, tabId).then((res) => {
      sendStarredStatus(res)
    }).catch((err) => {
      sendStarredStatus(err)
    })
    sendResponse({ message: 'checking' })
  }
  return true
})

async function saveProcess(pageData: PageData): Promise<SwResponse> {
  try {
    let summary = ''
    let categories = ['Others']
    const storage = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId', 'openaiApiKey'])
    const notionApiKey = storage.notionApiKey ?? ''
    const databaseId = storage.notionDatabaseId ?? ''
    const openaiApiKey = storage.openaiApiKey ?? ''

    if (!notionApiKey || !databaseId) {
      // console.log('Missing Notion API key or Database ID in settings.')
      const error = { tabId: pageData.tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error: 'Missing Notion API key or Database ID in settings.' }
      return error
    }

    if (openaiApiKey) {
      const { data, error } = await summarizeContent(openaiApiKey, pageData)
      if (error)
        return { tabId: pageData.tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error }

      summary = data.summary
      categories = data.categories
    }
    else {
      summary = pageData.content
    }

    const notionPage = {
      databaseId: databaseId as string,
      title: pageData.title,
      summary,
      url: pageData.url,
      categories,
      status: 'Starred' as const,
      meta: pageData.meta,
    }

    const { data, error } = await saveNotion(notionApiKey, notionPage)
    if (error)
      return { tabId: pageData.tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error }

    return { tabId: pageData.tabId, starred: data.starred, notionPageId: data.notionPageId }
  }
  catch (error) {
    return { tabId: pageData.tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error: error.message ? error.message : 'Error saving to Notion.' }
  }
}

function saveToNotion(pageData: PageData): Promise<SwResponse> {
  return new Promise((resolve, reject) => {
    saveProcess(pageData).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

async function sendStarredStatus(status: SwResponse) {
  if (status.tabId) {
    chrome.tabs.sendMessage(status.tabId, {
      action: 'starredStatusToContent',
      data: status,
    })
  }
}

async function checkStarredStatus(url: string, tabId: number): Promise<SwResponse> {
  const storage = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId'])
  const notionApiKey = storage.notionApiKey ?? ''
  const databaseId = storage.notionDatabaseId ?? ''
  let starred = false
  let notionPageId = ''

  if (!notionApiKey || !databaseId)
    return ({ tabId, notionPageId, starred, error: 'Missing Notion API key or Database ID in settings.' })

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
          'Authorization': `Bearer ${notionApiKey}`,
        },
        body: JSON.stringify({
          filter: {
            property: 'URL',
            rich_text: {
              contains: url,
            },
          },
        }),
      },
    )

    if (response.status !== 200) {
      const res = await response.json()
      let error = 'Notion API error: '
      if (res.message)
        error += res.message
      else
        error += response.status.toString()

      return ({ tabId, starred, notionPageId, error })
    }
    else {
      const data = await response.json()

      if (data.results.length > 0) {
        if (data.results[0].properties.Status.select.name === 'Starred')
          starred = true
        notionPageId = data.results[0].id
      }

      return ({ tabId, starred, notionPageId })
    }
  }
  catch (err) {
    return ({ tabId, starred, notionPageId, error: err.message ? err.message : 'Error check starred status.' })
  }
}
