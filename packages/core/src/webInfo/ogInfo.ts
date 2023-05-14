import type { WebInfoData } from '../types'

export type OGInfoFun = (url: string) => Promise< WebInfoData>

export class OGInfo {
  constructor(fields: { fun: OGInfoFun; url: string }) {
    this.fun = fields.fun
    this.url = fields.url
  }

  private fun
  private url

  async call() {
    return await this.fun(this.url)
  }
}
