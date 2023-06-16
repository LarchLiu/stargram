export interface Opts {
  /** support retreiving oembed metadata */
  oembed?: boolean
  /** req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies) */
  timeout?: number
  /** maximum redirect count. 0 to not follow redirect */
  follow?: number
  /** support gzip/deflate content encoding */
  compress?: boolean
  /** maximum response body size in bytes. 0 to disable */
  size?: number
  /** map of request headers, overrides the defaults */
  headers?: Record<string, string>
}

export type ReadabilityParse = null | {
  /** article title */
  title: string

  /** HTML string of processed article content */
  content: string

  /** text content of the article, with all the HTML tags removed */
  textContent: string

  /** length of an article, in characters */
  length: number

  /** article description, or short excerpt from the content */
  excerpt: string

  /** author metadata */
  byline: string

  /** content direction */
  dir: string

  /** name of the site */
  siteName: string

  /** content language */
  lang: string
}

export interface Metadata {
  title?: string
  description?: string
  keywords?: string[]
  favicon?: string
  author?: string
  theme_color?: string
  canonical_url?: string
  twitter_card: {
    card: string
    site?: string
    creator?: string
    creator_id?: string
    title?: string
    description?: string
    players?: {
      url: string
      stream?: string
      height?: number
      width?: number
    }[]
    apps: {
      iphone: {
        id: string
        name: string
        url: string
      }
      ipad: {
        id: string
        name: string
        url: string
      }
      googleplay: {
        id: string
        name: string
        url: string
      }
    }
    images: {
      url: string
      alt: string
    }[]
  }
  open_graph: {
    title: string
    type: string
    images?: {
      url: string
      secure_url?: string
      type: string
      width: number
      height: number
      alt?: string
    }[]
    url?: string
    audio?: {
      url: string
      secure_url?: string
      type: string
    }[]
    description?: string
    determiner?: string
    site_name?: string
    locale: string
    locale_alt: string
    videos: {
      url: string
      stream?: string
      height?: number
      width?: number
      tags?: string[]
    }[]
    article: {
      published_time?: string
      modified_time?: string
      expiration_time?: string
      author?: string
      section?: string
      tags?: string[]
    }
  }
  readability?: ReadabilityParse
}
