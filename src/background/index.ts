import { SUMMARIZE_PROMPT } from '~/const'
import type { PageData, SwResponse } from '~/types'

const extensionId = 'gcdmalofjiaofdiocehcjaalkmlealkb'

let popupOpen = false
async function sendSavedStatus(res: SwResponse) {
  const data = { message: res.message, error: res instanceof Error }
  if (popupOpen) {
    await chrome.runtime.sendMessage({
      action: 'savedStatusToPopup',
      data,
    })
  }
  if (!(res instanceof Error) && res.tabId) {
    chrome.tabs.sendMessage(res.tabId, {
      action: 'savedStatusToContent',
      data,
    })
  }
  else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0)
        return
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'sendResponseToContent',
        data,
      })
    })
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId', 'openaiApiKey'])
  const apiKey = result.notionApiKey ?? ''
  const databaseId = result.notionDatabaseId ?? ''
  const openaiApiKey = result.openaiApiKey ?? ''
  await chrome.storage.sync.set({ notionApiKey: apiKey, notionDatabaseId: databaseId, openaiApiKey })
})

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const action = request.action
  if (action === 'saveToNotion') {
    if (request.data) {
      const tabId = sender.tab?.id
      const pageData = request.data as PageData
      pageData.tabId = tabId
      saveToNotion(pageData).then((res) => {
        // console.log(res)
        sendSavedStatus(res)
      }).catch((err: Error) => {
        sendSavedStatus(err)
      })
      sendResponse({ message: 'handling save to notion' })
    }
    else {
      // console.log('Error: request.data is undefined.')
      sendResponse({ message: 'Error: request.data is undefined.', error: true })
    }
  }
  else if (action === 'openViewOpen') {
    popupOpen = true
  }
  else if (action === 'openViewClose') {
    popupOpen = false
  }
  else if (action === 'checkStarred') {
    const tabId = sender.tab?.id
    const url = request.data.url

    checkStarredStatus(url, tabId)
    sendResponse({ message: 'checking' })
  }
  return true
})

async function saveProcess(pageData: PageData): Promise<SwResponse> {
  try {
    let summary = ''
    let category = ''
    let catOpt = [{
      name: 'Others',
    }]

    const storage = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId', 'openaiApiKey'])
    const notionApiKey = storage.notionApiKey ?? ''
    const databaseId = storage.notionDatabaseId ?? ''
    const openaiApiKey = storage.openaiApiKey ?? ''

    if (!notionApiKey || !databaseId) {
      // console.log('Missing Notion API key or Database ID in settings.')
      return new Error('Missing Notion API key or Database ID in settings.')
    }

    if (openaiApiKey) {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: SUMMARIZE_PROMPT,
            },
            {
              role: 'user',
              content: pageData.content,
            },
          ],
          max_tokens: 400,
          temperature: 0.5,
        }),
      })
      const openaiData = await openaiRes.json()
      let text = openaiData.choices[0].message.content as string
      text = text.replace(/\n/g, '')
      const regexSummery = /Summary:(.*)Categories:/g
      const regexCategory = /Categories:(.*)$/g
      const summaryArr = regexSummery.exec(text)
      const categoryArr = regexCategory.exec(text)
      if (summaryArr)
        summary = summaryArr[1].trim()

      if (categoryArr)
        category = categoryArr[1].trim()

      const catArry = category.split(',')
      catOpt = catArry.map((item) => {
        return {
          name: item,
        }
      })
    }
    else {
      summary = pageData.content
    }

    // 创建 Notion 页面并保存信息
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${notionApiKey}`,
        'Access-Control-Allow-Origin': `chrome-extension://${extensionId}`,
      },
      body: JSON.stringify({
        parent: {
          database_id: databaseId,
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: pageData.title,
                },
              },
            ],
          },
          Summary: {
            rich_text: [
              {
                text: {
                  content: summary,
                },
              },
            ],
          },
          URL: {
            url: pageData.url,
          },
          Category: {
            multi_select: catOpt,
          },
        },
      }),
    })

    if (!response.ok) {
      return new Error('Error creating new page in Notion.')
    }
    else {
      // console.log('Created new page in Notion successfully!')
      const newPageResponse = await response.json()
      const newPageId = newPageResponse.id // 获取新页面的 ID

      const imageBlock = {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: '- Notion API Team',
                link: {
                  type: 'url',
                  url: 'https://twitter.com/NotionAPI',
                },
              },
            }],
        },
      }

      const addChildResponse = await fetch(
        `https://api.notion.com/v1/blocks/${newPageId}/children`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
            'Authorization': `Bearer ${notionApiKey}`,
            'Access-Control-Allow-Origin': `chrome-extension://${extensionId}`,
          },
          body: JSON.stringify({
            children: [imageBlock],
          }),
        },
      )

      if (!addChildResponse.ok) {
        return new Error('Error appending child block to Notion page.')
      }
      else {
        // console.log('Appended child block to Notion page successfully!')
        return ({ message: 'Data saved successfully.', tabId: pageData.tabId })
      }
    }
  }
  catch (error) {
    // console.log('Error saving to Notion:', error)
    return new Error('Error saving to Notion.')
  }
}

function saveToNotion(pageData: PageData): Promise<SwResponse> {
  return new Promise((resolve, reject) => {
    saveProcess(pageData).then((res) => {
      if (res instanceof Error)
        reject(res)
      else
        resolve(res)
    }).catch((error: Error) => {
      reject(error)
    })
  })
}

async function sendStarredStatus(tabId: number, starred: boolean, error?: string) {
  if (popupOpen) {
    await chrome.runtime.sendMessage({
      action: 'starredStatusToPopup',
      data: { message: error, error: !!error, starred },
    })
  }
  if (tabId) {
    chrome.tabs.sendMessage(tabId, {
      action: 'starredStatusToContent',
      data: { message: error, error: !!error, starred },
    })
  }
}

async function checkStarredStatus(url: string, tabId: number) {
  const storage = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId'])
  const notionApiKey = storage.notionApiKey ?? ''
  const databaseId = storage.notionDatabaseId ?? ''
  let starred = false

  if (!notionApiKey || !databaseId)
    return sendStarredStatus(tabId, starred, 'Missing Notion API key or Database ID in settings.')

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

  if (!response.ok) {
    return sendStarredStatus(tabId, starred, 'Error check starred status.')
  }
  else {
    // console.log('Appended child block to Notion page successfully!')
    const data = await response.json()
    if (data.results.length > 0)
      starred = true

    sendStarredStatus(tabId, starred)
  }
}
