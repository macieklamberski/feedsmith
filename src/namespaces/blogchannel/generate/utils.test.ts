import { describe, expect, it } from 'bun:test'
import { generateFeed } from './utils.js'

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      blogRoll: 'http://example.com/blogroll.opml',
      blink: 'http://recommended.example.com/',
      mySubscriptions: 'http://example.com/subscriptions.opml',
    }
    const expected = {
      'blogChannel:blogRoll': 'http://example.com/blogroll.opml',
      'blogChannel:blink': 'http://recommended.example.com/',
      'blogChannel:mySubscriptions': 'http://example.com/subscriptions.opml',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only blogRoll', () => {
    const value = {
      blogRoll: 'http://example.com/blogroll.opml',
    }
    const expected = {
      'blogChannel:blogRoll': 'http://example.com/blogroll.opml',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only blink', () => {
    const value = {
      blink: 'http://recommended.example.com/',
    }
    const expected = {
      'blogChannel:blink': 'http://recommended.example.com/',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only mySubscriptions', () => {
    const value = {
      mySubscriptions: 'http://example.com/subscriptions.opml',
    }
    const expected = {
      'blogChannel:mySubscriptions': 'http://example.com/subscriptions.opml',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      blogRoll: '',
      blink: 'http://recommended.example.com/',
    }
    const expected = {
      'blogChannel:blink': 'http://recommended.example.com/',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      blogRoll: '   ',
      blink: '\t\n',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle object with all undefined properties', () => {
    const value = {
      blogRoll: undefined,
      blink: undefined,
      mySubscriptions: undefined,
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

  const urlFormatCases: Array<[string, { 'blogChannel:blogRoll': string }]> = [
    [
      'http://example.com/blogroll.opml',
      { 'blogChannel:blogRoll': 'http://example.com/blogroll.opml' },
    ],
    [
      'https://example.com/blogroll.opml',
      { 'blogChannel:blogRoll': 'https://example.com/blogroll.opml' },
    ],
    [
      'http://example.com/blogroll.opml?format=opml',
      { 'blogChannel:blogRoll': 'http://example.com/blogroll.opml?format=opml' },
    ],
    [
      'http://example.com/path/to/blogroll.opml',
      { 'blogChannel:blogRoll': 'http://example.com/path/to/blogroll.opml' },
    ],
  ]

  it.each(urlFormatCases)('should handle URL format: %s', (blogRoll, expected) => {
    expect(generateFeed({ blogRoll })).toEqual(expected)
  })

  it('should handle partial feed data', () => {
    const value = {
      blogRoll: 'http://example.com/blogroll.opml',
      mySubscriptions: 'http://example.com/subscriptions.opml',
    }
    const expected = {
      'blogChannel:blogRoll': 'http://example.com/blogroll.opml',
      'blogChannel:mySubscriptions': 'http://example.com/subscriptions.opml',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle mixed empty and valid strings', () => {
    const value = {
      blogRoll: '',
      blink: 'http://recommended.example.com/',
      mySubscriptions: '   ',
    }
    const expected = {
      'blogChannel:blink': 'http://recommended.example.com/',
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
