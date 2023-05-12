import { $fetch } from 'ofetch'
import type { WebsiteCard, WebsiteInfo } from '../types'

export class WebCard {
  constructor(webInfo: WebsiteInfo, headers?: Record<string, string>, starNexusHub?: string) {
    this.apiUrl = (starNexusHub || '') + this.apiUrl
    this.webInfo = webInfo
    this.headers = headers
  }

  private apiUrl = '/api/webcard'
  private headers?: Record<string, string> = undefined
  private webInfo?: WebsiteInfo = undefined

  async getWebCardUrl() {
    const res = await $fetch<WebsiteCard>(this.apiUrl, {
      method: 'POST',
      headers: this.headers,
      body: this.webInfo,
    })
    return res
  }
}
