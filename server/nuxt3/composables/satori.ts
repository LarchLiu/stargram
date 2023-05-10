import type { AllowedComponentProps, Component, VNodeProps } from 'vue'
import { createApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { html as _html } from 'satori-html'
import _satori from 'satori'
import type { SatoriOptions } from 'satori'
import { replaceHtmlReservedCharacters } from '@starnexus/core'
import { loadNodeIcon } from '@iconify/utils/lib/loader/node-loader'

export type ExtractComponentProps<TComponent> =
  TComponent extends new () => {
    $props: infer P
  }
    ? Omit<P, keyof VNodeProps | keyof AllowedComponentProps>
    : never

export async function html(component: Component, props: any) {
  let Root
  if (props)
    Root = createApp(h(component, props))
  else
    Root = createApp(component)
  let strComponent = await renderToString(Root)
  const regex = /<div class="i-([a-z0-9:_-]+)(?:\?(\d+))?.*?"><\/div>/g
  const matchs = strComponent.matchAll(regex)
  for (const match of matchs) {
    const [collection, name] = match[1].split(':')
    const size = match[2] || 48
    let icon = await loadNodeIcon(collection, name)
    if (icon) {
      icon = icon.replace('width="1em" height="1em"', `width="${size}" height="${size}"`)
      strComponent = strComponent.replaceAll(match[0], icon)
      // console.log(strComponent)
    }
  }
  return _html(replaceHtmlReservedCharacters(strComponent))
}

export async function satori<T extends Component>(component: T, options: SatoriOptions & {
  props?: ExtractComponentProps<T>
}) {
  const markup = await html(component, options.props)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const result = await _satori(markup, options)
  return result
}
