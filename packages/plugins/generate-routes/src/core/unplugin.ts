import { createUnplugin } from 'unplugin'
import type { Options } from '../types'
import { createContext } from './ctx'

export default createUnplugin<Options | undefined>((options) => {
  let ctx = createContext(options)
  return {
    name: 'stargram-import-routes',
    enforce: 'post',
    async buildStart() {
      await ctx.scanDirs()
    },
    async buildEnd() {
      await ctx.writeRoutesFiles()
    },
    vite: {
      async handleHotUpdate({ file }) {
        if (ctx.dirs?.some(dir => file.startsWith(dir)))
          await ctx.scanDirs()
      },
      async configResolved(config) {
        if (ctx.root !== config.root) {
          ctx = createContext(options, config.root)
          await ctx.scanDirs()
        }
      },
    },
  }
})
