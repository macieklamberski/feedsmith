import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate valid itemOrFeed object with all singular (deprecated) properties', () => {
    const value = {
      title: 'Test Title',
      creator: 'John Doe',
      subject: 'Technology',
      description: 'A test description',
      publisher: 'Test Publisher',
      contributor: 'Jane Smith',
      date: new Date('2023-01-01T00:00:00Z'),
      type: 'Text',
      format: 'text/html',
      identifier: 'test-id-123',
      source: 'Test Source',
      language: 'en-US',
      relation: 'https://example.com/related',
      coverage: 'Global',
    }
    const expected = {
      'dc:title': 'Test Title',
      'dc:creator': 'John Doe',
      'dc:subject': 'Technology',
      'dc:description': 'A test description',
      'dc:publisher': 'Test Publisher',
      'dc:contributor': 'Jane Smith',
      'dc:date': '2023-01-01T00:00:00.000Z',
      'dc:type': 'Text',
      'dc:format': 'text/html',
      'dc:identifier': 'test-id-123',
      'dc:source': 'Test Source',
      'dc:language': 'en-US',
      'dc:relation': 'https://example.com/related',
      'dc:coverage': 'Global',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate valid itemOrFeed object with all plural properties (single values)', () => {
    const value = {
      titles: ['Test Title'],
      creators: ['John Doe'],
      subjects: ['Technology'],
      descriptions: ['A test description'],
      publishers: ['Test Publisher'],
      contributors: ['Jane Smith'],
      dates: [new Date('2023-01-01T00:00:00Z')],
      types: ['Text'],
      formats: ['text/html'],
      identifiers: ['test-id-123'],
      sources: ['Test Source'],
      languages: ['en-US'],
      relations: ['https://example.com/related'],
      coverages: ['Global'],
      rights: ['Copyright 2023'],
    }
    const expected = {
      'dc:title': ['Test Title'],
      'dc:creator': ['John Doe'],
      'dc:subject': ['Technology'],
      'dc:description': ['A test description'],
      'dc:publisher': ['Test Publisher'],
      'dc:contributor': ['Jane Smith'],
      'dc:date': ['2023-01-01T00:00:00.000Z'],
      'dc:type': ['Text'],
      'dc:format': ['text/html'],
      'dc:identifier': ['test-id-123'],
      'dc:source': ['Test Source'],
      'dc:language': ['en-US'],
      'dc:relation': ['https://example.com/related'],
      'dc:coverage': ['Global'],
      'dc:rights': ['Copyright 2023'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate valid itemOrFeed object with plural properties (multiple values)', () => {
    const value = {
      titles: ['Test Title', 'Alternative Title'],
      creators: ['John Doe', 'Jane Smith'],
      subjects: ['Technology', 'Science'],
      descriptions: ['A test description', 'Another description'],
      publishers: ['Test Publisher', 'Secondary Publisher'],
      contributors: ['Alice', 'Bob'],
      dates: [new Date('2023-01-01T00:00:00Z'), new Date('2023-06-15T12:00:00Z')],
      types: ['Text', 'Article'],
      formats: ['text/html', 'application/pdf'],
      identifiers: ['test-id-123', 'test-id-456'],
      sources: ['Test Source', 'Another Source'],
      languages: ['en-US', 'fr-FR'],
      relations: ['https://example.com/related', 'https://example.com/also-related'],
      coverages: ['Global', 'North America'],
      rights: ['Copyright 2023', 'CC BY-NC-SA 4.0'],
    }
    const expected = {
      'dc:title': ['Test Title', 'Alternative Title'],
      'dc:creator': ['John Doe', 'Jane Smith'],
      'dc:subject': ['Technology', 'Science'],
      'dc:description': ['A test description', 'Another description'],
      'dc:publisher': ['Test Publisher', 'Secondary Publisher'],
      'dc:contributor': ['Alice', 'Bob'],
      'dc:date': ['2023-01-01T00:00:00.000Z', '2023-06-15T12:00:00.000Z'],
      'dc:type': ['Text', 'Article'],
      'dc:format': ['text/html', 'application/pdf'],
      'dc:identifier': ['test-id-123', 'test-id-456'],
      'dc:source': ['Test Source', 'Another Source'],
      'dc:language': ['en-US', 'fr-FR'],
      'dc:relation': ['https://example.com/related', 'https://example.com/also-related'],
      'dc:coverage': ['Global', 'North America'],
      'dc:rights': ['Copyright 2023', 'CC BY-NC-SA 4.0'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should prefer plural fields over singular when both are provided', () => {
    const value = {
      title: 'Singular Title',
      titles: ['Plural Title 1', 'Plural Title 2'],
      creator: 'Singular Creator',
      creators: ['Plural Creator'],
    }
    const expected = {
      'dc:title': ['Plural Title 1', 'Plural Title 2'],
      'dc:creator': ['Plural Creator'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate itemOrFeed with minimal properties', () => {
    const value = {
      title: 'Minimal Title',
    }
    const expected = {
      'dc:title': 'Minimal Title',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      title: undefined,
      creator: undefined,
      subject: undefined,
      description: undefined,
      publisher: undefined,
      contributor: undefined,
      date: undefined,
      type: undefined,
      format: undefined,
      identifier: undefined,
      source: undefined,
      language: undefined,
      relation: undefined,
      coverage: undefined,
    }

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle empty arrays in plural fields', () => {
    const value = {
      titles: [],
      creators: ['John Doe'],
      subjects: [],
    }
    const expected = {
      'dc:creator': ['John Doe'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateItemOrFeed(undefined)).toBeUndefined()
  })
})
