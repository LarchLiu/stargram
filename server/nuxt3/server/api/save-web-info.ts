import { errorMessage } from '@stargram/core/utils'
import type { EmbeddingsInfo, VectorMetaData } from '@stargram/core'
import { routes } from '@stargram/web-hub'
import { SaveWebInfoChain } from '@stargram/core/chain/saveWebInfo'
import { storageInfo } from '@stargram/core/storage'
import type { TLLM } from '@stargram/core/llm'
import { llmInfo } from '@stargram/core/llm'
import { WebInfoFunction } from '@stargram/core/webInfo'
import { WebCardFunction } from '@stargram/core/webCard'
import webpush from 'web-push'
import type { UserConfig } from '../utils/index'
import type { Context } from '../utils/tgBot/context'

const VAPID_MAIL = 'mailto:larch.liu@gmail.com'
const runtimeConfig = useRuntimeConfig()
webpush.setVapidDetails(VAPID_MAIL, runtimeConfig.public.VAPID_PUBLIC_KEY as string, runtimeConfig.VAPID_PRIVATE_KEY as string)
const kv = useStorage('kv')

export default eventHandler(async (event) => {
  const { appId } = useRuntimeConfig()
  const body = await readBody(event)
  const url = body.url
  const context = body.context as Context
  const appName = body.appName
  const botId = appName === 'stargram' ? appId : body.botId
  const userId = body.userId
  const config = appName === 'stargram' ? await getUserConfig('stargram', appId, userId) as UserConfig : context.USER_CONFIG as UserConfig
  const stargramHub = appName === 'stargram' ? `${getRequestProtocol(event)}://${getRequestHost(event)}` : body.stargramHub

  if (appName === 'stargram' && !config) {
    setResponseStatus(event, 400)
    return { error: 'There is no user config.' }
  }

  if (config.webInfo.select === 'WebInfo')
    config.webInfo.config.routes = routes
  const webInfo = new (WebInfoFunction[config.webInfo.select as keyof typeof WebInfoFunction])(config.webInfo.config)

  const imgStorage = new (storageInfo.ImageStorage[config.imgStorage.select])(config.imgStorage.config)

  if (config.webCard.select === 'WebCard')
    config.webCard.config = { stargramHub, imgStorage }
  else
    config.webCard.config.imgStorage = imgStorage
  const webCard = new (WebCardFunction[config.webCard.select])(config.webCard.config)

  const llm = new (llmInfo[config.llm.select as TLLM])(config.llm.config)

  const dataStorage = new (storageInfo.DataStorage[config.dataStorage.select])(config.dataStorage.config)

  const embeddingsInfo: EmbeddingsInfo = llm.embeddingsInfo()
  const metaData: VectorMetaData = {
    source: url,
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
  }).catch(e => errorMessage(e))

  let message = ''
  let openUrl = '/share-target'
  if (typeof info === 'string') {
    message = `Save failed 🐛. ${url}\nError Info: ${info}\n`
  }
  else {
    message = `Saved to Stargram 🎉. ${url}\n`
    // openUrl = `/${config.dataStorage.select}/${info.storageId}`
    openUrl = '/'
  }

  try {
    if (appName === 'telegram') {
      return (await sendMessageToTelegramWithContext(context)(message))
    }
    else if (appName === 'slack') {
      return (await sendMessageToSlackBot(config.app.config.webhook, message))
    }
    else if (appName === 'stargram') {
      const config = await kv.getItem(`stargram${ConfigKey.notificationKey}:${appId}:${userId}`) as any[]
      if (config) {
        for (const subscription of config) {
          webpush.sendNotification(subscription, JSON.stringify({
            title: 'Stargram Notification',
            content: `${message}`,
            imageUrl: '',
            openUrl,
          }))
            .catch(error => console.error(error))
        }
      }
      return (message)
    }
  }
  catch (error) {
    console.error(error)
    return new Response(errorToString(error), { status: 200 })
  }
})
