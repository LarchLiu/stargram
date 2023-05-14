import { NotionStorage, SaveWebInfoChain, SummarizeContent, WebCard, WebInfoByApi, errorMessage } from '@starnexus/core'
import type { ContentRequest, ListenerSendResponse, PageInfo, SwResponse } from '~/types'

async function sendSavedStatus(res: SwResponse) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs.length && res.tabId && tabs[0].id && res.tabId !== tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'savedStatusToContent',
        data: res,
      })
    }
  })
  if (res.tabId) {
    chrome.tabs.sendMessage(res.tabId, {
      action: 'savedStatusToContent',
      data: res,
    })
  }
  else {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (tabs.length === 0)
        return
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'sendResponseToContent',
          data: res,
        })
      }
    })
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId', 'openaiApiKey', 'starNexusHub', 'uiLang', 'promptsLang'])
  const notionApiKey = result.notionApiKey ?? ''
  const notionDatabaseId = result.notionDatabaseId ?? ''
  const openaiApiKey = result.openaiApiKey ?? ''
  const starNexusHub = result.starNexusHub ?? ''
  const uiLang = result.uiLang ?? 'en'
  const promptsLang = result.promptsLang ?? 'en'
  await chrome.storage.sync.set({ notionApiKey, notionDatabaseId, openaiApiKey, starNexusHub, uiLang, promptsLang })
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
    const url = request.data?.webUrl

    if (url && tabId) {
      checkStarredStatus(url, tabId).then((res) => {
        sendStarredStatus(res)
      }).catch((err) => {
        sendStarredStatus(err)
      })
    }
    sendResponse({ message: 'checking' })
  }
  return true
})

async function saveToNotion(pageInfo: PageInfo): Promise<SwResponse> {
  const storage = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId', 'openaiApiKey', 'promptsLang', 'starNexusHub'])
  const notionApiKey = storage.notionApiKey ?? ''
  const databaseId = storage.notionDatabaseId ?? ''
  const openaiApiKey = storage.openaiApiKey ?? ''
  const promptsLang = storage.promptsLang ?? 'en'
  const starNexusHub = storage.starNexusHub ?? ''

  if (!notionApiKey || !databaseId) {
    // console.log('Missing Notion API key or Database ID in settings.')
    const error = { tabId: pageInfo.tabId, starred: pageInfo.starred, notionPageId: pageInfo.notionPageId, error: 'Missing Notion API key or Database ID in settings.' }
    return error
  }

  const url = pageInfo.webUrl
  const webInfo = new WebInfoByApi({
    urls: {
      webUrl: url,
    },
    starNexusHub,
  })

  const webCard = new WebCard({ starNexusHub })

  const summarize = new SummarizeContent({ apiKey: openaiApiKey, lang: promptsLang })
  const notion = new NotionStorage({
    config: {
      apiKey: notionApiKey,
      databaseId,
    },
  })

  const chain = new SaveWebInfoChain({
    webInfo,
    webCard,
    summarizeContent: summarize,
    dataStorage: notion,
  })

  try {
    const info = await chain.call()
    return { tabId: pageInfo.tabId, starred: info.starred, notionPageId: info.notionPageId }
  }
  catch(error: any) {
    const message = errorMessage(error)
    return { tabId: pageInfo.tabId, starred: pageInfo.starred, notionPageId: pageInfo.notionPageId, error: message }
  }
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
  catch (err: any) {
    return ({ tabId, starred, notionPageId, error: err.message ? err.message : 'Error check starred status.' })
  }
}