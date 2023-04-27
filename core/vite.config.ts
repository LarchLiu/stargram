import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
    },
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
  build: {
    cssCodeSplit: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@starnexus/core',
      // the proper extensions will be added
      fileName: 'index',
    },
  },
})
