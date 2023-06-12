import { $fetch } from 'ofetch'
import type { PromptsLanguage, SummarizeData, WebInfoData } from '../../types'
import { countWord, getPromptsByTemplate, preprocessText } from '../../utils'
import { ANSWER_IN_LANGUAGE, OPENAI_CHAT_API, SUMMARIZE_PROMPTS, USER_PROMPTS } from '../../const'
import { ProviderType, getSummaryPrompt } from './prompt'

export class OpenaiSummarizeContent {
  constructor(fields: { apiKey: string; apiHost?: string; webData?: WebInfoData; lang?: PromptsLanguage }) {
    this.apiKey = fields.apiKey
    this.webData = fields.webData
    this.lang = fields.lang
    this.apiHost = fields.apiHost
  }

  private apiKey
  private webData
  private lang
  private apiHost

  async call(webData?: WebInfoData) {
    if (!webData && !this.webData)
      throw new Error('OpenaiSummarizeContent error: No WebInfo Data')

    const info = webData || this.webData
    return await summarizeContent(this.apiKey, info!, this.lang, this.apiHost)
  }
}

export async function summarizeContent(apiKey: string, websiteInfo: WebInfoData, language: PromptsLanguage = 'zh-CN', apiHost: string = OPENAI_CHAT_API): Promise<SummarizeData> {
  let summary = ''
  let categories = []
  let content = websiteInfo.content
  content = preprocessText(content)
  const wordCount = countWord(content)
  const host = apiHost === OPENAI_CHAT_API ? `${apiHost}/v1` : apiHost

  if (wordCount > 40) {
    content = getSummaryPrompt(content, ProviderType.GPT3)

    const kv = {
      content,
      language: ANSWER_IN_LANGUAGE[language],
      webprompts: websiteInfo.meta.prompts || '',
    }
    const userPrompts = getPromptsByTemplate(USER_PROMPTS, kv)
    const openaiData = await $fetch<any>(`${host}/chat/completions`, {
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
