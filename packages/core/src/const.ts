import type { PromptsLanguage } from './types'

export const GITHUB_DOMAIN = 'github.com'
export const TWITTER_DOMAIN = 'twitter.com'
export const GITHUB_API_URL = 'https://api.github.com'
export const GITHUB_REPOS_API = `${GITHUB_API_URL}/repos`
export const GITHUB_RAW_URL = 'https://raw.githubusercontent.com'
export const NOTION_API_URL = 'https://api.notion.com/v1'
export const OPENAI_CHAT_API = 'https://api.openai.com'
export const MAX_TOKEN_LENGTH = 2048
export const SUMMARIZE_PROMPTS = `You are a summarize professer. Please summarize content in detail and then classify it to 1-5 types of classification. Classification names should be short and no explanation or description is needed.
You only speak JSON. Do not write text that isn't JSON. The JSON keys must be English word of "summary" and "categories".
Classification names used with array data.
The JSON format must be:
{
  "summary": "This is the summary content."
  "categories": ["XXX","YYY","ZZZ"]
}
`
export const USER_PROMPTS = `Please summarize in {language}. Remember You only speak JSON. The Content is {webprompts}:
=====
{content}
=====
Please summarize in {language}. Remember You only speak JSON.`

export const QA_PROMPT = `您是提供有用建议的人工智能助手。您被提供以下长文档的提取部分和一个问题。根据所提供的上下文提供对话式回答。

  您只应提供引用下文的超链接。不要编造超链接。
  
  如果您在下文中找不到答案，请说“嗯，我不确定。”不要试图编造答案。
  
  如果问题与上下文无关，请礼貌地回答您只回答与上下文相关的问题。

Question: {question}
=========
{context}
=========
Answer in Markdown:`

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
