import { errorMessage } from '@stargram/core/utils'

export async function SlackSaveWebInfoChain(stargramHub: string, text: string, userConfig: any) {
  const regex = /(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?[-a-zA-Z0-9()@:%_\\\+\.~#?&//=]*/g
  const matchs = text.match(regex)
  if (matchs) {
    let i = 0
    const uniqueUrls = new Set(matchs)
    const uniqueMatchs = [...uniqueUrls]
    while (i < uniqueMatchs.length) {
      let url = uniqueMatchs[i]
      if (!url.startsWith('http'))
        url = `https://${url}`

      $fetch(`${stargramHub}/api/slack/save-web-info`, {
        method: 'POST',
        body: {
          context: { USER_CONFIG: userConfig },
          url,
          stargramHub,
        },
      }).catch(e => console.error(errorMessage(e)))

      i += 1
    }
    return `Found ${i} Website. Saving...`
  }
  else {
    throw new Error('No Supported Website.')
  }
}

export function sendMessageToSlackBot(config: { appId: string; webhook: string }, message: string) {
  return $fetch(config.webhook, {
    body: {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message,
          },
        },
      ],
    },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}
