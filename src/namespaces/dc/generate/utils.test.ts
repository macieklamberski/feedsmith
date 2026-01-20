import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate valid itemOrFeed object with all properties', () => {
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
      coverage: ['Global'],
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

  it('should generate valid itemOrFeed object with multiple values', () => {
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
      coverage: ['Global', 'Regional'],
      rights: ['Copyright 2023', 'All rights reserved'],
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
      'dc:coverage': ['Global', 'Regional'],
      'dc:rights': ['Copyright 2023', 'All rights reserved'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate itemOrFeed with minimal properties', () => {
    const value = {
      titles: ['Minimal Title'],
    }
    const expected = {
      'dc:title': ['Minimal Title'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      titles: undefined,
      creators: undefined,
      subjects: undefined,
      descriptions: undefined,
      publishers: undefined,
      contributors: undefined,
      dates: undefined,
      types: undefined,
      formats: undefined,
      identifiers: undefined,
      sources: undefined,
      languages: undefined,
      relations: undefined,
      coverage: undefined,
      rights: undefined,
    }

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle empty arrays in fields', () => {
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

  it('should handle coverage and rights arrays', () => {
    const value = {
      coverage: ['Worldwide', 'Europe', 'North America'],
      rights: ['CC BY 4.0', 'Public Domain'],
    }
    const expected = {
      'dc:coverage': ['Worldwide', 'Europe', 'North America'],
      'dc:rights': ['CC BY 4.0', 'Public Domain'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle date strings', () => {
    const value = {
      dates: ['2023-01-01T00:00:00Z', '2023-06-15T12:00:00Z'],
    }
    const expected = {
      'dc:date': ['2023-01-01T00:00:00.000Z', '2023-06-15T12:00:00.000Z'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })
})
