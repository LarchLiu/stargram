import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { __DEV__, outputDir } from './const'

export function r(...args: string[]) {
  return resolve(__dirname, '.', ...args)
}

export const commonConfig = {
  root: r('src'),
  define: {
    __DEV__,
  },
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
    },
  },
}

export const plugins = [
  Vue(),
  Unocss(),
  VueI18nPlugin({
    include: [resolve(__dirname, 'locales/**')],
  }),
]

export default defineConfig({
  ...commonConfig,
  build: {
    watch: __DEV__ ? {} : null,
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: false,
    outDir: r(outputDir),
    rollupOptions: {
      input: {
        background: r('src/background/index.ts'),
        popup: r('src/popup/index.ts'),
      },
      output: {
        assetFileNames: 'popup/[name].[ext]',
        entryFileNames: '[name]/index.js',
        extend: true,
        format: 'es',
      },
    },
  },
  plugins: [
    ...plugins,
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'popup/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'popup/components.d.ts',
    }),
  ],
})
