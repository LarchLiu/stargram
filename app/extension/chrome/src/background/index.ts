import { errorMessage } from '@stargram/core/utils'
import { WebCardByApi } from '@stargram/core/webCard'
import { WebInfoByApi } from '@stargram/core/webInfo'
import { SaveWebInfoChain } from '@stargram/core/chain/saveWebInfo'
import type { EmbeddingsInfo, VectorMetaData, SavedNotion } from '@stargram/core'
import { storageInfo } from '@stargram/core/storage'
import type { TLLM } from '@stargram/core/llm'
import { llmInfo } from '@stargram/core/llm'
import type { ContentRequest, ListenerSendResponse, PageInfo, SwResponse } from '~/types'

const DEFAULT_STARGRAM_HUB = 'https://stargram.cc'
let stopSyncMarks = false
let stopSyncGithbu = false
let marksCount = 0
let currentMark = 0
let githubCount = 0
let currentGithub = 0

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
  const result = await chrome.storage.sync.get(['uiLang', 'userConfig'])
  const uiLang = result.uiLang ?? 'en'
  const userConfig = result.userConfig ?? ''
  await chrome.storage.sync.set({ uiLang, userConfig })
})

chrome.runtime.onMessage.addListener(async (request: ContentRequest, sender, sendResponse: ListenerSendResponse) => {
  const action = request.action
  if (action === 'saveToDB') {
    if (request.data) {
      const tabId = sender.tab?.id
      const pageData = request.data
      pageData.tabId = tabId
      saveToDB(pageData).then((res) => {
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
  else if (action === 'syncBookmarks') {
    if (request.data) {
      const pageData = request.data
      saveToDB(pageData).then((res) => {
        chrome.runtime.sendMessage({
          action: 'syncBookmarksResult',
          data: res
        })
      }).catch((err) => {
        chrome.runtime.sendMessage({
          action: 'syncBookmarksResult',
          data: err
        })
      })
      sendResponse({ message: 'handling save to DB' })
    }
    else {
      // console.log('Error: request.data is undefined.')
      sendResponse({ message: 'Error: request.data is undefined.', error: true })
    }
  }
  return true
})

async function saveToDB(pageInfo: PageInfo): Promise<SwResponse> {
  const storage = await chrome.storage.sync.get(['userConfig'])
  const userConfig = storage.userConfig ?? ''
  
  if (userConfig) {
    const config = JSON.parse(userConfig)
    const stargramHub = config.app.stargramHub ?? DEFAULT_STARGRAM_HUB
    const url = pageInfo.webUrl
    const webInfo = new WebInfoByApi({
      stargramHub,
      browserlessToken: config.webInfo.config.browserlessToken,
    })

    const webCard = new WebCardByApi({ stargramHub })


    const llm = new (llmInfo[config.llm.select as TLLM])(config.llm.config)

    const dataStorage = new (storageInfo.DataStorage[config.dataStorage.select])(config.dataStorage.config)

    const embeddingsInfo: EmbeddingsInfo = llm.embeddingsInfo()
    const metaData: VectorMetaData = {
      source: url,
      appName: config.app.appName,
      botId: config.app.botId,
      userId: config.app.userId,
    }
    const vectorStorage = new (storageInfo.VectorStorage[config.vectorStorage.select])({ ...config.vectorStorage.config, embeddingsInfo, metaData })

    const chain = new SaveWebInfoChain({
      webInfo,
      webCard,
      llm,
      dataStorage,
      vectorStorage,
    })

    try {
      const info = await chain.call({
        webUrl: url,
      }) as SavedNotion
      return { tabId: pageInfo.tabId, starred: info.starred, storageId: info.storageId }
    }
    catch(error: any) {
      const message = errorMessage(error)
      return { tabId: pageInfo.tabId, starred: pageInfo.starred, storageId: pageInfo.storageId, error: message }
    }
  }
  else {
    return { tabId: pageInfo.tabId, starred: pageInfo.starred, storageId: pageInfo.storageId, error: 'No User Config.' }
  }

  

  // if (!notionApiKey || !databaseId) {
  //   // console.log('Missing Notion API key or Database ID in settings.')
  //   const error = { tabId: pageInfo.tabId, starred: pageInfo.starred, notionPageId: pageInfo.storageId, error: 'Missing Notion API key or Database ID in settings.' }
  //   return error
  // }

  // const url = pageInfo.webUrl
  // const webInfo = new WebInfoByApi({
  //   stargramHub,
  //   browserlessToken,
  // })

  // const webCard = new WebCardByApi({ stargramHub })

  // const openai = new Openai({ apiKey: openaiApiKey, lang: promptsLang })
  // const notion = new NotionDataStorage(
  //   {
  //     apiKey: notionApiKey,
  //     databaseId,
  //     defaultOgImage: 'https://kiafhufrshqyrvlpsdqg.supabase.co/storage/v1/object/public/pics-bed/stargram.png?v=stargramogimage',
  //   },
  // )

  // const chain = new SaveWebInfoChain({
  //   webInfo,
  //   webCard,
  //   llm: openai,
  //   dataStorage: notion,
  // })

  // try {
  //   const info = await chain.call({
  //     webUrl: url,
  //   }) as SavedNotion
  //   return { tabId: pageInfo.tabId, starred: info.starred, storageId: info.storageId }
  // }
  // catch(error: any) {
  //   const message = errorMessage(error)
  //   return { tabId: pageInfo.tabId, starred: pageInfo.starred, storageId: pageInfo.storageId, error: message }
  // }
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
  const storage = await chrome.storage.sync.get(['userConfig'])
  const userConfig = storage.userConfig ?? ''
  let starred = false
  let storageId = ''
  if (userConfig) {
    const config = JSON.parse(userConfig)
    const dataStorage = new (storageInfo.DataStorage[config.dataStorage.select])(config.dataStorage.config)
    try {
      const res = await dataStorage.query(url)
      if (res) {
        starred = res.starred
        storageId = res.storageId
      }
      return ({ tabId, starred, storageId })
    }
    catch (err: any) {
      return ({ tabId, starred, storageId, error: err.message ? err.message : 'Error check starred status.' })
    }
  }
  else {
    return ({ tabId, starred, storageId, error: 'No User Config.' })
  }

  // if (!notionApiKey || !databaseId)
  //   return ({ tabId, storageId, starred, error: 'Missing Notion API key or Database ID in settings.' })

  // try {
  //   const response = await fetch(
  //     `https://api.notion.com/v1/databases/${databaseId}/query`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Notion-Version': '2022-06-28',
  //         'Authorization': `Bearer ${notionApiKey}`,
  //       },
  //       body: JSON.stringify({
  //         filter: {
  //           property: 'URL',
  //           rich_text: {
  //             contains: url,
  //           },
  //         },
  //       }),
  //     },
  //   )

  //   if (response.status !== 200) {
  //     const res = await response.json()
  //     let error = 'Notion API error: '
  //     if (res.message)
  //       error += res.message
  //     else
  //       error += response.status.toString()

  //     return ({ tabId, starred, storageId, error })
  //   }
  //   else {
  //     const data = await response.json()

  //     if (data.results.length > 0) {
  //       if (data.results[0].properties.Status.select.name === 'Starred')
  //         starred = true
  //       storageId = data.results[0].id
  //     }

  //     return ({ tabId, starred, storageId })
  //   }
  // }
  // catch (err: any) {
  //   return ({ tabId, starred, storageId, error: err.message ? err.message : 'Error check starred status.' })
  // }
}
