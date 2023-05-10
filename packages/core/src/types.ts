export interface WebsiteInfo {
  title: string
  url: string
  content: string
  meta: WebsiteMeta
}

export interface WebSiteCard {
  url: string
}

export interface WebsiteMeta {
  domain?: string
  website?: string
  cover?: string
  prompts?: string
}

export interface GithubRepoMeta extends WebsiteMeta {
  username?: string
  reponame?: string
  description?: string
  tags?: string[]
  languages?: string[]
}

export interface TwitterTweetMeta extends WebsiteMeta {
  name?: string
  screenName?: string
  avator?: string
  content?: string
  status?: string
  pubTime?: string
  tags?: string[]
}

export type FetchError = string

export interface FetchRes<T> {
  data?: T
  error?: FetchError
}

export type WebPath = string

export interface LoaderUrls {
  webUrl: string
  webHub?: string
  webPath?: WebPath
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

export interface PicBedRes {
  url: string
}

export type PromptsLanguage = 'de' | 'en' | 'es' | 'fr' | 'kr' | 'ja' | 'it' | 'nl' | 'pt' | 'ru' | 'zh-CN'

export interface PathInfo {
  name: string
  author: string
  sample: string
  prompts?: string
  sequence?: number
  filter: (urls: LoaderUrls) => LoaderUrls | undefined
  loader: (urls: LoaderUrls, headers?: Record<string, string>) => Promise<FetchRes<WebsiteInfo>>
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
