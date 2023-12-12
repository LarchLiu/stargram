import { WebInfo } from '@stargram/core/webInfo'
import { errorMessage } from '@stargram/core/utils'
import { routes } from '@stargram/web-hub'

export default eventHandler(async (event) => {
  const req = await readBody<{ webUrl: string; browserlessToken: string; twitterOauthToken: string; twitterOauthTokenSecret: string }>(event)
  const webUrl = req.webUrl
  const browserlessToken = req.browserlessToken
  const twitterOauthToken = req.twitterOauthToken
  const twitterOauthTokenSecret = req.twitterOauthTokenSecret

  try {
    const webInfo = new WebInfo({ routes, browserlessToken, twitterOauthToken, twitterOauthTokenSecret })
    const webData = await webInfo.call({ webUrl })
    return webData
  }
  catch (error: any) {
    setResponseStatus(event, 400)
    const message = errorMessage(error)
    return { error: message }
  }
})
