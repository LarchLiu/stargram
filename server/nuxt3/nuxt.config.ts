import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import { appDescription } from './constants/index'
import { pwa } from './config/pwa'
import type { BuildInfo } from './types'

export type KV_DRIVER_TYPE = 'vercelKV' | 'cloudflareKVHTTP' | 'redis'

function getKVStorageConfig() {
  let config: {
    driver: KV_DRIVER_TYPE
    [option: string]: any
  } = { driver: process.env.KV_DRIVER }

  switch (process.env.KV_DRIVER) {
    case 'cloudflareKVHTTP':
      config = {
        ...config,
        accountId: process.env.CF_ACCOUNT_ID,
        namespaceId: process.env.CF_NAMESPACE_ID,
        apiToken: process.env.CF_API_TOKEN,
      }
      break
    case 'redis':
      config = {
        ...config,
        url: process.env.REDIS_URL,
      }
      break
    case 'vercelKV':
      config = {
        ...config,
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      }
      break
    default:
      break
  }
  return config
}

export default defineNuxtConfig({
  runtimeConfig: {
    appId: process.env.STARGRAM_ID,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    public: {
      VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
      CRYPTION_C1: process.env.CRYPTION_C1,
      CRYPTION_C2: process.env.CRYPTION_C2,
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
  ],
  ui: {
    safelistColors: ['green', 'red'],
    icons: ['carbon', 'twemoji'],
  },
  css: [
    '@unocss/reset/tailwind-compat.css',
    '@vue-flow/core/dist/style.css',
    '@vue-flow/core/dist/theme-default.css',
    '@vue-flow/controls/dist/style.css',
    '@vue-flow/minimap/dist/style.css',
  ],
  nitro: {
    compressPublicAssets: true,
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: [
        '/',
        '/server-config',
      ],
    },
    storage: {
      kv: getKVStorageConfig(),
    },
    rollupConfig: {
      // @ts-expect-error eslint
      plugins: [vue()],
    },
  },
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },
  devtools: {
    enabled: true,
  },
  pwa,
})

declare module '@nuxt/schema' {
  interface AppConfig {
    storage: any
    env: BuildInfo['env']
    buildInfo: BuildInfo
  }
}
