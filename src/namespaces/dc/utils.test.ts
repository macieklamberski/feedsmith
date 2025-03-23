import { describe, expect, it } from 'bun:test'
import { parseItemOrFeed } from './utils'

describe('parseItemOrFeed', () => {
  it('should parse complete item or feed object with all properties', () => {
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
    const expected = {
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

    expect(parseItemOrFeed(value)).toEqual(expected)
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

    expect(parseItemOrFeed(value)).toEqual(expected)
  })

  it('should handle object with only title property', () => {
    const value = {
      'dc:title': { '#text': 'Only Title' },
    }
    const expected = {
      title: 'Only Title',
    }

    expect(parseItemOrFeed(value)).toEqual(expected)
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

    expect(parseItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object value', () => {
    expect(parseItemOrFeed('not an object')).toBeUndefined()
    expect(parseItemOrFeed(undefined)).toBeUndefined()
    expect(parseItemOrFeed(null)).toBeUndefined()
    expect(parseItemOrFeed([])).toBeUndefined()
  })

  it('should return undefined when no properties can be parsed', () => {
    const value = {
      'other:property': { '#text': 'value' },
      'unknown:field': { '#text': 'data' },
    }

    expect(parseItemOrFeed(value)).toBeUndefined()
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

    expect(parseItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty strings in properties', () => {
    const value = {
      'dc:title': { '#text': '' },
      'dc:creator': { '#text': 'John Doe' },
      'dc:description': { '#text': '' },
    }
    const expected = {
      title: '',
      creator: 'John Doe',
      description: '',
    }

    expect(parseItemOrFeed(value)).toEqual(expected)
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

    expect(parseItemOrFeed(value)).toEqual(expected)
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

    expect(parseItemOrFeed(value)).toEqual(expected)
  })

  it('should handle object with all properties having null values', () => {
    const value = {
      'dc:title': { '#text': null },
      'dc:creator': { '#text': null },
      'dc:subject': { '#text': null },
    }

    expect(parseItemOrFeed(value)).toBeUndefined()
  })
})
