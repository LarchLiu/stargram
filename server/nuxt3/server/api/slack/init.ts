import { cryption } from '../../../constants/index'
import type { BotConfig } from '../../utils'
import { getBotConfig, setBotConfig } from '../../utils'

export default eventHandler(async (event) => {
  const encode = await readBody(event) as string
  const decode = cryption.decode(encode)
  if (decode) {
    const config = JSON.parse(decode)
    const appId = config.app.config.appId as string
    const botConfig = await getBotConfig('slack') as BotConfig

    botConfig[appId] = { config: encode, userList: [], token: config.app.config.clientId }
    if (!botConfig.default)
      botConfig.default = appId

    await setBotConfig('slack', botConfig)
    return 'success'
  }
  else {
    setResponseStatus(event, 400)

    return { error: 'Code Error' }
  }
})
