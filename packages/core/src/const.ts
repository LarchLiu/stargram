import type { PromptsLanguage } from './types'

export const GITHUB_DOMAIN = 'github.com'
export const TWITTER_DOMAIN = 'twitter.com'
export const STAR_NEXUS_HUB_API = import.meta.env.VITE_STAR_NEXUS_HUB_API
export const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_HOST || 'https://api.github.com'
export const GITHUB_REPOS_API = `${GITHUB_API_URL}/repos`
export const GITHUB_RAW_URL = import.meta.env.VITE_GITHUB_RAW_HOST || 'https://raw.githubusercontent.com'
export const PICTURE_BED_URL = import.meta.env.VITE_PICTURE_BED
export const NOTION_API_URL = import.meta.env.VITE_NOTION_API_URL || 'https://api.notion.com/v1'
export const OPENAI_CHAT_API = import.meta.env.VITE_OPENAI_API_HOST || 'https://api.openai.com/v1'
export const MAX_TOKEN_LENGTH = 2048
export const SUMMARIZE_PROMPTS = `Please summarize content within 300 words and then classify it to 1-5 types of classification. Classification names should be short and no explanation or description is needed. Separate the classification names with "#", not other symbols.
Start the summary with "Summary:". Start the types classification with "Classification:". Return the summary first and then the types of classification. The format is as follows:

Summary: This is the summary content. // must start with English word of "Summary:"
Classification: XXX#YYY#ZZZ // must start with English word of "Classification:"
`
export const USER_PROMPTS = `Please answer in {language}. The Content is:
=====
{content}
=====
Please answer in {language}.`

export const ANSWER_IN_LANGUAGE: { [key in PromptsLanguage]: string } = {
  'de': 'German',
  'en': 'English',
  'es': 'Spanish',
  'fr': 'Franch',
  'kr': 'Korean',
  'nl': 'Dutch',
  'it': 'Italian',
  'ja': 'Japanese',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'zh-CN': 'Chinese',
}

export const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15'
