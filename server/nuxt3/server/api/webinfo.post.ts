import type { WebInfoData } from '@starnexus/core'
import { OGInfo, WebInfo, getDomain } from '@starnexus/core'
import { routes } from '@starnexus/web-hub'
import { unfurl } from 'unfurl.js'

export default eventHandler(async (event) => {
  const req = await readBody<{ webUrl: string }>(event)
  const webUrl = req.webUrl
  const ogInfoFun = async () => {
    const res = await unfurl(webUrl)
    let content = res.description || ''
    let title = res.title || ''
    let url = res.canonical_url || webUrl
    let website = ''
    const domain = getDomain(url)
    if (res.open_graph) {
      const og = res.open_graph
      title = og.title
      content = og.description || content
      url = og.url || url
      website = og.site_name || domain.split('.')[0].toUpperCase()
    }

    if (!title || !content)
      throw new Error('Not Supported Website. No OG info')

    return {
      title,
      content,
      url,
      meta: {
        domain,
        website,
      },
    } as WebInfoData
  }
  const ogInfo = new OGInfo(ogInfoFun)
  try {
    const webInfo = new WebInfo({ urls: { webUrl }, routes, ogInfo })
    const webData = await webInfo.call()
    return webData
  }
  catch (error: any) {
    setResponseStatus(event, 400)
    let message = error.message || ''
    if (error.data)
      message = JSON.stringify(error.data)
    return { error: message }
  }
})
