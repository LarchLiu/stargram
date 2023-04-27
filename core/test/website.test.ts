import { describe, expect, test } from 'vitest'
import { getWebsiteInfo } from '~/website'

describe('get website info', () => {
  test('github info', async () => {
    const res = await getWebsiteInfo('https://github.com/LarchLiu/star-nexus/something')
    expect((res.data?.title)?.includes('star-nexus')).toBeTruthy()
    expect(res.data?.url).toBe('https://github.com/LarchLiu/star-nexus')
  })
  test('github repo path error', async () => {
    const res = await getWebsiteInfo('https://github.com/LarchLiu')
    expect(res.error).toMatchSnapshot()
  })
  test('website domain error', async () => {
    const res = await getWebsiteInfo('https://domain-error.com/xxx/yyy')
    expect(res.error).toMatchSnapshot()
  })
})
