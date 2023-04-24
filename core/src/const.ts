import type { WebsiteLoader } from './types'
import { getGithubInfo } from './website/github'

const GITHUB_HOST = 'github.com'
const GITHUB_DOMAIN = 'https://github.com'
const GITHUB_API_DOMAIN = 'https://api.github.com'
const GITHUB_REPOS_API = `${GITHUB_API_DOMAIN}/repos`
const GITHUB_RAW_DOMAIN = 'https://raw.githubusercontent.com'
const PICTURE_BED_URL = import.meta.env.VITE_PICTURE_BED

const OPENAI_CHAT_API = 'https://api.openai.com/v1/chat/completions'
const SUMMARIZE_PROMPT = 'Summarize this Document first and then Categorize it. The Document is the *Markdown* format. In summary within 200 words. Categories with less than 5 items. Category names should be divided by a comma. Return the summary first and then the categories like this:\n\nSummary: my summary.\n\nCategories: XXX, YYY\n\nThe Document is: \n\n'

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15'
const websiteLoader: WebsiteLoader = {
  'github.com': {
    loader: getGithubInfo,
  },
}
export {
  GITHUB_HOST,
  GITHUB_DOMAIN,
  GITHUB_API_DOMAIN,
  GITHUB_REPOS_API,
  GITHUB_RAW_DOMAIN,
  SUMMARIZE_PROMPT,
  PICTURE_BED_URL,
  USER_AGENT,
  OPENAI_CHAT_API,
  websiteLoader,
}
