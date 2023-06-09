import { $fetch } from 'ofetch'
import type { Routes, WebInfoData, WebLoaderUrls } from '../types'
import { getDomain } from '../utils'

export class WebInfoByApi {
  constructor(fields: { stargramHub: string; browserlessToken: string; headers?: Record<string, string> }) {
    this.headers = fields.headers
    this.stargramHub = fields.stargramHub || ''
    this.browserlessToken = fields.browserlessToken
  }

  private apiUrl = '/api/webinfo'
  private stargramHub = ''
  private browserlessToken: string
  private headers?: Record<string, string>

  async call(urls: WebLoaderUrls) {
    if (!this.stargramHub)
      throw new Error('Stargram error: No StargramHub API.')

    const info = await $fetch<WebInfoData>(this.stargramHub + this.apiUrl,
      {
        method: 'POST',
        headers: this.headers,
        body: {
          webUrl: urls.webUrl,
          browserlessToken: this.browserlessToken,
        },
      })
    return info
  }

  getStarNuxesApi() {
    return this.stargramHub
  }
}

export class WebInfo {
  constructor(fields: { routes: Routes; browserlessToken: string; headers?: Record<string, string> }) {
    this.headers = fields.headers
    this.routes = fields.routes
    this.browserlessToken = fields.browserlessToken
  }

  private routes: Routes
  private headers?: Record<string, string>
  private browserlessToken: string

  async call(urls: WebLoaderUrls) {
    const domain = getDomain(urls.webUrl)

    if (this.routes[domain]) {
      const router = this.routes[domain]
      if (router.paths) {
        for (let i = 0; i < router.paths.length; i++) {
          const pathInfo = router.paths[i]
          const loaderUrls = pathInfo.filter(urls)
          if (loaderUrls) {
            const info = await pathInfo.loader({ urls: loaderUrls, browserlessToken: this.browserlessToken, headers: this.headers })
            info.meta.domain = domain
            info.meta.siteName = router.name

            return info
          }
        }
      }
      throw new Error(`${router.name} error: Not supported website.`)
    }
    else if (this.routes.common) {
      const router = this.routes.common
      if (router.paths) {
        for (let i = 0; i < router.paths.length; i++) {
          const pathInfo = router.paths[i]
          const loaderUrls = pathInfo.filter(urls)
          if (loaderUrls) {
            const info = await pathInfo.loader({ urls: loaderUrls, browserlessToken: this.browserlessToken, headers: this.headers })
            return info
          }
        }
      }
    }

    throw new Error('Stargram error: Not supported website.')
  }

  getStarNuxesApi() {
    return ''
  }
}

export const WebInfoFunction: Record<string, any> = {
  WebInfo,
  WebInfoByApi,
}
