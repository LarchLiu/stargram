import { defineConfig } from 'vite'
import { commonConfig, plugins, r } from './vite.config'
import { __DEV__, outputDir } from './const'

export default defineConfig({
  ...commonConfig,
  build: {
    watch: __DEV__ ? {} : null,
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: false,
    outDir: r(`${outputDir}/settings`),
    rollupOptions: {
      input: {
        settings: r('src/settings/index.ts'),
      },
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: 'index.js',
        extend: true,
        format: 'es',
      },
    },
  },
  plugins,
})
