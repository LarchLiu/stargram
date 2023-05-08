import { defineConfig } from 'vite'
import { replaceCodePlugin } from 'vite-plugin-replace'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { commonConfig, plugins, r } from './vite.config'
import { __DEV__, outputDir } from './const'

// bundling the content script
export default defineConfig({
  ...commonConfig,
  build: {
    watch: __DEV__ ? {} : null,
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: false,
    outDir: r(`${outputDir}/contentScript`),
    rollupOptions: {
      input: {
        contentScript: r('src/contentScript/index.ts'),
      },
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: 'index.js',
        extend: true,
        format: 'es',
      },
    },
  },
  plugins: [
    ...plugins,
    replaceCodePlugin({
      replacements: [
        {
          from: /:root\{/g,
          to: ':host{',
        },
      ],
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'contentScript/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'contentScript/components.d.ts',
    }),
  ],
})
