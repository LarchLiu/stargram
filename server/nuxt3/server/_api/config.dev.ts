import * as fs from 'node:fs'
import { errorMessage } from '@starnexus/core/utils'

export default eventHandler(async (event) => {
  try {
    const filename = './starnexus.config.json'
    const { outConfig } = await readBody(event)
    fs.writeFileSync(filename, `${JSON.stringify(outConfig, null, 2)}\n`)
    return 'ok'
  }
  catch (error) {
    setResponseStatus(event, 400)

    const message = errorMessage(error)
    return { error: message }
  }
})
