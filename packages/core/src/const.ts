import type { PromptsLanguage, WebsiteLoader } from './types'
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
const SUMMARIZE_PROMPTS = `Please summarize content within 300 words and then classify it to 1-5 types of classification. Classification names should be short and no explanation or description is needed. Separate the classification names with "#", not other symbols.
Start the summary with "Summary:". Start the types classification with "Classification:". Return the summary first and then the types of classification. The format is as follows:

Summary: This is the summary content. // must start with Summary:
Classification: XXX#YYY#ZZZ // must start with Classification:
`
const USER_PROMPTS = `The Content is:
=====
{content}
=====
{language}`

const ANSWER_IN_LANGUAGE: { [key in PromptsLanguage]: string } = {
  'en': 'Please answer in English.',
  'zh-CN': '请用中文回答。',
}

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
  SUMMARIZE_PROMPTS,
  USER_PROMPTS,
  ANSWER_IN_LANGUAGE,
  PICTURE_BED_URL,
  USER_AGENT,
  OPENAI_CHAT_API,
  NOTION_API_URL,
  websiteLoader,
  MAX_TOKEN_LENGTH,
}
