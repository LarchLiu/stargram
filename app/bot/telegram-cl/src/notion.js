import { NotionDataStorage } from '@starnexus/core/storage/notion'
import { SupabaseImageStorage } from '@starnexus/core/storage/supabase'
import { WebCard } from '@starnexus/core/webCard'
import { WebInfoByApi } from '@starnexus/core/webInfo'
import { OpenaiSummarizeContent } from '@starnexus/core/openai'
import { SaveWebInfoChain } from '@starnexus/core/chain/saveWebInfo'
import { ENV } from './env.js'

/**
 * Given a URL, returns information about the website if it is hosted on GitHub.
 *
 * @param {string} text - The text input by user.
 * @return {Promise<string>} - A Promise that resolves to the fetched information.
 */
async function saveToNotion(text) {
  const regex = /(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?[-a-zA-Z0-9()@:%_\\\+\.~#?&//=]*/g
  const match = text.match(regex)
  if (match) {
    let i = 0
    let success = 0
    let fail = 0
    while (i < match.length) {
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

      const supabaseImgStorage = new SupabaseImageStorage({
        url: ENV.SUPABASE_URL || '',
        anonKey: ENV.SUPABASE_ANON_KEY || '',
        bucket: ENV.SUPABASE_STORAGE_BUCKET || '',
        upsert: true,
      })

      const webCard = new WebCard({ starNexusHub, imgStorage: supabaseImgStorage })

      const summarize = new OpenaiSummarizeContent({ apiKey: openaiApiKey })
      const notion = new NotionDataStorage(
        {
          apiKey: notionApiKey,
          databaseId,
          defaultOgImage: 'https://kiafhufrshqyrvlpsdqg.supabase.co/storage/v1/object/public/pics-bed/star-nexus.png?v=starnexusogimage',
        },
      )

      const chain = new SaveWebInfoChain({
        webInfo,
        webCard,
        summarizeContent: summarize,
        dataStorage: notion,
      })

      const info = await chain.call().then(_ => true).catch(_ => false)

      i++
      if (info)
        success++
      else
        fail++
    }
    return `Success: ${success}${fail ? (` Fail: ${fail}`) : ''}`
  }
  else {
    throw new Error('No Website Matched')
  }
}

export {
  saveToNotion,
}
