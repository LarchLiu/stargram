import type { CommonMeta, PathInfo, WebInfoData, WebLoaderUrls } from '@stargram/core'
import { getDomain } from '@stargram/core/utils'
import { unfurl } from '../../../utils/unfurl'
import { USER_AGENT } from '../../../const'

function filter(urls: WebLoaderUrls): WebLoaderUrls | undefined {
  return urls
}

async function getWebInfo(urls: WebLoaderUrls, _headers: Record<string, string> = { 'User-Agent': USER_AGENT }): Promise<WebInfoData> {
  let title = ''
  let content = ''
  const url = urls.webUrl
  const meta: CommonMeta = {}
  const domain = getDomain(url)
  const word = domain.split('.')[0]
  const siteName = word.charAt(0).toUpperCase() + word.slice(1)

  meta.domain = domain
  meta.siteName = siteName
  meta.prompts = `Website info of ${urls.webUrl}`
  // fetch webinfo
  const webJson = await unfurl(url)
  if (webJson) {
    const readability = webJson.readability
    const openGraph = webJson.open_graph
    const faviconPath = webJson.favicon?.split('/')
    const favicon = (faviconPath && !faviconPath[faviconPath.length - 1].includes('.ico')) ? webJson.favicon : ''
    meta.favicon = favicon
    title = webJson.title || ''
    content = webJson.description || ''
    if (readability) {
      title = readability.title
      content = readability.textContent
    }
    if (openGraph && openGraph.images)
      meta.ogImage = openGraph.images[0].url
  }

  if (!title || !content)
    throw new Error('Not Supported Website')

  return { title, url, content, meta }
}

export const pathInfo: PathInfo = {
  name: 'Common Website Info',
  author: '[Stargram](https://github.com/LarchLiu/stargram)',
  sample: '',
  filter,
  loader: getWebInfo,
}
