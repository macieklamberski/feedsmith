import { describe, expect, it } from 'bun:test'
import { generateFeed, generateQuery } from './utils.js'

describe('generateQuery', () => {
  it('should generate Query with all attributes', () => {
    const value = {
      role: 'request',
      searchTerms: 'quantum computing',
      count: 10,
      startIndex: 21,
      startPage: 3,
      language: 'en',
      inputEncoding: 'UTF-8',
      outputEncoding: 'UTF-8',
    }
    const expected = {
      '@role': 'request',
      '@searchTerms': 'quantum computing',
      '@count': 10,
      '@startIndex': 21,
      '@startPage': 3,
      '@language': 'en',
      '@inputEncoding': 'UTF-8',
      '@outputEncoding': 'UTF-8',
    }

    expect(generateQuery(value)).toEqual(expected)
  })

  it('should generate Query with role only', () => {
    const value = {
      role: 'example',
    }
    const expected = {
      '@role': 'example',
    }

    expect(generateQuery(value)).toEqual(expected)
  })

  it('should generate Query with partial attributes', () => {
    const value = {
      role: 'correction',
      searchTerms: 'spelling corrected',
      count: 5,
    }
    const expected = {
      '@role': 'correction',
      '@searchTerms': 'spelling corrected',
      '@count': 5,
    }

    expect(generateQuery(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      role: 'request',
      searchTerms: '',
      language: 'en',
    }
    const expected = {
      '@role': 'request',
      '@language': 'en',
    }

    expect(generateQuery(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
    expect(generateQuery(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateQuery('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateQuery(123)).toBeUndefined()
    expect(generateQuery(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateQuery(null)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      totalResults: 1000,
      startIndex: 21,
      itemsPerPage: 10,
      queries: [
        {
          role: 'request',
          searchTerms: 'electron',
        },
      ],
    }
    const expected = {
      'opensearch:totalResults': 1000,
      'opensearch:startIndex': 21,
      'opensearch:itemsPerPage': 10,
      'opensearch:Query': [
        {
          '@role': 'request',
          '@searchTerms': 'electron',
        },
      ],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with totalResults only', () => {
    const value = {
      totalResults: 500,
    }
    const expected = {
      'opensearch:totalResults': 500,
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with multiple Query elements', () => {
    const value = {
      totalResults: 100,
      queries: [
        { role: 'request', searchTerms: 'test' },
        { role: 'correction', searchTerms: 'tests' },
      ],
    }
    const expected = {
      'opensearch:totalResults': 100,
      'opensearch:Query': [
        { '@role': 'request', '@searchTerms': 'test' },
        { '@role': 'correction', '@searchTerms': 'tests' },
      ],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with 0-based indexing (arXiv style)', () => {
    const value = {
      totalResults: 1000,
      startIndex: 0,
      itemsPerPage: 10,
    }
    const expected = {
      'opensearch:totalResults': 1000,
      'opensearch:startIndex': 0,
      'opensearch:itemsPerPage': 10,
    }

    expect(generateFeed(value)).toEqual(expected)
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
})
