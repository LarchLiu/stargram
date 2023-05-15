import zhHans from './zh-hans'
import zhHant from './zh-hant'
import en from './en'

export default function i18n(lang: string) {
  switch (lang.toLowerCase()) {
    case 'zh-CN':
      return zhHans
    case 'zh-TW':
      return zhHant
    case 'en':
      return en
    default:
      return en
  }
}
