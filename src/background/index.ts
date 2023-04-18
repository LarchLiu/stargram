import { SUMMARIZE_PROMPT } from '~/const'
import type { PageData, SwResponse } from '~/types'

const extensionId = 'gcdmalofjiaofdiocehcjaalkmlealkb'

let popupOpen = false
async function sendResponseToPopup(res: SwResponse) {
  if (popupOpen) {
    await chrome.runtime.sendMessage({
      action: 'saveToNotionFinish',
      data: { message: res.message, error: res instanceof Error },
    })
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0)
      return
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'sendResponseToContent',
      data: { message: res.message, error: res instanceof Error },
    })
  })
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
      const pageData = request.data
      saveToNotion(pageData).then((res) => {
        // console.log(res)
        sendResponseToPopup(res)
      }).catch((err: Error) => {
        sendResponseToPopup(err)
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
  return true
})

async function saveProcess(data: PageData): Promise<SwResponse> {
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
              content: data.content,
            },
          ],
          max_tokens: 200,
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
      summary = data.content
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
                  content: data.title,
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
            url: data.url,
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
        return ({ message: 'Data saved successfully.' })
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
