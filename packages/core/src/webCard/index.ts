import { $fetch } from 'ofetch'
import type { WebCardData, WebInfoData } from '../types'

export class WebCard {
  constructor(fields: { webData?: WebInfoData; starNexusHub: string; headers?: Record<string, string>; imgStorage?: string }) {
    this.apiUrl = (fields.starNexusHub || '') + this.apiUrl
    this.webData = fields.webData
    this.headers = fields.headers
  }

  private apiUrl = '/api/webcard'
  private headers?: Record<string, string>
  public webData?: WebInfoData

  async call(webData?: WebInfoData) {
    if (!webData && !this.webData)
      throw new Error('WebCard error: No WebInfo Data')

    const body = webData || this.webData
    const res = await $fetch<WebCardData>(this.apiUrl, {
      method: 'POST',
      headers: this.headers,
      body,
    })
    const data = body!
    data.meta.cover = res.url
    return data
  }
}
