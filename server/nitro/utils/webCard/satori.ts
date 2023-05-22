import { html } from 'satori-html'
import _satori from 'satori'
import type { SatoriOptions } from 'satori'

export async function satori(component: string, options: SatoriOptions) {
  const _component = component.replace('\n', '').replace(/>\s+?</g, '><')
  const markup = html(_component)
  const result = await _satori(markup, options)
  return result
}
