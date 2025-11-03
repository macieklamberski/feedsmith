import { describe, expect, it } from 'bun:test'
import { retrieveFeed, retrieveItem } from './utils.js'

describe('retrieveItem', () => {
  it('should parse complete item with all properties', () => {
    const value = {
      'pingback:server': 'https://example.com/pingback',
      'pingback:target': 'https://example.com/post/123',
    }
    const expected = {
      server: 'https://example.com/pingback',
      target: 'https://example.com/post/123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only server', () => {
    const value = {
      'pingback:server': 'https://example.com/pingback',
    }
    const expected = {
      server: 'https://example.com/pingback',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only target', () => {
    const value = {
      'pingback:target': 'https://example.com/post/123',
    }
    const expected = {
      target: 'https://example.com/post/123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'pingback:server': { '#text': 'https://example.com/pingback?foo=bar&amp;baz=qux' },
    }
    const expected = {
      server: 'https://example.com/pingback?foo=bar&baz=qux',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'pingback:server': { '#text': '<![CDATA[https://example.com/pingback]]>' },
    }
    const expected = {
      server: 'https://example.com/pingback',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'pingback:server': '',
      'pingback:target': 'https://example.com/post/123',
    }
    const expected = {
      target: 'https://example.com/post/123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'pingback:server': '   ',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
  })

  it('should handle array inputs by using first element', () => {
    const value = {
      'pingback:server': ['https://example.com/pingback1', 'https://example.com/pingback2'],
    }
    const expected = {
      server: 'https://example.com/pingback1',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with @rdf:resource attributes', () => {
    const value = {
      'pingback:server': {
        '@rdf:resource': 'https://example.com/pingback',
      },
      'pingback:target': {
        '@rdf:resource': 'https://example.com/post/123',
      },
    }
    const expected = {
      server: 'https://example.com/pingback',
      target: 'https://example.com/post/123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should prefer @rdf:resource over #text when both present', () => {
    const value = {
      'pingback:server': {
        '@rdf:resource': 'https://example.com/pingback',
        '#text': 'https://example.com/other',
      },
    }
    const expected = {
      server: 'https://example.com/pingback',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse mixed @rdf:resource and text content', () => {
    const value = {
      'pingback:server': {
        '@rdf:resource': 'https://example.com/pingback',
      },
      'pingback:target': 'https://example.com/post/123',
    }
    const expected = {
      server: 'https://example.com/pingback',
      target: 'https://example.com/post/123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })
})

describe('retrieveFeed', () => {
  it('should parse feed with to property', () => {
    const value = {
      'pingback:to': 'https://example.com/pingback-service',
    }
    const expected = {
      to: 'https://example.com/pingback-service',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'pingback:to': { '#text': 'https://example.com/pingback?foo=bar&amp;baz=qux' },
    }
    const expected = {
      to: 'https://example.com/pingback?foo=bar&baz=qux',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'pingback:to': { '#text': '<![CDATA[https://example.com/pingback-service]]>' },
    }
    const expected = {
      to: 'https://example.com/pingback-service',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'pingback:to': '',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'pingback:to': '   ',
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
      'pingback:to': ['https://example.com/service1', 'https://example.com/service2'],
    }
    const expected = {
      to: 'https://example.com/service1',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with @rdf:resource attribute', () => {
    const value = {
      'pingback:to': {
        '@rdf:resource': 'https://example.com/pingback-service',
      },
    }
    const expected = {
      to: 'https://example.com/pingback-service',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should prefer @rdf:resource over #text when both present', () => {
    const value = {
      'pingback:to': {
        '@rdf:resource': 'https://example.com/pingback-service',
        '#text': 'https://example.com/other-service',
      },
    }
    const expected = {
      to: 'https://example.com/pingback-service',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })
})
