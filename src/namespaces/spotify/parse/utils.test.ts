import { describe, expect, it } from 'bun:test'
import { retrieveFeed } from './utils.js'

describe('retrieveFeed', () => {
  const expectedFull = {
    limit: '10',
    countryOfOrigin: 'US',
  }

  it('should parse all Spotify feed properties when present (with #text)', () => {
    const value = {
      'spotify:limit': { '#text': '10' },
      'spotify:countryoforigin': { '#text': 'US' },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse all Spotify feed properties when present (without #text)', () => {
    const value = {
      'spotify:limit': '10',
      'spotify:countryoforigin': 'US',
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse all Spotify feed properties when present (with array of values)', () => {
    const value = {
      'spotify:limit': ['10', '20'],
      'spotify:countryoforigin': ['US', 'GB'],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse only limit when countryOfOrigin is missing', () => {
    const value = {
      'spotify:limit': { '#text': '10' },
    }
    const expected = {
      limit: '10',
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

  it('should handle HTML entities in text content', () => {
    const value = {
      'spotify:limit': { '#text': '10&amp;20' },
      'spotify:countryoforigin': { '#text': 'US&amp;GB' },
    }
    const expected = {
      limit: '10&20',
      countryOfOrigin: 'US&GB',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'spotify:limit': { '#text': '<![CDATA[10]]>' },
      'spotify:countryoforigin': { '#text': '<![CDATA[US]]>' },
    }
    const expected = {
      limit: '10',
      countryOfOrigin: 'US',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle non-string values by coercing to strings', () => {
    const value = {
      'spotify:limit': { '#text': 123 },
      'spotify:countryoforigin': { '#text': true },
    }
    const expected = {
      limit: '123',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle missing #text properties', () => {
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

  it('should handle empty string values', () => {
    const value = {
      'spotify:limit': { '#text': '' },
      'spotify:countryoforigin': { '#text': 'US' },
    }
    const expected = {
      countryOfOrigin: 'US',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'spotify:limit': { '#text': '   ' },
      'spotify:countryoforigin': { '#text': '\t\n' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })
})
