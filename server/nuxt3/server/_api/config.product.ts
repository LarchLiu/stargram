import { errorMessage } from '@starnexus/core/utils'
import { $fetch } from 'ofetch'
import type { OutputConfig, ServerConfig } from '../../composables/config'

export default eventHandler(async (event) => {
  try {
    const { outConfig } = await readBody<{ outConfig: ServerConfig<OutputConfig> }>(event)
    const res = await $fetch(`${process.env.GITHUB_REPO_DISPATCH_URL}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': process.env.GITHUB_TOKEN || '',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: {
        envent_type: 'deploy',
        client_payload: {
          outConfig: JSON.stringify(outConfig, null, 2),
          build: `pnpm build:${outConfig.server.select} && pnpm deploy:${outConfig.server.select}`,
          token: outConfig.server.config.token,
          siteid: outConfig.server.config.siteid,
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
