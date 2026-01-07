import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate valid XML namespace object with all properties', () => {
    const value = {
      lang: 'en-US',
      base: 'http://example.org/base/',
      space: 'preserve',
      id: 'unique-xml-id',
    }
    const expected = {
      '@xml:lang': 'en-US',
      '@xml:base': 'http://example.org/base/',
      '@xml:space': 'preserve',
      '@xml:id': 'unique-xml-id',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate XML namespace with minimal properties', () => {
    const value = {
      lang: 'fr-FR',
    }
    const expected = {
      '@xml:lang': 'fr-FR',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should filter out empty string values', () => {
    const value = {
      lang: '',
      base: 'http://example.org/',
      space: '',
      id: 'valid-id',
    }
    const expected = {
      '@xml:base': 'http://example.org/',
      '@xml:id': 'valid-id',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should filter out null values', () => {
    const value = {
      lang: null,
      base: 'http://example.org/',
      space: undefined,
      id: 'valid-id',
    }
    const expected = {
      '@xml:base': 'http://example.org/',
      '@xml:id': 'valid-id',
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle object with all properties having null/empty values', () => {
    const value = {
      lang: null,
      base: '',
      space: undefined,
      id: '',
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      lang: undefined,
      base: undefined,
      space: undefined,
      id: undefined,
    }

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateItemOrFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed('not an object')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed([])).toBeUndefined()
  })
})
