import type {
  FetchError,
  FetchOpenai,
  FetchWebsite,
  GithubMeta,
  NotionPage,
  OpenaiSummarize,
  WebsiteInfo,
  WebsiteLoader,
} from './types'
import { fetchGet, fetchPost } from './utils/index'
import { getWebsiteInfo } from './website'
import { summarizeContent } from './openai'

export {
  // types
  WebsiteInfo,
  GithubMeta,
  WebsiteLoader,
  FetchWebsite,
  FetchError,
  FetchOpenai,
  OpenaiSummarize,
  NotionPage,
  // functions
  getWebsiteInfo,
  summarizeContent,
  fetchGet,
  fetchPost,
}
