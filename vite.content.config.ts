import { defineConfig } from 'vite'
import { commonConfig, r } from './vite.config'
import { __DEV__, outputDir } from './const'
import hotReloadContent from './scripts/hot-reload/content'

// bundling the content script
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
        contentScript: r('src/contentScript/index.ts'),
      },
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: '[name]/index.js',
        extend: true,
        format: 'iife',
      },
    },
  },
  plugins: [
    ...commonConfig.plugins,
    // Unocss(),

    // // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    // VueI18nPlugin({
    //   include: [path.resolve(__dirname, 'locales/**')],
    // }),
    hotReloadContent(),
  ],
})
