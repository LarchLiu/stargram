import { $fetch } from 'ofetch'
import type { CommonMeta, GithubRepoMeta, TwitterTweetMeta, WebInfoData } from '@stargram/core'
import type { StorageImage } from '@stargram/core/storage'
import { errorMessage } from '@stargram/core/utils'
import TweetCard from './TweetCard.vue'
import CommonCard from './CommonCard.vue'

export async function createWebCard(webInfo: WebInfoData): Promise<StorageImage> {
  try {
    const webMeta = webInfo.meta
    let imgPath = ''
    let meta
    let props
    let card: Component | undefined
    let svg = ''
    let ogImage: Blob | undefined

    if (webMeta.siteName === 'Github') {
      meta = webMeta as GithubRepoMeta
      imgPath = `${webMeta.domain}/${meta.username}/${meta.reponame}.png`
      if (meta.ogImage)
        ogImage = await $fetch(meta.ogImage, { responseType: 'blob' })
    }
    else if (webMeta.siteName === 'Twitter') {
      card = TweetCard
      meta = webMeta as TwitterTweetMeta
      const screenName = meta.screenName!
      const status = meta.status!
      imgPath = `${webMeta.domain}/${screenName}/${status}.svg`
      const content = meta.content!
      let contentArr = content.split('\n').filter((l: string) => l !== '').map((l: string, i: number) =>
        i < 7 ? l : '...')

      if (contentArr.length > 7)
        contentArr = contentArr.slice(0, 8)

      props = {
        avatar: meta.avatar,
        name: meta.name,
        screenName: meta.screenName,
        content: contentArr,
        pubTime: meta.pubTime,
        lang: meta.lang, // TODO: change to satori lang type
      }
    }
    else {
      card = CommonCard
      meta = webMeta as CommonMeta
      const content = webInfo.content || 'No Content'
      let contentArr = content.split('\n').filter((l: string) => l !== '').map((l: string, i: number) =>
        i < 7 ? l : '...')

      if (contentArr.length > 7)
        contentArr = contentArr.slice(0, 8)

      const favicon = meta.favicon || ''
      props = {
        title: webInfo.title,
        content: contentArr,
        favicon,
      }
      const url = webInfo.url.replace(/https?:\/\/[^/]+\/?/, '')
      const filename = url.replace(/[<|>|:|"|\\|\/|\.|?|*|#|&|%|~|'|"]/g, '')
      imgPath = `${webMeta.domain}/${filename}.svg`
      if (meta.ogImage)
        ogImage = await $fetch(meta.ogImage, { responseType: 'blob' })
    }

    if (!imgPath)
      throw new Error(`No image path for ${webMeta.siteName}`)

    if (!ogImage) {
      if (!card)
        throw new Error(`No WebCard template for ${webMeta.siteName}`)

      const fonts = await initBasicFonts()
      svg = await satori(card, {
        props,
        width: 1200,
        height: 630,
        fonts,
        loadAdditionalAsset: async (code, text) => loadDynamicAsset('twemoji', code, text),
      })
      return {
        imgData: svg,
        imgPath,
      }
    }

    return {
      imgData: ogImage,
      imgPath,
    }
  }
  catch (error) {
    const message = errorMessage(error)
    throw new Error(message)
  }
}
