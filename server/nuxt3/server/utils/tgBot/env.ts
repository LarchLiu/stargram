import { kv } from '@vercel/kv'
import i18n from './i18n'

export interface TgBotEnv {
  // NOTION_CONFIG: { apiKey: string; databaseId: string }
  TELEGRAM_AVAILABLE_TOKENS: string[]
  TELEGRAM_BOT_NAME: string[]
  CHAT_WHITE_LIST: string[]
  CHAT_GROUP_WHITE_LIST: string[]
  HIDE_COMMAND_BUTTONS: string[]
  LANGUAGE: string
}

export interface TgBotConfig {
  [token: string]: TgBotEnv
}
type TgAvailableTokens = Record<string, string>
export const tgEnvDefault: TgBotEnv = {
  // 允许访问的Telegram Token， 设置时以逗号分隔
  TELEGRAM_AVAILABLE_TOKENS: [],
  // 允许访问的Telegram Token 对应的Bot Name， 设置时以逗号分隔
  TELEGRAM_BOT_NAME: [],
  // 白名单
  CHAT_WHITE_LIST: [],
  // 群组白名单
  CHAT_GROUP_WHITE_LIST: [],
  // 隐藏部分命令按钮
  HIDE_COMMAND_BUTTONS: [],
  // 语言
  LANGUAGE: 'en',
}
export const ENV = {
  // 允许所有人使用
  I_AM_A_GENEROUS_PERSON: false,
  // 群组机器人开关
  GROUP_CHAT_BOT_ENABLE: false,
  // 群组机器人共享模式,关闭后，一个群组只有一个会话和配置。开启的话群组的每个人都有自己的会话上下文
  GROUP_CHAT_BOT_SHARE_MODE: false,

  TELEGRAM_API_DOMAIN: 'https://api.telegram.org',

  // DEBUG 专用
  // 调试模式
  DEBUG_MODE: false,
  // 开发模式
  DEV_MODE: false,
}
export const CONST = {
  CONFIG_KEY: 'TG_BOT_CONFIG',
  TOKENS_KEY: 'TG_TOKENS',
  PASSWORD_KEY: 'chat_history_password',
  GROUP_TYPES: ['group', 'supergroup'],
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15',
}
const I18nHans = i18n('zh-CN')
const I18nHant = i18n('zh-TW')
const I18nEN = i18n('en')

export const I18N = {
  'zh-CN': I18nHans,
  'zh-TW': I18nHant,
  'en': I18nEN,
}

let TgConfig: TgBotConfig
let TgTokens: TgAvailableTokens
export const TG_CONFIG = () => TgConfig
export const TG_TOKENS = () => TgTokens
export async function initEnv() {
  TgConfig = await kv.get<TgBotConfig>(CONST.CONFIG_KEY) || {}
  TgTokens = await kv.get<TgAvailableTokens>(CONST.TOKENS_KEY) || {}
}
