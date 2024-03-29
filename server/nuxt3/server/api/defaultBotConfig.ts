import { getBotConfig } from '../utils'

export default eventHandler(async (event) => {
  const method = event.method
  if (method === 'GET') {
    const telegramConfig = await getBotConfig('telegram')
    let encodeConfig = ''
    if (telegramConfig.default) {
      const id = telegramConfig.default.split(':')[0]
      encodeConfig = telegramConfig[id].config
    }
    else {
      const stargramConfig = await getBotConfig('stargram')
      if (stargramConfig.default) {
        const id = stargramConfig.default
        encodeConfig = stargramConfig[id].config
      }
      else {
        const slackConfig = await getBotConfig('slack')
        if (slackConfig.default) {
          const id = slackConfig.default
          encodeConfig = slackConfig[id].config
        }
      }
    }
    return { config: encodeConfig }
  }
})
