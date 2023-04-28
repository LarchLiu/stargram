import { describe, expect, test } from 'vitest'
import { saveToNotion } from '~/notion'

const webInfo = {
  databaseId: import.meta.env.VITE_NOTION_DATABASE_ID,
  categories: ['Cool', 'Awesome'],
  status: 'Starred' as const,
  title: 'star-nexus',
  summary: 'Starred and Manage all your like',
  url: 'https://github.com/LarchLiu/star-nexus',
}
describe('notion', () => {
  test('save to notion', async () => {
    const res = await saveToNotion(import.meta.env.VITE_NOTION_API_KEY, webInfo)
    expect(res.data?.notionPageId).toBeDefined()
    expect(res.data?.starred).toBeDefined()
  }, 20000)
})
