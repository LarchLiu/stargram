import { errorMessage } from '@stargram/core/utils'
import type { EmbeddingsInfo } from '@stargram/core'
import { routes } from '@stargram/web-hub'
import { SaveWebInfoChain } from '@stargram/core/chain/saveWebInfo'
import { storageInfo } from '@stargram/core/storage'
import type { TLLM } from '@stargram/core/llm'
import type { VectorMetaData } from '@stargram/core/storage'
import { llmInfo } from '@stargram/core/llm'
import { WebInfoFunction } from '@stargram/core/webInfo'
import { WebCardFunction } from '@stargram/core/webCard'
import type { UserConfig } from '../utils/index'
import type { Context } from '../utils/tgBot/context'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  const url = body.url
  const context = body.context as Context
  const appName = body.appName
  const botId = body.botId
  const userId = body.userId
  const config = context.USER_CONFIG as UserConfig

  if (config.webInfo.select === 'WebInfo')
    config.webInfo.config.routes = routes
  const webInfo = new (WebInfoFunction[config.webInfo.select as keyof typeof WebInfoFunction])(config.webInfo.config)

  const imgStorage = new (storageInfo.ImageStorage[config.imgStorage.select])(config.imgStorage.config)

  if (config.webCard.select === 'WebCard')
    config.webCard.config = { stargramHub: body.stargramHub, imgStorage }
  else
    config.webCard.config.imgStorage = imgStorage
  const webCard = new (WebCardFunction[config.webCard.select])(config.webCard.config)

  const llm = new (llmInfo[config.llm.select as TLLM])(config.llm.config)

  const dataStorage = new (storageInfo.DataStorage[config.dataStorage.select])(config.dataStorage.config)

  const embeddingsInfo: EmbeddingsInfo = llm.embeddingsInfo()
  const metaData: VectorMetaData = {
    url,
    appName,
    botId,
    userId,
  }
  const vectorStorage = new (storageInfo.VectorStorage[config.vectorStorage.select])({ ...config.vectorStorage.config, embeddingsInfo, metaData })

  const chain = new SaveWebInfoChain({
    webInfo,
    webCard,
    llm,
    dataStorage,
    vectorStorage,
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
