import type { FetchRes, WebSiteCard, WebsiteInfo } from '../types'
import { fetchPost } from '../utils'

export class WebCard {
  apiUrl = '/api/webcard'
  webInfo?: WebsiteInfo = undefined
  headers?: Record<string, string> = undefined
  constructor(webInfo: WebsiteInfo, headers: Record<string, string>, webHub?: string) {
    this.apiUrl = (webHub || '') + this.apiUrl
    this.webInfo = webInfo
    this.headers = headers
  }

  async getWebCardUrl(): Promise<FetchRes<WebSiteCard>> {
    try {
      const res = await fetchPost<WebSiteCard>(this.apiUrl, this.headers, this.webInfo)
      return res
    }
    catch (error: any) {
      return { error: error.message }
    }
  }
}
