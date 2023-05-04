import type { FetchError, FetchWebsite, LoaderUrls, PathInfo, PicBedRes, TwitterMeta } from '../../../types'
import { PICTURE_BED_URL, STAR_NEXUS_HUB_API, TWITTER_DOMAIN, USER_AGENT } from '../../../const'
import { fetchGet, fetchPost, strNotEqualWith } from '../../../utils'

function tweetFilter(urls: LoaderUrls): LoaderUrls | undefined {
  const regexPath = /twitter.com\/([^\/]*\/status\/[^\?]*)/g
  const pathMatch = regexPath.exec(urls.webUrl)
  const webPath = pathMatch ? pathMatch[1] : ''
  const id = webPath.split('/')[0]

  if (strNotEqualWith(id, ['home', 'explore', 'notifications', 'messages', 'search']))
    return { ...urls, webPath }

  return undefined
}

async function getTweetInfo(urls: LoaderUrls, header: Record<string, string> = { 'User-Agent': USER_AGENT }): Promise<FetchWebsite> {
  let title = ''
  let content = ''
  const url = urls.webUrl
  const meta: TwitterMeta = { domain: TWITTER_DOMAIN, website: 'Twitter' }
  const regexPath = /https:\/\/twitter.com\/([^\/]*\/status\/[^\?]*)/g // match github.com/user/repo/
  const pathMatch = regexPath.exec(url)
  const path = pathMatch ? pathMatch[1] : ''
  const status = path.split('/')[2]
  const webHub = urls.webHub || STAR_NEXUS_HUB_API
  try {
    if (path && webHub) {
      // fetch tweets info
      const resJson = await fetchGet<any>(`${webHub}/twitter/tweet/${path}/original=true`, header)
      const tweets = resJson.item as any[]
      tweets.forEach((t) => {
        let fullText = t.full_text
        if (t.entities?.urls) {
          t.entities.urls.forEach((e: any) => {
            fullText = fullText.replace(e.url, e.expanded_url)
            t.full_text = fullText
          })
        }
        if (t.quoted_status) {
          let quotedFullText = t.quoted_status.full_text
          if (t.quoted_status.entities?.urls) {
            t.quoted_status.entities.urls.forEach((e: any) => {
              quotedFullText = quotedFullText.replace(e.url, e.expanded_url)
              t.quoted_status.full_text = quotedFullText
            })
          }

          content += `${t.quoted_status.user.name}: ${quotedFullText}\n${t.user.name}: ${fullText}\n`
        }
        else { content += `${t.user.name}: ${fullText}\n` }
      })
      const tweet = tweets.find(({ id_str }) => id_str === status)

      if (tweet) {
        const user = tweet.user
        const name = user.name
        const screenName = user.screen_name
        title = `Twitter · ${name} @${screenName}`

        const imageBaseUrl = urls.picBed || PICTURE_BED_URL
        if (imageBaseUrl) {
          const avator = user.profile_image_url_https.replace('_normal', '')
          const content = tweet.full_text
          const pubTime = new Date(tweet.created_at).toUTCString()
          const body = {
            name, screenName, avator, content, status, pubTime,
          }

          const imageUrl = `${imageBaseUrl}/twitter`
          const imageJson = await fetchPost<PicBedRes>(imageUrl, { ...header, 'Content-Type': 'application/json' }, body)
          meta.cover = (imageJson as PicBedRes).url
        }
        const hashtags = tweet.entities?.hashtags
        if (hashtags)
          meta.tags = hashtags.map((t: { text: string }) => t.text)
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

const pathInfo: PathInfo = {
  author: '[StarNexus](https://github.com/LarchLiu/star-nexus)',
  sample: 'LarchLiu/status/1635509927094677504',
  filter: tweetFilter,
  loader: getTweetInfo,
}

export default pathInfo
