import { errorMessage } from '@stargram/core/utils'
import { $fetch } from 'ofetch'
import type { BotConfig } from '../../../utils'
import { cryption } from '../../../../constants/index'
import type { OutUserConfig, ServerConfig } from '../../../../composables/config'

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const appId = event.context.params!.appid
  const botConfig = await getBotConfig('slack') as BotConfig
  const encodeConfig = botConfig[appId]?.config
  if (encodeConfig) {
    const config = JSON.parse(cryption.decode(encodeConfig)) as ServerConfig<OutUserConfig>
    const slackConfig = config.app.config!
    const body = new URLSearchParams({
      code: query.code as string,
      client_id: slackConfig.clientId,
      client_secret: slackConfig.clientSecret,
    })
    try {
      const res: Record<string, any> = await $fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })
      if (res.ok) {
        const userId = res.authed_user.id
        const webhook = res.incoming_webhook.url
        const config = {
          app: {
            select: 'slack',
            public: false,
            config: {
              webhook,
            },
          },
        }
        await setUserConfig('slack', appId, userId, config)
        return 'The setup was successful. Type /start and send that command to your bot to configure your custom settings.'
      }
      else {
        return res
      }
    }
    catch (err) {
      return errorMessage(err)
    }
  }
  else {
    return 'This App have not init on this server.'
  }
})
