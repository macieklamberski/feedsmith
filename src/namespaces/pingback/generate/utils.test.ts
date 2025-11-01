import { describe, expect, it } from 'bun:test'
import { generateFeed, generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      server: 'https://example.com/pingback',
      target: 'https://example.com/post/123',
    }
    const expected = {
      'pingback:server': 'https://example.com/pingback',
      'pingback:target': 'https://example.com/post/123',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only server', () => {
    const value = {
      server: 'https://example.com/pingback',
    }
    const expected = {
      'pingback:server': 'https://example.com/pingback',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only target', () => {
    const value = {
      target: 'https://example.com/post/123',
    }
    const expected = {
      'pingback:target': 'https://example.com/post/123',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      server: '',
      target: 'https://example.com/post/123',
    }
    const expected = {
      'pingback:target': 'https://example.com/post/123',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      server: '   ',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(123)).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
  })

  it('should handle URLs with special characters', () => {
    const value = {
      server: 'https://example.com/pingback?foo=bar&baz=qux',
      target: 'https://example.com/post/123?ref=feed',
    }
    const expected = {
      'pingback:server': {
        '#cdata': 'https://example.com/pingback?foo=bar&baz=qux',
      },
      'pingback:target': 'https://example.com/post/123?ref=feed',
    }

    expect(generateItem(value)).toEqual(expected)
  })
})

describe('generateFeed', () => {
  it('should generate feed with to property', () => {
    const value = {
      to: 'https://example.com/pingback-service',
    }
    const expected = {
      'pingback:to': 'https://example.com/pingback-service',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      to: '',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      to: '   ',
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

  it('should handle URLs with special characters', () => {
    const value = {
      to: 'https://example.com/pingback?foo=bar&baz=qux',
    }
    const expected = {
      'pingback:to': {
        '#cdata': 'https://example.com/pingback?foo=bar&baz=qux',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
