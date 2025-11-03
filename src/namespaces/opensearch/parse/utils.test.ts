import { describe, expect, it } from 'bun:test'
import { parseQuery, retrieveFeed } from './utils.js'

describe('parseQuery', () => {
  it('should parse Query with all attributes', () => {
    const value = {
      '@role': 'request',
      '@searchterms': 'quantum computing',
      '@count': '10',
      '@startindex': '21',
      '@startpage': '3',
      '@language': 'en',
      '@inputencoding': 'UTF-8',
      '@outputencoding': 'UTF-8',
    }
    const expected = {
      role: 'request',
      searchTerms: 'quantum computing',
      count: 10,
      startIndex: 21,
      startPage: 3,
      language: 'en',
      inputEncoding: 'UTF-8',
      outputEncoding: 'UTF-8',
    }

    expect(parseQuery(value)).toEqual(expected)
  })

  it('should parse Query with role only', () => {
    const value = {
      '@role': 'example',
    }
    const expected = {
      role: 'example',
    }

    expect(parseQuery(value)).toEqual(expected)
  })

  it('should parse Query with partial attributes', () => {
    const value = {
      '@role': 'correction',
      '@searchterms': 'spelling corrected',
      '@count': '5',
    }
    const expected = {
      role: 'correction',
      searchTerms: 'spelling corrected',
      count: 5,
    }

    expect(parseQuery(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseQuery(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseQuery(null)).toBeUndefined()
    expect(parseQuery(undefined)).toBeUndefined()
    expect(parseQuery('string')).toBeUndefined()
    expect(parseQuery(123)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse feed with all OpenSearch properties', () => {
    const value = {
      'opensearch:totalresults': '1000',
      'opensearch:startindex': '21',
      'opensearch:itemsperpage': '10',
      'opensearch:query': {
        '@role': 'request',
        '@searchterms': 'electron',
      },
    }
    const expected = {
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

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with totalResults only', () => {
    const value = {
      'opensearch:totalresults': '500',
    }
    const expected = {
      totalResults: 500,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with multiple Query elements', () => {
    const value = {
      'opensearch:totalresults': '100',
      'opensearch:query': [
        { '@role': 'request', '@searchterms': 'test' },
        { '@role': 'correction', '@searchterms': 'tests' },
      ],
    }
    const expected = {
      totalResults: 100,
      queries: [
        { role: 'request', searchTerms: 'test' },
        { role: 'correction', searchTerms: 'tests' },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with single Query element', () => {
    const value = {
      'opensearch:totalresults': '247',
      'opensearch:startindex': '1',
      'opensearch:itemsperpage': '10',
      'opensearch:query': {
        '@role': 'request',
        '@searchterms': 'quantum computing',
      },
    }
    const expected = {
      totalResults: 247,
      startIndex: 1,
      itemsPerPage: 10,
      queries: [
        {
          role: 'request',
          searchTerms: 'quantum computing',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'opensearch:totalresults': '',
      'opensearch:startindex': '21',
    }
    const expected = {
      startIndex: 21,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle 0-based indexing (arXiv style)', () => {
    const value = {
      'opensearch:totalresults': '1000',
      'opensearch:startindex': '0',
      'opensearch:itemsperpage': '10',
    }
    const expected = {
      totalResults: 1000,
      startIndex: 0,
      itemsPerPage: 10,
    }

    expect(retrieveFeed(value)).toEqual(expected)
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
})
