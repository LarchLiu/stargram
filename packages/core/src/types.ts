export interface WebsiteInfo {
  title: string
  url: string
  content: string
  meta: WebsiteMeta
}

export interface WebsiteMeta {
  domain: string
  website: string
  cover?: string
  prompts?: string
}

export interface GithubMeta extends WebsiteMeta {
  tags?: string[]
  languages?: string[]
}

export interface TwitterMeta extends WebsiteMeta {
  tags?: string[]
}

export type FetchError = string

export interface NotThrowError {
  error: FetchError
}

export interface FetchWebsite {
  data?: WebsiteInfo
  error?: FetchError
}

export type WebPath = string

export interface LoaderUrls {
  webUrl: string
  picBed?: string
  webHub?: string
  webPath?: WebPath
}

export interface WebsiteLoader {
  [key: string]: {
    loader: (urls: LoaderUrls, header?: Record<string, string>) => Promise<FetchWebsite>
  }
}

export interface FetchOpenai {
  data?: OpenaiSummarize
  error?: FetchError
}

export interface OpenaiSummarize {
  summary: string
  categories: string[]
}

export interface NotionPage {
  databaseId: string
  title: string
  summary: string
  url: string
  categories: string[]
  status: 'Starred' | 'Unstarred'
  meta?: WebsiteMeta
}

export interface SavedNotion {
  starred: boolean
  notionPageId: string
}

export interface FetchNotion {
  data?: SavedNotion
  error?: FetchError
}

export interface PicBedRes {
  url: string
}

export type PromptsLanguage = 'en' | 'zh-CN'

export interface PathInfo {
  name: string
  author: string
  sample: string
  prompts?: string
  sequence?: number
  filter: (urls: LoaderUrls) => LoaderUrls | undefined
  loader: (urls: LoaderUrls, header?: Record<string, string>) => Promise<FetchWebsite>
}

export interface Router {
  name: string
  author: string
  category: string | string[] // TODO: defined const categories
  paths?: PathInfo[]
}

export interface Routes {
  [name: string]: Router
}
