import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate valid itemOrFeed object with all properties', () => {
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
      rights: 'Copyright 2023',
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
      'dc:rights': 'Copyright 2023',
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
      rights: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateItemOrFeed(undefined)).toBeUndefined()
  })
})
