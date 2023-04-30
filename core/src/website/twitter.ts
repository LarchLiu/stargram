import type { FetchError, FetchWebsite, PicBedRes, TwitterMeta } from '../types'
import { PICTURE_BED_URL, STAR_NEXUS_HUB_API, TWITTER_DOMAIN, USER_AGENT } from '../const'
import { fetchGet, fetchPost } from '../utils'

async function getTwitterInfo(url: string, picBed?: string, header: Record<string, string> = { 'User-Agent': USER_AGENT }): Promise<FetchWebsite> {
  let title = ''
  let content = ''
  const meta: TwitterMeta = { domain: TWITTER_DOMAIN, website: 'Twitter' }
  const regexPath = /https:\/\/twitter.com\/([^\/]*\/status\/[^\?]*)/g // match github.com/user/repo/
  const pathMatch = regexPath.exec(url)
  const path = pathMatch ? pathMatch[1] : ''
  const status = path.split('/')[2]

  try {
    if (path) {
      // fetch tweets info
      const resJson = await fetchGet<any>(`${STAR_NEXUS_HUB_API}/twitter/tweet/${path}/original=true`, header)
      title = resJson.title

      const tweets = resJson.item as any[]
      const tweet = tweets.find(({ id_str }) => id_str === status)
      tweets.forEach((t) => {
        let fullText = t.full_text
        if (t.entities?.urls) {
          t.entities.urls.forEach((e: any) => {
            fullText = fullText.replace(e.url, e.expanded_url)
          })
        }
        if (t.quoted_status) {
          let quotedFullText = t.quoted_status.full_text
          if (t.quoted_status.entities?.urls) {
            t.quoted_status.entities.urls.forEach((e: any) => {
              quotedFullText = quotedFullText.replace(e.url, e.expanded_url)
            })
          }

          content += `${t.quoted_status.user.name}: ${quotedFullText}\n${t.user.name}: ${fullText}\n`
        }
        else { content += `${t.user.name}: ${fullText}\n` }
      })

      if (tweet) {
        const imageBaseUrl = picBed || PICTURE_BED_URL
        if (imageBaseUrl) {
          const user = tweet.user
          const name = user.name
          const screenName = user.screen_name
          const avator = user.profile_image_url_https
          const content = user.full_text
          const body = {
            name, screenName, avator, content, status,
          }
          const imageUrl = `${imageBaseUrl}/twitter`
          const imageJson = await fetchPost<PicBedRes>(imageUrl, { ...header, 'Content-Type': 'application/json' }, body)
          meta.cover = (imageJson as PicBedRes).url
        }
      }
    }
    else {
      return { error: 'Twitter error: Not supported website.' }
    }
    return { data: { title, url, content, meta } }
  }
  catch (error) {
    return { error: `Twitter error: ${error as FetchError}` }
  }
}

export { getTwitterInfo }
