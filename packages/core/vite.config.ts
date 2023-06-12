import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export const entrypoints = {
  'chain': 'chain/index',
  'chain/saveWebInfo': 'chain/saveWebInfo',
  'llm/openai': 'llm/openai/index',
  'storage': 'storage/index',
  'storage/notion': 'storage/notion/index',
  'storage/supabase': 'storage/supabase/index',
  'utils': 'utils/index',
  'webCard': 'webCard/index',
  'webInfo': 'webInfo/index',
}

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  build: {
    cssCodeSplit: false,
    emptyOutDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...Object.fromEntries(
          [...Object.values(entrypoints)].map(v => [
                `${v}`,
                resolve(__dirname, `src/${v}`),
          ]),
        ),
      },
      name: '@stargram/core',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        '@supabase/supabase-js',
        'ofetch',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@supabase/supabase-js': '@supabase/supabase-js',
          'ofetch': 'ofetch',
        },
      },
    },
  },
  plugins: [
    vue(),
  ],
})
