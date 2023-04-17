const extensionId = 'gcdmalofjiaofdiocehcjaalkmlealkb'
function sendResponseToPopup(res: Error | { message: string }): void {
  chrome.runtime.sendMessage({
    action: 'saveToNotionFinish',
    data: { message: res.message, error: res instanceof Error },
  })
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
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
  if (request.action === 'saveToNotion') {
    if (request.data) {
      const { title, url, category, summary } = request.data
      saveToNotion(title, url, category, summary).then((res) => {
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
  return true
})

async function saveProcess(title: string, url: string, category: string, summary: string): Promise<Error | { message: string }> {
  const catArry = category.split(',')
  const catOpt = catArry.map((item) => {
    return {
      name: item,
    }
  })
  try {
    // 获取 Notion API 密钥和数据库 ID
    const result = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId'])
    const apiKey = result.notionApiKey ?? ''
    const databaseId = result.notionDatabaseId ?? ''
    if (!apiKey || !databaseId) {
      // console.log('Missing Notion API key or Database ID in settings.')
      return new Error('Missing Notion API key or Database ID in settings.')
    }

    // 创建 Notion 页面并保存信息
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${apiKey}`,
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
                  content: title,
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
            url,
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
            'Authorization': `Bearer ${apiKey}`,
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

function saveToNotion(title: string, url: string, category: string, summary: string): Promise<Error | { message: string }> {
  return new Promise((resolve, reject) => {
    saveProcess(title, url, category, summary).then((res) => {
      if (res instanceof Error)
        reject(res)
      else
        resolve(res)
    }).catch((error: Error) => {
      reject(error)
    })
  })
}
