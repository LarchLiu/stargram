interface PageData {
  title: string
  url: string
  content: string
  starred: boolean
  tabId?: number
  notionPageId?: string
  github?: GithubMeta
}

interface GithubMeta {
  tags?: string[]
  languages?: string[]
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
  data?: PageData
}

type ListenerSendResponse = (response: ListenerResponse) => void

export type {
  PageData,
  ListenerResponse,
  ListenerSendResponse,
  SwResponse,
  SwRequest,
  ContentRequest,
  GithubMeta,
}
