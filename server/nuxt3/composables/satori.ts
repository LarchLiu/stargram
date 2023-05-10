import type { AllowedComponentProps, Component, VNodeProps } from 'vue'
import { createApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { html as _html } from 'satori-html'
import _satori from 'satori'
import type { SatoriOptions } from 'satori'
import { replaceHtmlReservedCharacters } from '@starnexus/core'

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
  const strComponent = await renderToString(Root)
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
