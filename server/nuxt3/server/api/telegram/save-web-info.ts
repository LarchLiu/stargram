import { WebInfoByApi } from '@starnexus/core/webInfo'
import { WebCardByApi } from '@starnexus/core/webCard'
import { OpenaiSummarizeContent } from '@starnexus/core/openai'
import { NotionDataStorage } from '@starnexus/core/storage/notion'
import { errorMessage } from '@starnexus/core/utils'
import { SaveWebInfoChain } from '@starnexus/core/chain/saveWebInfo'
import type { UserConfig } from '../../utils/index'
import type { Context } from '../../utils/tgBot/context'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  const url = body.url
  const context = body.context as Context
  const config = context.USER_CONFIG as UserConfig

  const webInfo = new WebInfoByApi({
    urls: {
      webUrl: url,
    },
    starNexusHub: config.webInfo.api.starNexusHub,
  })

  const webCard = new WebCardByApi({ starNexusHub: config.webCard.api.starNexusHub })

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
