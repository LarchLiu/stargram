import { websiteLoader } from '../const'
import type { FetchWebsite } from '../types'
import { getDomain } from '../utils'

async function getWebsiteInfo(url: string, picBed?: string, header?: Record<string, string>): Promise<FetchWebsite> {
  let info: FetchWebsite = {}
  const host = getDomain(url)

  if (websiteLoader[host])
    info = await websiteLoader[host].loader(url, picBed, header)
  else
    info.error = 'StarNexus error: Not supported website.'

  return info
}

export {
  getWebsiteInfo,
}
