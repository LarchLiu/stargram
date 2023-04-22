import { CONST, ENV } from './env.js'

const SUMMARIZE_PROMPT = 'Summarize this Document first and then Categorize it. The Document is the *Markdown* format. In summary within 200 words. Categories with less than 5 items. Category names should be divided by a comma. Return the summary first and then the categories like this:\n\nSummary: my summary.\n\nCategories: XXX, YYY\n\n The Document is: \n\n'
/**
 * Given a URL, returns information about the website if it is hosted on GitHub.
 *
 * @param {string} text - The URL to fetch information for.
 * @return {Promise<PageData[]>} - A Promise that resolves to the fetched information.
 */
async function getWebsiteInfo(text) {
  const fetchOpt = {
    method: 'GET',
  }
  const regex = /https?:\/\/(github.com|twitter.com|m.weibo.cn)\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/g
  const hostRegex = /https?:\/\/(github.com|twitter.com|m.weibo.cn)\//g
  const match = text.match(regex)
  const infoArr = []
  if (match) {
    for (let i = 0; i < match.length; i++) {
      const url = match[i]
      const host = hostRegex.exec(url)[1]
      const info = {}
      if (host === 'github.com') {
        const headers = {
          'User-Agent': CONST.USER_AGENT,
        }
        const regexGithubPath = /https:\/\/github.com\/([^\/]*\/[^\/]*)/g // match github.com/user/repo/
        const pathMatch = regexGithubPath.exec(url)
        const path = pathMatch ? pathMatch[1] : ''
        if (!path)
          break

        fetchOpt.headers = headers
        const apiUrl = `https://api.github.com/repos/${path}`
        // apiUrl = apiUrl.replace(host, 'api.github.com/repos');
        const repoRes = await fetch(apiUrl, fetchOpt)
        if (repoRes.status === 200) {
          const repoJson = await repoRes.json()
          const readmeUrl = `https://raw.githubusercontent.com/${repoJson.full_name}/${repoJson.default_branch}/README.md`
          let readme = ''
          const readmeRes = await fetch(readmeUrl, fetchOpt)
          if (readmeRes.status === 200)
            readme = await readmeRes.text()

          const description = repoJson.description ? repoJson.description.replace(/:\w+:/g, ' ') : ''
          info.title = repoJson.full_name + (description ? (`: ${description}`) : '')
          info.url = repoJson.html_url
          info.content = `${info.title}\n\n${readme}`
          if (info.content.length > 2000)
            info.content = `${info.content.substring(0, 2000)}...`

          // const tagsJson = await fetch(repoJson.url + '/topics', fetchOpt).then((r) => r.json()).catch((e) => e.message || 'error fetch tags');
          const tags = repoJson.topics
          const languagesJson = await fetch(repoJson.languages_url, fetchOpt).then(r => r.json()).catch(e => e.message || 'error fetch languages')
          const github = {}
          if (tags && tags.length > 0)
            github.tags = tags

          if (languagesJson)
            github.languages = Object.keys(languagesJson)

          const imageBaseUrl = 'https://star-nexus-og.vercel.app/api/github-og.png'
          const user = repoJson.owner.login
          const repo = repoJson.name
          const imageUrl = `${imageBaseUrl}?username=${user}&reponame=${repo}&stargazers_count=${repoJson.stargazers_count}&language=${repoJson.language}&issues=${repoJson.open_issues_count}&forks=${repoJson.forks_count}&description=${description}`
          github.socialPreview = encodeURI(imageUrl)
          info.github = github
          infoArr.push(info)
        }
      }
    }
  }
  return infoArr
}

/**
 * Saves page data to Notion database and returns an object with updated info or an error message.
 * @async
 * @param {PageData} pageData - Object containing data for the page to be saved.
 * @return {Promise<SavedResponse>} - Object containing updated page info or an error message.
 */
async function saveToNotion(pageData) {
  try {
    let summary = ''
    let category = ''
    let catOpt = [{
      name: 'Others',
    }]

    const notionApiKey = ENV.NOTION_API_KEY
    const databaseId = ENV.NOTION_DATABASE_ID
    const openaiApiKey = ENV.API_KEY

    if (!notionApiKey || !databaseId) {
      // console.log('Missing Notion API key or Database ID in settings.')
      const error = { message: 'Missing Notion API key or Database ID in settings.' }
      return error
    }

    if (openaiApiKey) {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: SUMMARIZE_PROMPT,
            },
            {
              role: 'user',
              content: pageData.content,
            },
          ],
          max_tokens: 400,
          temperature: 0.5,
        }),
      })
      if (openaiRes.status !== 200) {
        const res = await openaiRes.json()
        let error = 'Openai API error: '
        if (res.error && res.error.message)
          error += res.error.message

        else
          error += `${openaiRes.status.toString()}`

        return { message: error }
      }

      const openaiData = await openaiRes.json()
      let text = openaiData.choices[0].message.content
      text = text.replace(/\n/g, '')
      const regexSummery = /Summary:(.*)Categories:/g
      const regexCategory = /Categories:(.*)$/g
      const summaryArr = regexSummery.exec(text)
      const categoryArr = regexCategory.exec(text)
      if (summaryArr)
        summary = summaryArr[1].trim()

      if (categoryArr)
        category = categoryArr[1].trim()

      const catArry = (category || 'Others').split(',')
      catOpt = catArry.map((item) => {
        if (item.endsWith('.'))
          item = item.slice(0, -1)

        return {
          name: item,
        }
      })
    }
    else {
      summary = pageData.content
    }

    const body = {
      parent: {
        database_id: databaseId,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: pageData.title,
              },
            },
          ],
        },
        Summary: {
          rich_text: [
            {
              text: {
                content: summary,
              },
            },
          ],
        },
        URL: {
          url: pageData.url,
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
    if (Object.keys(pageData.github).length > 0) {
      const github = pageData.github
      body.properties = {
        ...body.properties,
        Website: {
          select: {
            name: 'Github',
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

    // 创建 Notion 页面并保存信息
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${notionApiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (response.status !== 200) {
      const res = await response.json()
      let error = 'Notion API error: '
      if (res.message)
        error += res.message

      else
        error += `${response.status.toString()} Error creating new page in Notion.`

      return { message: error }
    }
    else {
      // console.log('Created new page in Notion successfully!')
      const newPageResponse = await response.json()
      const newPageId = newPageResponse.id // 获取新页面的 ID

      if (!imageUrl)
        return ({ message: 'success' })

      const imageBlock = {
        object: 'block',
        type: 'embed',
        embed: {
          url: imageUrl,
        },
      }

      const addChildResponse = await fetch(
          `https://api.notion.com/v1/blocks/${newPageId}/children`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Notion-Version': '2022-06-28',
              'Authorization': `Bearer ${notionApiKey}`,
            },
            body: JSON.stringify({
              children: [imageBlock],
            }),
          },
      )

      if (addChildResponse.status !== 200) {
        const res = await response.json()
        let error = 'Notion API error: '
        if (res.message)
          error += res.message

        else
          error += `${response.status.toString()} Error appending child block to Notion page.`

        return { message: error }
      }
      else {
        // console.log('Appended child block to Notion page successfully!')
        return ({ message: 'success' })
      }
    }
  }
  catch (error) {
    return { message: error.message ? error.message : 'Error saving to Notion.' }
  }
}

export {
  getWebsiteInfo,
  saveToNotion,
}
