import { kv } from '@vercel/kv'
import { TG_CONFIG } from '../../utils/tgBot/env'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  await initEnv()
  const token = body.tgToken.trim()
  const userId = body.userId.trim()
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
  await kv.set(CONST.CONFIG_KEY, TG_CONFIG())
  return 'ok'
})
