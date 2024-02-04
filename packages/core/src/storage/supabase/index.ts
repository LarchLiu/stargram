import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { $fetch } from 'ofetch'
import type { WebCardData, WebInfoData } from '../../types'
import { ImageStorage, VectorStorage } from '../types'
import type { StorageImage, StorageType, VectorConfig } from '../types'

export interface SupabaseImageConfig {
  anonKey: string
  bucket: string
  url: string
  upsert?: boolean
}
export class SupabaseImageStorage extends ImageStorage<SupabaseImageConfig, WebCardData> {
  constructor(config: SupabaseImageConfig, data?: StorageImage) {
    super(config, data)
    this.client = createClient(this.config.url, this.config.anonKey, {
      auth: {
        persistSession: false,
      },
    })
    this.storageUrl = `${this.config.url}/storage/v1/object/public/${this.config.bucket}`
  }

  private client
  private storageUrl

  async create(data?: StorageImage) {
    if (!data && !this.data)
      throw new Error('ImageStorage error: No Storage Data')

    const storageData = (data || this.data)!

    const { error } = await this.client.storage
      .from(this.config.bucket)
      .upload(storageData.imgPath, storageData.imgData, {
        contentType: 'image/svg+xml',
        cacheControl: '31536000',
        upsert: this.config.upsert || true,
      })

    if (error)
      throw error

    return {
      url: `${this.storageUrl}/${storageData.imgPath}?v=stargramogimage&t=${Date.now()}`,
    }
  }

  async update(data?: StorageImage) {
    if (!data && !this.data)
      throw new Error('ImageStorage error: No Storage Data')

    const storageData = (data || this.data)!

    const { error } = await this.client.storage
      .from(this.config.bucket)
      .update(storageData.imgPath, storageData.imgData, {
        contentType: 'image/svg+xml',
        cacheControl: '31536000',
      })

    if (error)
      throw error

    return {
      url: `${this.storageUrl}/${storageData.imgPath}?v=stargramogimage&t=${Date.now()}`,
    }
  }

  async query(imgPath: string) {
    const imgUrl = `${this.storageUrl}/${imgPath}`
    const storageResponse = await $fetch(imgUrl)
      .then((_) => {
        return imgUrl
      })
      .catch((_) => {
        return ''
      })
    return {
      url: storageResponse,
    }
  }

  getConfig(): SupabaseImageConfig {
    return this.config
  }

  getType(): StorageType {
    return {
      type: 'ImageStorage',
      name: 'SupabaseImageStorage',
    }
  }
}

export interface SupabaseVectorConfig extends VectorConfig {
  anonKey: string
  url: string
}
export class SupabaseVectorStorage extends VectorStorage<SupabaseVectorConfig> {
  constructor(config: SupabaseVectorConfig, data?: WebInfoData) {
    super(config, data)
    this.client = createClient(this.config.url, this.config.anonKey, {
      auth: {
        persistSession: false,
      },
    })
  }

  private client

  async save(data?: WebInfoData) {
    if (!data && !this.data)
      throw new Error('VectorStorage error: No Storage Data')

    const storageData = (data || this.data)!
    const rawDoc = new Document({ pageContent: storageData.content, metadata: this.config.metaData })

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter()

    const docs = await textSplitter.splitDocuments([rawDoc])
    await SupabaseVectorStore.fromDocuments(docs, this.config.embeddingsInfo.embeddings, {
      client: this.client,
      tableName: this.config.embeddingsInfo.indexName,
    })
  }

  async getRetriever() {
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      this.config.embeddingsInfo.embeddings,
      {
        client: this.client,
        tableName: this.config.embeddingsInfo.indexName,
        queryName: this.config.embeddingsInfo.queryName,
        filter: {
          appName: this.config.metaData.appName,
          botId: this.config.metaData.botId,
          userId: this.config.metaData.userId,
        },
      })
    return vectorStore.asRetriever()
  }

  getConfig(): SupabaseVectorConfig {
    return this.config
  }

  getType(): StorageType {
    return {
      type: 'VectorStorage',
      name: 'SupabaseVectorStorage',
    }
  }
}
