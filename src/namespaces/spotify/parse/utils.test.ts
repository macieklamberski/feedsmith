import { describe, expect, it } from 'bun:test'
import { parseLimit, retrieveFeed } from './utils.js'

describe('parseLimit', () => {
  it('should parse limit with recentCount attribute', () => {
    const value = {
      '@recentcount': 10,
    }
    const expected = {
      recentCount: 10,
    }

    expect(parseLimit(value)).toEqual(expected)
  })

  it('should parse limit with string recentCount attribute', () => {
    const value = {
      '@recentcount': '10',
    }
    const expected = {
      recentCount: 10,
    }

    expect(parseLimit(value)).toEqual(expected)
  })

  it('should handle missing recentCount attribute', () => {
    const value = {}

    expect(parseLimit(value)).toBeUndefined()
  })

  it('should handle invalid numeric values', () => {
    const value = {
      '@recentcount': 'not-a-number',
    }

    expect(parseLimit(value)).toBeUndefined()
  })

  it('should handle null or undefined recentCount', () => {
    const value = {
      '@recentcount': null,
    }

    expect(parseLimit(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseLimit(null)).toBeUndefined()
    expect(parseLimit(undefined)).toBeUndefined()
    expect(parseLimit('string')).toBeUndefined()
    expect(parseLimit(123)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
    limit: {
      recentCount: 10,
    },
    countryOfOrigin: 'US',
  }

  it('should parse all Spotify feed properties when present', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
      'spotify:countryoforigin': { '#text': 'US' },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse limit with string recentCount and countryOfOrigin without #text', () => {
    const value = {
      'spotify:limit': { '@recentcount': '10' },
      'spotify:countryoforigin': 'US',
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse limit from array of values (uses first)', () => {
    const value = {
      'spotify:limit': [{ '@recentcount': 10 }, { '@recentcount': 20 }],
      'spotify:countryoforigin': ['US', 'GB'],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse only limit when countryOfOrigin is missing', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
    }
    const expected = {
      limit: {
        recentCount: 10,
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse only countryOfOrigin when limit is missing', () => {
    const value = {
      'spotify:countryoforigin': { '#text': 'US' },
    }
    const expected = {
      countryOfOrigin: 'US',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in countryOfOrigin text content', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
      'spotify:countryoforigin': { '#text': 'US&amp;GB' },
    }
    const expected = {
      limit: {
        recentCount: 10,
      },
      countryOfOrigin: 'US&GB',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in countryOfOrigin text content', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
      'spotify:countryoforigin': { '#text': '<![CDATA[US]]>' },
    }
    const expected = {
      limit: {
        recentCount: 10,
      },
      countryOfOrigin: 'US',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle limit without valid recentCount', () => {
    const value = {
      'spotify:limit': { '@recentcount': 'invalid' },
      'spotify:countryoforigin': { '#text': 'US' },
    }
    const expected = {
      countryOfOrigin: 'US',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle missing attributes and #text properties', () => {
    const value = {
      'spotify:limit': {},
      'spotify:countryoforigin': {},
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle null or undefined properties', () => {
    const value = {
      'spotify:limit': null,
      'spotify:countryoforigin': undefined,
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined when no valid feed properties are present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed(true)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
    expect(retrieveFeed(() => {})).toBeUndefined()
  })

  it('should return undefined if all parsed properties are undefined', () => {
    const value = {
      'spotify:limit': {},
      'spotify:countryoforigin': null,
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle empty string values in countryOfOrigin', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
      'spotify:countryoforigin': { '#text': '' },
    }
    const expected = {
      limit: {
        recentCount: 10,
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only values in countryOfOrigin', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
      'spotify:countryoforigin': { '#text': '\t\n' },
    }
    const expected = {
      limit: {
        recentCount: 10,
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })
})
