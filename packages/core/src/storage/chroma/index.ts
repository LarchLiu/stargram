import { Chroma } from 'langchain/vectorstores/chroma'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import type { WebInfoData } from '../../types'
import { VectorStorage } from '../types'
import type { StorageType, VectorConfig } from '../types'

export interface ChromaVectorConfig extends VectorConfig {
  url: string
}
export class ChromaVectorStorage extends VectorStorage<ChromaVectorConfig> {
  constructor(config: ChromaVectorConfig, data?: WebInfoData) {
    super(config, data)
  }

  async save(data?: WebInfoData) {
    if (!data && !this.data)
      throw new Error('VectorStorage error: No Storage Data')

    const storageData = (data || this.data)!
    const rawDoc = new Document({ pageContent: storageData.content, metadata: this.config.metaData })

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter()

    const docs = await textSplitter.splitDocuments([rawDoc])
    await Chroma.fromDocuments(docs, this.config.embeddingsInfo.embeddings, {
      collectionName: this.config.embeddingsInfo.indexName,
      url: this.config.url,
    })
  }

  async getRetriever() {
    const vectorStore = await Chroma.fromExistingCollection(
      this.config.embeddingsInfo.embeddings,
      {
        collectionName: this.config.embeddingsInfo.indexName,
        url: this.config.url,
        filter: {
          appName: this.config.metaData.appName,
          botId: this.config.metaData.botId,
          userId: this.config.metaData.userId,
        },
      },
    )
    return vectorStore.asRetriever()
  }

  getConfig(): ChromaVectorConfig {
    return this.config
  }

  getType(): StorageType {
    return {
      type: 'VectorStorage',
      name: 'ChromaVectorConfig',
    }
  }
}
