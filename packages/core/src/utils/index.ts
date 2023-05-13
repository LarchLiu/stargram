function getDomain(url: string) {
  const match = url.match(/(https?:\/\/)?([a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?)[-a-zA-Z0-9()@:%_\\\+\.~#?&//=]*/i)
  let host = ''
  if (match && match[2])
    host = match[2]

  const arr = host.split('.')
  host = arr.slice(-2).join('.')

  return host
}

/**
 * Word Count
 *
 * Word count in respect of CJK characters.
 *
 * Copyright (c) 2015 - 2016 by Hsiaoming Yang.
 *
 * https://github.com/yuehu/word-count
 */
const pattern = /[a-zA-Z0-9_\u0392-\u03C9\u00C0-\u00FF\u0600-\u06FF\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]+/g
function countWord(data: string): number {
  const m = data.match(pattern)
  let count = 0
  if (!m)
    return 0

  for (let i = 0; i < m.length; i++) {
    if (m[i].charCodeAt(0) >= 0x4E00)
      count += m[i].length
    else
      count += 1
  }
  return count
}

function preprocessText(text: string) {
  // 去除多余标点符号
  text = text.replace(/,+,/g, ', ')
  // 处理图片标签 <img src="..." />
  const imgRegex = /<img src="(.+)" \/>/g
  text = text.replace(imgRegex, '![$1]($1)')
  // 处理超链接 <a href="...">...</a>
  const linkRegex = /<a href="(.+)">(.+)<\/a>/g
  text = text.replace(linkRegex, '[$2]($1)')
  // 删除 Markdown 图片语法 ![alt](src)
  text = text.replace(/!\[.+?\]\(.+?\)/g, '')
  // 处理 HTML 标签
  text = text.replace(/<(?:.|\n)*?>/gm, '')
  text = text.replace(/<\/(?:.|\n)*?>/gm, '')
  // 删除标题语法 #
  text = text.replace(/#+\s/g, '')
  // 删除中间多余的空格
  text = text.replace(/\s+/g, ' ')
  // 删除两行及两行以上的空行
  text = text.replace(/\n{2,}/g, '\n')
  // 去除空白符
  text = text.trim()

  text = replaceHtmlReservedCharacters(text)
  return text
}

function getPromptsByTemplate(template: string, kv: Record<string, string>) {
  let prompts = template
  if (template && Object.keys(kv).length) {
    for (const key in kv)
      prompts = prompts.replaceAll(`{${key}}`, kv[key])
  }
  return prompts
}

function strNotEqualWith(key: string, values: string[]): boolean {
  if (key) {
    if (values.length === 0)
      return true

    for (let i = 0; i < values.length; i++) {
      if (key === values[i])
        return false
    }
    return true
  }
  else {
    return false
  }
}

const ESCAPE_CHARS: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&#60;': '<',
  '&#62;': '>',
  '&le;': '≤',
  '&#8804;': '≤',
  '&ge;': '≥',
  '&#8805;': '≥',
  '&quot;': '"',
  '&#34;': '"',
  '&trade;': '™',
  '&#8482;': '™',
  '&asymp;': '≈',
  '&#8776;': '≈',
  '&ndash;': '-',
  '&#8211;': '-',
  '&mdash;': '—',
  '&#8212;': '—',
  '&copy;': '©',
  '&#169;': '©',
  '&reg;': '®',
  '&#174;': '®',
  '&ne;': '≠',
  '&#8800;': '≠',
  '&pound;': '£',
  '&#163;': '£',
  '&euro;': '€',
  '&#8364;': '€',
  '&deg;': '°',
  '&#176;': '°',
  '&#39;': '\'',
  '&apos;': '\'',
  '&nbsp;': ' ',
  '&#160;': ' ',
}
function escapeHTML(str: string): string {
  return str.replace(/(&amp;|&lt;|&#60;|&gt;|&#62;|&le;|&#8804;|&ge;|&#8805;|&quot;|&#34;|&trade;|&#8482;|&asymp;|&#8776;|&ndash;|&#8211;|&mdash;|&#8212;|&copy;|&#169;|&reg;|&#174;|&ne;|&#8800;|&pound;|&#163;|&euro;|&#8364;|&deg;|&#176;|&#39;|&apos;|&nbsp;|&#160;|&quot;|&#34;|&trade;|&#8482;|&asymp;|&#8776;|&ndash;|&#8211;|&mdash;|&#8212;|&copy;|&#169;|&reg;|&#174;|&ne;|&#8800;|&pound;|&#163;|&euro;|&#8364;|&deg;|&#176;|&#39;|&apos;|&nbsp;|&#160;)/g, c => ESCAPE_CHARS[c] || c)
}

function replaceHtmlReservedCharacters(str: string) {
  return escapeHTML(str)
}

export {
  getDomain,
  countWord,
  preprocessText,
  getPromptsByTemplate,
  strNotEqualWith,
  replaceHtmlReservedCharacters,
}
