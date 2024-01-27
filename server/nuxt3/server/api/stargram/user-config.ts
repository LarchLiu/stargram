import { cryption } from '~/constants'

export default eventHandler(async (event) => {
  const { appId } = useRuntimeConfig()
  const body = await readBody(event)
  const userId = body.userId

  const info = {
    appName: 'stargram',
    appId,
    userId,
  }
  const encode = cryption.encode(JSON.stringify(info))

  return encode
})
