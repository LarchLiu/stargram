import type { AppName, OutUserConfig, ServerConfig } from '../../composables/config'
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
