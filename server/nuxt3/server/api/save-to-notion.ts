import { NotionDataStorage } from '@stargram/core/storage/notion'
import { errorMessage } from '@stargram/core/utils'

export default eventHandler(async (event) => {
  let apiKey = getHeader(event, 'Authorization')
  apiKey = apiKey!.split('Bearer ')[1]
  const req = await readBody<{ title: string; url: string; summary: string; apiKey: string; databaseId: string }>(event)
  const title = req.title
  const url = req.url
  const summary = req.summary
  const databaseId = req.databaseId
  // const defaultOgImage = req.image

  try {
    const storage = new NotionDataStorage({ apiKey, databaseId, defaultOgImage: '' },
      { title, summary, url, content: '', categories: [], meta: {} })
    const data = await storage.create()
    return data
  }
  catch (error: any) {
    setResponseStatus(event, 400)
    const message = errorMessage(error)
    return { error: message }
  }
})
