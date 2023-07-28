import { getBotConfig } from '../utils'

export default eventHandler(async (event) => {
  const method = getMethod(event)
  if (method === 'GET') {
    const telegramConfig = await getBotConfig('telegram')
    const telegramBot = []
    const telegramKeys = Object.keys(telegramConfig)
    for (let i = 0; i < telegramKeys.length; i++) {
      if (telegramKeys[i] !== 'default') {
        const res = await $fetch<{ result: Record<string, any> }>(`https://api.telegram.org/bot${telegramConfig[telegramKeys[i]].token}/getMe`)
        telegramBot.push(res.result)
      }
    }
    const slackConfig = await getBotConfig('slack')
    const slackBot = []
    const slackKeys = Object.keys(slackConfig)
    for (let i = 0; i < slackKeys.length; i++) {
      if (slackKeys[i] !== 'default')
        slackBot.push({ appId: slackKeys[i], clientId: slackConfig[slackKeys[i]].token })
    }
    return { telegram: telegramBot, slack: slackBot }
  }
})
