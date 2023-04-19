const GITHUB_HOST = 'github.com'
const SUMMARIZE_PROMPT = 'Categorize this Text and then Summarize this Text. In summary within 200 words. The maximum number of categories is 5. Categories name should be divided by punctuation \',\'. Return the categories and the summary like this:\n\nSummary: my summary. Categories: Github, OSS\n\nText: '
export {
  GITHUB_HOST,
  SUMMARIZE_PROMPT,
}
