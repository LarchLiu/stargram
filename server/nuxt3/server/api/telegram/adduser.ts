import { CONST, TG_CONFIG } from '../../utils/tgBot/env'

const kv = useStorage('kv')

export default eventHandler(async (event) => {
  const body = await readBody(event)
  await initEnv()
  const token = body.botToken.trim()
  const userId = body.userId.trim()
  const userConfig = body.userConfig
  const test = /(\d+:[A-Za-z0-9_-]{35})/.test(token)
  if (!test) {
    setResponseStatus(event, 400)
    return { error: 'Telegram Token Not Available' }
  }
  if (!userId) {
    setResponseStatus(event, 400)
    return { error: 'No User Id' }
  }

  const list = TG_CONFIG()[token].CHAT_WHITE_LIST
  if (!list.includes(userId))
    TG_CONFIG()[token].CHAT_WHITE_LIST.push(userId)
  await kv.setItem(CONST.CONFIG_KEY, TG_CONFIG())
  if (userConfig) {
    const botId = token.split(':')[0]
    const userConfigKey = `${CONST.USER_CONFIG_KEY}:${userId}:${botId}`
    await kv.setItem(userConfigKey, userConfig)
  }
  return 'ok'
})
