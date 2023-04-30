import type { FetchOpenai, WebsiteInfo } from '../types'
import { countWord, estimateTokens, fetchPost } from '../utils'
import { MAX_TOKEN_LENGTH, OPENAI_CHAT_API, SUMMARIZE_PROMPT } from '../const'

async function summarizeContent(apiKey: string, websiteInfo: WebsiteInfo): Promise<FetchOpenai> {
  try {
    let summary = ''
    let category = ''
    let content = websiteInfo.content
    const wordCount = countWord(content)

    if (wordCount > 100) {
      const systemLen = estimateTokens(SUMMARIZE_PROMPT)
      const maxTokens = MAX_TOKEN_LENGTH - systemLen
      let wordToken = estimateTokens(content)

      while (wordToken > maxTokens) {
        content = content.substring(0, content.length - (wordToken - maxTokens))
        wordToken = estimateTokens(content)
      }
      const openaiData = await fetchPost<any>(`${OPENAI_CHAT_API}/chat/completions`,
        {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: SUMMARIZE_PROMPT,
            },
            {
              role: 'user',
              content,
            },
          ],
          max_tokens: 400,
          temperature: 0.5,
        },
      )

      let text = openaiData.choices[0].message.content
      text = text.replace(/\n/g, '')
      const regexSummery = /Summary:(.*)Categories:/g
      const regexCategory = /Categories:(.*)$/g
      const summaryArr = regexSummery.exec(text)
      const categoryArr = regexCategory.exec(text)
      if (summaryArr)
        summary = summaryArr[1].trim()

      if (categoryArr)
        category = categoryArr[1].trim()
    }
    else {
      summary = content
    }
    const catArry = (category || 'Others').split(',')
    return { data: { summary, categories: catArry } }
  }
  catch (err) {
    return { error: `Openai API error: ${err}` }
  }
}

export {
  summarizeContent,
}
