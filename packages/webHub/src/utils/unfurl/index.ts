import { Parser } from 'htmlparser2'
import { $fetch } from '@stargram/core'
import { browserless } from '../browserless'
import UnexpectedError from './unexpectedError'
import { keys, schema } from './schema'
import type { Metadata, Opts } from './types'

interface ParserContext {
  isHtml?: boolean
  isOembed?: boolean
  favicon?: string
  text: string
  title?: string
  tagName?: string
  canonical_url?: string
}

const defaultHeaders = {
  'Accept': 'text/html, application/xhtml+xml',
  'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0',
}

function unfurl(url: string, opts?: Opts): Promise<Metadata> {
  if (opts === undefined)
    opts = {}

  if (opts.constructor.name !== 'Object')
    throw new UnexpectedError(UnexpectedError.BAD_OPTIONS)

  typeof opts.browserless === 'boolean' || (opts.browserless = true)
  typeof opts.headers === 'object' || (opts.headers = defaultHeaders)

  return getPage(url, opts)
    .then(getMetadata(url, opts))
    .then(parse(url))
}

async function getPage(url: string, opts: Opts) {
  const res = await $fetch.raw(url, {
    headers: opts.headers,
  })

  if (res.status !== 200) {
    throw new UnexpectedError({
      ...UnexpectedError.BAD_HTTP_STATUS,
      info: {
        url,
        httpStatus: res.status,
      },
    })
  }

  const contentType = res.headers.get('Content-Type') || ''
  const contentLength = res.headers.get('Content-Length')

  if (/text\/html|application\/xhtml+xml/.test(contentType) === false) {
    throw new UnexpectedError({
      ...UnexpectedError.EXPECTED_HTML,
      info: {
        url,
        contentType,
        contentLength,
      },
    })
  }
  const html = res._data ?? ''

  return html
}

function getMetadata(url: string, opts: Opts) {
  return async function (text: string): Promise<{ metadata: any[], content: string }> {
    const metadata: any[] = []
    const parserContext: ParserContext = { text: '' }
    let content = ''
    if (opts.browserless && opts.browserlessToken)
      content = await browserless(url, opts.browserlessToken)
    let distanceFromRoot = 0

    return new Promise((resolve) => {
      const parser = new Parser({
        onend() {
          if (parserContext.favicon === undefined) {
            metadata.push(['favicon', new URL('/favicon.ico', url).href])
          }
          else {
            metadata.push([
              'favicon',
              new URL(parserContext.favicon, url).href,
            ])
          }

          if (parserContext.canonical_url) {
            metadata.push([
              'canonical_url',
              new URL(parserContext.canonical_url, url).href,
            ])
          }

          resolve({ metadata, content })
        },

        onopentagname(tag: string) {
          parserContext.tagName = tag
        },

        ontext(text: string) {
          if (parserContext.tagName === 'title') {
            // makes sure we haven't already seen the title
            if (parserContext.title !== null) {
              if (parserContext.title === undefined)
                parserContext.title = ''

              parserContext.title += text
            }
          }
        },

        onopentag(
          tagname: string,
          attribs: { [key: string]: string },
        ) {
          distanceFromRoot++

          if (
            tagname === 'link'
            && attribs.href
            && (attribs.rel === 'icon' || attribs.rel === 'shortcut icon')
          )
            parserContext.favicon = attribs.href

          if (
            tagname === 'link'
            && attribs.href
            && attribs.rel === 'canonical'
          )
            parserContext.canonical_url = attribs.href

          let pair: [string, string | string[]] | undefined

          if (tagname === 'meta') {
            if (attribs.name === 'description' && attribs.content) {
              pair = ['description', attribs.content]
            }
            else if (attribs.name === 'author' && attribs.content) {
              pair = ['author', attribs.content]
            }
            else if (attribs.name === 'theme-color' && attribs.content) {
              pair = ['theme_color', attribs.content]
            }
            else if (attribs.name === 'keywords' && attribs.content) {
              const keywords = attribs.content
                .replace(/^[,\s]{1,}|[,\s]{1,}$/g, '') // gets rid of trailing space or sommas
                .split(/,{1,}\s{0,}/) // splits on 1+ commas followed by 0+ spaces

              pair = ['keywords', keywords]
            }
            else if (attribs.property && keys.includes(attribs.property)) {
              const content = attribs.content || attribs.value
              pair = [attribs.property, content]
            }
            else if (attribs.name && keys.includes(attribs.name)) {
              const content = attribs.content || attribs.value
              pair = [attribs.name, content]
            }
          }

          if (pair)
            metadata.push(pair)
        },

        onclosetag(tag: string) {
          distanceFromRoot--
          parserContext.tagName = ''

          if (distanceFromRoot <= 2 && tag === 'title') {
            metadata.push(['title', parserContext.title])
            parserContext.title = ''
          }

          // We want to parse as little as possible so finish once we see </head>
          // if we have not seen a title tag within the head, we scan the entire
          // document instead
          if (tag === 'head' && parserContext.title)
            parser.reset()
        },
      })

      parser.write(text)
      parser.end()
    })
  }
}

function parse(url: string) {
  return function ({ metadata, content }: { metadata: any[], content: string }) {
    const parsed: any = {}
    const ogVideoTags: any[] = []
    const articleTags: any[] = []

    let lastParent

    for (const meta of metadata) {
      const metaKey = meta[0]
      let metaValue = meta[1]

      const item = schema.get(metaKey)
      // decoding html entities
      if (typeof metaValue === 'string')
        metaValue = decodeURI(decodeURI(metaValue.toString()))

      else if (Array.isArray(metaValue))
        metaValue = metaValue.map(val => decodeURI(decodeURI(val)))

      if (!item) {
        parsed[metaKey] = metaValue
        continue
      }

      // special case for video tags which we want to map to each video object
      if (metaKey === 'og:video:tag') {
        ogVideoTags.push(metaValue)
        continue
      }
      if (metaKey === 'article:tag') {
        articleTags.push(metaValue)
        continue
      }

      if (item.type === 'number')
        metaValue = Number.parseInt(metaValue, 10)

      else if (item.type === 'url' && metaValue)
        metaValue = new URL(metaValue, url).href

      if (parsed[item.entry] === undefined)
        parsed[item.entry] = {}

      let target = parsed[item.entry]

      if (item.parent) {
        if (item.category) {
          if (!target[item.parent])
            target[item.parent] = {}

          if (!target[item.parent][item.category])
            target[item.parent][item.category] = {}

          target = target[item.parent][item.category]
        }
        else {
          if (Array.isArray(target[item.parent]) === false)
            target[item.parent] = []

          if (!target[item.parent][target[item.parent].length - 1])
            target[item.parent].push({})

          else if (
            (!lastParent || item.parent === lastParent)
            && target[item.parent][target[item.parent].length - 1]
            && target[item.parent][target[item.parent].length - 1][item.name]
          )
            target[item.parent].push({})

          lastParent = item.parent
          target = target[item.parent][target[item.parent].length - 1]
        }
      }

      // some fields map to the same name so once we have one stick with it
      target[item.name] || (target[item.name] = metaValue)
    }

    if (ogVideoTags.length && parsed.open_graph.videos) {
      parsed.open_graph.videos = parsed.open_graph.videos.map((obj: any) => ({
        ...obj,
        tags: ogVideoTags,
      }))
    }
    if (articleTags.length && parsed.open_graph.articles) {
      parsed.open_graph.articles = parsed.open_graph.articles.map((obj: any) => ({
        ...obj,
        tags: articleTags,
      }))
    }
    if (content)
      parsed.content = content

    return parsed as Metadata
  }
}

export { unfurl }
