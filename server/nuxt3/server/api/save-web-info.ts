import { errorMessage } from '@stargram/core/utils'
import { routes } from '@stargram/web-hub'
import { SaveWebInfoChain } from '@stargram/core/chain/saveWebInfo'
import { storageInfo } from '@stargram/core/storage'
import type { TLLM } from '@stargram/core/llm'
import { llmInfo } from '@stargram/core/llm'
import { WebInfoFunction } from '@stargram/core/webInfo'
import type { UserConfig } from '../utils/index'
import type { Context } from '../utils/tgBot/context'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  const url = body.url
  const context = body.context as Context
  const appName = body.appName
  const config = context.USER_CONFIG as UserConfig

  if (config.webInfo.select === 'WebInfo')
    config.webInfo.config.routes = routes
  const webInfo = new (WebInfoFunction[config.webInfo.select as keyof typeof WebInfoFunction])(config.webInfo.config)

  const imgStorage = new (storageInfo.ImageStorage[config.imgStorage.select])(config.imgStorage.config)

  if (config.webCard.select === 'WebCard')
    config.webCard.config = { stargramHub: body.stargramHub, imgStorage }
  else
    config.webCard.config.imgStorage = imgStorage
  const webCard = new (WebInfoFunction[config.webCard.select])(config.webCard.config)

  const summarizeContent = new (llmInfo[config.llm.select as TLLM][`${config.llm.select}SummarizeContent`])(config.llm.config)

  const dataStorage = new (storageInfo.DataStorage[config.dataStorage.select])(config.dataStorage.config)

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
    if (appName === 'telegram')
      return (await sendMessageToTelegramWithContext(context)(message))
    else if (appName === 'slack')
      return (await sendMessageToSlackBot(config.app.config.webhook, message))
  }
  catch (error) {
    console.error(error)
    return new Response(errorToString(error), { status: 200 })
  }
})
