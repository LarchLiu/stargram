import { kv as KV } from '@vercel/kv'
import { mergeConfig } from '../../utils/tgBot/utils'
import {
  getChatRoleWithContext,
  sendMessageToTelegramWithContext,
} from '../../utils/tgBot/telegram'

import type { Context } from '../../utils/tgBot/context'
import { CONST, ENV, I18N, TG_CONFIG } from '../../utils/tgBot/env'

type ScopeType = 'all_private_chats' | 'all_group_chats' | 'all_chat_administrators'
type CommandType = '/help' | '/new' | '/start' | '/setenv' | '/delenv' | '/system' | '/adduser' | '/deluser'
interface CommandOpt {
  scopes: ScopeType[]
  fn: (message: any, command: any, subcommand: any, context: any) => Promise<any>
  needAuth?: (type: string) => boolean | string[]
}
type CommandHandlers = {
  [key in CommandType]: CommandOpt
}
type ScopeCommandMap = {
  [type in ScopeType]: CommandType[]
}
type ScopeCommandResult = {
  [type in ScopeType]: string | Promise<string>
}

const commandAuthCheck = {
  default(chatType: string) {
    if (CONST.GROUP_TYPES.includes(chatType))
      return ['administrator', 'creator']

    return false
  },
  shareModeGroup(chatType: string) {
    if (CONST.GROUP_TYPES.includes(chatType)) {
      // 每个人在群里有上下文的时候，不限制
      if (!ENV.GROUP_CHAT_BOT_SHARE_MODE)
        return false

      return ['administrator', 'creator']
    }
    return false
  },
  mustCreator(_chatType: string) {
    return ['creator']
  },
}

// 命令绑定
const commandHandlers: CommandHandlers = {
  '/new': {
    scopes: [],
    fn: commandCreateNewChatContext,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/start': {
    scopes: ['all_private_chats', 'all_chat_administrators'],
    fn: commandCreateNewChatContext,
    needAuth: commandAuthCheck.default,
  },
  '/setenv': {
    scopes: ['all_private_chats'],
    fn: commandUpdateUserConfig,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/delenv': {
    scopes: ['all_private_chats'],
    fn: commandDeleteUserConfig,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/system': {
    scopes: ['all_private_chats', 'all_chat_administrators'],
    fn: commandSystem,
    needAuth: commandAuthCheck.default,
  },
  '/help': {
    scopes: ['all_private_chats', 'all_chat_administrators'],
    fn: commandGetHelp,
  },
  '/adduser': {
    scopes: [],
    fn: commandAddUser,
    needAuth: commandAuthCheck.mustCreator,
  },
  '/deluser': {
    scopes: [],
    fn: commandDelUser,
    needAuth: commandAuthCheck.mustCreator,
  },
}

async function commandAddUser(message: any, command: string, subcommand: string, context: Context) {
  const i18n = I18N[TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].LANGUAGE as keyof typeof I18N]
  try {
    const list = TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].CHAT_WHITE_LIST
    if (!list.includes(subcommand))
      TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].CHAT_WHITE_LIST.push(subcommand)
    await KV.set(CONST.CONFIG_KEY, TG_CONFIG())
    return sendMessageToTelegramWithContext(context)(i18n.command.adduser.update_config_success)
  }
  catch (e) {
    return sendMessageToTelegramWithContext(context)(i18n.command.adduser.add_user_error(e))
  }
}

async function commandDelUser(message: any, command: string, subcommand: string, context: Context) {
  const i18n = I18N[TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].LANGUAGE as keyof typeof I18N]
  try {
    const list = TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].CHAT_WHITE_LIST
    const idx = list.indexOf(subcommand)
    if (idx !== -1)
      TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].CHAT_WHITE_LIST.splice(idx, 1)
    await KV.set(CONST.CONFIG_KEY, TG_CONFIG())
    return sendMessageToTelegramWithContext(context)(i18n.command.adduser.update_config_success)
  }
  catch (e) {
    return sendMessageToTelegramWithContext(context)(i18n.command.adduser.add_user_error(e))
  }
}

async function commandGetHelp(message: any, command: string, subcommand: string, context: Context) {
  const i18n = I18N[TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].LANGUAGE as keyof typeof I18N]
  const helpMsg
      = i18n.command.help.summary
      + Object.keys(commandHandlers)
        .map(key => `${key}: ${i18n.command.help[key.substring(1) as keyof typeof i18n.command.help]}`)
        .join('\n')
  return sendMessageToTelegramWithContext(context)(helpMsg)
}

async function commandCreateNewChatContext(message: any, command: string, subcommand: string, context: Context) {
  const i18n = I18N[TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].LANGUAGE as keyof typeof I18N]
  try {
    if (command === '/new') {
      return sendMessageToTelegramWithContext(context)(i18n.command.new.new_chat_start)
    }
    else {
      if (context.SHARE_CONTEXT.chatType === 'private')
        return sendMessageToTelegramWithContext(context)(i18n.command.new.new_chat_start_private(context.CURRENT_CHAT_CONTEXT.chat_id))

      else
        return sendMessageToTelegramWithContext(context)(i18n.command.new.new_chat_start_group(context.CURRENT_CHAT_CONTEXT.chat_id))
    }
  }
  catch (e: any) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`)
  }
}

async function commandUpdateUserConfig(message: any, command: string, subcommand: string, context: Context) {
  const i18n = I18N[TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].LANGUAGE as keyof typeof I18N]
  const kv = subcommand.indexOf('=')
  if (kv === -1)
    return sendMessageToTelegramWithContext(context)(i18n.command.setenv.help)

  const key = subcommand.slice(0, kv)
  const value = subcommand.slice(kv + 1)
  try {
    mergeConfig(context.USER_CONFIG, key, value, i18n)
    await KV.set(context.SHARE_CONTEXT.configStoreKey, context.USER_CONFIG)
    return sendMessageToTelegramWithContext(context)(i18n.command.setenv.update_config_success)
  }
  catch (e) {
    return sendMessageToTelegramWithContext(context)(i18n.command.setenv.update_config_error(e))
  }
}

async function commandDeleteUserConfig(message: any, command: string, subcommand: string, context: Context) {
  const i18n = I18N[TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].LANGUAGE as keyof typeof I18N]
  try {
    if (subcommand === 'NOTION_CONFIG')
      context.USER_CONFIG[subcommand] = { API_KEY: '', DATABASE_ID: '' }
    else if (subcommand === 'OPENAI_API_KEY')
      context.USER_CONFIG[subcommand] = ''

    await KV.set(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(context.USER_CONFIG),
    )
    return sendMessageToTelegramWithContext(context)(i18n.command.setenv.update_config_success)
  }
  catch (e) {
    return sendMessageToTelegramWithContext(context)(i18n.command.setenv.update_config_error(e))
  }
}

async function commandSystem(message: any, command: string, subcommand: string, context: Context) {
  let msg = 'Current System Info:\n'
  if (ENV.DEV_MODE) {
    const shareCtx = { ...context.SHARE_CONTEXT }
    shareCtx.currentBotToken = '******'
    context.USER_CONFIG.OPENAI_API_KEY = '******'

    msg += '<pre>'
    msg += `USER_CONFIG: \n${JSON.stringify(context.USER_CONFIG, null, 2)}\n`
    msg += `CHAT_CONTEXT: \n${JSON.stringify(context.CURRENT_CHAT_CONTEXT, null, 2)}\n`
    msg += `SHARE_CONTEXT: \n${JSON.stringify(shareCtx, null, 2)}\n`

    msg += '</pre>'
  }
  else {
    msg = 'Current User Config:\n'
    const openaiKey = context.USER_CONFIG.OPENAI_API_KEY
    const notionKey = context.USER_CONFIG.NOTION_CONFIG.API_KEY
    if (openaiKey)
      context.USER_CONFIG.OPENAI_API_KEY = `${openaiKey.slice(0, 8)}******${openaiKey.slice(-5)}`

    if (notionKey)
      context.USER_CONFIG.NOTION_CONFIG.API_KEY = `${notionKey.slice(0, 12)}******${notionKey.slice(-5)}`

    msg += '<pre>'
    msg += `USER_CONFIG: \n${JSON.stringify(context.USER_CONFIG, null, 2)}\n`
    msg += '</pre>'
  }
  context.CURRENT_CHAT_CONTEXT.parse_mode = 'HTML'
  return sendMessageToTelegramWithContext(context)(msg)
}

export async function handleCommandMessage(message: any, context: Context) {
  const i18n = I18N[TG_CONFIG()[context.SHARE_CONTEXT.currentBotToken].LANGUAGE as keyof typeof I18N]
  if (ENV.DEV_MODE) {
    // commandHandlers['/echo'] = {
    //   help: '[DEBUG ONLY] echo message',
    //   scopes: ['all_private_chats', 'all_chat_administrators'],
    //   fn: commandEcho,
    //   needAuth: commandAuthCheck.default,
    // }
  }
  for (const key in commandHandlers) {
    if (message.text === key || message.text.startsWith(`${key} `)) {
      const command = commandHandlers[key as CommandType]
      try {
        // 如果存在权限条件
        if (command.needAuth) {
          const roleList = command.needAuth(context.SHARE_CONTEXT.chatType!)
          if (roleList) {
            // 获取身份并判断
            const chatRole = await getChatRoleWithContext(context)(context.SHARE_CONTEXT.speakerId)
            if (chatRole === null)
              return sendMessageToTelegramWithContext(context)(i18n.command.permission.not_authorized)

            if (!(roleList as string[]).includes(chatRole)) {
              const msg = i18n.command.permission.not_enough_permission(roleList as string[], chatRole)
              return sendMessageToTelegramWithContext(context)(msg)
            }
          }
        }
      }
      catch (e) {
        return sendMessageToTelegramWithContext(context)(i18n.command.permission.role_error(e))
      }
      const subcommand = message.text.substring(key.length).trim()
      try {
        return await command.fn(message, key, subcommand, context)
      }
      catch (e) {
        return sendMessageToTelegramWithContext(context)(i18n.command.permission.command_error(e))
      }
    }
  }
  return null
}

export async function bindCommandForTelegram(token: string) {
  const i18n = I18N.en
  const scopeCommandMap: ScopeCommandMap = {
    all_private_chats: [],
    all_group_chats: [],
    all_chat_administrators: [],
  }
  for (const key in commandHandlers) {
    if (TG_CONFIG()[token].HIDE_COMMAND_BUTTONS.includes(key))
      continue
    const _key = key as CommandType
    if (commandHandlers[_key] && commandHandlers[_key].scopes) {
      for (const scope of commandHandlers[_key].scopes) {
        if (!scopeCommandMap[scope])
          scopeCommandMap[scope] = []

        scopeCommandMap[scope].push(_key)
      }
    }
  }

  const result: ScopeCommandResult = {
    all_private_chats: '',
    all_group_chats: '',
    all_chat_administrators: '',
  }
  for (const scope in scopeCommandMap) {
    result[scope as ScopeType] = await fetch(
        `https://api.telegram.org/bot${token}/setMyCommands`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commands: scopeCommandMap[scope as ScopeType].map((command: CommandType) => ({
              command,
              description: i18n.command.help[(command.substring(1) as keyof typeof i18n.command.help)] || '',
            })),
            scope: {
              type: scope,
            },
          }),
        },
    ).then(res => res.json())
  }
  return { ok: true, result }
}
