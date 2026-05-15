import { describe, expect, it } from 'bun:test'
import { retrieveItemOrFeed } from './utils.js'

describe('retrieveItemOrFeed', () => {
  it('should parse complete XML namespace object with all properties', () => {
    const value = {
      '@xml:lang': 'en-US',
      '@xml:base': 'http://example.org/base/',
      '@xml:space': 'preserve',
      '@xml:id': 'unique-xml-id',
    }
    const expected = {
      lang: 'en-US',
      base: 'http://example.org/base/',
      space: 'preserve',
      id: 'unique-xml-id',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse object with only lang property', () => {
    const value = {
      '@xml:lang': 'fr-FR',
    }
    const expected = {
      lang: 'fr-FR',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse object with only base property', () => {
    const value = {
      '@xml:base': 'https://example.com/path/',
    }
    const expected = {
      base: 'https://example.com/path/',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse object with only space property', () => {
    const value = {
      '@xml:space': 'default',
    }
    const expected = {
      space: 'default',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse object with only id property', () => {
    const value = {
      '@xml:id': 'test-element-id',
    }
    const expected = {
      id: 'test-element-id',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should ignore non-XML namespace attributes', () => {
    const value = {
      '@xml:lang': 'en-US',
      '@href': 'http://example.com',
      '@title': 'Some title',
      '@rel': 'alternate',
      '@xml:base': 'http://example.org/',
      '@type': 'text/html',
    }
    const expected = {
      lang: 'en-US',
      base: 'http://example.org/',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@xml:lang': 'en',
      '@xml:id': 123,
      '@xml:space': true,
    }
    const expected = {
      lang: 'en',
      id: '123',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle boolean-like values', () => {
    const value = {
      '@xml:lang': false,
      '@xml:base': true,
      '@xml:space': 0,
      '@xml:id': 1,
    }
    const expected = {
      space: '0',
      id: '1',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle objects with empty string values', () => {
    const value = {
      '@xml:lang': '',
      '@xml:base': 'http://example.org/',
      '@xml:space': '',
      '@xml:id': 'valid-id',
    }
    const expected = {
      base: 'http://example.org/',
      id: 'valid-id',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle null values in properties', () => {
    const value = {
      '@xml:lang': null,
      '@xml:base': 'http://example.org/',
      '@xml:space': undefined,
      '@xml:id': 'valid-id',
    }
    const expected = {
      base: 'http://example.org/',
      id: 'valid-id',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle object with all properties having null/empty values', () => {
    const value = {
      '@xml:lang': null,
      '@xml:base': '',
      '@xml:space': undefined,
      '@xml:id': '',
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined when no XML namespace properties can be parsed', () => {
    const value = {
      'other:property': 'value',
      'unknown:field': 'data',
      '@href': 'http://example.com',
      '@title': 'Not XML namespace',
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItemOrFeed('not an object')).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed([])).toBeUndefined()
  })
})
