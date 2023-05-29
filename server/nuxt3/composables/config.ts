import { acceptHMRUpdate, defineStore } from 'pinia'
import { Position } from '@vue-flow/core'
import { DEFAULT_OG_IMAGE, DEFAULT_STAR_NEXUS_HUB } from '../constants/index'

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
  [key: string]: {
    displayName: string
    fn?: string
    import?: string
    config: {
      [key: string]: IConfig
    }
    output: string
  }
}
export interface OutputConfig {
  select: string
  config: {
    [key: string]: string
  }
  fn?: string
  import?: string
}
export interface KVConfig {
  [select: string]: {
    [config: string]: string
  }
}
// @unocss-include
export const appConfig: BasicConfig<ModelConfig> = {
  title: {
    text: 'App',
    icon: 'i-carbon-application',
  },
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
      },
      output: 'Text',
    },
    slack: {
      displayName: 'Slack Bot',
      config: {
        webHook: {
          label: 'Webhook URL',
          value: '',
          require: true,
        },
      },
      output: 'Text',
    },
  },
}
export const webInfoConfig: BasicConfig<ModelConfig> = {
  title: {
    text: 'Website Info',
    icon: 'i-carbon-document-preliminary',
  },
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
  select: 'api',
  info: {
    localFn: {
      displayName: 'Local Function',
      import: 'import { OGInfo, WebInfo } from \'@starnexus/core/webInfo\'\nimport { routes } from \'@starnexus/web-hub\'\n',
      fn: 'WebInfo',
      config: {
      },
      output: 'Website Info',
    },
    api: {
      displayName: 'Public API',
      import: 'import { WebInfoByApi } from \'@starnexus/core/webInfo\'\n',
      fn: 'WebInfoByApi',
      config: {
        starNexusHub: {
          label: 'StarNexus Hub',
          value: DEFAULT_STAR_NEXUS_HUB,
          require: true,
        },
      },
      output: 'Website Info',
    },
  },
}
export const webCardConfig: BasicConfig<ModelConfig> = {
  title: {
    text: 'Website Card',
    icon: 'i-carbon-image',
  },
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
  select: 'api',
  info: {
    localFn: {
      displayName: 'Local Function',
      import: 'import { WebCard } from \'@starnexus/core/webCard\'\n',
      fn: 'WebCard',
      config: {
      },
      output: 'Image',
    },
    api: {
      displayName: 'Public API',
      import: 'import { WebCardByApi } from \'@starnexus/core/webCard\'\n',
      fn: 'WebCardByApi',
      config: {
        starNexusHub: {
          label: 'StarNexus Hub',
          value: DEFAULT_STAR_NEXUS_HUB,
          require: true,
        },
      },
      output: 'Image',
    },
  },
}
export const imgStorageConfig: BasicConfig<ModelConfig> = {
  title: {
    text: 'Image Storage',
    icon: 'i-carbon-save-image',
  },
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
      import: 'import { SupabaseImageStorage } from \'@starnexus/core/storage/supabase\'\n',
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
export const dataStorageConfig: BasicConfig<ModelConfig> = {
  title: {
    text: 'Data Storage',
    icon: 'i-carbon-db2-database',
  },
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
      import: 'import { NotionDataStorage } from \'@starnexus/core/storage/notion\'\n',
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
export const llmConfig: BasicConfig<ModelConfig> = {
  title: {
    text: 'LLM',
    icon: 'i-carbon-ai-results',
  },
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
      import: 'import { OpenaiSummarizeContent } from \'@starnexus/core/openai\'\n',
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
          label: 'Output Language',
          value: 'en',
          require: false,
        },
      },
      output: 'Summary',
    },
  },
}
export const kvStorageConfig: BasicConfig<ModelConfig> = {
  title: {
    text: 'KV Storage',
    icon: 'i-carbon-virtual-column-key',
  },
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
        KV_URL: {
          label: 'KV URL',
          value: '',
          require: true,
        },
        KV_REST_API_TOKEN: {
          label: 'API TOKEN',
          value: '',
          require: true,
        },
      },
      output: 'Env Vars',
    },
  },
}
export const serverConfig: BasicConfig<ModelConfig> = {
  title: {
    text: 'Cloud Server',
    icon: 'i-carbon-ibm-cloud-citrix-daas',
  },
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
  select: 'netlifyEdge',
  info: {
    netlifyEdge: {
      displayName: 'Netlify Edge',
      config: {
        token: {
          label: 'Netlify Token',
          value: '',
          require: true,
        },
      },
      output: 'Server',
    },
    vercelServerless: {
      displayName: 'Vercel Serverless',
      config: {
        token: {
          label: 'Vercel Token',
          value: '',
          require: true,
        },
      },
      output: 'Server',
    },
    cloudflareWorker: {
      displayName: 'Cloudflare Worker',
      config: {
        token: {
          label: 'Cloudflare Token',
          value: '',
          require: true,
        },
      },
      output: 'Server',
    },
  },
}
export type ModelName = keyof ServerConfig<BasicConfig<ModelConfig>>
export const defaultConfig: ServerConfig<BasicConfig<ModelConfig>> = {
  app: appConfig,
  webInfo: webInfoConfig,
  webCard: webCardConfig,
  llm: llmConfig,
  imgStorage: imgStorageConfig,
  dataStorage: dataStorageConfig,
  kvStorage: kvStorageConfig,
  server: serverConfig,
}

export const useConfigStore = defineStore('server-config', () => {
  const config = ref(defaultConfig)
  const outConfig = computed(() => {
    const keys = Object.keys(config.value)
    const obj: Record<string, any> = {}
    keys.forEach((k) => {
      const c = config.value[k as ModelName]
      const _config = c.info[c.select].config
      const _fn = c.info[c.select].fn
      const _import = c.info[c.select].import
      const _obj: Record<string, any> = {}
      Object.keys(_config).forEach((x) => {
        _obj[x] = _config[x].value
      })
      obj[k] = { select: c.select, config: Object.keys(_obj).length ? _obj : null }
      if (_fn)
        obj[k].fn = _fn
      if (_import)
        obj[k].import = _import
    })
    return obj as ServerConfig<OutputConfig>
  })
  const kvConfig = computed(() => {
    const keys = Object.keys(config.value)
    const obj: Record<string, any> = {}
    keys.forEach((k) => {
      const c = config.value[k as ModelName]
      const _config = c.info[c.select].config
      const _obj: Record<string, any> = {}
      Object.keys(_config).forEach((x) => {
        _obj[x] = _config[x].value
      })
      obj[k] = { [c.select]: Object.keys(_obj).length ? _obj : null }
    })
    return obj as ServerConfig<KVConfig>
  })

  return {
    config,
    outConfig,
    kvConfig,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
