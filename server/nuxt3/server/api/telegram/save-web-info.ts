import { WebInfo } from '@stargram/core/webInfo'
import { routes } from '@stargram/web-hub'
import { WebCard } from '@stargram/core/webCard'
import { SupabaseImageStorage } from '@stargram/core/storage/supabase'
import { OpenaiSummarizeContent } from '@stargram/core/llm/openai'
import { NotionDataStorage } from '@stargram/core/storage/notion'
import { errorMessage } from '@stargram/core/utils'
import { SaveWebInfoChain } from '@stargram/core/chain/saveWebInfo'
import type { UserConfig } from '../../utils/index'
import type { Context } from '../../utils/tgBot/context'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  const url = body.url
  const context = body.context as Context
  const config = context.USER_CONFIG as UserConfig

  const webInfo = new WebInfo({
    routes,
  })

  const imgStorage = new SupabaseImageStorage({
    url: config.imgStorage.supabase.url, bucket: config.imgStorage.supabase.bucket, anonKey: config.imgStorage.supabase.anonKey,
  })
  const webCard = new WebCard({ stargramHub: body.stargramHub, imgStorage })

  const summarizeContent = new OpenaiSummarizeContent({
    apiKey: config.llm.openai.apiKey, apiHost: config.llm.openai.apiHost, lang: config.llm.openai.lang,
  })

  const dataStorage = new NotionDataStorage({
    apiKey: config.dataStorage.notion.apiKey, databaseId: config.dataStorage.notion.databaseId, defaultOgImage: config.dataStorage.notion.defaultOgImage,
  })

  const chain = new SaveWebInfoChain({
    webInfo,
    webCard,
    summarizeContent,
    dataStorage,
  })

  const info = await chain.call({
    webUrl: url,
  }).then(_ => true).catch(e => errorMessage(e))

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
