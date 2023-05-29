/* eslint-disable no-prototype-builtins */
import { kv } from '@vercel/kv'
import { CONST, ENV, TG_TOKENS } from './env'

export const defaultUserConfig = {
  webInfo: {
    api: {
      starNexusHub: '',
    },
  },
  webCard: {
    api: {
      starNexusHub: '',
    },
  },
  llm: {
    openai: {
      apiKey: '',
      apiHost: '',
      lang: 'en',
    },
  },
  imgStorage: {
    supabase: {
      url: '',
      bucket: '',
      anonKey: '',
    },
  },
  dataStorage: {
    notion: {
      apiKey: '',
      databaseId: '',
      defaultOgImage: '',
    },
  },
}
/**
 * 上下文信息
 */
export class Context {
  // 用户配置
  USER_CONFIG = defaultUserConfig

  USER_DEFINE = {
    // 自定义角色
    ROLE: {},
  }

  // 当前聊天上下文
  CURRENT_CHAT_CONTEXT = {
    chat_id: '',
    reply_to_message_id: '', // 如果是群组，这个值为消息ID，否则为null
    parse_mode: 'Markdown',
  }

  // 共享上下文
  SHARE_CONTEXT = {
    currentHost: '',
    currentBotId: '', // 当前机器人 ID
    currentBotToken: '', // 当前机器人 Token
    currentBotName: '', // 当前机器人名称: xxx_bot
    chatHistoryKey: '', // history:chat_id:bot_id:(from_id)
    configStoreKey: '', // user_config:chat_id:bot_id:(from_id)
    groupAdminKey: '', // group_admin:group_id
    usageKey: '', // usage:bot_id
    chatType: '', // 会话场景, private/group/supergroup 等, 来源 message.chat.type
    chatId: '', // 会话 id, private 场景为发言人 id, group/supergroup 场景为群组 id
    speakerId: '', // 发言人 id
    role: '', // 角色
  }

  _initChatContext(chatId: any, replyToMessageId: any) {
    this.CURRENT_CHAT_CONTEXT.chat_id = chatId
    this.CURRENT_CHAT_CONTEXT.reply_to_message_id = replyToMessageId
  }

  async _initUserConfig(storeKey: string) {
    try {
      const userConfig = await kv.get<any>(storeKey)
      if (userConfig) {
        for (const key in userConfig) {
          if (
            this.USER_CONFIG.hasOwnProperty(key)
          && typeof this.USER_CONFIG[key as keyof typeof this.USER_CONFIG] === typeof userConfig[key]
          )
            this.USER_CONFIG[key as keyof typeof this.USER_CONFIG] = userConfig[key]
        }
      }
    }
    catch (e) {
      console.error(e)
    }
  }

  _initUserDefine(userDefine: Record<string, string>) {
    for (const key in userDefine) {
      if (
        this.USER_DEFINE.hasOwnProperty(key)
        && typeof this.USER_DEFINE[key as keyof typeof this.USER_DEFINE] === typeof userDefine[key]
      )
        this.USER_DEFINE[key as keyof typeof this.USER_DEFINE] = userDefine[key]
    }
  }

  initTelegramContext(url: URL) {
    let token = ''
    const match = url.pathname.match(
      /^\/api\/telegram\/(\d+:[A-Za-z0-9_-]{35})\/webhook/,
    )
    if (match)
      token = match[1]
    const telegramIndex = Object.keys(TG_TOKENS()).indexOf(token)
    if (telegramIndex === -1)
      throw new Error('Token not allowed')

    this.SHARE_CONTEXT.currentHost = `${url.protocol}//${url.host}`
    this.SHARE_CONTEXT.currentBotToken = token
    this.SHARE_CONTEXT.currentBotId = token.split(':')[0]
    this.SHARE_CONTEXT.currentBotName = TG_TOKENS()[token]
  }

  async _initShareContext(message: any) {
    this.SHARE_CONTEXT.usageKey = `usage:${this.SHARE_CONTEXT.currentBotId}`
    const id = message?.chat?.id
    if (id === undefined || id === null)
      throw new Error('Chat id not found')

    /*
      message_id每次都在变的。
      私聊消息中：
        message.chat.id 是发言人id
      群组消息中：
        message.chat.id 是群id
        message.from.id 是发言人id
      没有开启群组共享模式时，要加上发言人id
      chatHistoryKey = history:chat_id:bot_id:(from_id)
      configStoreKey =  user_config:chat_id:bot_id:(from_id)
      * */

    const botId = this.SHARE_CONTEXT.currentBotId
    let historyKey = `history:${id}`
    let configStoreKey = `user_config:${id}`
    let groupAdminKey = ''

    if (botId) {
      historyKey += `:${botId}`
      configStoreKey += `:${botId}`
    }
    // 标记群组消息
    if (CONST.GROUP_TYPES.includes(message.chat?.type)) {
      if (!ENV.GROUP_CHAT_BOT_SHARE_MODE && message.from.id) {
        historyKey += `:${message.from.id}`
        configStoreKey += `:${message.from.id}`
      }
      groupAdminKey = `group_admin:${id}`
    }

    this.SHARE_CONTEXT.chatHistoryKey = historyKey
    this.SHARE_CONTEXT.configStoreKey = configStoreKey
    this.SHARE_CONTEXT.groupAdminKey = groupAdminKey

    this.SHARE_CONTEXT.chatType = message.chat?.type
    this.SHARE_CONTEXT.chatId = message.chat.id
    this.SHARE_CONTEXT.speakerId = message.from.id || message.chat.id
  }

  async initContext(message: any) {
    // 按顺序初始化上下文
    const chatId = message?.chat?.id
    const replyId = CONST.GROUP_TYPES.includes(message.chat?.type) ? message.message_id : null
    this._initChatContext(chatId, replyId)
    // console.log(this.CURRENT_CHAT_CONTEXT)
    await this._initShareContext(message)
    // console.log(this.SHARE_CONTEXT)
    await this._initUserConfig(this.SHARE_CONTEXT.configStoreKey)
    // console.log(this.USER_CONFIG)
  }
}
