import type { FetchWebsite, LoaderUrls } from '@starnexus/core'
import { getDomain } from '@starnexus/core'
import { routes } from '../src/routes-auto-generate'

export async function getWebsiteInfo(urls: LoaderUrls, header?: Record<string, string>): Promise<FetchWebsite> {
  let info: FetchWebsite = { error: 'StarNexus error: Not supported website.' }
  const domain = getDomain(urls.webUrl)

  if (routes[domain]) {
    const router = routes[domain]
    if (router.paths) {
      for (let i = 0; i < router.paths.length; i++) {
        const pathInfo = router.paths[i]
        const loaderUrls = pathInfo.filter(urls)
        if (loaderUrls) {
          info = await pathInfo.loader(loaderUrls, header)
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
