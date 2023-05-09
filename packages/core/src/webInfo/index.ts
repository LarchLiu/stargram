import type { FetchRes, LoaderUrls, Routes, WebsiteInfo } from '../types'
import { fetchPost, getDomain } from '../utils'

export async function getWebsiteInfo(urls: LoaderUrls, routes: Routes, headers?: Record<string, string>): Promise<FetchRes<WebsiteInfo>> {
  let info: FetchRes<WebsiteInfo> = { error: 'StarNexus error: Not supported website.' }
  const domain = getDomain(urls.webUrl)

  if (routes[domain]) {
    const router = routes[domain]
    if (router.paths) {
      for (let i = 0; i < router.paths.length; i++) {
        const pathInfo = router.paths[i]
        const loaderUrls = pathInfo.filter(urls)
        if (loaderUrls) {
          info = await pathInfo.loader(loaderUrls, headers)
          if (info.data) {
            info.data.meta.domain = domain
            info.data.meta.website = router.name
          }

          return info
        }
      }
    }
    return { error: `${router.name} error: Not supported website.` }
  }

  return info
}

export async function getWebsiteInfoByApi(urls: LoaderUrls, headers?: Record<string, string>): Promise<FetchRes<WebsiteInfo>> {
  try {
    if (!urls.webHub)
      return { error: 'StarNexus error: No WebHub Url' }

    const info = await fetchPost<WebsiteInfo>(`${urls.webHub}/api/webInfo`, headers, {
      webUrl: urls.webUrl,
    })
    return info
  }
  catch (error: any) {
    return { error: error.message }
  }
}
