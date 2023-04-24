interface WebsiteInfo {
  title: string
  url: string
  content: string
  meta?: GithubMeta
}

interface GithubMeta {
  host: string
  website: 'Github'
  tags?: string[]
  languages?: string[]
  socialPreview?: string
}

type FetchError = string

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
  category: string[]
}

interface NotionPage {
  title: string
  summary: string
  url: string

}

export type {
  WebsiteInfo,
  GithubMeta,
  WebsiteLoader,
  FetchWebsite,
  FetchError,
  FetchOpenai,
  OpenaiSummarize,
  NotionPage,
}
