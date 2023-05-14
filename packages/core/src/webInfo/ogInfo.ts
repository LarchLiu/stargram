import type { WebInfoData } from '../types'

export type OGInfoFun = () => Promise< WebInfoData>

export class OGInfo {
  constructor(fun: OGInfoFun) {
    this.fun = fun
  }

  private fun

  async call() {
    return await this.fun()
  }
}
