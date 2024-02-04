import type { GithubRepoMeta, PathInfo, WebInfoData, WebLoaderParams, WebLoaderUrls } from '@stargram/core'
import { strNotEqualWith } from '@stargram/core/utils'
import { $fetch } from '@stargram/core'
import { GITHUB_RAW_URL, GITHUB_REPOS_API, USER_AGENT } from '../../../const'
import { unfurl } from '../../../utils/unfurl'

function repoFilter(urls: WebLoaderUrls): WebLoaderUrls | undefined {
  const regexPath = /github.com\/([^\/]*\/[^\/]*)/g
  const pathMatch = regexPath.exec(urls.webUrl)
  const webPath = pathMatch ? pathMatch[1] : ''
  const id = webPath.split('/')[0]

  if (strNotEqualWith(id, [
    'issues',
    'pulls',
    'marketplace',
    'explore',
    'settings',
    'notifications',
    'discussions',
    'sponsors',
    'organizations',
  ]))
    return { ...urls, webPath }

  return undefined
}

async function getRepoInfo(params: WebLoaderParams): Promise<WebInfoData> {
  let title = ''
  let content = ''
  let url = params.urls.webUrl
  const meta: GithubRepoMeta = {}
  const repo = params.urls.webPath
  const headers = params.headers || { 'User-Agent': USER_AGENT }

  if (repo) {
    meta.prompts = 'The Github repo info'
    const webJson = await unfurl(url, { browserless: false })
    if (webJson) {
      const openGraph = webJson.open_graph
      if (openGraph && openGraph.images)
        meta.ogImage = openGraph.images[0].url
    }
    // fetch repo info
    const repoJson = await $fetch<Record<string, any>>(`${GITHUB_REPOS_API}/${repo}`, { method: 'GET', headers })
    // fetch languages
    const languagesJson = await $fetch<Record<string, string>>(`${GITHUB_REPOS_API}/${repo}/languages`, { method: 'GET', headers })
    if (repoJson) {
      // fetch readme
      let readme = ''
      const readmeRes = await $fetch<string>(`${GITHUB_RAW_URL}/${repo}/${repoJson.default_branch}/README.md`, { method: 'GET', headers })
        .catch(_ => '')
      readme = readmeRes

      const description = repoJson.description ? repoJson.description.replace(/:\w+:/g, ' ') : ''
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
    throw new Error('Github Repo error: No repo path.')
  }
  return { title, url, content, meta }
}

export const pathInfo: PathInfo = {
  name: 'Github Repo Info',
  author: '[Stargram](https://github.com/LarchLiu/stargram)',
  sample: 'LarchLiu/stargram',
  filter: repoFilter,
  loader: getRepoInfo,
}
