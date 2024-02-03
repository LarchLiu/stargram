import { errorMessage } from '@stargram/core/utils'
import type { EmbeddingsInfo, VectorMetaData } from '@stargram/core'
import { QAChain } from '@stargram/core/chain/qa'
import { storageInfo } from '@stargram/core/storage'
import type { TLLM } from '@stargram/core/llm'
import { llmInfo } from '@stargram/core/llm'
import type { AppName, OutUserConfig, ServerConfig } from '../../composables/config'
import type { Context } from './tgBot/context'
import { cryption } from '~/constants'

const kv = useStorage('kv')

export interface IBotConfig {
  config: string
  userList: string[]
  token?: string
}
export type BotConfig = { default: string } & Record<string, IBotConfig>

export const ConfigKey = {
  botConfigKey: '_bot_config',
  userConfigKey: '_user_config',
  notificationKey: '_notification',
}

export interface AppConfig {
  publicWebInfo: {
    api: {
      stargramHub: string
    }
  }
  publicWebCard: {
    api: {
      stargramHub: string
    }
  }
  publicImgStorage: {
    supabase: {
      url: string
      bucket: string
      anonKey: string
    }
  }
}

export interface UserConfig {
  app: {
    select: string
    public: boolean
    config: Record<string, any>
  }
  webInfo: {
    select: string
    public: boolean
    config: Record<string, any>
  }
  webCard: {
    select: string
    public: boolean
    config: Record<string, any>
  }
  llm: {
    select: string
    public: boolean
    config: Record<string, any>
  }
  imgStorage: {
    select: string
    public: boolean
    config: Record<string, any>
  }
  dataStorage: {
    select: string
    public: boolean
    config: Record<string, any>
  }
  vectorStorage: {
    select: string
    public: boolean
    config: Record<string, any>
  }
}

export async function getBotConfig(app: AppName) {
  return await kv.getItem(`${app}${ConfigKey.botConfigKey}`) as BotConfig || {}
}

export async function setBotConfig(app: AppName, config: BotConfig) {
  return await kv.setItem(`${app}${ConfigKey.botConfigKey}`, config)
}

export async function setUserConfig(app: AppName, appId: string, userId: string, config: Record<string, any>) {
  const encode = cryption.encode(JSON.stringify(config))
  await kv.setItem(`${app}${ConfigKey.userConfigKey}:${appId}:${userId}`, encode)
}

export async function getUserConfig(app: AppName, appId: string, userId: string) {
  const encode = await kv.getItem(`${app}${ConfigKey.userConfigKey}:${appId}:${userId}`) as string
  if (encode) {
    const config = JSON.parse(cryption.decode(encode)) as ServerConfig<OutUserConfig>
    return config
  }
  else {
    return false
  }
}

export async function MakeQAChain(question: string, context: { USER_CONFIG: UserConfig }, appName: string, botId: string, userId: string) {
  const config = context.USER_CONFIG as UserConfig

  const llm = new (llmInfo[config.llm.select as TLLM])(config.llm.config)

  const embeddingsInfo: EmbeddingsInfo = llm.embeddingsInfo()
  const metaData: VectorMetaData = {
    appName,
    botId,
    userId,
  }
  const vectorStorage = new (storageInfo.VectorStorage[config.vectorStorage.select])({ ...config.vectorStorage.config, embeddingsInfo, metaData })

  const chain = new QAChain({
    vectorStorage,
  })

  const info = await chain.call(question, config.llm.config.lang).catch(e => errorMessage(e))

  let message = 'Answer: '
  let meta = 'Source: '
  let answer = ''
  let source: string[] = []
  if (typeof info === 'string') {
    message = `Error Info: ${info}\n`
  }
  else {
    message += info.text
    answer = info.text
    if (info.sourceDocuments) {
      const uniqueUrls = new Set(info.sourceDocuments.map((d) => {
        return d.metadata.source!
      }))
      const uniqueMatchs = [...uniqueUrls]
      source = [...uniqueUrls]
      meta += uniqueMatchs.join('\n') || ''
      message += `\n${meta}`
    }
  }

  try {
    if (appName === 'telegram')
      return (await sendMessageToTelegramWithContext(context as Context)(message))
    else if (appName === 'slack')
      return (await sendMessageToSlackBot(config.app.config.webhook, message))
    else if (appName === 'stargram')
      return { answer, source }
  }
  catch (error) {
    console.error(error)
    return new Response(errorToString(error), { status: 200 })
  }
}
