import { $fetch } from 'ofetch'
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import type { PromptsLanguage, SummarizeData, WebInfoData } from '../../types'
import { countWord, getPromptsByTemplate, preprocessText } from '../../utils'
import { ANSWER_IN_LANGUAGE, OPENAI_CHAT_API, SUMMARIZE_PROMPTS, USER_PROMPTS } from '../../const'
import type { OpenaiConfig } from '../types'
import { CLLM } from '../types'
import { getSummaryPrompt } from '../prompt'

export class Openai extends CLLM<OpenaiConfig> {
  constructor(config: OpenaiConfig, webData?: WebInfoData) {
    super(config, webData)
  }

  async summarize(webData?: WebInfoData) {
    if (!webData && !this.webData)
      throw new Error('OpenaiSummarizeContent error: No WebInfo Data')

    const info = webData || this.webData
    return await summarizeContent(this.config.apiKey, info!, this.config.lang, this.config.apiHost)
  }

  embeddingsInfo() {
    const embeddings = new OpenAIEmbeddings({ openAIApiKey: this.config.apiKey }, {
      basePath: `${this.config.apiHost}/v1`,
    })
    const model = new ChatOpenAI({ openAIApiKey: this.config.apiKey, modelName: 'gpt-3.5-turbo', temperature: 0.2 }, {
      basePath: `${this.config.apiHost}/v1`,
    })
    return {
      llmModel: model,
      embeddings,
      indexName: 'openai_documents',
      queryName: 'openai_match_documents',
    }
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
    content = getSummaryPrompt(content)

    const kv = {
      content,
      language: ANSWER_IN_LANGUAGE[language],
      webprompts: websiteInfo.meta.prompts || '',
    }
    const userPrompts = getPromptsByTemplate(USER_PROMPTS, kv)
    let returnRes = false
    const maxRetry = 5
    let retry = 0
    while (!returnRes) {
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
      try {
        const json = JSON.parse(text)
        summary = json.summary
        categories = json.categories
        returnRes = true
      }
      catch (error) {
        retry++
        if (retry === maxRetry) {
          returnRes = true
          throw error
        }
      }
    }
  }
  else {
    summary = content
  }
  const catArry = (categories && categories.length) ? categories : ['Others']
  return { summary, categories: catArry }
}
