import { WebInfo } from '@stargram/core/webInfo'
import { routes } from '../src/routes-auto-generate'

export async function getWebsiteInfo(url: string) {
  const webInfo = new WebInfo({
    routes,
  })
  const info = webInfo.call({
    webUrl: url,
  })

  return info
}
