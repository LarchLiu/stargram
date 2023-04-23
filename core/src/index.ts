import { websiteLoader } from './const'
import type {
  FetchError,
  FetchWebsite,
  GithubMeta,
  WebsiteInfo,
  WebsiteLoader,
} from './types'

async function getWebsiteInfo(picBed?: string): Promise<FetchWebsite> {
  let info: FetchWebsite = {}
  const host = location.host

  if (websiteLoader[host])
    info = await websiteLoader[host].loader(picBed)

  return info
}

export {
  WebsiteInfo,
  GithubMeta,
  WebsiteLoader,
  FetchWebsite,
  FetchError,
  getWebsiteInfo,
}
