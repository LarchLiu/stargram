import { OGInfo, WebInfo } from '@starnexus/core/webInfo'
import { errorMessage } from '@starnexus/core/utils'
import { routes } from '@starnexus/web-hub'
import { ogInfoFn } from '../utils'

export default eventHandler(async (event) => {
  const req = await readBody<{ webUrl: string }>(event)
  const webUrl = req.webUrl

  const ogInfo = new OGInfo({ fn: ogInfoFn, url: webUrl })
  try {
    const webInfo = new WebInfo({ urls: { webUrl }, routes, ogInfo })
    const webData = await webInfo.call()
    return webData
  }
  catch (error: any) {
    setResponseStatus(event, 400)
    const message = errorMessage(error)
    return { error: message }
  }
})
