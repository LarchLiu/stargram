import type { WebsiteLoader } from './types'
import { getGithubInfo } from './website/github'
import { getTwitterInfo } from './website/twitter'

const GITHUB_DOMAIN = 'github.com'
const TWITTER_DOMAIN = 'twitter.com'
const STAR_NEXUS_HUB_API = import.meta.env.VITE_STAR_NEXUS_HUB_API
const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_HOST || 'https://api.github.com'
const GITHUB_REPOS_API = `${GITHUB_API_URL}/repos`
const GITHUB_RAW_URL = import.meta.env.VITE_GITHUB_RAW_HOST || 'https://raw.githubusercontent.com'
const PICTURE_BED_URL = import.meta.env.VITE_PICTURE_BED
const NOTION_API_URL = import.meta.env.VITE_NOTION_API_URL || 'https://api.notion.com/v1'
const OPENAI_CHAT_API = import.meta.env.VITE_OPENAI_API_HOST || 'https://api.openai.com/v1'
const MAX_TOKEN_LENGTH = 2048
const SUMMARIZE_PROMPT = `Summarize this Content first and then Categorize it. 
The Content is the *Markdown* format. In summary within 200 words. 
Categories number must *less than 5* items. Category names should be short without additional explanatory text. 
Multiple category names should be separated by commas, not other symbols.
Return the *summary first* and then the categories like this:
====
Summary: {Summary}. // must start with Summary:
Categories: XXX, YYY // must start with Categories:
====
The Content is: 
`

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15'
const websiteLoader: WebsiteLoader = {
  [GITHUB_DOMAIN]: {
    loader: getGithubInfo,
  },
  [TWITTER_DOMAIN]: {
    loader: getTwitterInfo,
  },
}
export {
  GITHUB_DOMAIN,
  TWITTER_DOMAIN,
  STAR_NEXUS_HUB_API,
  GITHUB_API_URL,
  GITHUB_REPOS_API,
  GITHUB_RAW_URL,
  SUMMARIZE_PROMPT,
  PICTURE_BED_URL,
  USER_AGENT,
  OPENAI_CHAT_API,
  NOTION_API_URL,
  websiteLoader,
  MAX_TOKEN_LENGTH,
}
