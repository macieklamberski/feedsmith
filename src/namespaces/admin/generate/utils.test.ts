import { describe, expect, it } from 'bun:test'
import { generateFeed } from './utils.js'

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      errorReportsTo: 'mailto:admin@example.com',
      generatorAgent: 'http://www.example.com/generator/1.0',
    }
    const expected = {
      'admin:errorReportsTo': {
        '@rdf:resource': 'mailto:admin@example.com',
      },
      'admin:generatorAgent': {
        '@rdf:resource': 'http://www.example.com/generator/1.0',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only errorReportsTo', () => {
    const value = {
      errorReportsTo: 'mailto:webmaster@example.org',
    }
    const expected = {
      'admin:errorReportsTo': {
        '@rdf:resource': 'mailto:webmaster@example.org',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only generatorAgent', () => {
    const value = {
      generatorAgent: 'http://www.movabletype.org/?v=3.2',
    }
    const expected = {
      'admin:generatorAgent': {
        '@rdf:resource': 'http://www.movabletype.org/?v=3.2',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      errorReportsTo: '',
      generatorAgent: 'http://www.example.com/generator',
    }
    const expected = {
      'admin:generatorAgent': {
        '@rdf:resource': 'http://www.example.com/generator',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      errorReportsTo: '   ',
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

  it('should trim whitespace from values', () => {
    const value = {
      errorReportsTo: '  mailto:admin@example.com  ',
      generatorAgent: '  http://www.example.com/generator  ',
    }
    const expected = {
      'admin:errorReportsTo': {
        '@rdf:resource': 'mailto:admin@example.com',
      },
      'admin:generatorAgent': {
        '@rdf:resource': 'http://www.example.com/generator',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle mailto URIs with parameters', () => {
    const value = {
      errorReportsTo: 'mailto:admin@example.com?subject=Feed Error',
    }
    const expected = {
      'admin:errorReportsTo': {
        '@rdf:resource': 'mailto:admin@example.com?subject=Feed Error',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle https URLs', () => {
    const value = {
      errorReportsTo: 'https://example.com/contact',
      generatorAgent: 'https://www.example.com/generator/2.0',
    }
    const expected = {
      'admin:errorReportsTo': {
        '@rdf:resource': 'https://example.com/contact',
      },
      'admin:generatorAgent': {
        '@rdf:resource': 'https://www.example.com/generator/2.0',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle URLs with query parameters and fragments', () => {
    const value = {
      generatorAgent: 'http://www.example.com/generator?version=1.0&build=123#info',
    }
    const expected = {
      'admin:generatorAgent': {
        '@rdf:resource': 'http://www.example.com/generator?version=1.0&build=123#info',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle URNs', () => {
    const value = {
      generatorAgent: 'urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
    }
    const expected = {
      'admin:generatorAgent': {
        '@rdf:resource': 'urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
