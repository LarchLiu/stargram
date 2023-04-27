interface WebsiteInfo {
  title: string
  url: string
  content: string
  meta?: WebsiteMeta
}

interface WebsiteMeta {
  domain: string
  website: string
}

interface GithubMeta extends WebsiteMeta {
  website: 'Github'
  tags?: string[]
  languages?: string[]
  socialPreview?: string
}

type FetchError = string

interface NotThrowError {
  error: FetchError
}

interface FetchWebsite {
  data?: WebsiteInfo
  error?: FetchError
}

interface WebsiteLoader {
  [key: string]: {
    loader: (url: string, picBed?: string, header?: Record<string, string>) => Promise<FetchWebsite>
  }
}

interface FetchOpenai {
  data?: OpenaiSummarize
  error?: FetchError
}

interface OpenaiSummarize {
  summary: string
  categories: string[]
}

interface NotionPage {
  databaseId: string
  title: string
  summary: string
  url: string
  categories: string[]
  status: 'Starred' | 'Unstarred'
  meta?: WebsiteMeta
}

interface SavedNotion {
  starred: boolean
  notionPageId: string
}

interface FetchNotion {
  data?: SavedNotion
  error?: FetchError
}

interface SupabasePicBedRes {
  url: string
}

export type {
  WebsiteInfo,
  GithubMeta,
  WebsiteLoader,
  FetchWebsite,
  FetchError,
  NotThrowError,
  FetchOpenai,
  OpenaiSummarize,
  NotionPage,
  FetchNotion,
  SupabasePicBedRes,
}
