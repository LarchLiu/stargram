import type {
  GithubRepoMeta,
  WebLoaderUrls,
  WebInfoData,
} from '@stargram/core'

interface PageData extends WebInfoData {
  starred: boolean
  tabId?: number
  storageId?: string
}

interface PageInfo extends WebLoaderUrls {
  starred: boolean
  tabId?: number
  storageId?: string
  error?: string
}

interface SwResponse {
  starred: boolean
  error?: string
  tabId?: number
  storageId?: string
  url?: string
}

interface ListenerResponse {
  message: string
  error?: boolean
}

interface SwRequest {
  action: string
  data?: SwResponse
  syncStatus?: SyncStatus
}

interface SyncStatus {
  index: number
  count: number
  state: boolean
  isEnd: boolean
  successCount: number
  failCount: number
  fetchEnd: boolean
}

interface ContentRequest {
  action: string
  data?: PageInfo
  syncData?: string[]
  syncState?: boolean
  syncStatus?: SyncStatus
  fetchGithubData?: { token: string; user?: string }
}

type ListenerSendResponse = (response: ListenerResponse) => void

interface IConfig {
  label: string
  value: string
  require: boolean
}

export type {
  PageData,
  ListenerResponse,
  ListenerSendResponse,
  SwResponse,
  SwRequest,
  ContentRequest,
  GithubRepoMeta,
  WebLoaderUrls,
  PageInfo,
  IConfig,
}
