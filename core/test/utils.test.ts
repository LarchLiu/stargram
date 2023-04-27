import { describe, expect, test } from 'vitest'
import { getDomain } from '~/utils'

const host = 'github.com'
describe('utils', () => {
  test('get domain', async () => {
    let res = getDomain('https://github.com')
    expect(res).toBe(host)
    res = getDomain('http://github.com')
    expect(res).toBe(host)
    res = getDomain('https://github.com/LarchLiu')
    expect(res).toBe(host)
    res = getDomain('http://github.com/LarchLiu')
    expect(res).toBe(host)
  })
})
