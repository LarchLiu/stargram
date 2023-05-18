import { NotionDataStorage } from './notion'
import { SupabaseImageStorage } from './supabase'
import type { TStorage } from './types'

export * from './types'
export * from './notion'
export * from './supabase'

export type StorageInfo = {
  [key in TStorage]: Record<string, any>
}

export const storageInfo: StorageInfo = {
  DataStorage: {
    NotionDataStorage,
  },
  ImageStorage: {
    SupabaseImageStorage,
  },
  VectorStorage: {

  },
}