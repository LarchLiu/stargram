// server/api/webcard.ts

import { unfurl } from 'unfurl.js'
import type { SatoriOptions } from 'satori'
import { createClient } from '@supabase/supabase-js'
import type { TwitterTweetMeta, WebsiteInfo } from '@starnexus/core'
import { satori } from '~/composables/satori'
import WebCard from '~/components/WebCard/WebCard.vue'
import { initBaseFonts, languageFontMap, loadDynamicFont } from '~/composables/font'
import { getIconCode, loadEmoji } from '~/composables/twemoji'

const SUPABASE_URL = process.env.SUPABASE_URL
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/pics-bed`

export default eventHandler(async (event) => {
  const webInfo = await readBody<WebsiteInfo>(event)
  const webMeta = webInfo.meta
  let meta
  let props
  let screenName = ''
  let status = ''
  const res = await unfurl(webInfo.url)

  if (webMeta.website === 'Github') {
    if (res.open_graph && res.open_graph.images) {
      return {
        url: res.open_graph.images[0].url,
      }
    }
  }
  else if (webMeta.website === 'Twitter') {
    meta = webMeta as TwitterTweetMeta
    screenName = meta.screenName!
    status = meta.status!
    const content = meta.content!
    let contentArr = content.split('\n').filter((l: string) => l !== '').map((l: string, i: number) =>
      i < 7 ? l : '...')

    if (contentArr.length > 7)
      contentArr = contentArr.slice(0, 8)

    props = {
      avator: meta.avator,
      name: meta.name,
      screenName: meta.screenName,
      content: contentArr,
      pubTime: meta.pubTime,
      favicon: res.favicon,
    }
  }
  const fonts = await initBaseFonts()
  const svg = await satori(WebCard, {
    props,
    width: 1200,
    height: 630,
    fonts,
    loadAdditionalAsset: async (code, text) => {
      if (code === 'emoji') {
        return (
          `data:image/svg+xml;base64,${
         btoa(await loadEmoji('twemoji', getIconCode(text)))}`
        )
      }
      // return fonts
      const codes = code.split('|')

      // Try to load from Google Fonts.
      const names = codes
        .map(code => languageFontMap[code as keyof typeof languageFontMap])
        .filter(Boolean)

      if (names.length === 0)
        return [] as SatoriOptions['fonts']

      const fontsName: string[] = []
      for (const name of names.flat())
        fontsName.push(name)

      try {
        const data = await loadDynamicFont(text, fontsName)
        const fonts: SatoriOptions['fonts'] = []

        // Decode the encoded font format.
        const decodeFontInfoFromArrayBuffer = (buffer: ArrayBuffer) => {
          let offset = 0
          const bufferView = new Uint8Array(buffer)

          while (offset < bufferView.length) {
            // 1 byte for font name length.
            const languageCodeLength = bufferView[offset]

            offset += 1
            let languageCode = ''
            for (let i = 0; i < languageCodeLength; i++)
              languageCode += String.fromCharCode(bufferView[offset + i])

            offset += languageCodeLength

            // 4 bytes for font data length.
            const fontDataLength = new DataView(buffer).getUint32(offset, false)
            offset += 4
            const fontData = buffer.slice(offset, offset + fontDataLength)
            offset += fontDataLength

            fonts.push({
              name: `satori_${languageCode}_fallback_${text}`,
              data: fontData,
              weight: 400,
              style: 'normal',
              lang: languageCode === 'unknown' ? undefined : languageCode,
            })
          }
        }

        decodeFontInfoFromArrayBuffer(data)

        return fonts
        // }
        // return []
      }
      catch (e) {
        console.error('Failed to load dynamic font for', text, '. Error:', e)
        return []
      }
    },
  })
  // setHeader(event, 'Content-Type', 'image/svg+xml')

  // return svg

  setHeader(event, 'Content-Type', 'application/json')

  try {
    const supabaseAdminClient = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_ANON_KEY ?? '',
    )
    const pngPath = `twitter/${screenName}/${status}.svg`

    // Upload image to storage.
    if (svg) {
      const storageResponse = await fetch(`${STORAGE_URL}/${pngPath}?v=starnexus`)
      if (storageResponse.ok) {
        return {
          url: `${STORAGE_URL}/${pngPath}?v=starnexus`,
        }
      }
      else {
        const { error } = await supabaseAdminClient.storage
          .from(process.env.SUPABASE_STORAGE_BUCKET || 'pics-bed')
          .upload(pngPath, svg, {
            contentType: 'image/svg+xml',
            cacheControl: '31536000',
            upsert: false,
          })

        if (error)
          throw error
      }

      return {
        url: `${STORAGE_URL}/${pngPath}?v=starnexus`,
      }
    }
    else {
      return {
        url: `${STORAGE_URL}/star-nexus.png?v=3`,
      }
    }
  }
  catch (error: any) {
    setResponseStatus(event, 400)

    return { error: error.message }
  }
})
