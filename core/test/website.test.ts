import { describe, expect, test } from 'vitest'
import { getWebsiteInfo } from '~/website'

describe('get website info', () => {
  test('github info', async () => {
    const res = await getWebsiteInfo({ webUrl: 'https://github.com/LarchLiu/star-nexus/something' })
    expect((res.data?.title)?.includes('star-nexus')).toBeTruthy()
    expect(res.data?.url).toBe('https://github.com/LarchLiu/star-nexus')
  }, 20000)

  test('tweet info', async () => {
    const res = await getWebsiteInfo({ webUrl: 'https://twitter.com/LarchLiu/status/1594316498377621504' })
    expect((res.data?.title)?.includes('Alex Liu')).toBeTruthy()
    expect(res.data?.url).toBe('https://twitter.com/LarchLiu/status/1594316498377621504')
  }, 20000)
})

describe('handle error', () => {
  test('github repo path error', async () => {
    const res = await getWebsiteInfo({ webUrl: 'https://github.com/LarchLiu' })
    expect(res.error).toMatchSnapshot()
  })
  test('twitter path error', async () => {
    const res = await getWebsiteInfo({ webUrl: 'https://twitter.com/LarchLiu/statu/1594316498377621504' })
    expect(res.error).toMatchSnapshot()
  })
  test('website domain error', async () => {
    const res = await getWebsiteInfo({ webUrl: 'https://domain-error.com/xxx/yyy' })
    expect(res.error).toMatchSnapshot()
  })
})
