import { describe, expect, it } from 'bun:test'
import { retrieveFeed } from './utils.js'

describe('retrieveFeed', () => {
  it('should parse feed with all properties', () => {
    const value = {
      'fh:complete': '',
      'fh:archive': '',
      'fh:incremental': 'true',
      'fh:prev': 'https://example.com/rss/album/5837108?page=2',
    }
    const expected = {
      complete: true,
      archive: true,
      incremental: true,
      prev: 'https://example.com/rss/album/5837108?page=2',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only complete', () => {
    const value = {
      'fh:complete': '',
    }
    const expected = {
      complete: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only archive', () => {
    const value = {
      'fh:archive': '',
    }
    const expected = {
      archive: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse incremental containing false', () => {
    const value = {
      'fh:incremental': 'false',
    }
    const expected = {
      incremental: false,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse incremental surrounded by whitespace', () => {
    const value = {
      'fh:incremental': '  true\n',
    }
    const expected = {
      incremental: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse complete carrying content', () => {
    const value = {
      'fh:complete': 'true',
    }
    const expected = {
      complete: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse archive carrying attributes', () => {
    const value = {
      'fh:archive': { '@xml:lang': 'en' },
    }
    const expected = {
      archive: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'fh:prev': 'https://example.com/feed?page=2&amp;sort=date',
    }
    const expected = {
      prev: 'https://example.com/feed?page=2&sort=date',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'fh:prev': { '#text': '<![CDATA[https://example.com/feed?page=2]]>' },
      'fh:incremental': { '#text': '<![CDATA[true]]>' },
    }
    const expected = {
      prev: 'https://example.com/feed?page=2',
      incremental: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'fh:incremental': '',
      'fh:prev': '',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'fh:incremental': '   ',
      'fh:prev': '   ',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should ignore incremental with content other than true or false', () => {
    const value = {
      'fh:incremental': 'sometimes',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
  })

  it('should handle array inputs by using first element', () => {
    const value = {
      'fh:incremental': ['true', 'false'],
      'fh:prev': ['https://example.com/feed?page=2', 'https://example.com/feed?page=3'],
    }
    const expected = {
      incremental: true,
      prev: 'https://example.com/feed?page=2',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse a repeated complete element', () => {
    const value = {
      'fh:complete': ['', ''],
    }
    const expected = {
      complete: true,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })
})
