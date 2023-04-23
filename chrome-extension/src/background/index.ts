import { GITHUB_HOST, SUMMARIZE_PROMPT } from '~/const'
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
  const result = await chrome.storage.sync.get(['notionApiKey', 'notionDatabaseId', 'openaiApiKey', 'pictureBed'])
  const notionApiKey = result.notionApiKey ?? ''
  const notionDatabaseId = result.notionDatabaseId ?? ''
  const openaiApiKey = result.openaiApiKey ?? ''
  const pictureBed = result.pictureBed ?? ''
  await chrome.storage.sync.set({ notionApiKey, notionDatabaseId, openaiApiKey, pictureBed })
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
        sendSavedStatus({ tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error: err.message ? err.message : 'Error saved to Notion.' })
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
      const error = { tabId: pageData.tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error: 'Missing Notion API key or Database ID in settings.' }
      return error
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
      if (openaiRes.status !== 200) {
        const res = await openaiRes.json()
        let error = 'Openai API error: '
        if (res.error && res.error.message)
          error += res.error.message
        else
          error += `${openaiRes.status.toString()}`
        return { tabId: pageData.tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error }
      }

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

      const catArry = (category || 'Others').split(',')
      catOpt = catArry.map((item) => {
        if (item.endsWith('.'))
          item = item.slice(0, -1)
        return {
          name: item,
        }
      })
    }
    else {
      summary = pageData.content
    }

    const body: { [key: string]: any } = {
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
        Categories: {
          multi_select: catOpt,
        },
        Status: {
          select: {
            name: 'Starred',
          },
        },
      },
    }
    let imageUrl = ''
    if (pageData.url.includes(GITHUB_HOST) && pageData.meta.host === GITHUB_HOST) {
      const github = pageData.meta
      body.properties = {
        ...body.properties,
        Website: {
          select: {
            name: github.website,
          },
        },
      }
      if (github.languages) {
        const languages = github.languages.map((lang) => {
          return {
            name: lang,
          }
        })
        body.properties = {
          ...body.properties,
          Languages: {
            multi_select: languages,
          },
        }
      }
      if (github.tags) {
        const tags = github.tags.map((tag) => {
          return {
            name: tag,
          }
        })
        body.properties = {
          ...body.properties,
          Tags: {
            multi_select: tags,
          },
        }
      }
      if (github.socialPreview)
        imageUrl = github.socialPreview
    }

    if (pageData.notionPageId) {
      body.properties = {
        ...body.properties,
        Status: {
          select: {
            name: pageData.starred ? 'Unstarred' : 'Starred',
          },
        },
      }
      const res = await fetch(`https://api.notion.com/v1/pages/${pageData.notionPageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (res.status !== 200) {
        const _res = await res.json()
        let error = 'Notion API error: '
        if (_res.message)
          error += _res.message
        else
          error += `${_res.status.toString()} Error updating page in Notion.`

        return { tabId: pageData.tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error }
      }
      else {
        return ({ tabId: pageData.tabId, notionPageId: pageData.notionPageId, starred: !pageData.starred })
      }
    }

    // 创建 Notion 页面并保存信息
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${notionApiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (response.status !== 200) {
      const res = await response.json()
      let error = 'Notion API error: '
      if (res.message)
        error += res.message
      else
        error += `${response.status.toString()} Error creating new page in Notion.`

      return { tabId: pageData.tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error }
    }
    else {
      // console.log('Created new page in Notion successfully!')
      const newPageResponse = await response.json()
      const newPageId = newPageResponse.id // 获取新页面的 ID
      if (!imageUrl)
        return ({ tabId: pageData.tabId, notionPageId: newPageId, starred: true })

      const imageBlock = {
        object: 'block',
        type: 'embed',
        embed: {
          url: imageUrl,
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
          },
          body: JSON.stringify({
            children: [imageBlock],
          }),
        },
      )

      if (addChildResponse.status !== 200) {
        const res = await addChildResponse.json()
        let error = 'Notion API error: '
        if (res.message)
          error += res.message
        else
          error += `${addChildResponse.status.toString()} Error appending child block to Notion page.`

        return { tabId: pageData.tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error }
      }
      else {
        // console.log('Appended child block to Notion page successfully!')
        return ({ tabId: pageData.tabId, notionPageId: newPageId, starred: true })
      }
    }
  }
  catch (error) {
    return { tabId: pageData.tabId, starred: pageData.starred, notionPageId: pageData.notionPageId, error: error.message ? error.message : 'Error saving to Notion.' }
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
