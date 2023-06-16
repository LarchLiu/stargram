import type { PromptsLanguage } from '@stargram/core'
import type { AppName, KVConfig, ServerConfig } from '../../composables/config'
import { cryption } from '~/constants'

const kv = useStorage('kv')

export interface IBotConfig {
  config: string
  userList: string[]
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
    telegram: {
      botToken: string
      language: string
    }
    slack: {
      appId: string
      webhook: string
    }
  }
  webInfo: {
    api: {
      stargramHub: string
    }
  }
  webCard: {
    api: {
      stargramHub: string
    }
  }
  llm: {
    openai: {
      apiKey: string
      apiHost: string
      lang: PromptsLanguage
    }
  }
  imgStorage: {
    supabase: {
      url: string
      bucket: string
      anonKey: string
    }
  }
  dataStorage: {
    notion: {
      apiKey: string
      databaseId: string
      defaultOgImage: string
    }
  }
}

export async function getBotConfig(app: AppName) {
  return await kv.getItem(`${app}${ConfigKey.botConfigKey}`) || {}
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
    const config = JSON.parse(cryption.decode(encode)) as ServerConfig<KVConfig>
    return config
  }
  else {
    return false
  }
}
