import { unfurl } from 'unfurl.js'
import type { WebInfoData } from '@starnexus/core'
import { getDomain } from '@starnexus/core/utils'

export async function ogInfoFn(webUrl: string) {
  const res = await unfurl(webUrl)
  let content = res.description || ''
  let title = res.title || ''
  let url = res.canonical_url || webUrl
  const domain = getDomain(url)
  const word = domain.split('.')[0]
  let siteName = word.charAt(0).toUpperCase() + word.slice(1)
  if (res.open_graph) {
    const og = res.open_graph
    title = og.title
    content = og.description || content
    url = og.url || url
    siteName = og.site_name || siteName
  }

  if (!title || !content)
    throw new Error('Not Supported Website. No OG info')

  return {
    title,
    content,
    url,
    meta: {
      domain,
      siteName,
    },
  } as WebInfoData
}
