import { describe, expect, it } from 'bun:test'
import { generateFeed } from './utils.js'

describe('generateFeed', () => {
  it('should generate valid feed object with all properties', () => {
    const value = {
      updatePeriod: 'hourly',
      updateFrequency: 2,
      updateBase: new Date('2023-01-01T00:00:00Z'),
    }
    const expected = {
      'sy:updatePeriod': 'hourly',
      'sy:updateFrequency': 2,
      'sy:updateBase': '2023-01-01T00:00:00.000Z',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with minimal properties', () => {
    const value = {
      updatePeriod: 'daily',
    }
    const expected = {
      'sy:updatePeriod': 'daily',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      updatePeriod: undefined,
      updateFrequency: undefined,
      updateBase: undefined,
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateFeed(undefined)).toBeUndefined()
  })
})
