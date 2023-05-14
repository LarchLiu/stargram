import { $fetch } from 'ofetch'
import type { Routes, WebInfoData, WebLoaderUrls } from '../types'
import { getDomain } from '../utils'
import type { OGInfo } from './ogInfo'

export * from './ogInfo'

export class WebInfoByApi {
  constructor(fields: { urls: WebLoaderUrls; starNexusHub: string; headers?: Record<string, string> }) {
    this.webUrl = fields.urls.webUrl
    this.headers = fields.headers
    this.starNexusHub = fields.starNexusHub || ''
  }

  private webUrl = ''
  private apiUrl = '/api/webinfo'
  private starNexusHub = ''
  private headers?: Record<string, string>

  async call() {
    if (!this.starNexusHub)
      throw new Error('StarNexus error: No StarNexusHub API.')

    const info = await $fetch<WebInfoData>(this.starNexusHub + this.apiUrl,
      {
        method: 'POST',
        headers: this.headers,
        body: {
          webUrl: this.webUrl,
        },
      })
    return info
  }

  getStarNuxesApi() {
    return this.starNexusHub
  }
}

export class WebInfo {
  constructor(fields: { urls: WebLoaderUrls; routes: Routes; headers?: Record<string, string>; ogInfo?: OGInfo }) {
    this.urls = fields.urls
    this.headers = fields.headers
    this.routes = fields.routes
    this.ogInfo = fields.ogInfo
  }

  private urls: WebLoaderUrls
  private routes: Routes
  private headers?: Record<string, string>
  private ogInfo

  async call() {
    const domain = getDomain(this.urls.webUrl)

    if (this.routes[domain]) {
      const router = this.routes[domain]
      if (router.paths) {
        for (let i = 0; i < router.paths.length; i++) {
          const pathInfo = router.paths[i]
          const loaderUrls = pathInfo.filter(this.urls)
          if (loaderUrls) {
            const info = await pathInfo.loader(loaderUrls, this.headers)
            info.meta.domain = domain
            info.meta.siteName = router.name

            return info
          }
        }
      }
      throw new Error(`${router.name} error: Not supported website.`)
    }
    else if (this.ogInfo) {
      return await this.ogInfo.call()
    }

    throw new Error('StarNexus error: Not supported website.')
  }

  getStarNuxesApi() {
    return ''
  }
}
