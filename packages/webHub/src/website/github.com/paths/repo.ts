import type { FetchError, FetchRes, GithubRepoMeta, LoaderUrls, PathInfo, WebsiteInfo } from '@starnexus/core'
import { fetchGet, strNotEqualWith } from '@starnexus/core'
import { GITHUB_RAW_URL, GITHUB_REPOS_API, USER_AGENT } from '../../../const'

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

async function getRepoInfo(urls: LoaderUrls, headers: Record<string, string> = { 'User-Agent': USER_AGENT }): Promise<FetchRes<WebsiteInfo>> {
  let title = ''
  let content = ''
  let url = urls.webUrl
  const meta: GithubRepoMeta = {}
  const repo = urls.webPath
  try {
    if (repo) {
      // fetch repo info
      const { data: repoJson } = await fetchGet<Record<string, any>>(`${GITHUB_REPOS_API}/${repo}`, headers)
      // fetch languages
      const { data: languagesJson } = await fetchGet<Record<string, string>>(`${GITHUB_REPOS_API}/${repo}/languages`, headers)
      if (repoJson) {
      // fetch readme
        const readmeRes = await fetchGet<string>(`${GITHUB_RAW_URL}/${repo}/${repoJson.default_branch}/README.md`, headers, undefined, false)
        const readme = readmeRes.error ? '' : readmeRes.data

        const description = repoJson.description.replace(/:\w+:/g, ' ')
        title = `Repo · ${repoJson.full_name}`
        url = repoJson.html_url
        meta.username = repoJson.owner.login
        meta.reponame = repoJson.name
        meta.description = description

        const tags = repoJson.topics
        if (tags && tags.length > 0)
          meta.tags = tags

        if (languagesJson)
          meta.languages = Object.keys(languagesJson)

        content = `${title}\n\n${readme}`
      }
    }
    else {
      return { error: 'Github error: Not supported website.' }
    }
    return { data: { title, url, content, meta } }
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
