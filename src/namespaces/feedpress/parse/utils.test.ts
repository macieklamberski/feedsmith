import { describe, expect, it } from 'bun:test'
import { retrieveFeed } from './utils.js'

describe('retrieveFeed', () => {
  const expectedFull = {
    link: 'https://feedpress.com/podcast',
    newsletterId: 'newsletter123',
    locale: 'en',
    podcastId: 'podcast456',
    cssFile: 'https://example.com/custom.css',
  }

  it('should parse all FeedPress feed properties when present (with #text)', () => {
    const value = {
      'feedpress:link': { '#text': 'https://feedpress.com/podcast' },
      'feedpress:newsletterid': { '#text': 'newsletter123' },
      'feedpress:locale': { '#text': 'en' },
      'feedpress:podcastid': { '#text': 'podcast456' },
      'feedpress:cssfile': { '#text': 'https://example.com/custom.css' },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse all FeedPress feed properties when present (without #text)', () => {
    const value = {
      'feedpress:link': 'https://feedpress.com/podcast',
      'feedpress:newsletterid': 'newsletter123',
      'feedpress:locale': 'en',
      'feedpress:podcastid': 'podcast456',
      'feedpress:cssfile': 'https://example.com/custom.css',
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed properties from arrays (uses first)', () => {
    const value = {
      'feedpress:link': ['https://feedpress.com/podcast', 'https://example.com/alt'],
      'feedpress:newsletterid': ['newsletter123', 'newsletter456'],
      'feedpress:locale': ['en', 'fr'],
      'feedpress:podcastid': ['podcast456', 'podcast789'],
      'feedpress:cssfile': ['https://example.com/custom.css', 'https://example.com/other.css'],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with only link', () => {
    const value = {
      'feedpress:link': 'https://feedpress.com/podcast',
    }
    const expected = {
      link: 'https://feedpress.com/podcast',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only newsletterId', () => {
    const value = {
      'feedpress:newsletterid': 'newsletter123',
    }
    const expected = {
      newsletterId: 'newsletter123',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only locale', () => {
    const value = {
      'feedpress:locale': 'fr',
    }
    const expected = {
      locale: 'fr',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only podcastId', () => {
    const value = {
      'feedpress:podcastid': 'podcast456',
    }
    const expected = {
      podcastId: 'podcast456',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only cssFile', () => {
    const value = {
      'feedpress:cssfile': 'https://example.com/custom.css',
    }
    const expected = {
      cssFile: 'https://example.com/custom.css',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'feedpress:link': { '#text': 'https://example.com?foo=1&amp;bar=2' },
      'feedpress:newsletterid': { '#text': 'newsletter&amp;123' },
    }
    const expected = {
      link: 'https://example.com?foo=1&bar=2',
      newsletterId: 'newsletter&123',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'feedpress:link': { '#text': '<![CDATA[https://feedpress.com/podcast]]>' },
      'feedpress:locale': { '#text': '<![CDATA[en]]>' },
    }
    const expected = {
      link: 'https://feedpress.com/podcast',
      locale: 'en',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle missing #text properties', () => {
    const value = {
      'feedpress:link': {},
      'feedpress:newsletterid': {},
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle null or undefined properties', () => {
    const value = {
      'feedpress:link': null,
      'feedpress:newsletterid': undefined,
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
      'feedpress:link': {},
      'feedpress:newsletterid': null,
      'feedpress:locale': undefined,
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle empty string values', () => {
    const value = {
      'feedpress:link': { '#text': '' },
      'feedpress:newsletterid': { '#text': 'newsletter123' },
    }
    const expected = {
      newsletterId: 'newsletter123',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'feedpress:link': { '#text': '   ' },
      'feedpress:locale': { '#text': '\t\n' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })
})
