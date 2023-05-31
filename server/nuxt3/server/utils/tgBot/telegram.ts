import type { Context } from './context'
import { ENV } from './env'

const kv = useStorage('kv')
async function sendMessage(message: string, token: string, context: Record<string, any>) {
  return await fetch(
      `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...context,
          text: message,
        }),
      },
  )
}

export async function sendMessageToTelegram(message: string, token: string, context: Record<string, any>) {
  // console.log('Send Message:\n', message)
  const chatContext = context
  if (message.length <= 4096) {
    const resp = await sendMessage(message, token, chatContext)
    if (resp.status === 200) {
      return resp
    }
    else {
      // 继续尝试用HTML发送
      // {"ok":false,"error_code":400,"description":"Bad Request: can't parse entities
    }
  }
  const limit = 4000
  chatContext.parse_mode = 'HTML'
  for (let i = 0; i < message.length; i += limit) {
    const msg = message.slice(i, i + limit)
    await sendMessage(`<pre>\n${msg}\n</pre>`, token, chatContext)
  }
  return new Response('Message batch send', { status: 200 })
}

export function sendMessageToTelegramWithContext(context: Context) {
  return async (message: string) => {
    return sendMessageToTelegram(message, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT)
  }
}

export async function sendPhotoToTelegram(url: string, token: string, context: Record<string, any>) {
  return await fetch(
      `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendPhoto`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...context,
          photo: url,
          parse_mode: null,
        }),
      },
  )
}

export function sendPhotoToTelegramWithContext(context: Context) {
  return (url: string) => {
    return sendPhotoToTelegram(url, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT)
  }
}

export async function sendChatActionToTelegram(action: string, token: string, chatId: string | number) {
  return await fetch(
      `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendChatAction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          action,
        }),
      },
  ).then(res => res.json())
}

export function sendChatActionToTelegramWithContext(context: Context) {
  return (action: string) => {
    return sendChatActionToTelegram(action, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT.chat_id)
  }
}

export async function bindTelegramWebHook(token: string, url: string) {
  return await fetch(
      `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
        }),
      },
  ).then(res => res.json())
}

export async function getChatRole(id: string | number, groupAdminKey: string, chatId: string | number, token: string) {
  let groupAdmin
  try {
    groupAdmin = await kv.getItem(groupAdminKey)
  }
  catch (e: any) {
    console.error(e)
    return e.message
  }
  if (!groupAdmin || !Array.isArray(groupAdmin) || groupAdmin.length === 0) {
    const administers = await getChatAdminister(chatId, token)
    if (!administers)
      return null

    groupAdmin = administers
    // 缓存120s
    await kv.setItem(groupAdminKey, groupAdmin)
  }
  for (let i = 0; i < groupAdmin.length; i++) {
    const user = groupAdmin[i]
    if (user.user.id === id)
      return user.status
  }
  return 'member'
}

export function getChatRoleWithContext(context: Context) {
  return (id: string) => {
    return getChatRole(id, context.SHARE_CONTEXT.groupAdminKey, context.CURRENT_CHAT_CONTEXT.chat_id, context.SHARE_CONTEXT.currentBotToken)
  }
}

export async function getChatAdminister(chatId: string | number, token: string) {
  try {
    const resp = await fetch(
        `${ENV.TELEGRAM_API_DOMAIN}/bot${
          token
        }/getChatAdministrators`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chat_id: chatId }),
        },
    ).then(res => res.json())
    if (resp.ok)
      return resp.result
    else
      return null
  }
  catch (e) {
    console.error(e)
    return null
  }
}

export async function getBot(token: string) {
  const resp = await fetch(
      `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getMe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
  ).then(res => res.json())
  if (resp.ok) {
    return {
      ok: true,
      info: {
        name: resp.result.first_name,
        bot_name: resp.result.username,
        can_join_groups: resp.result.can_join_groups,
        can_read_all_group_messages: resp.result.can_read_all_group_messages,
      },
    }
  }
  else {
    return resp
  }
}
