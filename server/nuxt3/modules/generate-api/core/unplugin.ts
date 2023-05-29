import { resolve } from 'node:path'
import { createUnplugin } from 'unplugin'
import { createContext } from './ctx'

export default createUnplugin(() => {
  const ctx = createContext()
  return {
    name: 'starnexus-generate-api',
    enforce: 'post',
    async buildStart() {
      const resolved = resolve(process.cwd(), './starnexus.config.json')
      this.addWatchFile(resolved)
      await ctx.generateApi()
    },
    vite: {
      async handleHotUpdate({ file }) {
        if (file.includes('starnexus.config'))
          await ctx.generateApi()
      },
    },
  }
})
