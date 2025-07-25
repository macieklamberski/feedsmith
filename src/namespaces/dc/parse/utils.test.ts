import { describe, expect, it } from 'bun:test'
import { retrieveItemOrFeed } from './utils.js'

describe('retrieveItemOrFeed', () => {
  const expectedFull = {
    title: 'Sample Title',
    creator: 'John Doe',
    subject: 'Test Subject',
    description: 'This is a description',
    publisher: 'Test Publisher',
    contributor: 'Jane Smith',
    date: '2023-05-15T09:30:00Z',
    type: 'Article',
    format: 'text/html',
    identifier: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
    source: 'https://example.org/source',
    language: 'en-US',
    relation: 'https://example.org/related',
    coverage: 'Worldwide',
    rights: 'Copyright 2023, All rights reserved',
  }

  it('should parse complete item or feed object with all properties (with #text)', () => {
    const value = {
      'dc:title': { '#text': 'Sample Title' },
      'dc:creator': { '#text': 'John Doe' },
      'dc:subject': { '#text': 'Test Subject' },
      'dc:description': { '#text': 'This is a description' },
      'dc:publisher': { '#text': 'Test Publisher' },
      'dc:contributor': { '#text': 'Jane Smith' },
      'dc:date': { '#text': '2023-05-15T09:30:00Z' },
      'dc:type': { '#text': 'Article' },
      'dc:format': { '#text': 'text/html' },
      'dc:identifier': { '#text': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a' },
      'dc:source': { '#text': 'https://example.org/source' },
      'dc:language': { '#text': 'en-US' },
      'dc:relation': { '#text': 'https://example.org/related' },
      'dc:coverage': { '#text': 'Worldwide' },
      'dc:rights': { '#text': 'Copyright 2023, All rights reserved' },
    }

    expect(retrieveItemOrFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete item or feed object with all properties (without #text)', () => {
    const value = {
      'dc:title': 'Sample Title',
      'dc:creator': 'John Doe',
      'dc:subject': 'Test Subject',
      'dc:description': 'This is a description',
      'dc:publisher': 'Test Publisher',
      'dc:contributor': 'Jane Smith',
      'dc:date': '2023-05-15T09:30:00Z',
      'dc:type': 'Article',
      'dc:format': 'text/html',
      'dc:identifier': 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
      'dc:source': 'https://example.org/source',
      'dc:language': 'en-US',
      'dc:relation': 'https://example.org/related',
      'dc:coverage': 'Worldwide',
      'dc:rights': 'Copyright 2023, All rights reserved',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete item or feed object with all properties (with array of values)', () => {
    const value = {
      'dc:title': ['Sample Title', 'Alternative Title'],
      'dc:creator': ['John Doe', 'Richard Roe'],
      'dc:subject': ['Test Subject', 'Secondary Subject'],
      'dc:description': ['This is a description', 'This is an alternative description'],
      'dc:publisher': ['Test Publisher', 'Another Publisher'],
      'dc:contributor': ['Jane Smith', 'Alice Johnson'],
      'dc:date': ['2023-05-15T09:30:00Z', '2023-06-20T14:45:00Z'],
      'dc:type': ['Article', 'Blog Post'],
      'dc:format': ['text/html', 'application/pdf'],
      'dc:identifier': [
        'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
        'urn:uuid:2335d785-dfc9-5fcc-bbbb-90eb455efa7b',
      ],
      'dc:source': ['https://example.org/source', 'https://example.org/alternate-source'],
      'dc:language': ['en-US', 'fr-FR'],
      'dc:relation': ['https://example.org/related', 'https://example.org/also-related'],
      'dc:coverage': ['Worldwide', 'North America'],
      'dc:rights': ['Copyright 2023, All rights reserved', 'Creative Commons BY-NC-SA 4.0'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expectedFull)
  })

  it('should handle partial dublincore object with common properties', () => {
    const value = {
      'dc:title': { '#text': 'Sample Title' },
      'dc:creator': { '#text': 'John Doe' },
      'dc:date': { '#text': '2023-05-15T09:30:00Z' },
    }
    const expected = {
      title: 'Sample Title',
      creator: 'John Doe',
      date: '2023-05-15T09:30:00Z',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle object with only title property', () => {
    const value = {
      'dc:title': { '#text': 'Only Title' },
    }
    const expected = {
      title: 'Only Title',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'dc:title': { '#text': 123 },
      'dc:date': { '#text': true },
      'dc:identifier': { '#text': 456 },
    }
    const expected = {
      title: '123',
      identifier: '456',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItemOrFeed('not an object')).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed([])).toBeUndefined()
  })

  it('should return undefined when no properties can be parsed', () => {
    const value = {
      'other:property': { '#text': 'value' },
      'unknown:field': { '#text': 'data' },
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should handle objects with missing #text property', () => {
    const value = {
      'dc:title': {},
      'dc:creator': { '#text': 'John Doe' },
      'dc:date': { '#text': '2023-01-01T12:00:00Z' },
    }
    const expected = {
      creator: 'John Doe',
      date: '2023-01-01T12:00:00Z',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty strings in properties', () => {
    const value = {
      'dc:title': { '#text': '' },
      'dc:creator': { '#text': 'John Doe' },
      'dc:description': { '#text': '' },
    }
    const expected = {
      creator: 'John Doe',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle null values in properties', () => {
    const value = {
      'dc:title': { '#text': null },
      'dc:creator': { '#text': 'John Doe' },
      'dc:date': { '#text': undefined },
    }
    const expected = {
      creator: 'John Doe',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle numeric values in properties', () => {
    const value = {
      'dc:identifier': { '#text': 12345 },
      'dc:language': { '#text': 'en' },
    }
    const expected = {
      identifier: '12345',
      language: 'en',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle object with all properties having null values', () => {
    const value = {
      'dc:title': { '#text': null },
      'dc:creator': { '#text': null },
      'dc:subject': { '#text': null },
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })
})
