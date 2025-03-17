import { describe, expect, it } from 'bun:test'
import { parse } from './parse'

describe('parse', () => {
  const versions = {
    '09': '0.9',
    '091': '0.91',
    '092': '0.92',
    '093': '0.93',
    '094': '0.94',
    '20': '2.0',
  }

  for (const [key, label] of Object.entries(versions)) {
    it(`should correctly parse RSS ${label} feed`, async () => {
      const reference = `${import.meta.dir}/references/rss${key}`
      const input = await Bun.file(`${reference}.xml`).text()
      const expectation = await Bun.file(`${reference}.json`).json()
      const result = parse(input)

      expect(result).toEqual(expectation)
    })
  }
})
