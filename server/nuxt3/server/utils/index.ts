import { unfurl } from 'unfurl.js'
import { getDomain } from '@stargram/core/utils'
import type { PromptsLanguage, WebInfoData } from '@stargram/core'
import type { AppName } from '../../composables/config'

const kv = useStorage('kv')

export interface IBotConfig {
  config: string
  userList: string[]
}
export type BotConfig = { default: string } & Record<string, IBotConfig>

export const ConfigKey = {
  botConfigKey: '_bot_config',
  userCofnigKey: '_user_config',
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

export async function ogInfoFn(webUrl: string): Promise<WebInfoData> {
  const res = await unfurl(webUrl)
  let content = res.description || ''
  let title = res.title || ''
  let url = res.canonical_url || webUrl
  const domain = getDomain(url)
  const word = domain.split('.')[0]
  const siteName = word.charAt(0).toUpperCase() + word.slice(1)
  if (res.open_graph) {
    const og = res.open_graph
    title = og.title
    content = og.description || content
    url = og.url || url
  }

  if (!title || !content)
    throw new Error('Not Supported Website. No OG info')

  return {
    title,
    content,
    url,
    meta: {
      domain,
      siteName,
    },
  }
}

export async function getBotConfig(app: AppName) {
  return await kv.getItem(`${app}${ConfigKey.botConfigKey}`) || {}
}

export async function setBotConfig(app: AppName, config: BotConfig) {
  return await kv.setItem(`${app}${ConfigKey.botConfigKey}`, config)
}
