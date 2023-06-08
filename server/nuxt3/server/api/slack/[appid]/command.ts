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
    const userConfig = JSON.parse(cryption.decode(config))
    const mykeys = Object.keys(userConfig)
      .filter((key) => {
        const obj = userConfig[key]
        const keys = Object.keys(obj)
        return !keys.includes('public')
      })
    const myConfig = mykeys.map(key => ({ [key]: userConfig[key] }))
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
})
