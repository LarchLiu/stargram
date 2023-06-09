import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import GenerateRoutes from '@stargram/generate-routes/vite'

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
      name: '@stargram/web-hub',
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        '@stargram/core',
        '@extractus/article-extractor',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@stargram/core': '@stargram/core',
          '@extractus/article-extractor': '@extractus/article-extractor',
        },
      },
    },
  },
  plugins: [
    GenerateRoutes({
      dirs: ['src/website/**/*'],
      routesExportPath: 'src/routes-auto-generate.ts',
    }),
  ],
})
