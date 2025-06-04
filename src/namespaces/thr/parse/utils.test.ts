import { describe, expect, it } from 'bun:test'
import { parseInReplyTo, retrieveItem, retrieveLink } from './utils.js'

describe('parseInReplyTo', () => {
  it('should parse complete inReplyTo object', () => {
    const value = {
      '@ref': 'post-123',
      '@href': 'https://example.com/posts/123',
      '@type': 'application/json',
      '@source': 'example.com',
    }
    const expected = {
      ref: 'post-123',
      href: 'https://example.com/posts/123',
      type: 'application/json',
      source: 'example.com',
    }

    expect(parseInReplyTo(value)).toEqual(expected)
  })

  it('should parse inReplyTo with only ref field', () => {
    const value = {
      '@ref': 'post-123',
    }
    const expected = {
      ref: 'post-123',
    }

    expect(parseInReplyTo(value)).toEqual(expected)
  })

  it('should parse inReplyTo with ref and other fields', () => {
    const value = {
      '@ref': 'post-123',
      '@href': 'https://example.com/posts/123',
    }
    const expected = {
      ref: 'post-123',
      href: 'https://example.com/posts/123',
    }

    expect(parseInReplyTo(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@ref': 123,
      '@type': 456,
    }
    const expected = {
      ref: '123',
      type: '456',
    }

    expect(parseInReplyTo(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@ref': 'post-123',
      '@href': 'https://example.com/posts/123',
      '@invalid': 'property',
    }
    const expected = {
      ref: 'post-123',
      href: 'https://example.com/posts/123',
    }

    expect(parseInReplyTo(value)).toEqual(expected)
  })

  it('should return undefined if ref is missing', () => {
    const value = {
      '@href': 'https://example.com/posts/123',
      '@type': 'application/json',
      '@source': 'example.com',
    }

    expect(parseInReplyTo(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseInReplyTo(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseInReplyTo(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(parseInReplyTo('not an object')).toBeUndefined()
    expect(parseInReplyTo(undefined)).toBeUndefined()
    expect(parseInReplyTo(null)).toBeUndefined()
    expect(parseInReplyTo([])).toBeUndefined()
  })
})

describe('retrieveLink', () => {
  it('should parse complete link object', () => {
    const value = {
      '@thr:count': 42,
      '@thr:updated': '2025-05-01T12:00:00Z',
    }
    const expected = {
      count: 42,
      updated: '2025-05-01T12:00:00Z',
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should parse link with only count field', () => {
    const value = {
      '@thr:count': 42,
    }
    const expected = {
      count: 42,
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should parse link with only updated field', () => {
    const value = {
      '@thr:updated': '2025-05-01T12:00:00Z',
    }
    const expected = {
      updated: '2025-05-01T12:00:00Z',
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@thr:count': '42',
      '@thr:updated': 20250501,
    }
    const expected = {
      count: 42,
      updated: '20250501',
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@thr:count': 42,
      '@thr:updated': '2025-05-01T12:00:00Z',
      '@invalid': 'property',
    }
    const expected = {
      count: 42,
      updated: '2025-05-01T12:00:00Z',
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should return undefined for empty input objects', () => {
    const value = {}

    expect(retrieveLink(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(retrieveLink(value)).toBeUndefined()
  })

  it('should return undefined for not supported input', () => {
    expect(retrieveLink('not an object')).toBeUndefined()
    expect(retrieveLink(undefined)).toBeUndefined()
    expect(retrieveLink(null)).toBeUndefined()
    expect(retrieveLink([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse a complete item with inReplyTos', () => {
    const value = {
      'thr:total': 100,
      'thr:in-reply-to': [
        {
          '@ref': 'post-123',
          '@href': 'https://example.com/posts/123',
          '@type': 'application/json',
        },
        {
          '@ref': 'post-456',
          '@source': 'example.com',
        },
      ],
    }
    const expected = {
      total: 100,
      inReplyTos: [
        {
          ref: 'post-123',
          href: 'https://example.com/posts/123',
          type: 'application/json',
        },
        {
          ref: 'post-456',
          source: 'example.com',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse an item with only total field (with #text)', () => {
    const value = {
      'thr:total': { '#text': 100 },
    }
    const expected = {
      total: 100,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse an item with only total field (without #text)', () => {
    const value = {
      'thr:total': 100,
    }
    const expected = {
      total: 100,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse an item with only total field (with array of values)', () => {
    const value = {
      'thr:total': [100],
    }
    const expected = {
      total: 100,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse an item with only inReplyTos field', () => {
    const value = {
      'thr:in-reply-to': [
        {
          '@ref': 'post-123',
          '@href': 'https://example.com/posts/123',
        },
      ],
    }
    const expected = {
      inReplyTos: [
        {
          ref: 'post-123',
          href: 'https://example.com/posts/123',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse an item with a single inReplyTo object', () => {
    const value = {
      'thr:in-reply-to': {
        '@ref': 'post-123',
        '@href': 'https://example.com/posts/123',
      },
    }
    const expected = {
      inReplyTos: [
        {
          ref: 'post-123',
          href: 'https://example.com/posts/123',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'thr:total': '100',
      'thr:in-reply-to': {
        '@ref': 123,
        '@href': 'https://example.com/posts/123',
      },
    }
    const expected = {
      total: 100,
      inReplyTos: [
        {
          ref: '123',
          href: 'https://example.com/posts/123',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should filter out invalid inReplyTo objects', () => {
    const value = {
      'thr:total': 100,
      'thr:in-reply-to': [
        {
          '@ref': 'post-123',
          '@href': 'https://example.com/posts/123',
        },
        {}, // Empty object should be filtered out.
        {
          '@href': 'https://example.com/posts/456', // Missing ref field.
          '@invalid': 'property',
        },
      ],
    }
    const expected = {
      total: 100,
      inReplyTos: [
        {
          ref: 'post-123',
          href: 'https://example.com/posts/123',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined when no valid properties are present', () => {
    const value = {
      'thr:in-reply-to': [
        {}, // Empty object will be filtered out.
        {
          '@href': 'https://example.com/posts/456', // Missing ref field.
        },
      ],
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
  })
})
