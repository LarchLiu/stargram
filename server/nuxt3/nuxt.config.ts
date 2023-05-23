import vue from '@vitejs/plugin-vue'
import { appDescription } from './constants/index'

export default defineNuxtConfig({
  modules: [
    // '@vueuse/nuxt',
    // '@unocss/nuxt',
    // '@pinia/nuxt',
    // '@nuxtjs/color-mode',
    // '@vite-pwa/nuxt',
  ],

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: false,
  },

  // css: [
  //   '@unocss/reset/tailwind.css',
  // ],

  // colorMode: {
  //   classSuffix: '',
  // },

  nitro: {
    // preset: 'netlify-edge',
    // serverAssets: [{
    //   baseName: 'fonts',
    //   dir: './assets/fonts', // Relative to `srcDir` (`server/` for nuxt)
    // }],
    // storage: {
    //   fs: {
    //     driver: 'fs',
    //     base: './server/assets/fonts',
    //   },
    // },
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
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

  // pwa,

  // devtools: {
  //   enabled: true,
  // },
})
