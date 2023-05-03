import { resolve } from 'node:path'
import { defineProject } from 'vitest/config'

export default defineProject({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
    },
  },
  test: {
    include: ['test/**/*.test.ts'],
    includeSource: ['src/**/*.{js,ts}'],
    environment: 'node',
    testTimeout: 20000,
  },
})
