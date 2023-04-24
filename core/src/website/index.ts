import { websiteLoader } from '../const'
import type { FetchWebsite } from '../types'
import { getHost } from '../utils'

async function getWebsiteInfo(url: string, picBed?: string, header?: Record<string, string>): Promise<FetchWebsite> {
  let info: FetchWebsite = {}
  const host = getHost(url)

  if (websiteLoader[host])
    info = await websiteLoader[host].loader(url, picBed, header)

  return info
}

export {
  getWebsiteInfo,
}
