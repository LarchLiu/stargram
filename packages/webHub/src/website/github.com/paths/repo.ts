import type { GithubRepoMeta, PathInfo, WebInfoData, WebLoaderUrls } from '@starnexus/core'
import { strNotEqualWith } from '@starnexus/core'
import { $fetch } from 'ofetch'
import { GITHUB_RAW_URL, GITHUB_REPOS_API, USER_AGENT } from '../../../const'

function repoFilter(urls: WebLoaderUrls): WebLoaderUrls | undefined {
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

async function getRepoInfo(urls: WebLoaderUrls, headers: Record<string, string> = { 'User-Agent': USER_AGENT }): Promise<WebInfoData> {
  let title = ''
  let content = ''
  let url = urls.webUrl
  const meta: GithubRepoMeta = {}
  const repo = urls.webPath

  if (repo) {
    meta.prompts = 'The Github repo info'
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
    throw new Error('Github Repo error: No repo path.')
  }
  return { title, url, content, meta }
}

export const pathInfo: PathInfo = {
  name: 'Github Repo Info',
  author: '[StarNexus](https://github.com/LarchLiu/star-nexus)',
  sample: 'LarchLiu/star-nexus',
  filter: repoFilter,
  loader: getRepoInfo,
}
