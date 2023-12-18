// import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import { appDescription } from './constants/index'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxthq/ui',
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
      kv: {
        driver: 'vercelKV',
      },
      // kv: {
      //   driver: 'redis',
      //   url: process.env.REDIS_URL,
      // },
      // kv: {
      //   driver: 'cloudflareKVHTTP',
      //   accountId: process.env.CF_ACCOUNT_ID,
      //   namespaceId: process.env.CF_NAMESPACE_ID,
      //   apiToken: process.env.CF_API_TOKEN,
      // },
    },
    rollupConfig: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
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
})
