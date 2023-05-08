import { getWebsiteInfo as getInfo } from '@starnexus/core'
import { routes } from '../src/routes-auto-generate'

export async function getWebsiteInfo(url: string) {
  const info = getInfo({ webUrl: url }, routes)

  return info
}
