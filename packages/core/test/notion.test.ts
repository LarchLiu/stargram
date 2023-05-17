import { describe, expect, test } from 'vitest'
import { saveToNotion } from '../src/storage/notion'

const notionPage = {
  categories: ['Cool', 'Awesome'],
  status: 'Starred' as const,
  title: 'star-nexus',
  summary: 'Starred and Manage all your like',
  url: 'https://github.com/LarchLiu/star-nexus',
  meta: {
    domain: 'github.com',
    siteName: 'Github',
    ogImage: 'https://kiafhufrshqyrvlpsdqg.supabase.co/storage/v1/object/public/pics-bed/star-nexus.png?v=3',
  },
}
describe('notion', () => {
  test('save to notion', async () => {
    const res = await saveToNotion({
      apiKey: import.meta.env.VITE_NOTION_API_KEY,
      databaseId: import.meta.env.VITE_NOTION_DATABASE_ID,
      defaultOgImage: 'https://kiafhufrshqyrvlpsdqg.supabase.co/storage/v1/object/public/pics-bed/star-nexus.png?v=3',
    }, notionPage)
    expect(res.storageId).toBeDefined()
    expect(res.starred).toBeDefined()
    // expect(res).matchSnapshot()
  })
})
