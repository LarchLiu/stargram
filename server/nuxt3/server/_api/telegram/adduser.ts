import { cryption } from '../../../constants/index'
import type { BotConfig } from '../../utils'
import { getBotConfig, setBotConfig } from '../../utils'
import type { OutUserConfig, ServerConfig } from '../../../composables/config'

const kv = useStorage('kv')

export default eventHandler(async (event) => {
  const body = await readBody(event)
  let userId = body.userId
  const encodeConfig = body.userConfig
  const userConfig = JSON.parse(cryption.decode(encodeConfig)) as ServerConfig<OutUserConfig>
  let token = userConfig.app.config?.botToken.trim() as string
  const appConfig = await getBotConfig('telegram') as BotConfig
  if (!token)
    token = appConfig.default

  token = token.trim()
  const test = /(\d+:[A-Za-z0-9_-]{35})/.test(token)
  if (!test) {
    setResponseStatus(event, 400)
    return { error: 'Telegram Token Not Available' }
  }
  if (!userId) {
    setResponseStatus(event, 400)
    return { error: 'No User Id' }
  }
  userId = userId.trim()

  const botId = token.split(':')[0] as string
  const _thisConfig = appConfig[botId]?.config
  const userList = appConfig[botId]?.userList
  if (_thisConfig) {
    if (!userList.includes(userId)) {
      userList.push(userId)
      await setBotConfig('telegram', appConfig)
    }

    const thisConfig = JSON.parse(cryption.decode(_thisConfig)) as ServerConfig<OutUserConfig>
    const _userConfig: any = {}
    const publicKey = Object.keys(thisConfig).filter((c) => {
      return thisConfig[c as keyof ServerConfig<OutUserConfig>].public
    })
    Object.keys(userConfig).forEach((key) => {
      const _key = key as keyof ServerConfig<OutUserConfig>
      _userConfig[key] = { [userConfig[_key].select]: userConfig[_key].config }
    })
    publicKey.forEach((key) => {
      const _key = key as keyof ServerConfig<OutUserConfig>
      if (!_userConfig[_key])
        _userConfig[key] = { [thisConfig[_key].select]: thisConfig[_key].config }
    })
    const userConfigKey = `telegram${ConfigKey.userCofnigKey}:${botId}:${userId}`
    await kv.setItem(userConfigKey, cryption.encode(JSON.stringify(_userConfig)))
  }
  return 'ok'
})
