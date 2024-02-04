const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  unocss: true,
  formatters: true,
  ignores: ['dist', '**/dist/**', 'extension', '**/extension/**', 'local', '**/local/**', 'node_modules', '**/node_modules/**', '*.d.ts', '**/*.d.ts', '.next', '**/.next/**', '.turbo', '**/.turbo/**'],
})
