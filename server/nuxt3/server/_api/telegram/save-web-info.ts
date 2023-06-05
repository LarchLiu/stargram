import { OGInfo, WebInfo } from '@stargram/core/webInfo'
import { SupabaseImageStorage } from '@stargram/core/storage/supabase'
import { NotionDataStorage } from '@stargram/core/storage/notion'
import { WebCard } from '@stargram/core/webCard'
import { OpenaiSummarizeContent } from '@stargram/core/openai'
import { errorMessage } from '@stargram/core/utils'
import { routes } from '@stargram/web-hub'
import { SaveWebInfoChain } from '@stargram/core/chain/saveWebInfo'
import type { UserConfig } from '../../utils/index'
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
    url: config.imgStorage.supabase.url || '',
    anonKey: config.imgStorage.supabase.anonKey || '',
    bucket: config.imgStorage.supabase.bucket || '',
    upsert: true,
  })
  const webCard = new WebCard({ starNexusHub, imgStorage: supabaseImgStorage })
  const summarize = new OpenaiSummarizeContent({ apiKey: config.llm.openai.apiKey || '' })
  const notion = new NotionDataStorage(
    {
      apiKey: config.dataStorage.notion.apiKey || '',
      databaseId: config.dataStorage.notion.databaseId || '',
      defaultOgImage: config.dataStorage.notion.defaultOgImage,
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
    message = `Saved to Stargram 🎉. ${url}\n`
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
