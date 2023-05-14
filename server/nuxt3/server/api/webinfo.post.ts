import { OGInfo, WebInfo, errorMessage } from '@starnexus/core'
import { routes } from '@starnexus/web-hub'
import { ogInfoFun } from '../utils'

export default eventHandler(async (event) => {
  const req = await readBody<{ webUrl: string }>(event)
  const webUrl = req.webUrl

  const ogInfo = new OGInfo({ fun: ogInfoFun, url: webUrl })
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
