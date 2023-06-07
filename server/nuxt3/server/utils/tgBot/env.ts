import { Cryption } from '@stargram/core/utils'
import type { BotConfig } from '../index'
import { getBotConfig } from '../index'
import { C1, C2 } from '../../../constants/index'
import i18n from './i18n'

const cryption = new Cryption(C1, C2)
export interface TgBotEnv {
  CHAT_WHITE_LIST: string[]
  LANGUAGE: string
  IS_INIT?: boolean
}

export interface TgBotConfig {
  [token: string]: TgBotEnv
}
export const tgEnvDefault: TgBotEnv = {
  // 白名单
  CHAT_WHITE_LIST: [],
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
  USER_CONFIG_KEY: 'user_config_tg',
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

const TgConfig: TgBotEnv = tgEnvDefault
export const TG_CONFIG = () => TgConfig
export async function initEnv(token: string) {
  const botConfig = await getBotConfig('telegram') as BotConfig
  const id = token.split(':')[0]
  const encodeConfig = botConfig[id]?.config
  if (encodeConfig) {
    const config = JSON.parse(cryption.decode(encodeConfig))
    TgConfig.LANGUAGE = config.app.config.language
    TgConfig.CHAT_WHITE_LIST = botConfig[id].userList
    TgConfig.IS_INIT = true
  }
}
