import { describe, expect, it } from 'bun:test'
import { retrieveFeed } from './utils.js'

describe('retrieveFeed', () => {
  const expectedFull = {
    blogRoll: 'http://example.com/blogroll.opml',
    blink: 'http://recommended-site.com/',
    mySubscriptions: 'http://example.com/subscriptions.opml',
  }

  it('should parse all blogChannel feed properties when present (with #text)', () => {
    const value = {
      'blogchannel:blogroll': { '#text': 'http://example.com/blogroll.opml' },
      'blogchannel:blink': { '#text': 'http://recommended-site.com/' },
      'blogchannel:mysubscriptions': { '#text': 'http://example.com/subscriptions.opml' },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse all blogChannel feed properties when present (without #text)', () => {
    const value = {
      'blogchannel:blogroll': 'http://example.com/blogroll.opml',
      'blogchannel:blink': 'http://recommended-site.com/',
      'blogchannel:mysubscriptions': 'http://example.com/subscriptions.opml',
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed properties from arrays (uses first)', () => {
    const value = {
      'blogchannel:blogroll': ['http://example.com/blogroll.opml', 'http://example.com/alt.opml'],
      'blogchannel:blink': ['http://recommended-site.com/', 'http://other-site.com/'],
      'blogchannel:mysubscriptions': [
        'http://example.com/subscriptions.opml',
        'http://example.com/subs2.opml',
      ],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with only blogRoll', () => {
    const value = {
      'blogchannel:blogroll': 'http://example.com/blogroll.opml',
    }
    const expected = {
      blogRoll: 'http://example.com/blogroll.opml',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only blink', () => {
    const value = {
      'blogchannel:blink': 'http://recommended-site.com/',
    }
    const expected = {
      blink: 'http://recommended-site.com/',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only mySubscriptions', () => {
    const value = {
      'blogchannel:mysubscriptions': 'http://example.com/subscriptions.opml',
    }
    const expected = {
      mySubscriptions: 'http://example.com/subscriptions.opml',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'blogchannel:blogroll': { '#text': 'http://example.com/blogroll.opml?foo=1&amp;bar=2' },
      'blogchannel:blink': { '#text': 'http://example.com/?a=1&amp;b=2' },
    }
    const expected = {
      blogRoll: 'http://example.com/blogroll.opml?foo=1&bar=2',
      blink: 'http://example.com/?a=1&b=2',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'blogchannel:blogroll': { '#text': '<![CDATA[http://example.com/blogroll.opml]]>' },
      'blogchannel:blink': { '#text': '<![CDATA[http://recommended-site.com/]]>' },
    }
    const expected = {
      blogRoll: 'http://example.com/blogroll.opml',
      blink: 'http://recommended-site.com/',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle missing #text properties', () => {
    const value = {
      'blogchannel:blogroll': {},
      'blogchannel:blink': {},
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle null or undefined properties', () => {
    const value = {
      'blogchannel:blogroll': null,
      'blogchannel:blink': undefined,
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
      'blogchannel:blogroll': {},
      'blogchannel:blink': null,
      'blogchannel:mysubscriptions': undefined,
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle empty string values', () => {
    const value = {
      'blogchannel:blogroll': { '#text': '' },
      'blogchannel:blink': { '#text': 'http://recommended-site.com/' },
    }
    const expected = {
      blink: 'http://recommended-site.com/',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'blogchannel:blogroll': { '#text': '   ' },
      'blogchannel:blink': { '#text': '\t\n' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })
})
