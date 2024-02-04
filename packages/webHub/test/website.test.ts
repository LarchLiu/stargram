import { describe, expect, it } from 'vitest'
import { getWebsiteInfo } from './website'

describe('get webhub info', () => {
  // test('segmentfault info', async () => {
  //   const res = await getWebsiteInfo('https://segmentfault.com/a/1190000008879966')
  //   expect(res).toMatchSnapshot()
  // })

  it('github info', async () => {
    const res = await getWebsiteInfo('https://github.com/LarchLiu/stargram')
    expect((res.title).includes('stargram')).toBeTruthy()
    expect(res.url).toBe('https://github.com/LarchLiu/stargram')
  })

  it('tweet info', async () => {
    const res = await getWebsiteInfo('https://twitter.com/LarchLiu/status/1594316498377621504')
    expect((res.title).includes('Alex Liu')).toBeTruthy()
    expect(res.url).toBe('https://twitter.com/LarchLiu/status/1594316498377621504')
    // expect(res).toMatchSnapshot()
  })
})

describe('get common website info', () => {
  it('slack info', async () => {
    const res = await getWebsiteInfo('https://api.slack.com')
    expect(res.content).toBeDefined()
  })
})

describe('handle error', () => {
  it('github repo path error', async () => {
    await getWebsiteInfo('https://github.com/LarchLiu').catch((err) => {
      expect(err).toMatchSnapshot()
    })
  })
  it('twitter tweet path error', async () => {
    await getWebsiteInfo('https://twitter.com/LarchLiu/statu/1594316498377621504').catch((err) => {
      expect(err).toMatchSnapshot()
    })
  })
  it('website domain error', async () => {
    await getWebsiteInfo('https://domain.error/xxx/yyy').catch((err) => {
      expect(err).toBeDefined()
    })
  })
  it('github repo fetch error', async () => {
    await getWebsiteInfo('https://github.com/LarchLiu/xxx').catch((err) => {
      expect(err).toMatchSnapshot()
    })
  })
  it('twitter tweet fetch error', async () => {
    await getWebsiteInfo('https://twitter.com/LarchLiu/status/xxx').catch((err) => {
      expect(err).toBeDefined()
    })
  })
})
