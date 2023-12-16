import type { LlmInfo } from './types'
import { Openai } from './openai'
import { Googleai } from './googleai'

export * from './types'

export const llmInfo: LlmInfo = {
  Googleai,
  Openai,
}
