import { describe, expect, test } from 'vitest'
import { summarizeContent } from '~/openai'

const webInfo = {
  domain: 'github.com',
  website: 'Github',
  title: 'star-nexus',
  content: 'Starred and Manage all your like',
  url: 'https://github.com/LarchLiu/star-nexus',
}
describe('openai', () => {
  test('get summarize', async () => {
    console.error(import.meta.env.VITE_OPENAI_API_KEY.includes('sk-'))
    const res = await summarizeContent(import.meta.env.VITE_OPENAI_API_KEY, webInfo)
    expect(res.data?.summary).toBeDefined()
    expect(res.data?.categories).toBeDefined()
  })
})
