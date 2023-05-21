import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import GenerateRoutes from '@starnexus/generate-routes/vite'

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
      name: '@starnexus/web-hub',
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        '@starnexus/core',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@starnexus/core': '@starnexus/core',
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
