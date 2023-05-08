import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    include: ['test/**/*.test.ts'],
    includeSource: ['src/**/*.{js,ts}'],
    environment: 'node',
    testTimeout: 20000,
  },
})
