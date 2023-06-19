export interface WebInfoData {
  title: string
  url: string
  content: string
  meta: WebsiteMeta
}

export interface WebCardData {
  url: string
}

export interface WebsiteMeta {
  domain?: string
  siteName?: string
  ogImage?: string
  prompts?: string
  savedImage?: string
}
export interface CommonMeta extends WebsiteMeta {
  favicon?: string
}
// TODO: remove web meta type to webHub
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
  avatar?: string
  content?: string
  status?: string
  pubTime?: string
  lang?: string
  tags?: string[]
}

export interface WebLoaderUrls {
  webUrl: string
  webPath?: string
}

export interface SummarizeData {
  summary: string
  categories: string[]
}

export interface NotionDataConfig {
  apiKey: string
  databaseId: string
  defaultOgImage: string
}

export interface NotionPage {
  title: string
  summary: string
  url: string
  categories: string[]
  status: 'Starred' | 'Unstarred'
  meta?: WebsiteMeta
}

export interface SavedNotion {
  starred: boolean
  storageId: string
}

export interface PicBedRes {
  url: string
}

export type PromptsLanguage = 'de' | 'en' | 'es' | 'fr' | 'kr' | 'ja' | 'it' | 'nl' | 'pt' | 'ru' | 'zh-CN'

export interface WebLoaderParams {
  urls: WebLoaderUrls
  browserlessToken?: string
  headers?: Record<string, string>
}

export interface PathInfo {
  name: string
  author: string
  sample: string
  prompts?: string
  sequence?: number
  filter: (urls: WebLoaderUrls) => WebLoaderUrls | undefined
  loader: (params: WebLoaderParams) => Promise<WebInfoData>
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
