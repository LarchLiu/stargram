import type { BaseRetriever } from 'langchain/schema/retriever'
import type { EmbeddingsInfo, SummarizeData, VectorMetaData, WebInfoData } from '../types'

export type TStorage = 'DataStorage' | 'ImageStorage' | 'VectorStorage'
export interface StorageType {
  type: TStorage
  name: string
}
export type StorageData = WebInfoData & SummarizeData
export type ReturnStorageData = (StorageData & { id: string | number })
export interface StorageImage {
  imgData: string | Blob
  imgPath: string
}

export interface SavedData {
  starred: boolean
  storageId: string | number
}

export interface SavedImage {
  url: string
}

export interface IDataStorage {
  create: (data?: StorageData) => Promise<SavedData>
  query: (url: string) => Promise<SavedData | undefined>
  update: (savedData: SavedData, data?: StorageData) => Promise<SavedData>
  updateOgImage: (info: SavedData, url: string) => Promise<SavedImage>
  getType: () => StorageType
  getConfig: () => any
  list: (pageSize: number, page?: number | string) => Promise<{ data: ReturnStorageData[], nextPage: number | string | undefined }>
}

export abstract class DataStorage<T> implements IDataStorage {
  constructor(config: T, data?: StorageData) {
    this.config = config
    this.data = data
  }

  protected config: T
  protected data?: StorageData
  abstract query(url: string): Promise<SavedData | undefined>
  abstract create(data?: StorageData): Promise<SavedData>
  abstract update(savedData: SavedData, data?: StorageData): Promise<SavedData>
  abstract updateOgImage(info: SavedData, url: string): Promise<SavedImage>
  abstract getType(): StorageType
  abstract getConfig(): T
  abstract list(pageSize: number, page?: number | string): Promise<{ data: ReturnStorageData[], nextPage: number | string | undefined }>
}

export interface IImageStorage {
  create: (data?: StorageImage) => Promise<SavedImage>
  update: (data?: StorageImage) => Promise<SavedImage>
  query: (imgPath: string) => Promise<SavedImage>
  getType: () => StorageType
  getConfig: () => any
}

export abstract class ImageStorage<T, R extends SavedImage> implements IImageStorage {
  constructor(config: T, data?: StorageImage) {
    this.config = config
    this.data = data
  }

  protected config: T
  protected data?: StorageImage

  abstract create(data?: StorageImage): Promise<R>
  abstract update(data?: StorageImage): Promise<R>
  abstract query(imgPath: string): Promise<R>
  abstract getType(): StorageType
  abstract getConfig(): T
}

export interface IVectorStorage {
  save: (data?: WebInfoData) => Promise<void>
  getRetriever: () => Promise<BaseRetriever>
  getType: () => StorageType
  getConfig: () => VectorConfig
}
export interface VectorConfig {
  embeddingsInfo: EmbeddingsInfo
  metaData: VectorMetaData
}
export abstract class VectorStorage<T extends VectorConfig> implements IVectorStorage {
  constructor(config: T, data?: WebInfoData) {
    this.config = config
    this.data = data
  }

  protected config: T
  protected data?: WebInfoData

  abstract save(data?: WebInfoData): Promise<void>
  abstract getRetriever(): Promise<BaseRetriever>
  abstract getType(): StorageType
  abstract getConfig(): T
}
