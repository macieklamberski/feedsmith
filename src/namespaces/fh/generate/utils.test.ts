import { describe, expect, it } from 'bun:test'
import { generateFeed } from './utils.js'

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      complete: true,
      archive: true,
      incremental: true,
      stateful: true,
      prev: 'https://example.com/rss/album/5837108?page=2',
    }
    const expected = {
      'fh:complete': '',
      'fh:archive': '',
      'fh:incremental': true,
      'fh:stateful': true,
      'fh:prev': 'https://example.com/rss/album/5837108?page=2',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only complete', () => {
    const value = {
      complete: true,
    }
    const expected = {
      'fh:complete': '',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only archive', () => {
    const value = {
      archive: true,
    }
    const expected = {
      'fh:archive': '',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate incremental set to false', () => {
    const value = {
      incremental: false,
    }
    const expected = {
      'fh:incremental': false,
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate stateful set to false', () => {
    const value = {
      stateful: false,
    }
    const expected = {
      'fh:stateful': false,
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should omit complete and archive set to false', () => {
    const value = {
      complete: false,
      archive: false,
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should wrap prev with HTML special characters in CDATA', () => {
    const value = {
      prev: 'https://example.com/feed?page=2&sort=date',
    }
    const expected = {
      'fh:prev': { '#cdata': 'https://example.com/feed?page=2&sort=date' },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      prev: '',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      prev: '   ',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
  })

  it('should ignore non-boolean flags', () => {
    const value = {
      complete: 'yes',
      incremental: 'true',
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(value)).toBeUndefined()
  })
})
