import { describe, expect, test } from 'vitest'
import { unfurl } from '../src/utils/unfurl'

describe('get unfurl info', () => {
  test('slack info', async () => {
    const res = await unfurl('https://api.slack.com')
    expect(res.open_graph).toBeDefined()
    expect(res.readability).toBeDefined()
  })
})
