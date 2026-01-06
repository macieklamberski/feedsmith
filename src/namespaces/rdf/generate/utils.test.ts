import { describe, expect, it } from 'bun:test'
import { generateAbout, generateElement } from './utils.js'

describe('generateAbout', () => {
  it('should generate about attribute', () => {
    const value = {
      about: 'http://example.com/item/1',
    }
    const expected = {
      '@rdf:about': 'http://example.com/item/1',
    }

    expect(generateAbout(value)).toEqual(expected)
  })

  it('should handle empty string', () => {
    const value = {
      about: '',
    }

    expect(generateAbout(value)).toBeUndefined()
  })

  it('should handle whitespace-only string', () => {
    const value = {
      about: '   ',
    }

    expect(generateAbout(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateAbout(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateAbout('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateAbout(123)).toBeUndefined()
    expect(generateAbout(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateAbout(null)).toBeUndefined()
  })

  it('should handle undefined about value', () => {
    const value = {
      about: undefined,
    }

    expect(generateAbout(value)).toBeUndefined()
  })
})

describe('generateElement', () => {
  it('should generate complete element with all properties', () => {
    const value = {
      about: 'http://example.com/item/1',
      resource: 'http://example.com/resource',
      id: 'item1',
      nodeId: 'node1',
      parseType: 'Literal',
      datatype: 'http://www.w3.org/2001/XMLSchema#string',
      type: 'http://example.com/Article',
      value: ['Some value'],
    }
    const expected = {
      '@rdf:about': 'http://example.com/item/1',
      '@rdf:resource': 'http://example.com/resource',
      '@rdf:ID': 'item1',
      '@rdf:nodeID': 'node1',
      '@rdf:parseType': 'Literal',
      '@rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
      'rdf:type': { '@rdf:resource': 'http://example.com/Article' },
      'rdf:value': ['Some value'],
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should generate id attribute only', () => {
    const value = {
      id: 'uniqueId123',
    }
    const expected = {
      '@rdf:ID': 'uniqueId123',
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should generate nodeId attribute only', () => {
    const value = {
      nodeId: 'blankNode42',
    }
    const expected = {
      '@rdf:nodeID': 'blankNode42',
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should generate about attribute only', () => {
    const value = {
      about: 'http://example.com/feed',
    }
    const expected = {
      '@rdf:about': 'http://example.com/feed',
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should generate resource attribute only', () => {
    const value = {
      resource: 'http://example.com/linked-resource',
    }
    const expected = {
      '@rdf:resource': 'http://example.com/linked-resource',
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should generate parseType attribute', () => {
    const value = {
      parseType: 'Resource',
    }
    const expected = {
      '@rdf:parseType': 'Resource',
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should generate datatype attribute', () => {
    const value = {
      datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
    }
    const expected = {
      '@rdf:datatype': 'http://www.w3.org/2001/XMLSchema#dateTime',
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should generate type element with resource attribute', () => {
    const value = {
      type: 'http://schema.org/NewsArticle',
    }
    const expected = {
      'rdf:type': { '@rdf:resource': 'http://schema.org/NewsArticle' },
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should generate single value element', () => {
    const value = {
      value: ['Single value'],
    }
    const expected = {
      'rdf:value': ['Single value'],
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should generate multiple value elements', () => {
    const value = {
      value: ['First value', 'Second value', 'Third value'],
    }
    const expected = {
      'rdf:value': ['First value', 'Second value', 'Third value'],
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      about: '',
      resource: 'http://example.com/resource',
    }
    const expected = {
      '@rdf:resource': 'http://example.com/resource',
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      about: '   ',
    }

    expect(generateElement(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateElement(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateElement('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateElement(123)).toBeUndefined()
    expect(generateElement(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateElement(null)).toBeUndefined()
  })

  it('should handle undefined values', () => {
    const value = {
      about: 'http://example.com/item',
      resource: undefined,
      type: undefined,
    }
    const expected = {
      '@rdf:about': 'http://example.com/item',
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should handle empty value array', () => {
    const value = {
      about: 'http://example.com/item',
      value: [],
    }
    const expected = {
      '@rdf:about': 'http://example.com/item',
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should handle mixed values in array', () => {
    const value = {
      value: ['String value', 123, { nested: 'object' }],
    }
    const expected = {
      'rdf:value': ['String value', 123, { nested: 'object' }],
    }

    expect(generateElement(value)).toEqual(expected)
  })

  it('should generate multiple attributes together', () => {
    const value = {
      about: 'http://example.com/item',
      parseType: 'Literal',
      datatype: 'http://www.w3.org/2001/XMLSchema#string',
    }
    const expected = {
      '@rdf:about': 'http://example.com/item',
      '@rdf:parseType': 'Literal',
      '@rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
    }

    expect(generateElement(value)).toEqual(expected)
  })
})
