import { describe, expect, test } from 'vitest'
import { saveToNotion } from '../src/notion'

const notionPage = {
  databaseId: import.meta.env.VITE_NOTION_DATABASE_ID,
  categories: ['Cool', 'Awesome'],
  status: 'Starred' as const,
  title: 'star-nexus',
  summary: 'Starred and Manage all your like',
  url: 'https://github.com/LarchLiu/star-nexus',
  meta: {
    domain: 'github.com',
    website: 'Github',
    cover: 'https://kiafhufrshqyrvlpsdqg.supabase.co/storage/v1/object/public/pics-bed/star-nexus.png?v=3',
  },
}
describe('notion', () => {
  test('save to notion', async () => {
    const res = await saveToNotion(import.meta.env.VITE_NOTION_API_KEY, notionPage)
    expect(res.data?.notionPageId).toBeDefined()
    expect(res.data?.starred).toBeDefined()
  })
})
