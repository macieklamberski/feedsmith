import { describe, expect, it } from 'bun:test'
import { parseLink, parseQuery, retrieveFeed } from './utils.js'

describe('parseQuery', () => {
  it('should parse Query with all attributes', () => {
    const value = {
      '@role': 'request',
      '@title': 'Search results for quantum computing',
      '@totalresults': '4230000',
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
      title: 'Search results for quantum computing',
      totalResults: 4230000,
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

  it('should handle coercible numeric values', () => {
    const value = {
      '@role': 'request',
      '@count': 10,
      '@startindex': 21,
    }
    const expected = {
      role: 'request',
      count: 10,
      startIndex: 21,
    }

    expect(parseQuery(value)).toEqual(expected)
  })

  it('should handle mixed valid and invalid attributes', () => {
    const value = {
      '@role': 'request',
      '@count': 'not a number',
      '@searchterms': '',
      '@language': 'en',
    }
    const expected = {
      role: 'request',
      language: 'en',
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

describe('parseLink', () => {
  it('should parse link with all attributes', () => {
    const value = {
      '@href': 'http://example.com/opensearchdescription.xml',
      '@rel': 'search',
      '@type': 'application/opensearchdescription+xml',
      '@hreflang': 'en',
    }
    const expected = {
      href: 'http://example.com/opensearchdescription.xml',
      rel: 'search',
      type: 'application/opensearchdescription+xml',
      hreflang: 'en',
    }

    expect(parseLink(value)).toEqual(expected)
  })

  it('should parse link with href only', () => {
    const value = {
      '@href': 'http://example.com/opensearchdescription.xml',
    }
    const expected = {
      href: 'http://example.com/opensearchdescription.xml',
    }

    expect(parseLink(value)).toEqual(expected)
  })

  it('should handle HTML entities in attributes', () => {
    const value = {
      '@href': 'http://example.com/osd.xml?a=1&amp;b=2',
    }
    const expected = {
      href: 'http://example.com/osd.xml?a=1&b=2',
    }

    expect(parseLink(value)).toEqual(expected)
  })

  it('should handle empty and whitespace-only attributes', () => {
    const value = {
      '@href': 'http://example.com/opensearchdescription.xml',
      '@rel': '',
      '@type': '   ',
    }
    const expected = {
      href: 'http://example.com/opensearchdescription.xml',
    }

    expect(parseLink(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseLink(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseLink(null)).toBeUndefined()
    expect(parseLink(undefined)).toBeUndefined()
    expect(parseLink('string')).toBeUndefined()
    expect(parseLink(123)).toBeUndefined()
    expect(parseLink([])).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse feed with all OpenSearch properties', () => {
    const value = {
      'opensearch:totalresults': '1000',
      'opensearch:startindex': '21',
      'opensearch:itemsperpage': '10',
      'opensearch:link': {
        '@href': 'http://example.com/opensearchdescription.xml',
        '@rel': 'search',
        '@type': 'application/opensearchdescription+xml',
      },
      'opensearch:query': {
        '@role': 'request',
        '@searchterms': 'electron',
      },
    }
    const expected = {
      totalResults: 1000,
      startIndex: 21,
      itemsPerPage: 10,
      link: {
        href: 'http://example.com/opensearchdescription.xml',
        rel: 'search',
        type: 'application/opensearchdescription+xml',
      },
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

  it('should parse feed with link only', () => {
    const value = {
      'opensearch:link': {
        '@href': 'http://example.com/opensearchdescription.xml',
      },
    }
    const expected = {
      link: {
        href: 'http://example.com/opensearchdescription.xml',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse first link when multiple are present', () => {
    const value = {
      'opensearch:link': [
        { '@href': 'http://example.com/first.xml' },
        { '@href': 'http://example.com/second.xml' },
      ],
    }
    const expected = {
      link: {
        href: 'http://example.com/first.xml',
      },
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

  it('should handle 0-based indexing', () => {
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
