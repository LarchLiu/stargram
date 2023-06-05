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
}

interface SwResponse {
  starred: boolean
  error?: string
  tabId?: number
  storageId?: string
}

interface ListenerResponse {
  message: string
  error?: boolean
}

interface SwRequest {
  action: string
  data?: SwResponse
}

interface ContentRequest {
  action: string
  data?: PageInfo
}

type ListenerSendResponse = (response: ListenerResponse) => void

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
}
