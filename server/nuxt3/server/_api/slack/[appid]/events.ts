import { errorMessage } from '@stargram/core/utils'
import { cryption } from '../../../../constants/index'

const kv = useStorage('kv')

export default eventHandler(async (event) => {
  try {
    const raw = await readBody(event)
    if (raw.type) {
      if (raw.type === 'event_callback') {
        if (raw.api_app_id === event.context.params?.appid) {
          const rawEvent = raw.event
          if (rawEvent.type === 'message' && rawEvent.channel_type === 'im' && rawEvent.user) {
            const text = rawEvent.text
            const stargramHub = `${getRequestProtocol(event)}://${getRequestHost(event)}`
            const config = await kv.getItem(`slack${ConfigKey.userCofnigKey}:${raw.api_app_id}:${rawEvent.user}`)
            if (config) {
              const userConfig = JSON.parse(cryption.decode(config as string))
              const message = await SlackSaveWebInfoChain(stargramHub, text, userConfig).catch((error) => {
                sendMessageToSlackBot(userConfig.app.slack, error.message).catch((err) => {
                  console.error(errorMessage(err))
                })
              })
              if (message) {
                sendMessageToSlackBot(userConfig.app.slack, message).catch((err) => {
                  console.error(errorMessage(err))
                })
              }
            }
          }
        }
        return 'ok'
      }
      else if (raw.type === 'url_verification') {
        return raw.challenge
      }
    }
  }
  catch (error) {
    console.error(errorMessage(error))
    return new Response(errorToString(error), { status: 200 })
  }
})
