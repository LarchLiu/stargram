import type {
  FetchError,
  FetchNotion,
  FetchOpenai,
  FetchWebsite,
  GithubMeta,
  LoaderUrls,
  NotionPage,
  OpenaiSummarize,
  PicBedRes,
  WebsiteInfo,
  WebsiteLoader,
} from './types'
import { fetchGet, fetchPost } from './utils/index'
import { getWebsiteInfo } from './website'
import { summarizeContent } from './openai'
import { saveToNotion } from './notion'

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
  FetchNotion,
  PicBedRes,
  LoaderUrls,
  // functions
  getWebsiteInfo,
  summarizeContent,
  saveToNotion,
  fetchGet,
  fetchPost,
}
