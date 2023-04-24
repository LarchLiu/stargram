import { getWebsiteInfo, summarizeContent } from '@starnexus/core'
import { ENV } from './env.js'

/**
 * Given a URL, returns information about the website if it is hosted on GitHub.
 *
 * @param {string} text - The text input by user.
 * @return {Promise<FetchWebsite[]>} - A Promise that resolves to the fetched information.
 */
async function getWebsiteInfoFromText(text) {
  const regex = /https?:\/\/(github.com|twitter.com|m.weibo.cn)\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/g
  // const hostRegex = /https?:\/\/(github.com|twitter.com|m.weibo.cn)\//g
  const match = text.match(regex)
  const infoArr = []
  if (match) {
    for (let i = 0; i < match.length; i++) {
      const url = match[i]
      const info = await getWebsiteInfo(url, ENV.PICTURE_BED_URL)

      infoArr.push(info)
    }
  }
  return infoArr
}

/**
 * Saves page data to Notion database and returns an object with updated info or an error message.
 * @async
 * @param {WebsiteInfo} pageData - Object containing data for the page to be saved.
 * @return {Promise<SavedResponse>} - Object containing updated page info or an error message.
 */
async function saveToNotion(pageData) {
  try {
    let summary = ''
    let catOpt = [{
      name: 'Others',
    }]

    const notionApiKey = ENV.NOTION_API_KEY
    const databaseId = ENV.NOTION_DATABASE_ID
    const openaiApiKey = ENV.API_KEY

    if (!notionApiKey || !databaseId) {
      // console.log('Missing Notion API key or Database ID in settings.')
      const error = { error: 'Missing Notion API key or Database ID in settings.' }
      return error
    }

    if (openaiApiKey) {
      const { data, error } = await summarizeContent(openaiApiKey, pageData)
      if (error)
        return { error }

      summary = data.summary

      catOpt = data.categories.map((item) => {
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

    const body = {
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
    if (Object.keys(pageData.meta).length > 0 && pageData.meta.host === 'github.com') {
      const github = pageData.meta
      body.properties = {
        ...body.properties,
        Website: {
          select: {
            name: pageData.meta.website,
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

      return { error }
    }
    else {
      // console.log('Created new page in Notion successfully!')
      const newPageResponse = await response.json()
      const newPageId = newPageResponse.id // 获取新页面的 ID

      if (!imageUrl)
        return ({ message: 'success' })

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
        const res = await response.json()
        let error = 'Notion API error: '
        if (res.message)
          error += res.message

        else
          error += `${response.status.toString()} Error appending child block to Notion page.`

        return { error }
      }
      else {
        // console.log('Appended child block to Notion page successfully!')
        return ({ message: 'success' })
      }
    }
  }
  catch (error) {
    return { error: error.message ? error.message : 'Error saving to Notion.' }
  }
}

export {
  getWebsiteInfoFromText,
  saveToNotion,
}
