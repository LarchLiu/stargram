export interface WebsiteInfo {
  title: string
  url: string
  content: string
  meta: WebsiteMeta
}

export interface WebsiteCard {
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

export interface WebLoaderUrls {
  webUrl: string
  webPath?: string
  starNexusHub?: string
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
  filter: (urls: WebLoaderUrls) => WebLoaderUrls | undefined
  loader: (urls: WebLoaderUrls, headers?: Record<string, string>) => Promise<WebsiteInfo>
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
