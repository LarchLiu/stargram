import { cryption } from '../../../../constants/index'
import type { KVConfig, ServerConfig } from '../../../../composables/config'
import type { UserConfig } from '../../../utils'

export default eventHandler(async (event) => {
  const raw = await readBody(event)
  if (raw.command === '/start') {
    const domain = `${getRequestProtocol(event)}://${getRequestHost(event)}`
    const info = {
      appName: 'slack',
      appId: raw.api_app_id,
      userId: raw.user_id,
    }
    const encode = cryption.encode(JSON.stringify(info))
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `User ID: ${raw.user_id}\nSet Config: *<${domain}/user-config?code=${encode}|Go to this link>*`,
          },
        },
      ],
    }
  }
  else if (raw.command === '/config') {
    const userConfig = await getUserConfig('slack', raw.api_app_id, raw.user_id)
    const myConfig: any = {}
    if (userConfig) {
      Object.keys(userConfig)
        .filter((key) => {
          const obj = userConfig[key as keyof ServerConfig<KVConfig>]
          return !obj.public
        })
        .forEach(key => myConfig[key] = userConfig[key as keyof ServerConfig<KVConfig>])
    }
    const showConfig = JSON.stringify(myConfig, null, 2)
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `\`\`\`\n${showConfig}\n\`\`\``,
          },
        },
      ],
    }
  }
  else if (raw.command === '/qa') {
    const userConfig = await getUserConfig('slack', raw.api_app_id, raw.user_id)
    const question = raw.text
    if (userConfig)
      MakeQAChain(question, { USER_CONFIG: userConfig as UserConfig }, 'slack', raw.api_app_id, raw.user_id)
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Question: ${question}`,
          },
        },
      ],
    }
  }
})
