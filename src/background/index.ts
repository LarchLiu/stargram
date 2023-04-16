const extensionId = 'bgiijojohannkkolgillijnkfgadpkpc'
function sendResponseToPopup(res) {
  chrome.runtime.sendMessage({
    action: 'saveToNotionFinish',
    data: res,
  })
}

chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId'])
  const apiKey = result.notionApiKey ?? 'secret_ufFyjuKs4JqyKZkkKPjuzzbRAc8R3GdgrzdxMXosaeB'
  const databaseId = result.notionDatabaseId ?? '63f34aafd23e4e438c51a917bf45d939'
  chrome.storage.sync.set({ notionApiKey: apiKey, notionDatabaseId: databaseId })
})

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'saveToNotion') {
    if (request.data) {
      const { title, url, category, summary } = request.data
      saveToNotion(title, url, category, summary).then((res) => {
        // console.log(res)
        sendResponseToPopup(res)
      }).catch((err) => {
        sendResponseToPopup({ message: err.message, error: true })
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

async function saveProcess(title: string, url: string, category: string, summary: string) {
  try {
    // 获取 Notion API 密钥和数据库 ID
    const result = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId'])
    const apiKey = result.notionApiKey ?? 'secret_ufFyjuKs4JqyKZkkKPjuzzbRAc8R3GdgrzdxMXosaeB'
    const databaseId = result.notionDatabaseId ?? '63f34aafd23e4e438c51a917bf45d939'
    if (!apiKey || !databaseId) {
      console.log('Missing Notion API key or Database ID in settings.')
      return ({ message: 'Missing Notion API key or Database ID in settings.', error: true })
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
            multi_select: [
              {
                name: category,
              },
            ],
          },
        },
      }),
    })

    if (!response.ok) {
      return ({ message: 'Error creating new page in Notion.', error: true })
    }
    else {
      console.log('Created new page in Notion successfully!')
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
        return ({ message: 'Error appending child block to Notion page.', error: true })
      }
      else {
        // console.log('Appended child block to Notion page successfully!')
        return ({ message: 'Data saved successfully.' })
      }
    }
  }
  catch (error) {
    // console.log('Error saving to Notion:', error)
    return ({ message: 'Error saving to Notion.', error: true })
  }
}

function saveToNotion(title: string, url: string, category: string, summary: string) {
  return new Promise((resolve, reject) => {
    saveProcess(title, url, category, summary).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}
