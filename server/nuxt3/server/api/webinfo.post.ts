import { WebInfo } from '@starnexus/core'
import { routes } from '@starnexus/web-hub'

export default eventHandler(async (event) => {
  const req = await readBody<{ webUrl: string }>(event)
  const webUrl = req.webUrl
  try {
    const webInfo = new WebInfo({ urls: { webUrl }, routes })
    const webData = await webInfo.call()
    return webData
  }
  catch (error: any) {
    setResponseStatus(event, 400)
    return { error: error.message }
  }
})
