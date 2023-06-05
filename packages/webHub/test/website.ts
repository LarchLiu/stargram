import { WebInfo } from '@stargram/core/webInfo'
import { routes } from '../src/routes-auto-generate'

export async function getWebsiteInfo(url: string) {
  const webInfo = new WebInfo({
    urls: {
      webUrl: url,
    },
    routes,
  })
  const info = webInfo.call()

  return info
}
