import { websiteLoader } from '../const'
import type { FetchWebsite, LoaderUrls } from '../types'
import { getDomain } from '../utils'

async function getWebsiteInfo(urls: LoaderUrls, header?: Record<string, string>): Promise<FetchWebsite> {
  let info: FetchWebsite = {}
  const host = getDomain(urls.webUrl)

  if (websiteLoader[host])
    info = await websiteLoader[host].loader(urls, header)
  else
    info.error = 'StarNexus error: Not supported website.'

  return info
}

export {
  getWebsiteInfo,
}
