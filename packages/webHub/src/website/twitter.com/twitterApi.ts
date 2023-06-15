import { errorMessage } from '@stargram/core/utils'
import { $fetch } from '@stargram/core'

// https://github.com/mikf/gallery-dl/blob/a53cfc845e12d9e98fefd07e43ebffaec488c18f/gallery_dl/extractor/twitter.py#L716-L726
const headers = {
  'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAPYXBAAAAAAACLXUNDekMxqa8h%2F40K4moUkGsoc%3DTYfbDKbT3jJPCEVnMYqilB28NHfOPqkca3qaAxGfsyKCs0wRbw',
  // Bearer AAAAAAAAAAAAAAAAAAAAAPYXBAAAAAAACLXUNDekMxqa8h%2F40K4moUkGsoc%3DTYfbDKbT3jJPCEVnMYqilB28NHfOPqkca3qaAxGfsyKCs0wRbw
  // reference: https://github.com/dangeredwolf/FixTweet/blob/f3082bbb0d69798687481a605f6760b2eb7558e0/src/constants.ts#L23-L25
  'x-guest-token': '',
  // 'x-twitter-client-language': 'en',
  // 'x-twitter-active-user': 'yes',
  // 'Referer': 'https://twitter.com/',
}

async function newGuestToken() {
  let guestToken = ''
  const activate = await $fetch(
    'https://api.twitter.com/1.1/guest/activate.json',
    {
      method: 'POST',
      headers: {
        Authorization: headers.authorization,
      },
      retry: 3,
    },
  )
  guestToken = activate.guest_token
  headers['x-guest-token'] = guestToken
}
// https://github.com/mikf/gallery-dl/blob/a53cfc845e12d9e98fefd07e43ebffaec488c18f/gallery_dl/extractor/twitter.py#L756--L770
const _variables = {
  count: 20,
  includePromotedContent: false,
  withSuperFollowsUserFields: true,
  withBirdwatchPivots: false,
  withDownvotePerspective: false,
  withReactionsMetadata: false,
  withReactionsPerspective: false,
  withSuperFollowsTweetFields: true,
  withClientEventToken: false,
  withBirdwatchNotes: false,
  withVoice: true,
  withV2Timeline: false,
  __fs_interactive_text: false,
  __fs_dont_mention_me_view_api_enabled: false,
}

// https://github.com/mikf/gallery-dl/blob/a53cfc845e12d9e98fefd07e43ebffaec488c18f/gallery_dl/extractor/twitter.py#L1075-L1093
async function paginationTweets(endpoint: string, userId: string, variables = {}, path: string[]) {
  if (!headers['x-guest-token'])
    await newGuestToken()

  const params = {
    ..._variables,
    ...variables,
    userId,
  }

  const { data } = await $fetch(`https://twitter.com/i/api${endpoint}?variables=${encodeURI(JSON.stringify(params))}`, {
    headers,
    method: 'GET',
  })

  if (data && Object.keys(data).length) {
    let instructions: any
    if (!path) {
      instructions = data.user.result.timeline.timeline.instructions
    }
    else {
      instructions = data
      path.forEach((p) => {
        instructions = instructions[p]
      })
      instructions = instructions.instructions
    }
    return instructions.filter((i: any) => i.type === 'TimelineAddEntries')[0].entries
  }
  throw new Error('Tweet Not Found')
}

// https://github.com/mikf/gallery-dl/blob/a53cfc845e12d9e98fefd07e43ebffaec488c18f/gallery_dl/extractor/twitter.py#L795-L805
function tweetDetail(status: string) {
  return paginationTweets(
    '/graphql/ItejhtHVxU7ksltgMmyaLA/TweetDetail',
    '',
    {
      focalTweetId: status,
      with_rux_injections: false,
      withCommunity: true,
      withQuickPromoteEligibilityTweetFields: false,
      withBirdwatchNotes: false,
    },
    ['threaded_conversation_with_injections'],
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
      headers['x-guest-token'] = ''
      const tweets = await tweetDetail(status)
      return gatherLegacyFromData(tweets, 'none')
    }
    else {
      const message = errorMessage(error)
      throw new Error(`Twitter API error: ${message || error.statusText}`)
    }
  }
}
