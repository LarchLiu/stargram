import type { PathInfo, TwitterTweetMeta, WebInfoData, WebLoaderUrls } from '@stargram/core'
import { replaceHtmlReservedCharacters, strNotEqualWith } from '@stargram/core/utils'
import { getTweetByStatus } from '../twitterApi'

function tweetFilter(urls: WebLoaderUrls): WebLoaderUrls | undefined {
  const regexPath = /twitter.com\/([^\/]*\/status\/[^\?]*)/g
  const pathMatch = regexPath.exec(urls.webUrl)
  const webPath = pathMatch ? pathMatch[1] : ''
  const id = webPath.split('/')[0]

  if (strNotEqualWith(id, ['home', 'explore', 'notifications', 'messages', 'search']))
    return { ...urls, webPath }

  return undefined
}

async function getTweetInfo(urls: WebLoaderUrls): Promise<WebInfoData> {
  let title = ''
  let content = ''
  const url = urls.webUrl
  const meta: TwitterTweetMeta = {}
  const path = urls.webPath
  if (path) {
    const status = path.split('/')[2]
    if (!status)
      throw new Error('Twitter Tweet error: No tweet status ID')

    meta.prompts = 'The tweet and retweet info'
    // fetch tweets info
    const resJson = await getTweetByStatus(status)
    const tweets = resJson as any[]
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
      title = `Tweet · ${name} @${screenName}`
      const avatar = user.profile_image_url_https.replace('_normal', '')
      const content = replaceHtmlReservedCharacters(tweet.full_text)
      const pubTime = new Date(tweet.created_at).toUTCString()

      meta.name = name
      meta.screenName = screenName
      meta.avatar = avatar
      meta.content = content
      meta.pubTime = pubTime
      meta.lang = tweet.lang
      meta.status = status
      const hashtags = tweet.entities?.hashtags
      if (hashtags)
        meta.tags = hashtags.map((t: { text: string }) => t.text)
    }
  }
  else {
    throw new Error('Twitter Tweet error: No tweet path.')
  }
  return { title, url, content, meta }
}

export const pathInfo: PathInfo = {
  name: 'Tweet Details',
  author: '[Stargram](https://github.com/LarchLiu/stargram)',
  sample: 'LarchLiu/status/1635509927094677504',
  filter: tweetFilter,
  loader: getTweetInfo,
}
