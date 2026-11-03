import { describe, expect, it } from 'bun:test'
import { retrieveItem } from './utils.js'

describe('retrieveItem', () => {
  it('should parse item with all properties', () => {
    const value = {
      'annotate:reference': {
        '@rdf:resource': 'http://forum.example.com/viewtopic.php?p=3194#3194',
      },
    }
    const expected = {
      reference: 'http://forum.example.com/viewtopic.php?p=3194#3194',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse reference from @resource attribute', () => {
    const value = {
      'annotate:reference': {
        '@resource': 'https://example.com/article/991790',
      },
    }
    const expected = {
      reference: 'https://example.com/article/991790',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse reference from text content', () => {
    const value = {
      'annotate:reference': 'https://example.com/news/show.php?361',
    }
    const expected = {
      reference: 'https://example.com/news/show.php?361',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should prefer @rdf:resource over #text when both present', () => {
    const value = {
      'annotate:reference': {
        '@rdf:resource': 'https://example.com/discuss/1',
        '#text': 'https://example.com/discuss/2',
      },
    }
    const expected = {
      reference: 'https://example.com/discuss/1',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities', () => {
    const value = {
      'annotate:reference': {
        '@rdf:resource': 'https://example.com/forum?topic=1&amp;p=2',
      },
    }
    const expected = {
      reference: 'https://example.com/forum?topic=1&p=2',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'annotate:reference': { '#text': '<![CDATA[https://example.com/discuss/1]]>' },
    }
    const expected = {
      reference: 'https://example.com/discuss/1',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'annotate:reference': { '@rdf:resource': '' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'annotate:reference': { '@rdf:resource': '   ' },
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
      'annotate:reference': [
        { '@rdf:resource': 'https://example.com/discuss/1' },
        { '@rdf:resource': 'https://example.com/discuss/2' },
      ],
    }
    const expected = {
      reference: 'https://example.com/discuss/1',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })
})
