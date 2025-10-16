import { describe, expect, it } from 'bun:test'
import { generateFeed, generateLimit } from './utils.js'

describe('generateLimit', () => {
  it('should generate limit with recentCount', () => {
    const value = {
      recentCount: 10,
    }
    const expected = {
      '@recentCount': 10,
    }

    expect(generateLimit(value)).toEqual(expected)
  })

  it('should handle missing recentCount', () => {
    const value = {}

    expect(generateLimit(value)).toBeUndefined()
  })

  it('should handle undefined recentCount', () => {
    const value = {
      recentCount: undefined,
    }

    expect(generateLimit(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateLimit('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateLimit(123)).toBeUndefined()
    expect(generateLimit(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateLimit(null)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      limit: {
        recentCount: 10,
      },
      countryOfOrigin: 'US',
    }
    const expected = {
      'spotify:limit': {
        '@recentCount': 10,
      },
      'spotify:countryOfOrigin': 'US',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only limit', () => {
    const value = {
      limit: {
        recentCount: 10,
      },
    }
    const expected = {
      'spotify:limit': {
        '@recentCount': 10,
      },
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

  it('should handle empty strings in countryOfOrigin', () => {
    const value = {
      limit: {
        recentCount: 10,
      },
      countryOfOrigin: '',
    }
    const expected = {
      'spotify:limit': {
        '@recentCount': 10,
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings in countryOfOrigin', () => {
    const value = {
      limit: {
        recentCount: 10,
      },
      countryOfOrigin: '\t\n',
    }
    const expected = {
      'spotify:limit': {
        '@recentCount': 10,
      },
    }

    expect(generateFeed(value)).toEqual(expected)
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
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
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

  it('should handle various recentCount limit values', () => {
    const limits = [1, 5, 10, 50, 100]

    for (const count of limits) {
      const value = {
        limit: {
          recentCount: count,
        },
      }
      const expected = {
        'spotify:limit': {
          '@recentCount': count,
        },
      }

      expect(generateFeed(value)).toEqual(expected)
    }
  })

  it('should handle limit with undefined recentCount', () => {
    const value = {
      limit: {
        recentCount: undefined,
      },
      countryOfOrigin: 'US',
    }
    const expected = {
      'spotify:countryOfOrigin': 'US',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty limit object', () => {
    const value = {
      limit: {},
      countryOfOrigin: 'US',
    }
    const expected = {
      'spotify:countryOfOrigin': 'US',
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
