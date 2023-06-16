import { WebInfo } from '@stargram/core/webInfo'
import { errorMessage } from '@stargram/core/utils'
import { routes } from '@stargram/web-hub'

export default eventHandler(async (event) => {
  const req = await readBody<{ webUrl: string }>(event)
  const webUrl = req.webUrl

  try {
    const webInfo = new WebInfo({ routes })
    const webData = await webInfo.call({ webUrl })
    return webData
  }
  catch (error: any) {
    setResponseStatus(event, 400)
    const message = errorMessage(error)
    return { error: message }
  }
})
