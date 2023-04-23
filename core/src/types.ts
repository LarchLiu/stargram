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

export type {
  WebsiteInfo,
  GithubMeta,
  WebsiteLoader,
  FetchWebsite,
  FetchError,
}
