/* eslint-disable no-prototype-builtins */
import { errorMessage } from '@stargram/core/utils'
import { TelegramSaveWebInfoChain } from './makeChain'
import { ENV, TG_CONFIG } from './env'
import { Context } from './context'
import { sendChatActionToTelegramWithContext, sendMessageToTelegramWithContext } from './telegram.js'

// import {requestCompletionsFromChatGPT} from './openai.js';
import { handleCommandMessage } from './command'
import { errorToString } from './utils'

// import { saveToNotion } from './notion.js'

// import {TelegramMessage, TelegramWebhookRequest} from './type.d.ts';
const kv = useStorage('kv')

async function msgInitChatContext(message: any, context: Context) {
  try {
    await context.initContext(message)
  }
  catch (e) {
    return new Response(errorToString(e), { status: 200 })
  }
  return null
}

async function msgFilterWhiteList(message: any, context: Context) {
  if (ENV.I_AM_A_GENEROUS_PERSON)
    return null

  const i18n = I18N[TG_CONFIG().LANGUAGE as keyof typeof I18N]
  // 判断私聊消息
  if (context.SHARE_CONTEXT.chatType === 'private') {
    // 白名单判断
    if (!TG_CONFIG().CHAT_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
      return sendMessageToTelegramWithContext(context)(
        i18n.message.user_has_no_permission_to_use_the_bot(context.CURRENT_CHAT_CONTEXT.chat_id),
      )
    }
    return null
  }

  return sendMessageToTelegramWithContext(context)(
    i18n.message.not_supported_chat_type(context.SHARE_CONTEXT.chatType),
  )
}

async function msgFilterNonTextMessage(message: any, context: Context) {
  const i18n = I18N[TG_CONFIG().LANGUAGE as keyof typeof I18N]
  if (!message.text)
    return sendMessageToTelegramWithContext(context)(i18n.message.not_supported_chat_type_message)

  return null
}

async function msgHandleGroupMessage(message: any, context: Context) {
  // 非文本消息直接忽略
  if (!message.text)
    return new Response('Non text message', { status: 200 })

  // 处理群组消息，过滤掉AT部分
  const botName = context.SHARE_CONTEXT.currentBotName
  if (botName) {
    let mentioned = false
    // Reply消息
    if (message.reply_to_message) {
      if (message.reply_to_message.from.username === botName)
        mentioned = true
    }
    if (message.entities) {
      let content = ''
      let offset = 0
      message.entities.forEach((entity: any) => {
        switch (entity.type) {
          case 'bot_command':
            if (!mentioned) {
              const mention = message.text.substring(
                entity.offset,
                entity.offset + entity.length,
              )
              if (mention.endsWith(botName))
                mentioned = true

              const cmd = mention
                .replaceAll(`@${botName}`, '')
                .replaceAll(botName, '')
                .trim()
              content += cmd
              offset = entity.offset + entity.length
            }
            break
          case 'mention':
          case 'text_mention':
            if (!mentioned) {
              const mention = message.text.substring(
                entity.offset,
                entity.offset + entity.length,
              )
              if (mention === botName || mention === `@${botName}`)
                mentioned = true
            }
            content += message.text.substring(offset, entity.offset)
            offset = entity.offset + entity.length
            break
        }
      })
      content += message.text.substring(offset, message.text.length)
      message.text = content.trim()
    }
    // 未AT机器人的消息不作处理
    if (!mentioned)
      return new Response('No mentioned', { status: 200 })
    else
      return null
  }
  return new Response('Not set bot name', { status: 200 })
}

async function msgHandleCommand(message: any, context: Context) {
  return await handleCommandMessage(message, context)
}

async function msgHandleRole(message: any, context: Context) {
  if (!message.text.startsWith('~'))
    return null

  message.text = message.text.slice(1)
  const kv = message.text.indexOf(' ')
  if (kv === -1)
    return null

  const role = message.text.slice(0, kv)
  const msg = message.text.slice(kv + 1).trim()
  // 存在角色就替换USER_CONFIG
  if (context.USER_DEFINE.ROLE.hasOwnProperty(role)) {
    context.SHARE_CONTEXT.role = role
    message.text = msg
    const roleConfig = context.USER_DEFINE.ROLE[role as keyof typeof context.USER_DEFINE.ROLE]
    for (const key in roleConfig as any) {
      if (
        context.USER_CONFIG.hasOwnProperty(key)
        && typeof context.USER_CONFIG[key as keyof typeof context.USER_CONFIG] === typeof roleConfig[key]
      )
        context.USER_CONFIG[key as keyof typeof context.USER_CONFIG] = roleConfig[key]
    }
  }
}

async function msgProcessByStarNuxts(message: any, context: Context) {
  try {
    // console.log(`Ask:${message.text}` || '')
    setTimeout(() => sendChatActionToTelegramWithContext(context)('typing').catch(console.error), 0)
    const res = await TelegramSaveWebInfoChain(message.text, context)
    return sendMessageToTelegramWithContext(context)(res)
  }
  catch (e) {
    const message = errorMessage(e)
    return sendMessageToTelegramWithContext(context)(`Error: ${message}`)
  }
}

export async function msgProcessByChatType(message: any, context: Context) {
  const i18n = I18N[TG_CONFIG().LANGUAGE as keyof typeof I18N]
  const handlerMap = {
    private: [
      msgFilterWhiteList,
      msgFilterNonTextMessage,
      msgHandleCommand,
      msgHandleRole,
    ],
    group: [
      msgHandleGroupMessage,
      msgFilterWhiteList,
      msgHandleCommand,
      msgHandleRole,
    ],
    supergroup: [
      msgHandleGroupMessage,
      msgFilterWhiteList,
      msgHandleCommand,
      msgHandleRole,
    ],
  }
  if (!handlerMap.hasOwnProperty(context.SHARE_CONTEXT.chatType)) {
    return sendMessageToTelegramWithContext(context)(
      i18n.message.not_supported_chat_type(context.SHARE_CONTEXT.chatType),
    )
  }
  const handlers = handlerMap[context.SHARE_CONTEXT.chatType as keyof typeof handlerMap]
  for (const handler of handlers) {
    try {
      const result = await handler(message, context)
      if (result && result instanceof Response)
        return result
    }
    catch (e) {
      console.error(e)
      return sendMessageToTelegramWithContext(context)(
        i18n.message.handle_chat_type_message_error(context.SHARE_CONTEXT.chatType),
      )
    }
  }
  return null
}

async function loadMessage(raw: any) {
  // console.log(JSON.stringify(raw))
  if (ENV.DEV_MODE) {
    setTimeout(() => {
      kv.setItem(`log:${new Date().toISOString()}`, JSON.stringify(raw)).catch(console.error)
    })
  }
  if (raw.edited_message)
    throw new Error('Ignore edited message')

  if (raw.message)
    return raw.message
  else
    throw new Error('Invalid message')
}

export async function handleMessage(url: URL, raw: any) {
  const context = new Context()
  context.initTelegramContext(url)
  const message = await loadMessage(raw)

  // 消息处理中间件
  const handlers = [
    msgInitChatContext, // 初始化聊天上下文: 生成chat_id, reply_to_message_id(群组消息), SHARE_CONTEXT
    msgProcessByChatType, // 根据类型对消息进一步处理
    msgProcessByStarNuxts, // 与OpenAI聊天
  ]

  for (const handler of handlers) {
    try {
      const result = await handler(message, context)
      if (result && result instanceof Response)
        return result
    }
    catch (e) {
      console.error(e)
      return new Response(errorToString(e), { status: 500 })
    }
  }

  return null
}
