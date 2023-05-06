import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import AutoImport from '@starnexus/import-routes/vite'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  build: {
    cssCodeSplit: false,
    emptyOutDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@starnexus/core',
      // the proper extensions will be added
      fileName: 'index',
    },
  },
  plugins: [
    AutoImport({
      dirs: ['src/website/**/*'],
      routesExportPath: 'src/website/routes-auto-imports.ts',
    }),
  ],
})