import type { WebInfoData } from '../types'

export type OGInfoFn = (url: string) => Promise<WebInfoData>

export class OGInfo {
  constructor(fields: { fn: OGInfoFn }) {
    this.fn = fields.fn
  }

  private fn

  async call(url: string) {
    return await this.fn(url)
  }
}
