import {
  sendMessageToTelegramWithContext,
} from '../../utils/tgBot/telegram'
import type { Context } from '../../utils/tgBot/context'
import { CONST, ENV, I18N } from '../../utils/tgBot/env'
import type { KVConfig, ServerConfig } from '../../../composables/config'
import { cryption } from '~/constants'

type ScopeType = 'all_private_chats' | 'all_group_chats' | 'all_chat_administrators'
type CommandType = '/start' | '/config'
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
  '/start': {
    scopes: ['all_private_chats', 'all_chat_administrators'],
    fn: commandCreateNewChatContext,
    needAuth: commandAuthCheck.default,
  },
  '/config': {
    scopes: ['all_private_chats', 'all_chat_administrators'],
    fn: commandSystem,
    needAuth: commandAuthCheck.default,
  },
}

async function commandCreateNewChatContext(message: any, command: string, subcommand: string, context: Context) {
  try {
    if (context.SHARE_CONTEXT.chatType === 'private') {
      const domain = context.SHARE_CONTEXT.currentHost
      const info = {
        appName: 'telegram',
        appId: context.SHARE_CONTEXT.currentBotId,
        userId: context.CURRENT_CHAT_CONTEXT.chat_id,
      }
      const encode = cryption.encode(JSON.stringify(info))
      return sendMessageToTelegramWithContext(context)(`User ID: ${context.CURRENT_CHAT_CONTEXT.chat_id}\nGo to this link to set your config: ${domain}/user-config?code=${encode}`)
    }
  }
  catch (e: any) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`)
  }
}

async function commandSystem(message: any, command: string, subcommand: string, context: Context) {
  let msg = 'Current User Config:\n'
  const userConfig = await getUserConfig('telegram', context.SHARE_CONTEXT.currentBotId, context.CURRENT_CHAT_CONTEXT.chat_id)
  const myConfig: any = {}
  if (userConfig) {
    Object.keys(userConfig)
      .filter((key) => {
        const obj = userConfig[key as keyof ServerConfig<KVConfig>]
        const keys = Object.keys(obj)
        return !keys.includes('public')
      })
      .forEach(key => myConfig[key] = userConfig[key as keyof ServerConfig<KVConfig>])
  }
  const showConfig = JSON.stringify(myConfig, null, 2)
  msg += '<pre>'
  msg += `<code>${showConfig}</code>`
  msg += '</pre>'
  context.CURRENT_CHAT_CONTEXT.parse_mode = 'HTML'
  return sendMessageToTelegramWithContext(context)(msg)
}

export async function handleCommandMessage(message: any, context: Context) {
  for (const key in commandHandlers) {
    if (message.text === key || message.text.startsWith(`${key} `)) {
      const command = commandHandlers[key as CommandType]

      const subcommand = message.text.substring(key.length).trim()
      try {
        return await command.fn(message, key, subcommand, context)
      }
      catch (e: any) {
        return sendMessageToTelegramWithContext(context)(e.message)
      }
    }
  }
  return null
}

export async function bindCommandForTelegram(token: string, lang: string) {
  const i18n = I18N[lang as keyof typeof I18N]
  const scopeCommandMap: ScopeCommandMap = {
    all_private_chats: [],
    all_group_chats: [],
    all_chat_administrators: [],
  }
  for (const key in commandHandlers) {
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
