import { NotionDataStorage } from './notion'
import { SupabaseImageStorage, SupabaseVectorStorage } from './supabase'
import type { TStorage } from './types'

export * from './types'
// export * from './notion'
// export * from './supabase'

export type StorageInfo = {
  [key in TStorage]: Record<string, any>
}

// TODO: tree shaking
export const storageInfo: StorageInfo = {
  DataStorage: {
    NotionDataStorage,
  },
  ImageStorage: {
    SupabaseImageStorage,
  },
  VectorStorage: {
    SupabaseVectorStorage,
  },
}
