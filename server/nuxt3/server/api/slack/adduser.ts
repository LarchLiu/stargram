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
  let appId = userConfig.app?.config?.appId as string
  const appConfig = await getBotConfig('slack') as BotConfig
  if (!appId)
    appId = appConfig.default

  if (!userId) {
    setResponseStatus(event, 400)
    return { error: 'No User Id' }
  }
  appId = appId.trim()
  userId = userId.trim()

  const _thisConfig = appConfig[appId]?.config
  const userList = appConfig[appId]?.userList
  if (_thisConfig) {
    if (!userList.includes(userId)) {
      userList.push(userId)
      await setBotConfig('slack', appConfig)
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
        _userConfig[key] = { [thisConfig[_key].select]: thisConfig[_key].config, public: true }
    })
    const userConfigKey = `slack${ConfigKey.userCofnigKey}:${appId}:${userId}`
    await kv.setItem(userConfigKey, cryption.encode(JSON.stringify(_userConfig)))
  }
  return 'ok'
})
