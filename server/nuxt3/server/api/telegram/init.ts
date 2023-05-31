import { TG_CONFIG, TG_TOKENS, tgEnvDefault } from '../../utils/tgBot/env'

const kv = useStorage('kv')

export default eventHandler(async (event) => {
  const result: Record<string, any> = {}
  const body = await readBody(event)
  await initEnv()
  const domain = `${getRequestProtocol(event)}://${getRequestHost(event)}`
  const token = body.tgToken.trim()
  const botName = body.botName
  const test = /(\d+:[A-Za-z0-9_-]{35})/.test(token)
  if (!test) {
    setResponseStatus(event, 400)
    return { error: 'Telegram Token Not Available' }
  }
  if (!botName) {
    setResponseStatus(event, 400)
    return { error: 'Telegram Bot Name Not Available' }
  }
  const url = `${domain}/api/telegram/${token}/webhook`
  const id = token.split(':')[0]
  result[id] = {
    webhook: await bindTelegramWebHook(token, url).catch(e => e.message),
    command: await bindCommandForTelegram(token).catch(e => e.message),
  }
  if (result[id].webhook.result) {
    const env = JSON.parse(JSON.stringify(tgEnvDefault))
    TG_TOKENS()[token] = botName
    TG_CONFIG()[token] = env
    await kv.setItem(CONST.TOKENS_KEY, TG_TOKENS())
    await kv.setItem(CONST.CONFIG_KEY, TG_CONFIG())
  }
  return result[id]
})
