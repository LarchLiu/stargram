import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { HarmBlockThreshold, HarmCategory, TaskType } from '@google/generative-ai'
import type { SummarizeData, WebInfoData } from '../../types'
import { countWord, getPromptsByTemplate, preprocessText } from '../../utils'
import { ANSWER_IN_LANGUAGE, SUMMARIZE_PROMPTS, USER_PROMPTS } from '../../const'
import type { GoogleaiConfig } from '../types'
import { CLLM } from '../types'
import { getSummaryPrompt } from '../prompt'

export class Googleai extends CLLM<GoogleaiConfig> {
  constructor(config: GoogleaiConfig, webData?: WebInfoData) {
    super(config, webData)
  }

  async summarize(webData?: WebInfoData) {
    if (!webData && !this.webData)
      throw new Error('OpenaiSummarizeContent error: No WebInfo Data')

    const info = webData || this.webData
    return await summarizeContent(this.config, info!)
  }

  embeddingsInfo() {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: this.config.apiKey,
      modelName: 'embedding-001', // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    })
    const model = new ChatGoogleGenerativeAI({
      apiKey: this.config.apiKey,
      modelName: 'gemini-2.0-flash',
      maxOutputTokens: 2048,
      temperature: 0.3,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    })
    return {
      llmModel: model,
      embeddings,
      indexName: 'googleai_documents',
      queryName: 'googleai_match_documents',
    }
  }
}

export async function summarizeContent(config: GoogleaiConfig, websiteInfo: WebInfoData): Promise<SummarizeData> {
  let summary = ''
  let categories = []
  let content = websiteInfo.content
  content = preprocessText(content)
  const wordCount = countWord(content)

  if (wordCount > 40) {
    content = getSummaryPrompt(content)

    const kv = {
      content,
      language: ANSWER_IN_LANGUAGE[config.lang],
      webprompts: websiteInfo.meta.prompts || '',
    }
    const userPrompts = getPromptsByTemplate(USER_PROMPTS, kv)
    let returnRes = false
    const maxRetry = 5
    let retry = 0
    while (!returnRes) {
      const model = new ChatGoogleGenerativeAI({
        apiKey: config.apiKey,
        modelName: 'gemini-2.0-flash',
        maxOutputTokens: 2048,
        temperature: 0.3,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
      })

      // Batch and stream are also supported
      const res = await model.invoke([
        [
          'system',
          SUMMARIZE_PROMPTS,
        ],
        [
          'human',
          userPrompts,
        ],
      ])

      const text = res.content
      try {
        const json = JSON.parse(typeof text === 'string' ? text.replace('```json', '').replace('```', '') : text.map(t => t.type === 'text' ? t.text : '').join(''))
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
