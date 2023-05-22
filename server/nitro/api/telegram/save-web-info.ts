import { OGInfo, WebInfo } from '@starnexus/core/webInfo'
import { SupabaseImageStorage } from '@starnexus/core/storage/supabase'
import { NotionDataStorage } from '@starnexus/core/storage/notion'
import { WebCard } from '@starnexus/core/webCard'
import { SummarizeContent } from '@starnexus/core/openai'
import { errorMessage } from '@starnexus/core/utils'
import { routes } from '@starnexus/web-hub'
import { SaveWebInfoChain } from '@starnexus/core/chain/saveWebInfo'
import type { UserConfig } from '../../utils/tgBot/makeChain'
import type { Context } from '../../utils/tgBot/context'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  const url = body.url
  const starNexusHub = body.starNexusHub
  const context = body.context as Context
  const config = context.USER_CONFIG as UserConfig

  const ogInfo = new OGInfo({ fn: ogInfoFn, url })
  const webInfo = new WebInfo({
    urls: {
      webUrl: url,
    },
    routes,
    ogInfo,
  })

  const supabaseImgStorage = new SupabaseImageStorage({
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    bucket: process.env.SUPABASE_STORAGE_BUCKET || '',
    upsert: true,
  })
  const webCard = new WebCard({ starNexusHub, imgStorage: supabaseImgStorage })
  const summarize = new SummarizeContent({ apiKey: config.OPENAI_API_KEY || '' })
  const notion = new NotionDataStorage(
    {
      apiKey: config.NOTION_CONFIG.API_KEY || '',
      databaseId: config.NOTION_CONFIG.DATABASE_ID || '',
      defaultOgImage: process.env.SUPABASE_OG_IMAGE || '',
    },
  )

  const chain = new SaveWebInfoChain({
    webInfo,
    webCard,
    summarizeContent: summarize,
    dataStorage: notion,
  })

  const info = await chain.call().then(_ => true).catch(e => errorMessage(e))

  let message = ''
  if (typeof info === 'boolean')
    message = `Saved to StarNexus 🎉. ${url}\n`
  else
    message = `Save failed 🐛. ${url}\nError Info: ${info}\n`

  try {
    return (await sendMessageToTelegramWithContext(context)(message))
  }
  catch (error) {
    console.error(error)
    return new Response(errorToString(error), { status: 200 })
  }
})
