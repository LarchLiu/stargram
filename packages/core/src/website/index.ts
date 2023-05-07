import type { FetchWebsite, LoaderUrls, Routes } from '../types'
import { fetchPost, getDomain } from '../utils'
import { routes } from './routes-auto-imports'

export async function getWebsiteInfo(urls: LoaderUrls, header?: Record<string, string>, otherRoutes: Routes = {}): Promise<FetchWebsite> {
  let info: FetchWebsite = { error: 'StarNexus error: Not supported website.' }
  const domain = getDomain(urls.webUrl)
  const allRoutes: Routes = { ...routes, ...otherRoutes }

  if (allRoutes[domain]) {
    const router = allRoutes[domain]
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

export async function getWebsiteInfoByApi(urls: LoaderUrls, header?: Record<string, string>): Promise<FetchWebsite> {
  try {
    if (!urls.webHub)
      return { error: 'StarNexus error: No WebHub Url' }

    const info: FetchWebsite = await fetchPost(`${urls.webHub}/api/webinfo`, header, {
      webUrl: urls.webUrl,
    })
    return info
  }
  catch (error: any) {
    return { error: error.message }
  }
}
