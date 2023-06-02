// https://github.com/sparticleinc/chatgpt-google-summary-extension/blob/main/src/content-script/prompt.ts

import { countWord } from '../utils'

export enum ProviderType {
  ChatGPT = 'chatgpt',
  GPT3 = 'gpt3',
}

export function getSummaryPrompt(transcript = '', providerConfigs?: ProviderType) {
  const text = transcript
    ? transcript
      .replace(/&#39;/g, '\'')
      .replace(/(\r\n)+/g, '\r\n')
      .replace(/(\s{2,})/g, ' ')
      .replace(/^(\s)+|(\s)$/g, '')
    : ''

  return truncateTranscript(text, providerConfigs)
}

// Seems like 15,000 bytes is the limit for the prompt
const textLimit = 14000
// const limit = 1100 // 1000 is a buffer
const countLimit = 800
// const apiLimit = 2000
const apiCountLimit = 1300

function truncateTranscript(str: string, providerConfigs?: ProviderType) {
  let textStr = str

  const textBytes = textToBinaryString(str).length
  if (textBytes > textLimit) {
    const ratio = textLimit / textBytes
    const newStr = str.substring(0, Math.floor(str.length * ratio))
    textStr = newStr
  }

  return truncateTranscriptByToken(textStr, providerConfigs)
}

function truncateTranscriptByToken(str: string, providerConfigs?: ProviderType) {
  // const tokenLimit = providerConfigs === ProviderType.GPT3 ? apiLimit : limit
  const wordCountLimit = providerConfigs === ProviderType.GPT3 ? apiCountLimit : countLimit
  let count = countWord(str)

  if (count > wordCountLimit) {
    let newStr = str
    while (count > wordCountLimit) {
      const k = count - wordCountLimit
      newStr = newStr.substring(0, newStr.length - (k / 2 < 10 ? 10 : k / 2))
      count = countWord(newStr)
      // console.log('in ', k, count)
    }
    // const encoded = encode(newStr)
    // const bytes = encoded.length
    // console.log(count, bytes)

    return newStr
  }

  // const encoded = encode(str)
  // const bytes = encoded.length
  // console.log(count, bytes)

  // if (bytes > tokenLimit) {
  //   const ratio = tokenLimit / bytes
  //   const newStr = str.substring(0, str.length * ratio)
  //   const count = countWord(newStr)
  //   const encoded = encode(newStr)
  //   const _bytes = encoded.length
  //   console.log(count, _bytes)
  //   return newStr
  // }

  return str
}

export function textToBinaryString(str: string) {
  const escstr = decodeURIComponent(encodeURIComponent(escape(str)))
  const binstr = escstr.replace(/%([0-9A-F]{2})/gi, (match, hex) => {
    const i = Number.parseInt(hex, 16)
    return String.fromCharCode(i)
  })
  return binstr
}
