import { cryption } from '../../../../constants/index'
import type { BotConfig } from '../../../utils'
import { getBotConfig, setBotConfig } from '../../../utils'
import type { OutUserConfig, ServerConfig } from '../../../../composables/config'

const kv = useStorage('kv')

export default eventHandler(async (event) => {
  const method = event.method
  if (method === 'GET') {
    const token = event.context.params!.token as string
    const appId = token.split(':')[0]
    const userId = getQuery(event).userId as string
    const encodeConfig = await kv.getItem(`telegram${ConfigKey.userConfigKey}:${appId}:${userId}`)
    return { config: encodeConfig }
  }
  else if (method === 'POST') {
    const body = await readBody(event)
    let userId = body.userId
    const encodeConfig = body.userConfig
    const userConfig = JSON.parse(cryption.decode(encodeConfig)) as ServerConfig<OutUserConfig>
    let appId = event.context.params!.token
    const appConfig = await getBotConfig('telegram') as BotConfig
    if (!appId)
      appId = appConfig.default

    if (!userId) {
      setResponseStatus(event, 400)
      return { error: 'No User Id' }
    }
    appId = appId.trim()
    userId = typeof userId === 'number' ? `${userId}` : userId.trim()

    const _thisConfig = appConfig[appId]?.config
    const userList = appConfig[appId]?.userList
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
        _userConfig[key] = userConfig[_key]
      })
      publicKey.forEach((key) => {
        const _key = key as keyof ServerConfig<OutUserConfig>
        // if (!_userConfig[_key])
        _userConfig[key] = thisConfig[_key]
      })
      await setUserConfig('telegram', appId, userId, _userConfig)
    }
    return 'ok'
  }
})
