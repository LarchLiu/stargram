// server/api/webcard.ts

import type { WebInfoData } from '@starnexus/core'
import { errorMessage } from '@starnexus/core'

export default eventHandler(async (event) => {
  try {
    const webInfo = await readBody<WebInfoData>(event)
    const res = await createWebCard(webInfo)
    return res
  }
  catch (error: any) {
    setResponseStatus(event, 400)

    const message = errorMessage(error)
    return { error: message }
  }
})
