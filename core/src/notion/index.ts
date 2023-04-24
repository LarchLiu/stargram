import { fetchPost } from '../utils'
import type { FetchNotion, GithubMeta, NotionPage } from '../types'

async function saveToNotion(apiKey: string, info: NotionPage): Promise<FetchNotion> {
  try {
    let catOpt = [{
      name: 'Others',
    }]

    catOpt = info.categories.map((item) => {
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
    let imageUrl = ''
    if (info.meta && Object.keys(info.meta).length > 0 && info.meta.host === 'github.com') {
      const github = info.meta as GithubMeta
      body.properties = {
        ...body.properties,
        Website: {
          select: {
            name: info.meta.website,
          },
        },
      }
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
      if (github.socialPreview)
        imageUrl = github.socialPreview
    }

    // check notion page exists
    const checkData = await fetchPost<any>(`https://api.notion.com/v1/databases/${info.databaseId}/query`,
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
    if (checkData.results.length > 0) {
      if (checkData.results[0].properties.Status.select.name === 'Starred')
        starred = true
      notionPageId = checkData.results[0].id
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
      await fetchPost(`https://api.notion.com/v1/pages/${notionPageId}`,
        {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        }, body, true,
      )

      return { data: { starred: !starred, notionPageId } }
    }

    // create notion page
    const newPageResponse = await fetchPost<any>('https://api.notion.com/v1/pages',
      {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${apiKey}`,
      }, body,
    )

    notionPageId = newPageResponse.id // 获取新页面的 ID

    if (!imageUrl)
      return { data: { starred: !starred, notionPageId } }

    const imageBlock = {
      object: 'block',
      type: 'embed',
      embed: {
        url: imageUrl,
      },
    }

    await fetchPost(`https://api.notion.com/v1/blocks/${notionPageId}/children`,
      {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${apiKey}`,
      },
      {
        children: [imageBlock],
      },
      true,
    )

    return { data: { starred: !starred, notionPageId } }
  }
  catch (err) {
    return { error: `Notion API error: ${err}` }
  }
}

export {
  saveToNotion,
}
