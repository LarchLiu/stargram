import * as fs from 'node:fs'
import process from 'node:process'
import { errorMessage } from '@stargram/core/utils'
import { $fetch } from 'ofetch'
import type { OutputConfig, ServerConfig } from '../../composables/config'

export default eventHandler(async (event) => {
  try {
    const { outConfig } = await readBody<{ outConfig: ServerConfig<OutputConfig> }>(event)
    if (process.env.NODE_ENV === 'development') {
      let prebuild = ''
      const kvConfig = outConfig.kvStorage.config!
      const kvEnvs = Object.keys(kvConfig).map((key) => {
        return `netlify env:set ${key} ${kvConfig[key]}`
      })
      prebuild = kvEnvs.join(' && ')

      const kv = {
        driver: outConfig.kvStorage.select,
        ...kvConfig,
      }

      const filename = './nuxt.config.ts'
      const nuxtConfig = fs.readFileSync(filename, 'utf-8')
      const regex = /storage: \{\n\s+?kv: (\{\n\s+?\S.*?,\n.*?\}),\n\s+?\},/s
      const matchs = nuxtConfig.match(regex)
      let replaced = ''
      if (matchs) {
        replaced = nuxtConfig.replace(matchs[1], JSON.stringify(kv, null, '\t'))
        fs.writeFileSync(filename, replaced)
      }
      console.error(prebuild)

      return 'Check nuxt.config.ts, DO NOT SAVE this change to git!!!'
    }
    else {
      let prebuild = ''
      let deployOptions = ''
      const prewrite = {
        file: '',
        content: '',
      }
      const kvConfig = outConfig.kvStorage.config!
      const kv = {
        driver: outConfig.kvStorage.select,
        ...kvConfig,
      }
      const runScripts = {
        run: `node server/nuxt3/scripts/changeKVStorage.js --kv '${JSON.stringify(kv, null, 2)}'`,
      }
      if (outConfig.server.select === 'netlify') {
        const kvEnvs = Object.keys(kvConfig).map((key) => {
          return `netlify env:set ${key} ${kvConfig[key]}`
        })
        // prebuild = `netlify env:set KV_REST_API_URL ${outConfig.kvStorage.config!.KV_REST_API_URL} && netlify env:set KV_REST_API_TOKEN ${outConfig.kvStorage.config!.KV_REST_API_TOKEN}`
        prebuild = kvEnvs.join(' && ')
      }
      else if (outConfig.server.select === 'cloudflare') {
        deployOptions = ` --project-name=${outConfig.server.config!.siteid}`
      }
      else if (outConfig.server.select === 'vercel') {
        deployOptions = ` --token=${outConfig.server.config!.token}`
      }

      await $fetch(`${process.env.GITHUB_REPO_DISPATCH_URL}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN || ''}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: {
          event_type: 'deploy',
          client_payload: {
            runScripts,
            prebuild,
            prewrite,
            build: `pnpm build:${outConfig.server.select} && pnpm deploy:${outConfig.server.select}${deployOptions}`,
            clitoken: outConfig.server.config!.token,
            siteid: outConfig.server.config!.siteid,
            KV_REST_API_URL: outConfig.kvStorage.config!.KV_REST_API_URL,
            KV_REST_API_TOKEN: outConfig.kvStorage.config!.KV_REST_API_TOKEN,
          },
        },
        responseType: 'json',
      })
      return 'Deploy to cloud server, please check your own server status.'
    }
  }
  catch (error) {
    setResponseStatus(event, 400)

    const message = errorMessage(error)
    return { error: message }
  }
})
