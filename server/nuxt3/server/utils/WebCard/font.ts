import { $fetch } from 'ofetch'
import type { SatoriOptions } from 'satori'
import type { apis } from './twemoji'
import { getIconCode, loadEmoji } from './twemoji'

type UnicodeRange = Array<number | number[]>

export class FontDetector {
  private rangesByLang: {
    [font: string]: UnicodeRange
  } = {}

  public async detect(
    text: string,
    fonts: string[],
  ): Promise<{
    [lang: string]: string
  }> {
    await this.load(fonts)

    const result: {
      [lang: string]: string
    } = {}

    for (const segment of text) {
      const lang = this.detectSegment(segment, fonts)
      if (lang) {
        result[lang] = result[lang] || ''
        result[lang] += segment
      }
    }

    return result
  }

  private detectSegment(segment: string, fonts: string[]): string | null {
    for (const font of fonts) {
      const range = this.rangesByLang[font]
      if (range && checkSegmentInRange(segment, range))
        return font
    }

    return null
  }

  private async load(fonts: string[]): Promise<void> {
    let params = ''

    const existingLang = Object.keys(this.rangesByLang)
    const langNeedsToLoad = fonts.filter(font => !existingLang.includes(font))

    if (langNeedsToLoad.length === 0)
      return

    for (const font of langNeedsToLoad)
      params += `family=${font}&`

    params += 'display=swap'

    const API = `https://fonts.googleapis.com/css2?${params}`

    const fontFace: string = await $fetch(API, {
      headers: {
        // Make sure it returns TTF.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      },
    })

    this.addDetectors(fontFace)
  }

  private addDetectors(input: string) {
    const regex = /font-family:\s*'(.+?)';.+?unicode-range:\s*(.+?);/gms
    const matches = input.matchAll(regex)

    for (const [, _lang, range] of matches) {
      const lang = _lang.replaceAll(' ', '+')
      if (!this.rangesByLang[lang])
        this.rangesByLang[lang] = []

      this.rangesByLang[lang].push(...convert(range))
    }
  }
}

function convert(input: string): UnicodeRange {
  return input.split(', ').map((range) => {
    range = range.replaceAll('U+', '')
    const [start, end] = range.split('-').map(hex => parseInt(hex, 16))

    if (isNaN(end))
      return start

    return [start, end]
  })
}

function checkSegmentInRange(segment: string, range: UnicodeRange): boolean {
  const codePoint = segment.codePointAt(0)

  if (!codePoint)
    return false

  return range.some((val) => {
    if (typeof val === 'number') {
      return codePoint === val
    }
    else {
      const [start, end] = val
      return start <= codePoint && codePoint <= end
    }
  })
}

// @TODO: Support font style and weights, and make this option extensible rather
// than built-in.
// @TODO: Cover most languages with Noto Sans.
export const languageFontMap = {
  'zh-CN': 'Noto+Sans+SC',
  'zh-TW': 'Noto+Sans+TC',
  'zh-HK': 'Noto+Sans+HK',
  'ja-JP': 'Noto+Sans+JP',
  'ko-KR': 'Noto+Sans+KR',
  'th-TH': 'Noto+Sans+Thai',
  'bn-IN': 'Noto+Sans+Bengali',
  'ar-AR': 'Noto+Sans+Arabic',
  'ta-IN': 'Noto+Sans+Tamil',
  'ml-IN': 'Noto+Sans+Malayalam',
  'he-IL': 'Noto+Sans+Hebrew',
  'te-IN': 'Noto+Sans+Telugu',
  'devanagari': 'Noto+Sans+Devanagari',
  'kannada': 'Noto+Sans+Kannada',
  'symbol': ['Noto+Sans+Symbols', 'Noto+Sans+Symbols+2'],
  'math': 'Noto+Sans+Math',
  'unknown': 'Noto+Sans',
}

const detector = new FontDetector()

// Our own encoding of multiple fonts and their code, so we can fetch them in one request. The structure is:
// [1 byte = X, length of language code][X bytes of language code string][4 bytes = Y, length of font][Y bytes of font data]
// Note that:
// - The language code can't be longer than 255 characters.
// - The language code can't contain non-ASCII characters.
// - The font data can't be longer than 4GB.
// When there are multiple fonts, they are concatenated together.
function encodeFontInfoAsArrayBuffer(code: string, fontData: ArrayBuffer) {
  // 1 byte per char
  const buffer = new ArrayBuffer(1 + code.length + 4 + fontData.byteLength)
  const bufferView = new Uint8Array(buffer)
  // 1 byte for the length of the language code
  bufferView[0] = code.length
  // X bytes for the language code
  for (let i = 0; i < code.length; i++)
    bufferView[i + 1] = code.charCodeAt(i)

  // 4 bytes for the length of the font data
  new DataView(buffer).setUint32(1 + code.length, fontData.byteLength, false)

  // Y bytes for the font data
  bufferView.set(new Uint8Array(fontData), 1 + code.length + 4)

  return buffer
}

async function fetchFont(
  text: string,
  font: string,
): Promise<ArrayBuffer | null> {
  const API = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text,
  )}`

  const css: string = await $fetch(API, {
    headers: {
      // Make sure it returns TTF.
      'User-Agent':
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
    },
  })

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (!resource)
    return null

  const res: ArrayBuffer = await $fetch(resource[1], { responseType: 'arrayBuffer' })

  return res // arrayBuffer()
}

export async function loadDynamicFont(text: string, fonts: string[]) {
  const textByFont = await detector.detect(text, fonts)

  const _fonts = Object.keys(textByFont)

  const encodedFontBuffers: ArrayBuffer[] = []
  let fontBufferByteLength = 0
  ;(
    await Promise.all(_fonts.map(font => fetchFont(textByFont[font], font)))
  ).forEach((fontData, i) => {
    if (fontData) {
      // TODO: We should be able to directly get the language code here :)
      const langCode = Object.entries(languageFontMap).find(
        ([, v]) => v === _fonts[i],
      )?.[0]

      if (langCode) {
        const buffer = encodeFontInfoAsArrayBuffer(langCode, fontData)
        encodedFontBuffers.push(buffer)
        fontBufferByteLength += buffer.byteLength
      }
    }
  })

  const responseBuffer = new ArrayBuffer(fontBufferByteLength)
  const responseBufferView = new Uint8Array(responseBuffer)
  let offset = 0
  encodedFontBuffers.forEach((buffer) => {
    responseBufferView.set(new Uint8Array(buffer), offset)
    offset += buffer.byteLength
  })

  return responseBuffer
}

const cache = new Map()

function withCache(fn: Function) {
  return async (emojiType: string, code: string, text: string) => {
    const key = `${emojiType}:${code}:${text}`
    if (cache.has(key))
      return cache.get(key)
    const result = await fn(emojiType, code, text)
    cache.set(key, result)
    return result
  }
}

async function loadAsset(emojiType: keyof typeof apis, code: string, text: string) {
  if (code === 'emoji') {
    return (
    `data:image/svg+xml;base64,${btoa(await loadEmoji(emojiType, getIconCode(text)))}`
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
    const fonts: SatoriOptions['fonts'] = []
    // const data = await loadDynamicFont(text, fontsName)
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

    const data = await loadDynamicFont(text, fontsName)
    decodeFontInfoFromArrayBuffer(data)

    return fonts
  }
  catch (e) {
    console.error('Failed to load dynamic font for', text, '. Error:', e)
    return []
  }
}

export const loadDynamicAsset = withCache(loadAsset)

export async function initBaseFonts() {
  // const interRegPath = join(process.cwd(), 'public', 'fonts', 'Inter-Regular.ttf')
  // const InterReg = await fs.readFile(resolve(__dirname, '../../../assets/fonts/Inter-Regular.ttf'))
  // const interBoldPath = join(process.cwd(), 'public', 'fonts', 'Inter-Bold.ttf')
  // const InterBold = await fs.readFile(resolve(__dirname, '../../../assets/fonts/Inter-Bold.ttf'))
  // const scPath = join(process.cwd(), 'public', 'fonts', 'NotoSansSC-Regular.otf')
  // const NotoSansSC = await fs.readFile(resolve(__dirname, '../../../assets/fonts/NotoSansSC-Regular.otf'))
  // const jpPath = join(process.cwd(), 'public', 'fonts', 'NotoSansJP-Regular.ttf')
  // const NotoSansJP = await fs.readFile(jpPath)
  // const uniPath = join(process.cwd(), 'public', 'fonts', 'unifont-15.0.01.otf')
  // const Unifont = await fs.readFile(uniPath)
  // const path = join(process.cwd(), 'public', 'fonts', 'MPLUS1p-Regular.ttf')
  // const fontData = await fs.readFile(path)
  const fontData = await $fetch('https://unpkg.com/@fontsource/inter@4.5.2/files/inter-latin-ext-400-normal.woff', { responseType: 'arrayBuffer' })
  return [
    // {
    //   name: 'Noto Sans SC',
    //   data: NotoSansSC,
    //   weight: 400,
    //   style: 'normal',
    // },
    {
      name: 'Inter',
      data: fontData,
      weight: 400,
      style: 'normal',
    },
    // {
    //   name: 'Inter',
    //   data: InterBold,
    //   weight: 700,
    //   style: 'normal',
    // },
    // {
    //   name: 'M Plus 1p',
    //   data: fontData,
    //   weight: 400,
    //   style: 'normal',
    // },
  ] as SatoriOptions['fonts']
}
