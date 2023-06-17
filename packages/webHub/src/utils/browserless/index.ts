import { $fetch } from '@stargram/core'

export async function browserless(url: string, token: string) {
  const res = await $fetch(`https://chrome.browserless.io/scrape?token=${token}`, {
    method: 'POST',
    body: {
      url,
      elements: [
        {
          selector: 'body',
        },
      ],
      gotoOptions: {
        waitUntil: 'networkidle0',
      },
    },
  })
  let text = ''
  if (res.data) {
    if (res.data[0].results)
      text = res.data[0].results[0].text
  }
  return text
}
