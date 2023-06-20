import { OpenaiSummarizeContent } from './openai'

export type TLLM = 'Openai'

export type LlmInfo = {
  [key in TLLM]: Record<string, any>
}

export const llmInfo: LlmInfo = {
  Openai: {
    OpenaiSummarizeContent,
  },
}
