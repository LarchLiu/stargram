import { NotionStorage, OGInfo, SaveWebInfoChain, SummarizeContent, WebCard, WebInfo, errorMessage } from '@starnexus/core'
import { routes } from '@starnexus/web-hub'
import { createWebCard } from './webCard'

interface UserConfig {
  OPENAI_API_KEY: string
  NOTION_CONFIG: {
    API_KEY: string
    DATABASE_ID: string
  }
}

export async function StarNexusSaveWebInfoChain(text: string, config: UserConfig) {
  const regex = /(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?[-a-zA-Z0-9()@:%_\\\+\.~#?&//=]*/g
  const match = text.match(regex)
  const infoArr = []
  if (match) {
    let i = 0
    let success = 0
    let fail = 0
    while (i < match.length) {
      let url = match[i]
      if (!url.startsWith('http'))
        url = `https://${url}`

      const ogInfo = new OGInfo({ fn: ogInfoFn, url })
      const webInfo = new WebInfo({
        urls: {
          webUrl: url,
        },
        routes,
        ogInfo,
      })
      const webCard = new WebCard({ localFn: createWebCard })
      const summarize = new SummarizeContent({ apiKey: config.OPENAI_API_KEY || '' })
      const notion = new NotionStorage({
        config: {
          apiKey: config.NOTION_CONFIG.API_KEY || '',
          databaseId: config.NOTION_CONFIG.DATABASE_ID || '',
        },
      })

      const chain = new SaveWebInfoChain({
        webInfo,
        webCard,
        summarizeContent: summarize,
        dataStorage: notion,
      })

      const info = await chain.call().then(_ => true).catch(e => errorMessage(e))

      i += 1
      if (typeof info === 'boolean') {
        success += 1
      }
      else {
        fail += 1
        infoArr.push(info)
      }
    }
    return `${success ? 'Saved to StarNexus 🎉.\n' : ''}Success: ${success}${fail ? (` Fail: ${fail}\nError Info: ${infoArr.join('\n')}`) : ''}`
  }
  else {
    throw new Error('Not Supported Website.')
  }
}
