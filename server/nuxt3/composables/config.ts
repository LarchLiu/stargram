import { acceptHMRUpdate, defineStore } from 'pinia'
import { Position } from '@vue-flow/core'
import { DEFAULT_OG_IMAGE, DEFAULT_STARGRAM_HUB, cryption } from '../constants/index'

export interface ServerConfig<T> {
  app: T
  webInfo: T
  webCard: T
  llm: T
  imgStorage: T
  dataStorage: T
  kvStorage: T
  server: T
}
export interface BasicConfig<T> {
  title: {
    text: string
    icon: string
  }
  handles: IHandle[]
  public: boolean
  userConfig: boolean
  select: string
  info: T
}
export interface IConfig {
  label: string
  value: string
  require: boolean
}
export interface IHandle {
  id: string
  type: 'source' | 'target'
  position: Position
}
export interface ModelConfig {
  displayName: string
  fn?: string
  import?: string
  config: {
    [key: string]: IConfig
  }
  output: string
}
export type ModelsConfig = AppConfig | Record<string, ModelConfig>
export interface OutputConfig {
  select: string
  public: boolean
  userConfig: boolean
  config: Record<string, any> | null
  fn?: string
  import?: string
}
export interface OutUserConfig {
  select: string
  public: boolean
  config: Record<string, any> | null
}
export interface KVConfig {
  [select: string]: Record<string, any> | null
}

export type AppName = keyof AppConfig
export interface AppConfig {
  telegram: ModelConfig
  slack: ModelConfig
}
// @unocss-include
export const appConfig: BasicConfig<AppConfig> = {
  title: {
    text: 'App',
    icon: 'i-carbon-application',
  },
  public: false,
  userConfig: true,
  handles: [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
    },
    {
      id: 'result',
      type: 'target',
      position: Position.Bottom,
    },
  ],
  select: 'telegram',
  info: {
    telegram: {
      displayName: 'Telegram Bot',
      config: {
        botToken: {
          label: 'Bot Token',
          value: '',
          require: true,
        },
        language: {
          label: 'Command Language',
          value: 'en',
          require: true,
        },
      },
      output: 'Text',
    },
    slack: {
      displayName: 'Slack Bot',
      config: {
        appId: {
          label: 'App ID',
          value: '',
          require: true,
        },
        clientId: {
          label: 'Client ID',
          value: '',
          require: true,
        },
        clientSecret: {
          label: 'Client Secret',
          value: '',
          require: true,
        },
      },
      output: 'Text',
    },
  },
}
export const webInfoConfig: BasicConfig<ModelsConfig> = {
  title: {
    text: 'Website Info',
    icon: 'i-carbon-document-preliminary',
  },
  public: true,
  userConfig: true,
  handles: [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
    },
  ],
  select: 'localFn',
  info: {
    localFn: {
      displayName: 'Local Function',
      import: 'import { OGInfo, WebInfo } from \'@stargram/core/webInfo\'\nimport { routes } from \'@stargram/web-hub\'\n',
      fn: 'WebInfo',
      config: {
      },
      output: 'Website Info',
    },
    api: {
      displayName: 'Public API',
      import: 'import { WebInfoByApi } from \'@stargram/core/webInfo\'\n',
      fn: 'WebInfoByApi',
      config: {
        stargramHub: {
          label: 'Stargram Hub',
          value: DEFAULT_STARGRAM_HUB,
          require: true,
        },
      },
      output: 'Website Info',
    },
  },
}
export const webCardConfig: BasicConfig<ModelsConfig> = {
  title: {
    text: 'Website Card',
    icon: 'i-carbon-image',
  },
  public: true,
  userConfig: true,
  handles: [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
    },
  ],
  select: 'localFn',
  info: {
    localFn: {
      displayName: 'Local Function',
      import: 'import { WebCard } from \'@stargram/core/webCard\'\n',
      fn: 'WebCard',
      config: {
      },
      output: 'Image',
    },
    api: {
      displayName: 'Public API',
      import: 'import { WebCardByApi } from \'@stargram/core/webCard\'\n',
      fn: 'WebCardByApi',
      config: {
        stargramHub: {
          label: 'Stargram Hub',
          value: DEFAULT_STARGRAM_HUB,
          require: true,
        },
      },
      output: 'Image',
    },
  },
}
export const imgStorageConfig: BasicConfig<ModelsConfig> = {
  title: {
    text: 'Image Storage',
    icon: 'i-carbon-save-image',
  },
  public: true,
  userConfig: true,
  handles: [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
    },
  ],
  select: 'supabase',
  info: {
    supabase: {
      displayName: 'Supabase Storage',
      import: 'import { SupabaseImageStorage } from \'@stargram/core/storage/supabase\'\n',
      fn: 'SupabaseImageStorage',
      config: {
        url: {
          label: 'Supabase URL',
          value: '',
          require: true,
        },
        bucket: {
          label: 'Storage Bucket',
          value: '',
          require: true,
        },
        anonKey: {
          label: 'Anon Key',
          value: '',
          require: true,
        },
      },
      output: 'Image URL',
    },
  },
}
export const dataStorageConfig: BasicConfig<ModelsConfig> = {
  title: {
    text: 'Data Storage',
    icon: 'i-carbon-db2-database',
  },
  public: false,
  userConfig: true,
  handles: [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
    },
  ],
  select: 'notion',
  info: {
    notion: {
      displayName: 'Notion Storage',
      import: 'import { NotionDataStorage } from \'@stargram/core/storage/notion\'\n',
      fn: 'NotionDataStorage',
      config: {
        apiKey: {
          label: 'API Key',
          value: '',
          require: true,
        },
        databaseId: {
          label: 'Datbase ID',
          value: '',
          require: true,
        },
        defaultOgImage: {
          label: 'Default OG Image',
          value: DEFAULT_OG_IMAGE,
          require: true,
        },
      },
      output: 'Result',
    },
  },
}
export const llmConfig: BasicConfig<ModelsConfig> = {
  title: {
    text: 'LLM',
    icon: 'i-carbon-ai-results',
  },
  public: false,
  userConfig: true,
  handles: [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
    },
  ],
  select: 'openai',
  info: {
    openai: {
      displayName: 'Openai',
      import: 'import { OpenaiSummarizeContent } from \'@stargram/core/openai\'\n',
      fn: 'OpenaiSummarizeContent',
      config: {
        apiKey: {
          label: 'API Token',
          value: '',
          require: true,
        },
        apiHost: {
          label: 'API Host',
          value: 'https://api.openai.com',
          require: true,
        },
        lang: {
          label: 'Summary Language',
          value: 'en',
          require: false,
        },
      },
      output: 'Summary',
    },
  },
}
export const kvStorageConfig: BasicConfig<ModelsConfig> = {
  title: {
    text: 'KV Storage',
    icon: 'i-carbon-virtual-column-key',
  },
  public: false,
  userConfig: false,
  handles: [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
    },
  ],
  select: 'vercelKV',
  info: {
    vercelKV: {
      displayName: 'Vercel KV',
      config: {
        KV_REST_API_URL: {
          label: 'REST API URL',
          value: '',
          require: true,
        },
        KV_REST_API_TOKEN: {
          label: 'REST API TOKEN',
          value: '',
          require: true,
        },
      },
      output: 'Env Vars',
    },
  },
}
export const serverConfig: BasicConfig<ModelsConfig> = {
  title: {
    text: 'Cloud Server',
    icon: 'i-carbon-ibm-cloud-citrix-daas',
  },
  public: false,
  userConfig: false,
  handles: [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
    },
  ],
  select: 'netlify',
  info: {
    netlify: {
      displayName: 'Netlify Edge',
      config: {
        token: {
          label: 'Netlify Token',
          value: '',
          require: true,
        },
        siteid: {
          label: 'Site ID',
          value: '',
          require: true,
        },
      },
      output: 'Server',
    },
    vercel: {
      displayName: 'Vercel Serverless',
      config: {
        token: {
          label: 'Vercel Token',
          value: '',
          require: true,
        },
        siteid: {
          label: 'Site ID',
          value: '',
          require: true,
        },
      },
      output: 'Server',
    },
    cloudflare: {
      displayName: 'Cloudflare Worker',
      config: {
        token: {
          label: 'Cloudflare Token',
          value: '',
          require: true,
        },
        siteid: {
          label: 'Worker Name',
          value: '',
          require: true,
        },
      },
      output: 'Server',
    },
  },
}
export type ModelName = keyof ServerConfig<BasicConfig<ModelsConfig>>
export const defaultConfig: ServerConfig<BasicConfig<ModelsConfig>> = {
  app: appConfig,
  webInfo: webInfoConfig,
  webCard: webCardConfig,
  llm: llmConfig,
  imgStorage: imgStorageConfig,
  dataStorage: dataStorageConfig,
  kvStorage: kvStorageConfig,
  server: serverConfig,
}

export function getConfigKV(config: Record<string, IConfig>) {
  const _obj: Record<string, any> = {}
  Object.keys(config).forEach((x) => {
    _obj[x] = config[x].value
  })

  return Object.keys(_obj).length ? _obj : null
}

export const useConfigStore = defineStore('server-config', () => {
  const config = ref(defaultConfig)
  const outConfig = computed(() => {
    const keys = Object.keys(config.value)
    const obj: Record<string, any> = {}
    keys.forEach((k) => {
      const c = config.value[k as ModelName]
      const select = c.select as keyof typeof c.info
      const _config = getConfigKV(c.info[select].config)
      const _fn = c.info[select].fn
      const _import = c.info[select].import

      obj[k] = { select: c.select, public: c.public, userConfig: c.userConfig, config: _config }
      if (_fn)
        obj[k].fn = _fn
      if (_import)
        obj[k].import = _import
    })
    return obj as ServerConfig<OutputConfig>
  })
  const outUserConfig = computed(() => {
    const keys = Object.keys(config.value)
    const obj: Record<string, any> = {}
    keys.forEach((k) => {
      const c = config.value[k as ModelName]
      const select = c.select as keyof typeof c.info
      if (c.userConfig) {
        const _config = getConfigKV(c.info[select].config)
        obj[k] = { select: c.select, public: c.public, config: _config }
      }
    })
    return obj as ServerConfig<OutUserConfig>
  })
  const kvConfig = computed(() => {
    const keys = Object.keys(config.value)
    const obj: Record<string, any> = {}
    keys.forEach((k) => {
      const c = config.value[k as ModelName]
      const select = c.select as keyof typeof c.info
      if (c.userConfig) {
        const _config = getConfigKV(c.info[select].config)
        obj[k] = { [c.select]: _config }
      }
    })
    return obj as ServerConfig<KVConfig>
  })
  const encodeKvConfig = computed(() => {
    return cryption.encode(JSON.stringify(kvConfig.value))
  })
  const encodeUserConfig = computed(() => {
    return cryption.encode(JSON.stringify(outUserConfig.value))
  })

  return {
    config,
    outConfig,
    outUserConfig,
    kvConfig,
    encodeKvConfig,
    encodeUserConfig,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
