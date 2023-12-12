import { errorMessage } from '@stargram/core/utils'
import { $fetch } from '@stargram/core'
import OAuth from 'oauth-1.0a'
import CryptoJS from 'crypto-js'
import queryString from 'query-string'
import { baseUrl, consumerKey, consumerSecret, gqlFeatures, gqlMap } from './constants'

let tokenIndex = 0
const oauthTokens = import.meta.env.VITE_TWITTER_OAUTH_TOKEN?.split(',')
const oauthTokenSecrets = import.meta.env.VITE_TWITTER_OAUTH_TOKEN_SECRET?.split(',')

async function twitterGot(url: string, params: any) {
  if (!oauthTokens?.length || !oauthTokenSecrets?.length || oauthTokens.length !== oauthTokenSecrets.length)
    throw new Error('Invalid twitter oauth tokens')

  const oauth = new OAuth({
    consumer: {
      key: consumerKey,
      secret: consumerSecret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (base_string: string, key: string) => CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64),
  })

  const token = {
    key: oauthTokens[tokenIndex],
    secret: oauthTokenSecrets[tokenIndex],
  }
  tokenIndex++
  if (tokenIndex >= oauthTokens.length)
    tokenIndex = 0

  const requestData = {
    url: `${url}?${queryString.stringify(params)}`,
    method: 'GET',
    headers: {
      'connection': 'keep-alive',
      'content-type': 'application/json',
      'x-twitter-active-user': 'yes',
      'authority': 'api.twitter.com',
      'accept-encoding': 'gzip',
      'accept-language': 'en-US,en;q=0.9',
      'accept': '*/*',
      'DNT': '1',
    },
  }

  const response = await $fetch(requestData.url, {
    headers: oauth.toHeader(oauth.authorize(requestData, token)) as { Authorization: string },
  })

  return response
}

// https://github.com/mikf/gallery-dl/blob/a53cfc845e12d9e98fefd07e43ebffaec488c18f/gallery_dl/extractor/twitter.py#L1075-L1093
async function paginationTweets(endpoint: string, userId: string, variables = {}, path: string[]) {
  const { data } = await twitterGot(baseUrl + endpoint, {
    variables: JSON.stringify({
      ...variables,
      rest_id: userId,
    }),
    features: gqlFeatures,
  })

  let instructions: any
  if (!path) {
    instructions = data.user_result.result.timeline_response.timeline.instructions
  }
  else {
    instructions = data
    path.forEach(p => (instructions = instructions[p]))
    instructions = instructions.instructions
  }

  return instructions.filter((i: any) => i.__typename === 'TimelineAddEntries' || i.type === 'TimelineAddEntries')[0].entries
}

// https://github.com/mikf/gallery-dl/blob/a53cfc845e12d9e98fefd07e43ebffaec488c18f/gallery_dl/extractor/twitter.py#L795-L805
function tweetDetail(status: string) {
  return paginationTweets(
    // '/graphql/ItejhtHVxU7ksltgMmyaLA/TweetDetail',
    gqlMap.TweetDetail,
    '',
    {
      focalTweetId: status,
      includeHasBirdwatchNotes: false,
      includePromotedContent: false,
      withBirdwatchNotes: false,
      withVoice: false,
      withV2Timeline: true,
    },
    ['threaded_conversation_with_injections_v2'],
  )
}

function gatherLegacyFromData(entries: any, filter = 'tweet-') {
  const tweets: any[] = []
  const filte_entries: any[] = []
  entries.forEach((entry: any) => {
    const entryId = entry.entryId
    if (entryId) {
      if (filter === 'none') {
        if (entryId.startsWith('tweet-'))
          filte_entries.push(entry)

        else if (entryId.startsWith('homeConversation-') || entryId.startsWith('conversationthread-'))
          filte_entries.push(...entry.content.items)
      }
      else {
        if (entryId.startsWith(filter))
          filte_entries.push(entry)
      }
    }
  })
  filte_entries.forEach((entry) => {
    if (entry.entryId) {
      const content = entry.content || entry.item
      let tweet = content?.itemContent?.tweet_results?.result
      if (tweet && tweet.tweet)
        tweet = tweet.tweet

      if (tweet) {
        const retweet = tweet.legacy?.retweeted_status_result?.result
        for (const t of [tweet, retweet]) {
          if (!t?.legacy)
            continue

          t.legacy.user = t.core.user_results.result.legacy
          const quote = t.quoted_status_result?.result
          if (quote) {
            t.legacy.quoted_status = quote.legacy
            t.legacy.quoted_status.user = quote.core.user_results.result.legacy
          }
        }
        const legacy = tweet.legacy
        if (legacy) {
          if (retweet)
            legacy.retweeted_status = retweet.legacy

          tweets.push(legacy)
        }
      }
    }
  })
  return tweets
}

export async function getTweetByStatus(status: string) {
  try {
    const tweets = await tweetDetail(status)
    return gatherLegacyFromData(tweets, 'none')
  }
  catch (error: any) {
    if (error.status === 403) {
      const tweets = await tweetDetail(status)
      return gatherLegacyFromData(tweets, 'none')
    }
    else {
      const message = errorMessage(error)
      throw new Error(`Twitter API error: ${message || error.statusText}`)
    }
  }
}
