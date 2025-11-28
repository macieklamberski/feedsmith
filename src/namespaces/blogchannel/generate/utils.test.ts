import { describe, expect, it } from 'bun:test'
import { generateFeed } from './utils.js'

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      blogRoll: 'http://example.com/blogroll.opml',
      blink: 'http://recommended-site.com/',
      mySubscriptions: 'http://example.com/subscriptions.opml',
    }
    const expected = {
      'blogChannel:blogRoll': 'http://example.com/blogroll.opml',
      'blogChannel:blink': 'http://recommended-site.com/',
      'blogChannel:mySubscriptions': 'http://example.com/subscriptions.opml',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only blogRoll', () => {
    const value = {
      blogRoll: 'http://example.com/blogroll.opml',
    }
    const expected = {
      'blogChannel:blogRoll': 'http://example.com/blogroll.opml',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only blink', () => {
    const value = {
      blink: 'http://recommended-site.com/',
    }
    const expected = {
      'blogChannel:blink': 'http://recommended-site.com/',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only mySubscriptions', () => {
    const value = {
      mySubscriptions: 'http://example.com/subscriptions.opml',
    }
    const expected = {
      'blogChannel:mySubscriptions': 'http://example.com/subscriptions.opml',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      blogRoll: '',
      blink: 'http://recommended-site.com/',
    }
    const expected = {
      'blogChannel:blink': 'http://recommended-site.com/',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      blogRoll: '   ',
      blink: '\t\n',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle object with all undefined properties', () => {
    const value = {
      blogRoll: undefined,
      blink: undefined,
      mySubscriptions: undefined,
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

  it('should handle various URL formats', () => {
    const urls = [
      'http://example.com/blogroll.opml',
      'https://example.com/blogroll.opml',
      'http://example.com/blogroll.opml?foo=bar',
      'http://example.com/path/to/blogroll.opml',
    ]

    for (const url of urls) {
      const value = {
        blogRoll: url,
      }
      const expected = {
        'blogChannel:blogRoll': url,
      }

      expect(generateFeed(value)).toEqual(expected)
    }
  })

  it('should handle partial feed data', () => {
    const value = {
      blogRoll: 'http://example.com/blogroll.opml',
      mySubscriptions: 'http://example.com/subscriptions.opml',
    }
    const expected = {
      'blogChannel:blogRoll': 'http://example.com/blogroll.opml',
      'blogChannel:mySubscriptions': 'http://example.com/subscriptions.opml',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle mixed empty and valid strings', () => {
    const value = {
      blogRoll: '',
      blink: 'http://recommended-site.com/',
      mySubscriptions: '   ',
    }
    const expected = {
      'blogChannel:blink': 'http://recommended-site.com/',
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
