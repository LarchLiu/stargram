import { fetchPost } from '../utils'
import type { FetchRes, GithubRepoMeta, NotionPage, SavedNotion, TwitterTweetMeta } from '../types'
import { GITHUB_DOMAIN, NOTION_API_URL, TWITTER_DOMAIN } from '../const'

async function saveToNotion(apiKey: string, info: NotionPage): Promise<FetchRes<SavedNotion>> {
  try {
    let catOpt = [{
      name: 'Others',
    }]

    catOpt = info.categories.map((item) => {
      item = item.trim()
      if (item.endsWith('.'))
        item = item.slice(0, -1)

      return {
        name: item,
      }
    })

    const body: Record<string, any> = {
      parent: {
        database_id: info.databaseId,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: info.title,
              },
            },
          ],
        },
        Summary: {
          rich_text: [
            {
              text: {
                content: info.summary,
              },
            },
          ],
        },
        URL: {
          url: info.url,
        },
        Categories: {
          multi_select: catOpt,
        },
        Status: {
          select: {
            name: 'Starred',
          },
        },
      },
    }
    let cover = ''
    if (info.meta && Object.keys(info.meta).length > 0) {
      const meta = info.meta
      if (meta.cover) {
        cover = meta.cover
        body.properties = {
          ...body.properties,
          Cover: {
            url: cover,
          },
        }
      }
      body.properties = {
        ...body.properties,
        Website: {
          select: {
            name: meta.website,
          },
        },
      }
      if (info.meta.domain === GITHUB_DOMAIN) {
        const github = meta as GithubRepoMeta
        if (github.languages) {
          const languages = github.languages.map((lang) => {
            return {
              name: lang,
            }
          })
          body.properties = {
            ...body.properties,
            Languages: {
              multi_select: languages,
            },
          }
        }
        if (github.tags) {
          const tags = github.tags.map((tag) => {
            return {
              name: tag,
            }
          })
          body.properties = {
            ...body.properties,
            Tags: {
              multi_select: tags,
            },
          }
        }
      }
      else if (info.meta.domain === TWITTER_DOMAIN) {
        const twitter = meta as TwitterTweetMeta
        if (twitter.tags) {
          const tags = twitter.tags.map((tag) => {
            return {
              name: tag,
            }
          })
          body.properties = {
            ...body.properties,
            Tags: {
              multi_select: tags,
            },
          }
        }
      }
    }

    // check notion page exists
    const checkData = await fetchPost<any>(`${NOTION_API_URL}/databases/${info.databaseId}/query`,
      {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${apiKey}`,
      },
      {
        filter: {
          property: 'URL',
          rich_text: {
            contains: info.url,
          },
        },
      },
    )

    let notionPageId = ''
    let starred = false
    if (checkData.data?.results.length > 0) {
      if (checkData.data.results[0].properties.Status.select.name === 'Starred')
        starred = true
      notionPageId = checkData.data.results[0].id
    }

    if (notionPageId) {
      body.properties = {
        ...body.properties,
        Status: {
          select: {
            name: starred ? 'Unstarred' : 'Starred',
          },
        },
      }
      // update notion page info
      await fetchPost(`${NOTION_API_URL}/pages/${notionPageId}`,
        {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        }, body, true,
      )

      return { data: { starred: !starred, notionPageId } }
    }

    if (cover) {
      const imageBlock = {
        object: 'block',
        image: {
          external: {
            url: cover,
          },
        },
      }
      body.children = [imageBlock]
    }
    // create notion page
    const newPageResponse = await fetchPost<any>(`${NOTION_API_URL}/pages`,
      {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${apiKey}`,
      }, body,
    )

    notionPageId = newPageResponse.data?.id // 获取新页面的 ID

    return { data: { starred: !starred, notionPageId } }
  }
  catch (err) {
    return { error: `Notion API error: ${err}` }
  }
}

export {
  saveToNotion,
}
