import { getWebsiteInfo, saveToNotion as saveNotion, summarizeContent } from '@starnexus/core'
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
 * @param {WebsiteInfo} websiteInfo - Object containing data for the page to be saved.
 * @return {Promise<SavedResponse>} - Object containing updated page info or an error message.
 */
async function saveToNotion(websiteInfo) {
  let summary = ''
  let categories = ['Others']

  const notionApiKey = ENV.NOTION_API_KEY
  const databaseId = ENV.NOTION_DATABASE_ID
  const openaiApiKey = ENV.API_KEY

  if (!notionApiKey || !databaseId) {
    // console.log('Missing Notion API key or Database ID in settings.')
    const error = { error: 'Missing Notion API key or Database ID in settings.' }
    return error
  }

  if (openaiApiKey) {
    const { data, error } = await summarizeContent(openaiApiKey, websiteInfo)
    if (error)
      return { error }

    summary = data.summary

    categories = data.categories
  }
  else {
    summary = websiteInfo.content
  }

  const notionPage = {
    databaseId,
    title: websiteInfo.title,
    summary,
    url: websiteInfo.url,
    categories,
    status: 'Starred',
    meta: websiteInfo.meta,
  }

  const { error } = await saveNotion(notionApiKey, notionPage)
  if (error)
    return { error }

  return ({ message: 'success' })
}

export {
  getWebsiteInfoFromText,
  saveToNotion,
}
