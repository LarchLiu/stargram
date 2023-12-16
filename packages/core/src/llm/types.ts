import type { EmbeddingsInfo, PromptsLanguage, SummarizeData, WebInfoData } from '../types'

export interface ILLM {
  summarize: (webData?: WebInfoData) => Promise<SummarizeData>
  embeddingsInfo: () => EmbeddingsInfo
}

export abstract class CLLM<T> implements ILLM {
  constructor(config: T, webData?: WebInfoData) {
    this.config = config
    this.webData = webData
  }

  protected config: T
  protected webData?: WebInfoData

  abstract summarize(webData?: WebInfoData): Promise<SummarizeData>
  abstract embeddingsInfo(): EmbeddingsInfo
}

export type TLLM = 'Openai' | 'Googleai'

export interface OpenaiConfig {
  apiKey: string
  apiHost?: string
  lang?: PromptsLanguage
}

export interface GoogleaiConfig {
  apiKey: string
  lang: PromptsLanguage
}

export type LlmInfo = {
  [key in TLLM]: any
}
