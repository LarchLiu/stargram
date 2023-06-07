import { cryption } from '../../../../constants/index'

const kv = useStorage('kv')

export default eventHandler(async (event) => {
  const raw = await readBody(event)
  if (raw.command === '/start') {
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `\`\`\`\nApp ID: ${raw.api_app_id}\nUser ID: ${raw.user_id}\n\`\`\``,
          },
        },
      ],
    }
  }
  else if (raw.command === '/config') {
    const config = await kv.getItem(`slack${ConfigKey.userCofnigKey}:${raw.api_app_id}:${raw.user_id}`) as string
    const userConfig = JSON.stringify(JSON.parse(cryption.decode(config)), null, 2)
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `\`\`\`\n${userConfig}\n\`\`\``,
          },
        },
      ],
    }
  }
})
