import type { FetchWebsite, LoaderUrls } from '../types'
import { getDomain } from '../utils'
import routes from './routes'

export async function getWebsiteInfo(urls: LoaderUrls, header?: Record<string, string>): Promise<FetchWebsite> {
  let info: FetchWebsite = { error: 'StarNexus error: Not supported website.' }
  const host = getDomain(urls.webUrl)

  if (routes[host]) {
    const router = routes[host]
    if (router.paths) {
      for (let i = 0; i < router.paths.length; i++) {
        const pathInfo = router.paths[i]
        const loaderUrls = pathInfo.filter(urls)
        if (loaderUrls) {
          info = await pathInfo.loader(loaderUrls, header)
          break
        }
      }
    }
  }

  return info
}
