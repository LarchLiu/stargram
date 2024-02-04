import { PGVectorStore } from '@langchain/community/vectorstores/pgvector'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import type { WebInfoData } from '../../types'
import { VectorStorage } from '../types'
import type { StorageType, VectorConfig } from '../types'

export interface PGVectorConfig extends VectorConfig {
  host: string
  port: string
  user: string
  password: string
  database: string
}
export class PGVectorStorage extends VectorStorage<PGVectorConfig> {
  constructor(config: PGVectorConfig, data?: WebInfoData) {
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
    await PGVectorStore.fromDocuments(docs, this.config.embeddingsInfo.embeddings, {
      postgresConnectionOptions: {
        ...this.config,
        type: 'postgres',
        port: Number.parseInt(this.config.port),
      },
      tableName: this.config.embeddingsInfo.indexName,
      columns: {
        idColumnName: 'id',
        vectorColumnName: 'embedding',
        contentColumnName: 'content',
        metadataColumnName: 'metadata',
      },
    })
  }

  async getRetriever() {
    const vectorStore = await PGVectorStore.initialize(
      this.config.embeddingsInfo.embeddings,
      {
        postgresConnectionOptions: {
          ...this.config,
          type: 'postgres',
          port: Number.parseInt(this.config.port),
        },
        tableName: this.config.embeddingsInfo.indexName,
        columns: {
          idColumnName: 'id',
          vectorColumnName: 'embedding',
          contentColumnName: 'content',
          metadataColumnName: 'metadata',
        },
        filter: {
          appName: this.config.metaData.appName,
          botId: this.config.metaData.botId,
          userId: this.config.metaData.userId,
        },
      },
    )
    return vectorStore.asRetriever()
  }

  getConfig(): PGVectorConfig {
    return this.config
  }

  getType(): StorageType {
    return {
      type: 'VectorStorage',
      name: 'PGVectorStorage',
    }
  }
}
