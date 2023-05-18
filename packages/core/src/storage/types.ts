import type { SummarizeData, WebInfoData } from '../types'

export type TStorage = 'DataStorage' | 'ImageStorage' | 'VectorStorage'
export interface StorageType {
  type: TStorage
  name: string
}
export type StorageData = WebInfoData & SummarizeData
export interface StorageImage {
  imgData: string | Blob
  imgPath: string
}

export interface SavedData {
  storageId: string | number
}

export interface SavedImage {
  url: string
}

export interface IDataStorage {
  create(data?: StorageData): Promise<SavedData>
  updateOgImage(info: SavedData, url: string): Promise<SavedImage>
  getType(): StorageType
  getConfig(): any
}

export abstract class DataStorage<T, R extends SavedData> implements IDataStorage {
  constructor(config: T, data?: StorageData) {
    this.config = config
    this.data = data
  }

  protected config: T
  protected data?: StorageData

  abstract create(data?: StorageData): Promise<R>
  abstract updateOgImage(info: R, url: string): Promise<SavedImage>
  abstract getType(): StorageType
  abstract getConfig(): T
}

export interface IImageStorage {
  create(data?: StorageImage): Promise<SavedImage>
  update(data?: StorageImage): Promise<SavedImage>
  query(imgPath: string): Promise<SavedImage>
  getType(): StorageType
  getConfig(): any
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
