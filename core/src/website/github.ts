import type { FetchError, FetchWebsite, GithubMeta } from '~/types'
import { GITHUB_HOST, GITHUB_RAW_DOMAIN, GITHUB_REPOS_API, PICTURE_BED_URL } from '~/const'
import { fetchGet } from '~/utils'

async function getGithubInfo(url: string, picBed?: string): Promise<FetchWebsite> {
  const regexGithubPath = /https:\/\/github.com\/([^\/]*\/[^\/]*)/g // match github.com/user/repo/
  let title = ''
  const githubMeta: GithubMeta = { host: GITHUB_HOST, website: 'Github' }
  let content = ''
  const githubPathMatch = regexGithubPath.exec(url)
  const githubPath = githubPathMatch ? githubPathMatch[1] : ''

  try {
    if (githubPath) {
      // fetch repo info
      const repoJson = await fetchGet<any>(`${GITHUB_REPOS_API}/${githubPath}`)
      // fetch languages
      const languagesJson = await fetchGet(`${GITHUB_REPOS_API}/${githubPath}/languages`)
      // fetch readme
      const readme = await fetchGet<string>(`${GITHUB_RAW_DOMAIN}/${githubPath}/${repoJson.default_branch}/README.md`)

      const description = repoJson.description ? repoJson.description.replace(/:\w+:/g, ' ') : ''
      title = repoJson.full_name + (description ? (`: ${description}`) : '')
      url = repoJson.html_url
      const tags = repoJson.topics

      if (tags && tags.length > 0)
        githubMeta.tags = tags

      if (languagesJson)
        githubMeta.languages = Object.keys(languagesJson)

      const imageBaseUrl = picBed || PICTURE_BED_URL
      if (imageBaseUrl) {
        const user = repoJson.owner.login
        const repo = repoJson.name
        const imageUrl = `${imageBaseUrl}?username=${user}&reponame=${repo}&stargazers_count=${repoJson.stargazers_count}&language=${repoJson.language}&issues=${repoJson.open_issues_count}&forks=${repoJson.forks_count}&description=${description}`
        githubMeta.socialPreview = encodeURI(imageUrl)
      }

      content = `${title}\n\n${readme}`
      if (content.length > 1000) {
        content = content.substring(0, 1000)
        content += '...'
      }
    }
    return { data: { title, url, content, meta: githubMeta } }
  }
  catch (error) {
    return { error: error as FetchError }
  }
}

export { getGithubInfo }
