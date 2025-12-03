import { describe, expect, it } from 'bun:test'
import { retrieveAbout, retrieveElement } from './utils.js'

describe('retrieveAbout', () => {
  it('should parse about attribute (normalized)', () => {
    const value = {
      '@about': 'http://example.com/item/1',
    }
    const expected = {
      about: 'http://example.com/item/1',
    }

    expect(retrieveAbout(value)).toEqual(expected)
  })

  it('should parse about attribute (non-normalized)', () => {
    const value = {
      '@rdf:about': 'http://example.com/item/1',
    }
    const expected = {
      about: 'http://example.com/item/1',
    }

    expect(retrieveAbout(value)).toEqual(expected)
  })

  it('should prefer normalized over non-normalized', () => {
    const value = {
      '@about': 'http://normalized.com',
      '@rdf:about': 'http://non-normalized.com',
    }
    const expected = {
      about: 'http://normalized.com',
    }

    expect(retrieveAbout(value)).toEqual(expected)
  })

  it('should ignore other RDF attributes', () => {
    const value = {
      '@about': 'http://example.com/item',
      '@resource': 'http://example.com/resource',
      '@parseType': 'Literal',
    }
    const expected = {
      about: 'http://example.com/item',
    }

    expect(retrieveAbout(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      '@about': '',
    }

    expect(retrieveAbout(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      '@about': '   ',
    }

    expect(retrieveAbout(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveAbout(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveAbout(null)).toBeUndefined()
    expect(retrieveAbout(undefined)).toBeUndefined()
    expect(retrieveAbout('string')).toBeUndefined()
    expect(retrieveAbout(123)).toBeUndefined()
  })
})

describe('retrieveElement', () => {
  it('should parse complete element with all properties (normalized)', () => {
    const value = {
      '@about': 'http://example.com/item/1',
      '@resource': 'http://example.com/resource',
      '@id': 'item1',
      '@nodeid': 'node1',
      '@parsetype': 'Literal',
      '@datatype': 'http://www.w3.org/2001/XMLSchema#string',
      type: { '@resource': 'http://example.com/Article' },
      value: ['Some value'],
    }
    const expected = {
      about: 'http://example.com/item/1',
      resource: 'http://example.com/resource',
      id: 'item1',
      nodeId: 'node1',
      parseType: 'Literal',
      datatype: 'http://www.w3.org/2001/XMLSchema#string',
      type: 'http://example.com/Article',
      value: ['Some value'],
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse complete element with all properties (non-normalized)', () => {
    const value = {
      '@rdf:about': 'http://example.com/item/1',
      '@rdf:resource': 'http://example.com/resource',
      '@rdf:id': 'item1',
      '@rdf:nodeid': 'node1',
      '@rdf:parsetype': 'Resource',
      '@rdf:datatype': 'http://www.w3.org/2001/XMLSchema#integer',
      'rdf:type': { '@rdf:resource': 'http://example.com/BlogPost' },
      'rdf:value': ['Content here'],
    }
    const expected = {
      about: 'http://example.com/item/1',
      resource: 'http://example.com/resource',
      id: 'item1',
      nodeId: 'node1',
      parseType: 'Resource',
      datatype: 'http://www.w3.org/2001/XMLSchema#integer',
      type: 'http://example.com/BlogPost',
      value: ['Content here'],
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse id attribute only', () => {
    const value = {
      '@id': 'uniqueId123',
    }
    const expected = {
      id: 'uniqueId123',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse nodeId attribute only', () => {
    const value = {
      '@nodeid': 'blankNode42',
    }
    const expected = {
      nodeId: 'blankNode42',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should prefer normalized over non-normalized attributes', () => {
    const value = {
      '@about': 'http://normalized.com',
      '@rdf:about': 'http://non-normalized.com',
    }
    const expected = {
      about: 'http://normalized.com',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse about attribute only', () => {
    const value = {
      '@about': 'http://example.com/feed',
    }
    const expected = {
      about: 'http://example.com/feed',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse resource attribute only', () => {
    const value = {
      '@resource': 'http://example.com/linked-resource',
    }
    const expected = {
      resource: 'http://example.com/linked-resource',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse parseType attribute', () => {
    const value = {
      '@parsetype': 'Collection',
    }
    const expected = {
      parseType: 'Collection',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse datatype attribute', () => {
    const value = {
      '@datatype': 'http://www.w3.org/2001/XMLSchema#dateTime',
    }
    const expected = {
      datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse type element with resource attribute', () => {
    const value = {
      type: { '@resource': 'http://schema.org/NewsArticle' },
    }
    const expected = {
      type: 'http://schema.org/NewsArticle',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse type element with rdf:resource attribute', () => {
    const value = {
      'rdf:type': { '@rdf:resource': 'http://schema.org/BlogPosting' },
    }
    const expected = {
      type: 'http://schema.org/BlogPosting',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse type element with text content', () => {
    const value = {
      'rdf:type': { '#text': 'http://schema.org/Article' },
    }
    const expected = {
      type: 'http://schema.org/Article',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse type element as plain string', () => {
    const value = {
      'rdf:type': 'http://schema.org/WebPage',
    }
    const expected = {
      type: 'http://schema.org/WebPage',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should prefer rdf:resource over text content for type', () => {
    const value = {
      'rdf:type': {
        '@rdf:resource': 'http://schema.org/Article',
        '#text': 'http://schema.org/BlogPosting',
      },
    }
    const expected = {
      type: 'http://schema.org/Article',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse single value element', () => {
    const value = {
      value: 'Single value',
    }
    const expected = {
      value: ['Single value'],
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse multiple value elements', () => {
    const value = {
      value: ['First value', 'Second value', 'Third value'],
    }
    const expected = {
      value: ['First value', 'Second value', 'Third value'],
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should parse value with #text content', () => {
    const value = {
      value: { '#text': 'Text content' },
    }
    const expected = {
      value: ['Text content'],
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      '@about': '',
      '@resource': 'http://example.com/resource',
    }
    const expected = {
      resource: 'http://example.com/resource',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      '@about': '   ',
    }

    expect(retrieveElement(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveElement(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveElement(null)).toBeUndefined()
    expect(retrieveElement(undefined)).toBeUndefined()
    expect(retrieveElement('string')).toBeUndefined()
    expect(retrieveElement(123)).toBeUndefined()
  })

  it('should handle type element as array (uses first)', () => {
    const value = {
      type: [
        { '@resource': 'http://example.com/PrimaryType' },
        { '@resource': 'http://example.com/SecondaryType' },
      ],
    }
    const expected = {
      type: 'http://example.com/PrimaryType',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should handle mixed normalized and non-normalized elements', () => {
    const value = {
      '@about': 'http://example.com/item',
      '@rdf:datatype': 'http://www.w3.org/2001/XMLSchema#string',
      type: { '@rdf:resource': 'http://example.com/Type' },
      'rdf:value': ['Value 1', 'Value 2'],
    }
    const expected = {
      about: 'http://example.com/item',
      datatype: 'http://www.w3.org/2001/XMLSchema#string',
      type: 'http://example.com/Type',
      value: ['Value 1', 'Value 2'],
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should handle type element with text content (normalized)', () => {
    const value = {
      type: { '#text': 'http://example.com/PlainType' },
    }
    const expected = {
      type: 'http://example.com/PlainType',
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should handle empty values in value array', () => {
    const value = {
      value: ['Valid', 'Also valid'],
    }
    const expected = {
      value: ['Valid', 'Also valid'],
    }

    expect(retrieveElement(value)).toEqual(expected)
  })

  it('should handle value elements with text content', () => {
    const value = {
      value: [{ '#text': 'Text value' }, 'Plain string'],
    }
    const expected = {
      value: ['Text value', 'Plain string'],
    }

    expect(retrieveElement(value)).toEqual(expected)
  })
})
