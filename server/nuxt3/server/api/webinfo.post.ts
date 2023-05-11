import { getWebsiteInfo } from '@starnexus/core'
import { routes } from '@starnexus/web-hub'

export default eventHandler(async (event) => {
  const req = await readBody<{ webUrl: string }>(event)
  const webUrl = req.webUrl

  const webInfo = await getWebsiteInfo({ webUrl }, routes)
  if (webInfo.error) {
    setResponseStatus(event, 400)

    return { error: webInfo.error }
  }

  return webInfo.data
})
