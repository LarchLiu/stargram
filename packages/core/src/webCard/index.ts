import { $fetch } from 'ofetch'
import type { WebCardData, WebInfoData } from '../types'

export type WebCardFn = (webData: WebInfoData) => Promise<WebCardData>
export class WebCard {
  constructor(fields: { webData?: WebInfoData; starNexusHub?: string; localFn?: WebCardFn; headers?: Record<string, string>; imgStorage?: string }) {
    this.apiUrl = (fields.starNexusHub || '') + this.apiUrl
    this.webData = fields.webData
    this.headers = fields.headers
    this.localFn = fields.localFn
  }

  private apiUrl = '/api/webcard'
  private headers
  private webData
  private localFn

  async call(webData?: WebInfoData) {
    if (!webData && !this.webData)
      throw new Error('WebCard error: No WebInfo Data')

    const info = (webData || this.webData)!
    let res: WebCardData
    if (this.localFn) {
      res = await this.localFn(info)
    }
    else {
      res = await $fetch<WebCardData>(this.apiUrl, {
        method: 'POST',
        headers: this.headers,
        body: info,
      })
    }
    const data = info
    data.meta.cover = res.url
    return data
  }
}
