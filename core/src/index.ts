import { websiteLoader } from './const'
import type {
  FetchError,
  FetchWebsite,
  GithubMeta,
  WebsiteInfo,
  WebsiteLoader,
} from './types'
import { fetchGet, getHost } from './utils'

async function getWebsiteInfo(url: string, picBed?: string, header: Record<string, string> = {}): Promise<FetchWebsite> {
  let info: FetchWebsite = {}
  const host = getHost(url)

  if (websiteLoader[host])
    info = await websiteLoader[host].loader(url, picBed, header)

  return info
}

export {
  WebsiteInfo,
  GithubMeta,
  WebsiteLoader,
  FetchWebsite,
  FetchError,
  getWebsiteInfo,
  fetchGet,
}
