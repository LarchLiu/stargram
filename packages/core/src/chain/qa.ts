import { RetrievalQAChain } from 'langchain/chains'
import { PromptTemplate } from '@langchain/core/prompts'
import type { IVectorStorage } from '../storage'
import type { PromptsLanguage, QARes } from '../types'
import { ANSWER_IN_LANGUAGE } from '../const'
import { getPromptsByTemplate } from '../utils'

const prompt_template = `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}
Answer in {language}:`

export class QAChain {
  constructor(fields: {
    vectorStorage: IVectorStorage
  }) {
    this.vectorStorage = fields.vectorStorage
  }

  private vectorStorage

  async call(question: string, language: PromptsLanguage = 'zh-CN') {
    const retriever = await this.vectorStorage.getRetriever()
    const config = this.vectorStorage.getConfig()

    const kv = {
      language: ANSWER_IN_LANGUAGE[language],
    }
    const template = getPromptsByTemplate(prompt_template, kv)

    const chain = RetrievalQAChain.fromLLM(
      config.embeddingsInfo.llmModel,
      retriever,
      {
        returnSourceDocuments: true,
        prompt: new PromptTemplate({
          template,
          inputVariables: ['context', 'question'],
        }),
      },
    )

    const res = await chain.call({ query: question })

    return res as QARes
  }
}
