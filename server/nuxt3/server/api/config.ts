import { errorMessage } from '@stargram/core/utils'
import { $fetch } from 'ofetch'
import type { OutputConfig, ServerConfig } from '../../composables/config'

export default eventHandler(async (event) => {
  try {
    const { outConfig } = await readBody<{ outConfig: ServerConfig<OutputConfig> }>(event)
    let prebuild = ''
    let deployOptions = ''
    const prewrite = {
      file: '',
      content: '',
    }
    if (outConfig.server.select === 'netlify')
      prebuild = `netlify env:set KV_REST_API_URL ${outConfig.kvStorage.config!.KV_REST_API_URL} && netlify env:set KV_REST_API_TOKEN ${outConfig.kvStorage.config!.KV_REST_API_TOKEN}`
    else if (outConfig.server.select === 'cloudflare')
      deployOptions = ` --project-name=${outConfig.server.config!.siteid}`
    else if (outConfig.server.select === 'vercel')
      deployOptions = ` --token=${outConfig.server.config!.token}`

    const res = await $fetch(`${process.env.GITHUB_REPO_DISPATCH_URL}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN || ''}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: {
        event_type: 'deploy',
        client_payload: {
          outConfig: JSON.stringify(outConfig, null, 2),
          prebuild,
          prewrite,
          build: `pnpm build:${outConfig.server.select} && pnpm deploy:${outConfig.server.select}${deployOptions}`,
          clitoken: outConfig.server.config!.token,
          siteid: outConfig.server.config!.siteid,
          kvurl: outConfig.kvStorage.config!.KV_REST_API_URL,
          kvtoken: outConfig.kvStorage.config!.KV_REST_API_TOKEN,
        },
      },
      responseType: 'json',
    })
    return res
  }
  catch (error) {
    setResponseStatus(event, 400)

    const message = errorMessage(error)
    return { error: message }
  }
})
