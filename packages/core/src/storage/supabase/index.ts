import { createClient } from '@supabase/supabase-js'
import { $fetch } from 'ofetch'
import type { WebCardData } from '../../types'
import { ImageStorage } from '../types'
import type { StorageImage, StorageType } from '../types'

export interface SupabaseImageConfig {
  anonKey: string
  bucket: string
  url: string
  upsert?: boolean
}
export class SupabaseImageStorage extends ImageStorage<SupabaseImageConfig, WebCardData> {
  constructor(config: SupabaseImageConfig, data?: StorageImage) {
    super(config, data)
    this.client = createClient(this.config.url, this.config.anonKey)
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
      url: `${this.storageUrl}/${storageData.imgPath}?v=starnexusogimage&t=${Date.now()}`,
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
      url: `${this.storageUrl}/${storageData.imgPath}?v=starnexusogimage&t=${Date.now()}`,
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
