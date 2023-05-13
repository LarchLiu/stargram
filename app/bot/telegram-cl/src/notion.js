import { NotionStorage, SaveWebInfoChain, SummarizeContent, WebCard, WebInfoByApi } from '@starnexus/core'
import { ENV } from './env.js'

/**
 * Given a URL, returns information about the website if it is hosted on GitHub.
 *
 * @param {string} text - The text input by user.
 * @return {Promise<FetchWebsite[]>} - A Promise that resolves to the fetched information.
 */
async function saveToNotion(text) {
  const regex = /(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?[-a-zA-Z0-9()@:%_\\\+\.~#?&//=]*/g
  const match = text.match(regex)
  if (match) {
    for (let i = 0; i < match.length; i++) {
      const notionApiKey = ENV.NOTION_API_KEY
      const databaseId = ENV.NOTION_DATABASE_ID
      const openaiApiKey = ENV.API_KEY
      const starNexusHub = ENV.STAR_NEXUS_HUB_API
      const url = match[i]
      const webInfo = new WebInfoByApi({
        urls: {
          webUrl: url,
        },
        starNexusHub,
      })

      const webCard = new WebCard({ starNexusHub })

      const summarize = new SummarizeContent({ apiKey: openaiApiKey })
      const notion = new NotionStorage({
        config: {
          apiKey: notionApiKey || '',
          databaseId,
        },
      })

      const chain = new SaveWebInfoChain({
        webInfo,
        webCard,
        summarizeContent: summarize,
        dataStorage: notion,
      })

      await chain.call()
    }
  }
}

export {
  saveToNotion,
}
