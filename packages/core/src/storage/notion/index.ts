import { $fetch } from 'ofetch'
import type { GithubRepoMeta, NotionDataConfig, NotionPage, SavedNotion, TwitterTweetMeta, WebsiteMeta } from '../../types'
import { GITHUB_DOMAIN, NOTION_API_URL, TWITTER_DOMAIN } from '../../const'
import { DataStorage } from '../types'
import type { ReturnStorageData, StorageData, StorageType } from '../types'

export class NotionDataStorage extends DataStorage<NotionDataConfig, SavedNotion> {
  constructor(config: NotionDataConfig, data?: StorageData) {
    super(config, data)
  }

  async create(data?: StorageData) {
    if (!data && !this.data)
      throw new Error('DataStorage error: No Storage Data')

    const storageData = (data || this.data)!

    const notion: NotionPage = {
      title: storageData.title,
      summary: storageData.summary,
      url: storageData.url,
      categories: storageData.categories,
      status: 'Starred',
      meta: storageData.meta,
    }
    return await saveToNotion(this.config, notion)
  }

  async update(savedData: SavedNotion, data?: StorageData) {
    if (!data && !this.data)
      throw new Error('DataStorage error: No Storage Data')

    const storageData = (data || this.data)!

    const notion: NotionPage = {
      title: storageData.title,
      summary: storageData.summary,
      url: storageData.url,
      categories: storageData.categories,
      status: 'Starred',
      meta: storageData.meta,
    }
    return await updateToNotion(savedData, this.config, notion)
  }

  async query(url: string) {
    const checkData = await $fetch<any>(`${NOTION_API_URL}/databases/${this.config.databaseId}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: {
        filter: {
          property: 'URL',
          rich_text: {
            contains: url,
          },
        },
      },
    })
    if (checkData.results.length > 0) {
      let starred = false
      let storageId = ''
      if (checkData.results[0].properties.Status.select.name === 'Starred')
        starred = true
      storageId = checkData.results[0].id
      return {
        starred, storageId,
      }
    }
    else { return undefined }
  }

  async updateOgImage(info: SavedNotion, url: string) {
    return await updateOgImage(this.config, info.storageId, url)
  }

  getConfig(): NotionDataConfig {
    return this.config
  }

  getType(): StorageType {
    return {
      type: 'DataStorage',
      name: 'NotionDataStorage',
    }
  }

  async list(pageSize: number, startCursor?: string): Promise<{ data: ReturnStorageData[]; nextPage: string | undefined }> {
    const body = startCursor
      ? {
          page_size: pageSize,
          start_cursor: startCursor,
        }
      : {
          page_size: pageSize,
        }
    const checkData = await $fetch<any>(`${NOTION_API_URL}/databases/${this.config.databaseId}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body,
    })
    const res = {
      data: [] as ReturnStorageData[],
      nextPage: checkData.has_more && checkData.next_cursor ? checkData.next_cursor as string : undefined,
    }
    if (checkData.results.length > 0) {
      checkData.results.forEach((item: any) => {
        res.data.push({
          id: item.id,
          title: item.properties.Title.title[0].plain_text as string,
          summary: item.properties.Summary.rich_text[0].plain_text as string,
          url: item.properties.URL.url as string,
          categories: item.properties.Categories.multi_select.map((i: any) => {
            return i.name
          }) as string[],
          content: item.properties.Summary.rich_text[0].plain_text as string,
          meta: {
            ogImage: item.properties.OgImage.url as string,
            siteName: item.properties.Website.select.name as string,
          } as WebsiteMeta,
        })
      })
    }
    return res
  }
}

export async function saveToNotion(config: NotionDataConfig, info: NotionPage): Promise<SavedNotion> {
  const apiKey = config.apiKey
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
      database_id: config.databaseId,
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
  let ogImage = config.defaultOgImage
  if (info.meta && Object.keys(info.meta).length > 0) {
    const meta = info.meta
    if (meta.savedImage)
      ogImage = meta.savedImage

    body.properties = {
      ...body.properties,
      OgImage: {
        url: ogImage,
      },
    }
    body.properties = {
      ...body.properties,
      Website: {
        select: {
          name: meta.siteName,
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

  let storageId = ''
  const starred = false

  // // check notion page exists
  // const checkData = await $fetch<any>(`${NOTION_API_URL}/databases/${config.databaseId}/query`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Notion-Version': '2022-06-28',
  //     'Authorization': `Bearer ${apiKey}`,
  //   },
  //   body: {
  //     filter: {
  //       property: 'URL',
  //       rich_text: {
  //         contains: info.url,
  //       },
  //     },
  //   },
  // })

  // if (checkData.results.length > 0) {
  //   if (checkData.results[0].properties.Status.select.name === 'Starred')
  //     starred = true
  //   storageId = checkData.results[0].id
  // }

  // if (storageId) {
  //   body.properties = {
  //     ...body.properties,
  //     Status: {
  //       select: {
  //         name: starred ? 'Unstarred' : 'Starred',
  //       },
  //     },
  //   }
  //   // update notion page info
  //   await $fetch(`${NOTION_API_URL}/pages/${storageId}`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Authorization': `Bearer ${apiKey}`,
  //       'Notion-Version': '2022-06-28',
  //       'Content-Type': 'application/json',
  //     },
  //     body,
  //   })

  //   return { starred: !starred, storageId }
  // }

  if (ogImage) {
    const imageBlock = {
      object: 'block',
      image: {
        external: {
          url: ogImage,
        },
      },
    }
    body.children = [imageBlock]
  }
  // create notion page
  const newPageResponse = await $fetch<any>(`${NOTION_API_URL}/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
      'Authorization': `Bearer ${apiKey}`,
    },
    body,
  })

  storageId = newPageResponse.id

  return { starred: !starred, storageId }
}

export async function updateToNotion(savedData: SavedNotion, config: NotionDataConfig, info: NotionPage): Promise<SavedNotion> {
  const apiKey = config.apiKey
  const storageId = savedData.storageId
  const starred = savedData.starred
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
      database_id: config.databaseId,
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
          name: starred ? 'Unstarred' : 'Starred',
        },
      },
    },
  }
  let ogImage = config.defaultOgImage
  if (info.meta && Object.keys(info.meta).length > 0) {
    const meta = info.meta
    if (meta.savedImage)
      ogImage = meta.savedImage

    body.properties = {
      ...body.properties,
      OgImage: {
        url: ogImage,
      },
    }
    body.properties = {
      ...body.properties,
      Website: {
        select: {
          name: meta.siteName,
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

  // update notion page info
  await $fetch(`${NOTION_API_URL}/pages/${storageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body,
  })

  return { starred: !starred, storageId }
}

export async function updateOgImage(config: NotionDataConfig, storageId: string, url: string) {
  const checkData = await $fetch<any>(`${NOTION_API_URL}/blocks/${storageId}/children`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
      'Authorization': `Bearer ${config.apiKey}`,
    },
  })

  let blockId = ''
  if (checkData.results.length > 0) {
    const data = checkData.results
    const len = data.length
    for (let i = 0; i < len; i++) {
      if (data[i].type === 'image' && data[i].image.type === 'external' && data[i].image.external.url.includes('stargramogimage')) {
        blockId = data[i].id
        break
      }
    }
  }
  await $fetch(`${NOTION_API_URL}/pages/${storageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: {
      properties: {
        OgImage: {
          url,
        },
      },
    },
  })
  if (blockId) {
    await $fetch(`${NOTION_API_URL}/blocks/${blockId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: {
        image: {
          external: {
            url,
          },
        },
      },
    })
  }
  return {
    url,
  }
}
