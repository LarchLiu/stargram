import { extract } from '@extractus/article-extractor'

export async function articleExtractor(url: string) {
  const article = await extract(url)

  return article
}
