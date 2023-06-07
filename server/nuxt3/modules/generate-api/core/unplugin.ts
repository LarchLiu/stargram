import { resolve } from 'node:path'
import { createUnplugin } from 'unplugin'
import { createContext } from './ctx'

export default createUnplugin(() => {
  const ctx = createContext()
  return {
    name: 'stargram-generate-api',
    enforce: 'post',
    async buildStart() {
      const resolved = resolve(process.cwd(), './stargram.config.json')
      this.addWatchFile(resolved)
      await ctx.generateApi()
    },
    async buildEnd() {
      ctx.copyDefaultConfigFile()
    },
    vite: {
      async handleHotUpdate({ file }) {
        if (file.includes('stargram.config') || file.includes('_api'))
          await ctx.generateApi()
      },
    },
  }
})
