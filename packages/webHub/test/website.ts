import { getWebsiteInfo as getInfo } from '../../core/src/website'
import { routes } from '../src/routes-auto-generate'

export async function getWebsiteInfo(url: string) {
  const info = await getInfo({ webUrl: url }, routes)

  return info
}
