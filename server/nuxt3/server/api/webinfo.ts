import { OGInfo, WebInfo } from '@stargram/core/webInfo'
import { errorMessage } from '@stargram/core/utils'
import { routes } from '@stargram/web-hub'
import { ogInfoFn } from '../utils'

export default eventHandler(async (event) => {
  const req = await readBody<{ webUrl: string }>(event)
  const webUrl = req.webUrl

  const ogInfo = new OGInfo({ fn: ogInfoFn })
  try {
    const webInfo = new WebInfo({ routes, ogInfo })
    const webData = await webInfo.call({ webUrl })
    return webData
  }
  catch (error: any) {
    setResponseStatus(event, 400)
    const message = errorMessage(error)
    return { error: message }
  }
})
