const GITHUB_HOST = 'github.com'
const GITHUB_DOMAIN = 'https://github.com'
const GITHUB_API_DOMAIN = 'https://api.github.com'
const GITHUB_REPOS_API = `${GITHUB_API_DOMAIN}/repos`
const GITHUB_RAW_DOMAIN = 'https://raw.githubusercontent.com'
const starSrc = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="256" height="256" viewBox="0 0 256 256"%3E%3Cpath fill="currentColor" d="M237.47 70.71a11.18 11.18 0 0 0-9.73-7.71l-38.43-3.25l-15-35a11.24 11.24 0 0 0-20.63 0l-15 35L100.27 63a11.12 11.12 0 0 0-6.36 19.54L123 107.38l-8.72 36.92a11.09 11.09 0 0 0 4.26 11.5a11.23 11.23 0 0 0 12.42.6l33-19.64l33.05 19.64a11.22 11.22 0 0 0 12.42-.6a11.07 11.07 0 0 0 4.25-11.5L205 107.38l29.08-24.83a11.08 11.08 0 0 0 3.39-11.84Zm-40.66 27.9a11.05 11.05 0 0 0-3.61 11l8.39 35.55l-31.83-18.92a11.23 11.23 0 0 0-11.52 0l-31.82 18.92l8.38-35.56a11 11 0 0 0-3.6-11l-27.89-23.81l36.85-3.12a11.2 11.2 0 0 0 9.37-6.74L164 31.17l14.48 33.76a11.19 11.19 0 0 0 9.36 6.74l36.86 3.12ZM84.24 124.24l-56 56a6 6 0 0 1-8.48-8.48l56-56a6 6 0 0 1 8.48 8.48Zm16 47.52a6 6 0 0 1 0 8.48l-56 56a6 6 0 0 1-8.48-8.48l56-56a6 6 0 0 1 8.48 0Zm72 0a6 6 0 0 1 0 8.48l-56 56a6 6 0 0 1-8.48-8.48l56-56a6 6 0 0 1 8.49 0Z"%2F%3E%3C%2Fsvg%3E'
const starFillSrc = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="256" height="256" viewBox="0 0 256 256"%3E%3Cpath fill="currentColor" d="m235.39 84.07l-28.15 24l8.43 35.73a13.09 13.09 0 0 1-5 13.58a13.25 13.25 0 0 1-14.63.7l-32-19l-32 19a13.25 13.25 0 0 1-14.63-.7a13.1 13.1 0 0 1-5-13.58l8.43-35.73l-28.16-24A13.13 13.13 0 0 1 100.1 61l37.23-3.15L151.85 24a13.24 13.24 0 0 1 24.31 0l14.52 33.87L227.9 61a13.12 13.12 0 0 1 7.49 23.06ZM85.66 114.34a8 8 0 0 0-11.32 0l-56 56a8 8 0 0 0 11.32 11.32l56-56a8 8 0 0 0 0-11.32Zm16 56a8 8 0 0 0-11.32 0l-56 56a8 8 0 0 0 11.32 11.32l56-56a8 8 0 0 0 0-11.32Zm60.69 0l-56 56a8 8 0 0 0 11.32 11.32l56-56a8 8 0 0 0-11.31-11.32Z"%2F%3E%3C%2Fsvg%3E'
const SUMMARIZE_PROMPT = 'Summarize this Document first and then Categorize it. The Document is the *Markdown* format. In summary within 200 words. Categories with less than 5 items. Category names should be divided by a comma. Return the summary first and then the categories like this:\n\nSummary: my summary.\n\nCategories: XXX, YYY\n\nThe Document is: \n\n'
export {
  GITHUB_HOST,
  GITHUB_DOMAIN,
  GITHUB_API_DOMAIN,
  GITHUB_REPOS_API,
  GITHUB_RAW_DOMAIN,
  SUMMARIZE_PROMPT,
  starSrc,
  starFillSrc,
}