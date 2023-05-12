import { $fetch } from 'ofetch'
import type { Routes, WebLoaderUrls, WebsiteInfo } from '../types'
import { getDomain } from '../utils'

export async function getWebsiteInfo(urls: WebLoaderUrls, routes: Routes, headers?: Record<string, string>): Promise<WebsiteInfo> {
  const domain = getDomain(urls.webUrl)

  if (routes[domain]) {
    const router = routes[domain]
    if (router.paths) {
      for (let i = 0; i < router.paths.length; i++) {
        const pathInfo = router.paths[i]
        const loaderUrls = pathInfo.filter(urls)
        if (loaderUrls) {
          const info = await pathInfo.loader(loaderUrls, headers)
          info.meta.domain = domain
          info.meta.website = router.name

          return info
        }
      }
    }
    throw new Error(`${router.name} error: Not supported website.`)
  }

  throw new Error('StarNexus error: Not supported website.')
}

export async function getWebsiteInfoByApi(urls: WebLoaderUrls, headers?: Record<string, string>): Promise<WebsiteInfo> {
  const info = await $fetch<WebsiteInfo>(`${urls.starNexusHub}/api/webinfo`,
    {
      method: 'POST',
      headers,
      body: {
        webUrl: urls.webUrl,
      },
    })
  return info
}
