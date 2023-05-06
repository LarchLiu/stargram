export async function getFontsData() {
  const NotoSansJP = await fetch(new URL('../../assets/NotoSansJP-Regular.ttf', import.meta.url)).then(
    res => res.arrayBuffer(),
  )
  const NotoSansSC = await fetch(new URL('../../assets/NotoSansSC-Regular.otf', import.meta.url)).then(
    res => res.arrayBuffer(),
  )
  const Unifont = await fetch(new URL('../../assets/unifont-15.0.01.otf', import.meta.url)).then(
    res => res.arrayBuffer(),
  )

  const fonts = [
    {
      name: 'Noto Sans SC',
      data: NotoSansSC,
      style: 'normal' as const,
    },
    {
      name: 'Noto Sans JP',
      data: NotoSansJP,
      style: 'normal' as const,
    },
    {
      name: 'Unifont',
      data: Unifont,
      style: 'normal' as const,
    },
  ]

  return fonts
}
