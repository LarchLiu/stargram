import { errorMessage } from '@starnexus/core/utils'
import type { Context } from './context'

export async function StarNexusSaveWebInfoChain(starNexusHub: string, text: string, context: Context) {
  const regex = /(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?[-a-zA-Z0-9()@:%_\\\+\.~#?&//=]*/g
  const match = text.match(regex)
  // const infoArr = []
  if (match) {
    let i = 0
    // let success = 0
    // let fail = 0
    while (i < match.length) {
      let url = match[i]
      if (!url.startsWith('http'))
        url = `https://${url}`

      $fetch(`${starNexusHub}/api/telegram/save-web-info`, {
        method: 'POST',
        body: {
          context,
          url,
          starNexusHub,
        },
      }).catch(e => console.error(errorMessage(e)))
      i += 1
      // const ogInfo = new OGInfo({ fn: ogInfoFn, url })
      // const webInfo = new WebInfo({
      //   urls: {
      //     webUrl: url,
      //   },
      //   routes,
      //   ogInfo,
      // })

      // const supabaseImgStorage = new SupabaseImageStorage({
      //   url: process.env.SUPABASE_URL || '',
      //   anonKey: process.env.SUPABASE_ANON_KEY || '',
      //   bucket: process.env.SUPABASE_STORAGE_BUCKET || '',
      //   upsert: true,
      // })
      // const webCard = new WebCard({ starNexusHub, imgStorage: supabaseImgStorage })
      // const summarize = new OpenaiSummarizeContent({ apiKey: config.OPENAI_API_KEY || '' })
      // const notion = new NotionDataStorage(
      //   {
      //     apiKey: config.NOTION_CONFIG.API_KEY || '',
      //     databaseId: config.NOTION_CONFIG.DATABASE_ID || '',
      //     defaultOgImage: process.env.DEFAULT_OG_IMAGE || '',
      //   },
      // )

      // const chain = new SaveWebInfoChain({
      //   webInfo,
      //   webCard,
      //   summarizeContent: summarize,
      //   dataStorage: notion,
      // })

      // const info = await chain.call().then(_ => true).catch(e => errorMessage(e))

      // i += 1
      // if (typeof info === 'boolean') {
      //   success += 1
      // }
      // else {
      //   fail += 1
      //   infoArr.push(`${url}: ${info}`)
      // }
    }
    return `Found ${i} Website. Saving...`
  }
  else {
    throw new Error('Not Supported Website.')
  }
}
