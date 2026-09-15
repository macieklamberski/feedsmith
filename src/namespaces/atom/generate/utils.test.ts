import { describe, expect, it } from 'bun:test'
import { generateEntry, generateFeed } from './utils.js'

describe('generateEntry', () => {
  it('should generate atom entry with prefixed elements', () => {
    const value = {
      updated: new Date('2023-03-15T12:00:00Z'),
      authors: [{ name: 'John Doe' }],
    }
    const expected = {
      'atom:updated': '2023-03-15T12:00:00.000Z',
      'atom:author': [{ name: 'John Doe' }],
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate atom entry with links', () => {
    const value = {
      links: [
        {
          href: 'https://example.com/entry/1',
          rel: 'alternate',
          type: 'text/html',
        },
      ],
    }
    const expected = {
      'atom:link': [
        {
          '@href': 'https://example.com/entry/1',
          '@rel': 'alternate',
          '@type': 'text/html',
        },
      ],
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      id: '',
      title: { value: 'Entry Title' },
    }
    const expected = {
      'atom:title': { '#text': 'Entry Title' },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      id: '   ',
    }

    expect(generateEntry(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateEntry({})).toBeUndefined()
  })

  it('should handle undefined input', () => {
    expect(generateEntry(undefined)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry(123)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry([])).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate atom feed with prefixed elements', () => {
    const value = {
      authors: [
        {
          name: 'John Doe',
          email: 'john@example.com',
        },
      ],
      links: [
        {
          href: 'https://example.com/feed.xml',
          rel: 'self',
          type: 'application/atom+xml',
        },
      ],
    }
    const expected = {
      'atom:author': [
        {
          'atom:name': 'John Doe',
          'atom:email': 'john@example.com',
        },
      ],
      'atom:link': [
        {
          '@href': 'https://example.com/feed.xml',
          '@rel': 'self',
          '@type': 'application/atom+xml',
        },
      ],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      id: '',
      title: { value: 'Feed Title' },
    }
    const expected = {
      'atom:title': { '#text': 'Feed Title' },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      id: '   ',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should handle undefined input', () => {
    expect(generateFeed(undefined)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed([])).toBeUndefined()
  })
})
