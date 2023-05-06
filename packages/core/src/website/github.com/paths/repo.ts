import type { FetchError, FetchWebsite, GithubMeta, LoaderUrls, NotThrowError, PathInfo, PicBedRes } from '../../../types'
import { GITHUB_RAW_URL, GITHUB_REPOS_API, PICTURE_BED_URL, USER_AGENT } from '../../../const'
import { fetchGet, fetchPost, strNotEqualWith } from '../../../utils'

function repoFilter(urls: LoaderUrls): LoaderUrls | undefined {
  const regexPath = /github.com\/([^\/]*\/[^\/]*)/g
  const pathMatch = regexPath.exec(urls.webUrl)
  const webPath = pathMatch ? pathMatch[1] : ''
  const id = webPath.split('/')[0]

  if (strNotEqualWith(id, [
    'issues', 'pulls', 'marketplace', 'explore', 'settings',
    'notifications', 'discussions', 'sponsors', 'organizations',
  ]))
    return { ...urls, webPath }

  return undefined
}

async function getRepoInfo(urls: LoaderUrls, header: Record<string, string> = { 'User-Agent': USER_AGENT }): Promise<FetchWebsite> {
  let title = ''
  let content = ''
  let url = urls.webUrl
  const githubMeta: GithubMeta = {
    domain: '',
    website: '',
  }
  const githubRepo = urls.webPath
  try {
    if (githubRepo) {
      // fetch repo info
      const repoJson = await fetchGet<any>(`${GITHUB_REPOS_API}/${githubRepo}`, header)
      // fetch languages
      const languagesJson = await fetchGet(`${GITHUB_REPOS_API}/${githubRepo}/languages`, header)
      // fetch readme
      const readmeRes = await fetchGet<string>(`${GITHUB_RAW_URL}/${githubRepo}/${repoJson.default_branch}/README.md`, header, undefined, false)
      const readme = (readmeRes as NotThrowError).error ? '' : readmeRes

      const description = repoJson.description
      title = `Repo · ${repoJson.full_name}`
      url = repoJson.html_url
      const tags = repoJson.topics

      if (tags && tags.length > 0)
        githubMeta.tags = tags

      if (languagesJson)
        githubMeta.languages = Object.keys(languagesJson)

      const imageBaseUrl = urls.picBed || PICTURE_BED_URL
      if (imageBaseUrl) {
        const user = repoJson.owner.login
        const repo = repoJson.name
        const body = {
          username: user,
          reponame: repo,
          stargazers_count: repoJson.stargazers_count,
          language: repoJson.language,
          issues: repoJson.open_issues_count,
          forks: repoJson.forks_count,
          description,
        }
        const imageUrl = `${imageBaseUrl}/github`
        const imageJson = await fetchPost<PicBedRes>(imageUrl, {
          ...header,
          'Content-Type': 'application/json',
        }, body)

        githubMeta.cover = (imageJson as PicBedRes).url
      }

      content = `${title}\n\n${readme}`
    }
    else {
      return { error: 'Github error: Not supported website.' }
    }
    return { data: { title, url, content, meta: githubMeta } }
  }
  catch (error) {
    return { error: `Github error: ${error as FetchError}` }
  }
}

export const pathInfo: PathInfo = {
  name: 'Repo Info',
  author: '[StarNexus](https://github.com/LarchLiu/star-nexus)',
  sample: 'LarchLiu/star-nexus',
  filter: repoFilter,
  loader: getRepoInfo,
}
