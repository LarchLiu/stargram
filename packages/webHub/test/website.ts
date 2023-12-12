import { WebInfo } from '@stargram/core/webInfo'
import { routes } from '../src/routes-auto-generate'

export async function getWebsiteInfo(url: string) {
  const webInfo = new WebInfo({
    routes,
    browserlessToken: import.meta.env.VITE_BROWSERLESS_TOKEN,
    twitterOauthToken: import.meta.env.VITE_TWITTER_OAUTH_TOKEN,
    twitterOauthTokenSecret: import.meta.env.VITE_TWITTER_OAUTH_TOKEN_SECRET,
  })
  const info = webInfo.call({
    webUrl: url,
  })

  return info
}
