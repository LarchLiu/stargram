import type { WebInfoData } from '../types'

export type OGInfoFn = (url: string) => Promise<WebInfoData>

export class OGInfo {
  constructor(fields: { fn: OGInfoFn; url: string }) {
    this.fn = fields.fn
    this.url = fields.url
  }

  private fn
  private url

  async call() {
    return await this.fn(this.url)
  }
}
