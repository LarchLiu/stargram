import { cryption } from '~/constants'

const kv = useStorage('kv')
export default eventHandler(async (event) => {
  const { appId } = useRuntimeConfig()
  const body = await readBody(event)
  const userId = body.userId
  const question = body.question

  const encodeConfig = await kv.getItem(`stargram${ConfigKey.userConfigKey}:${appId}:${userId}`)
  const config = cryption.decode(encodeConfig as string)
  const userConfig = JSON.parse(config)

  const data = await MakeQAChain(question, { USER_CONFIG: userConfig as UserConfig }, 'stargram', appId, userId)

  return data
})
