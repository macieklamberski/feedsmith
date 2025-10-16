import { describe, expect, it } from 'bun:test'
import { generateFeed } from './utils.js'

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      limit: '10',
      countryOfOrigin: 'US',
    }
    const expected = {
      'spotify:limit': '10',
      'spotify:countryOfOrigin': 'US',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only limit', () => {
    const value = {
      limit: '10',
    }
    const expected = {
      'spotify:limit': '10',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only countryOfOrigin', () => {
    const value = {
      countryOfOrigin: 'US',
    }
    const expected = {
      'spotify:countryOfOrigin': 'US',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      limit: '',
      countryOfOrigin: 'US',
    }
    const expected = {
      'spotify:countryOfOrigin': 'US',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      limit: '   ',
      countryOfOrigin: '\t\n',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle object with all undefined properties', () => {
    const value = {
      limit: undefined,
      countryOfOrigin: undefined,
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    expect(generateFeed(null)).toBeUndefined()
  })

  it('should handle numeric values', () => {
    const value = {
      limit: '5',
      countryOfOrigin: 'GB',
    }
    const expected = {
      'spotify:limit': '5',
      'spotify:countryOfOrigin': 'GB',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle country codes correctly', () => {
    const countryCodes = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP']

    for (const code of countryCodes) {
      const value = {
        countryOfOrigin: code,
      }
      const expected = {
        'spotify:countryOfOrigin': code,
      }

      expect(generateFeed(value)).toEqual(expected)
    }
  })

  it('should handle various limit values', () => {
    const limits = ['1', '5', '10', '50', '100']

    for (const limit of limits) {
      const value = {
        limit,
      }
      const expected = {
        'spotify:limit': limit,
      }

      expect(generateFeed(value)).toEqual(expected)
    }
  })
})
