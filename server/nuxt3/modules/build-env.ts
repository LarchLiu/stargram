import { defineNuxtModule } from '@nuxt/kit'
import { getEnv, version } from '../config/env'
import type { BuildInfo } from '../types'

export default defineNuxtModule({
  meta: {
    name: 'stargram:build-env',
  },
  async setup(_options, nuxt) {
    const { env } = await getEnv()
    const buildInfo: BuildInfo = {
      version,
      time: +Date.now(),
      env,
    }

    nuxt.options.appConfig = nuxt.options.appConfig || {}
    nuxt.options.appConfig.env = env
    nuxt.options.appConfig.buildInfo = buildInfo
  },
})
