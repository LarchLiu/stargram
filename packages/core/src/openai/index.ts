import { $fetch } from 'ofetch'
import type { OpenaiSummarize, PromptsLanguage, WebsiteInfo } from '../types'
import { countWord, getPromptsByTemplate, preprocessText } from '../utils'
import { ANSWER_IN_LANGUAGE, MAX_TOKEN_LENGTH, OPENAI_CHAT_API, SUMMARIZE_PROMPTS, USER_PROMPTS } from '../const'

async function summarizeContent(apiKey: string, websiteInfo: WebsiteInfo, language: PromptsLanguage = 'zh-CN'): Promise<OpenaiSummarize> {
  let summary = ''
  let categories = []
  let content = websiteInfo.content
  content = preprocessText(content)
  let wordCount = countWord(content)

  if (wordCount > 40) {
    const systemLen = countWord(SUMMARIZE_PROMPTS)
    const maxTokens = MAX_TOKEN_LENGTH - systemLen
    // let wordToken = estimateTokens(content)

    while (wordCount > maxTokens) {
      content = content.substring(0, content.length - (wordCount - maxTokens))
      wordCount = countWord(content)
    }

    const kv = {
      content,
      language: ANSWER_IN_LANGUAGE[language],
      webprompts: websiteInfo.meta.prompts || '',
    }
    const userPrompts = getPromptsByTemplate(USER_PROMPTS, kv)
    const openaiData = await $fetch<any>(`${OPENAI_CHAT_API}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: SUMMARIZE_PROMPTS,
          },
          {
            role: 'user',
            content: userPrompts,
          },
        ],
        max_tokens: 800,
        temperature: 0.3,
      },
    })

    const text = openaiData.choices[0].message.content
    const json = JSON.parse(text)
    summary = json.summary
    categories = json.categories
  }
  else {
    summary = content
  }
  const catArry = (categories && categories.length) ? categories : ['Others']
  return { summary, categories: catArry }
}

export {
  summarizeContent,
}
