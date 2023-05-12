import { describe, expect, test } from 'vitest'
import { getWebsiteInfo } from './website'

describe('get website info', () => {
  test('github info', async () => {
    const res = await getWebsiteInfo('https://github.com/LarchLiu/star-nexus')
    expect((res.title).includes('star-nexus')).toBeTruthy()
    expect(res.url).toBe('https://github.com/LarchLiu/star-nexus')
  })

  test('tweet info', async () => {
    const res = await getWebsiteInfo('https://twitter.com/LarchLiu/status/1594316498377621504')
    expect((res.title).includes('Alex Liu')).toBeTruthy()
    expect(res.url).toBe('https://twitter.com/LarchLiu/status/1594316498377621504')
    // expect(res).toMatchSnapshot()
  })
})

describe('handle error', () => {
  test('github repo path error', async () => {
    await getWebsiteInfo('https://github.com/LarchLiu').catch((err) => {
      expect(err).toMatchSnapshot()
    })
  })
  test('twitter tweet path error', async () => {
    await getWebsiteInfo('https://twitter.com/LarchLiu/statu/1594316498377621504').catch((err) => {
      expect(err).toMatchSnapshot()
    })
  })
  test('website domain error', async () => {
    await getWebsiteInfo('https://domain-error.com/xxx/yyy').catch((err) => {
      expect(err).toMatchSnapshot()
    })
  })
  test('github repo fetch error', async () => {
    await getWebsiteInfo('https://github.com/LarchLiu/xxx').catch((err) => {
      expect(err).toMatchSnapshot()
    })
  })
  test('twitter tweet fetch error', async () => {
    await getWebsiteInfo('https://twitter.com/LarchLiu/status/xxx').catch((err) => {
      expect(err).toBeDefined()
    })
  })
})
