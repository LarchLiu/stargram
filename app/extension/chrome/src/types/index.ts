import type {
  GithubRepoMeta,
  WebLoaderUrls,
  WebInfoData,
} from '@starnexus/core'

interface PageData extends WebInfoData {
  starred: boolean
  tabId?: number
  notionPageId?: string
}

interface PageInfo extends WebLoaderUrls {
  starred: boolean
  tabId?: number
  notionPageId?: string
}

interface SwResponse {
  starred: boolean
  error?: string
  tabId?: number
  notionPageId?: string
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
