import { WebInfo } from '@stargram/core/webInfo'
import { errorMessage } from '@stargram/core/utils'
import { routes } from '@stargram/web-hub'

export default eventHandler(async (event) => {
  const req = await readBody<{ webUrl: string; stargramToken: string }>(event)
  const webUrl = req.webUrl
  const stargramToken = req.stargramToken

  try {
    const webInfo = new WebInfo({ routes, browserlessToken: stargramToken })
    const webData = await webInfo.call({ webUrl })
    return webData
  }
  catch (error: any) {
    setResponseStatus(event, 400)
    const message = errorMessage(error)
    return { error: message }
  }
})
