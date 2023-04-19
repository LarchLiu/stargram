const GITHUB_HOST = 'github.com'
const SUMMARIZE_PROMPT = 'Summarize this Text and then Categorize this Text. In summary within 200 words. The maximum number of categories is 5. Categories name should be divided by punctuation \',\'. Return the summary first and then the categories like this:\n\nSummary: my summary. Categories: Github, OSS\n\nText: '
export {
  GITHUB_HOST,
  SUMMARIZE_PROMPT,
}
