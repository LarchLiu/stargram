const kv = useStorage('kv')

export default eventHandler(async (event) => {
  const { appId } = useRuntimeConfig()
  const body = await readBody(event)
  const userId = body.userId
  let config = await kv.getItem(`stargram${ConfigKey.notificationKey}:${appId}:${userId}`) as any[]
  if (config) {
    const hasConfig = config.filter(item => item.endpoint === body.endpoint)
    if (hasConfig.length === 0) {
      config.push({
        endpoint: body.endpoint,
        expirationTime: body.expirationTime,
        keys: body.keys,
      })
    }
  }
  else {
    config = [{
      endpoint: body.endpoint,
      expirationTime: body.expirationTime,
      keys: body.keys,
    }]
  }
  await kv.setItem(`stargram${ConfigKey.notificationKey}:${appId}:${userId}`, config)
  return 'ok'
})
