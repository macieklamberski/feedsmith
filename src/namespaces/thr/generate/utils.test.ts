import { describe, expect, it } from 'bun:test'
import { generateInReplyTo, generateItem, generateLink } from './utils.js'

describe('generateInReplyTo', () => {
  it('should generate in-reply-to with all properties', () => {
    const value = {
      ref: 'http://example.com/original-post',
      href: 'http://example.com/original-post#comment-1',
      type: 'text/html',
      source: 'http://example.com/feed.xml',
    }
    const expected = {
      '@ref': 'http://example.com/original-post',
      '@href': 'http://example.com/original-post#comment-1',
      '@type': 'text/html',
      '@source': 'http://example.com/feed.xml',
    }

    expect(generateInReplyTo(value)).toEqual(expected)
  })

  it('should generate in-reply-to with minimal properties', () => {
    const value = {
      ref: 'http://example.com/original-post',
    }
    const expected = {
      '@ref': 'http://example.com/original-post',
    }

    expect(generateInReplyTo(value)).toEqual(expected)
  })

  it('should handle undefined input', () => {
    expect(generateInReplyTo(undefined)).toBeUndefined()
  })
})

describe('generateLink', () => {
  it('should generate link attributes with all properties', () => {
    const value = {
      count: 25,
      updated: new Date('2023-12-15T14:30:00Z'),
    }
    const expected = {
      '@thr:count': 25,
      '@thr:updated': '2023-12-15T14:30:00.000Z',
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should handle undefined input', () => {
    expect(generateLink(undefined)).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate threading namespace properties for item', () => {
    const value = {
      total: 42,
      inReplyTos: [
        {
          ref: 'http://example.com/original-post',
          href: 'http://example.com/original-post#comment-1',
        },
        {
          ref: 'http://example.com/another-post',
        },
      ],
    }
    const expected = {
      'thr:total': 42,
      'thr:in-reply-to': [
        {
          '@ref': 'http://example.com/original-post',
          '@href': 'http://example.com/original-post#comment-1',
        },
        {
          '@ref': 'http://example.com/another-post',
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate only correct inReplyTos', () => {
    const value = {
      inReplyTos: [
        {
          ref: 'http://example.com/original-post',
          href: 'http://example.com/original-post#comment-1',
        },
        {}, // Empty object.
        { invalid: 'value' },
      ],
    }
    const expected = {
      'thr:in-reply-to': [
        {
          '@ref': 'http://example.com/original-post',
          '@href': 'http://example.com/original-post#comment-1',
        },
      ],
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle undefined input', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })
})
