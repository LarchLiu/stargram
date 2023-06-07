import { Cryption } from '@stargram/core/utils'
import { C1, C2 } from '../../../constants/index'
import type { BotConfig } from '../../utils'
import { getBotConfig, setBotConfig } from '../../utils'

const cryption = new Cryption(C1, C2)

export default eventHandler(async (event) => {
  const encode = await readBody(event) as string
  const decode = cryption.decode(encode)
  const config = JSON.parse(decode)
  const appId = config.app.config.appId as string
  const botConfig = await getBotConfig('slack') as BotConfig

  botConfig[appId] = { config: encode, userList: [] }
  if (!botConfig.default)
    botConfig.default = appId

  await setBotConfig('slack', botConfig)
  return 'success'
})
