const fs = require('node:fs')

function run() {
  let kv = ''
  const argv = process.argv
  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case '--kv':
        kv = argv[++i]
        break
      default:
        throw new Error('unknown arg')
    }
  }
  const filename = 'server/nuxt3/nuxt.config.ts'
  const nuxtConfig = fs.readFileSync(filename, 'utf-8')
  const regex = /storage: \{\n\s+?kv: (\{\n\s+?\S.*?,\n.*?\}),\n\s+?\},/s
  const matchs = nuxtConfig.match(regex)
  let replaced = ''
  if (matchs) {
    replaced = nuxtConfig.replace(matchs[1], kv)
    fs.writeFileSync(filename, replaced)
  }
}

run()
