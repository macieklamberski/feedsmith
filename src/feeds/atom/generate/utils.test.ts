import { describe, expect, it } from 'bun:test'
import {
  generateCategory,
  generateEntry,
  generateFeed,
  generateGenerator,
  generateLink,
  generatePerson,
  generateSource,
  generateText,
} from './utils.js'

describe('generateText', () => {
  it('should pass through non-empty string text', () => {
    const value = 'Hello World'
    const expected = 'Hello World'

    expect(generateText(value)).toEqual(expected)
  })

  it('should return undefined for empty string', () => {
    expect(generateText('')).toBeUndefined()
  })

  it('should return undefined for whitespace-only string', () => {
    expect(generateText('   ')).toBeUndefined()
  })

  it('should pass through undefined', () => {
    expect(generateText(undefined)).toBeUndefined()
  })
})

describe('generateLink', () => {
  it('should generate valid link object with all properties', () => {
    const value = {
      href: 'https://example.com/feed.xml',
      rel: 'self',
      type: 'application/atom+xml',
      hreflang: 'en',
      title: 'Example Feed',
      length: 1024,
    }
    const expected = {
      '@href': 'https://example.com/feed.xml',
      '@rel': 'self',
      '@type': 'application/atom+xml',
      '@hreflang': 'en',
      '@title': 'Example Feed',
      '@length': 1024,
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should generate link with minimal properties (href only)', () => {
    const value = {
      href: 'https://example.com',
    }
    const expected = {
      '@href': 'https://example.com',
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      href: undefined,
      rel: undefined,
      type: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateLink(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateLink(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateLink(undefined)).toBeUndefined()
  })

  it('should generate link with thr namespace attributes', () => {
    const value = {
      href: 'https://example.com/comments',
      rel: 'replies',
      type: 'application/atom+xml',
      thr: {
        count: 5,
        updated: new Date('2023-03-15T12:00:00Z'),
      },
    }
    const expected = {
      '@href': 'https://example.com/comments',
      '@rel': 'replies',
      '@type': 'application/atom+xml',
      '@thr:count': 5,
      '@thr:updated': '2023-03-15T12:00:00.000Z',
    }

    expect(generateLink(value)).toEqual(expected)
  })
})

describe('generatePerson', () => {
  it('should generate valid person object with all properties', () => {
    const value = {
      name: 'John Doe',
      uri: 'https://example.com/john',
      email: 'john@example.com',
    }
    const expected = {
      name: 'John Doe',
      uri: 'https://example.com/john',
      email: 'john@example.com',
    }

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should generate person with minimal properties (name only)', () => {
    const value = {
      name: 'John Doe',
    }
    const expected = {
      name: 'John Doe',
    }

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      name: undefined,
      uri: undefined,
      email: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generatePerson(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generatePerson(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generatePerson(undefined)).toBeUndefined()
  })
})

describe('generateCategory', () => {
  it('should generate valid category object with all properties', () => {
    const value = {
      term: 'technology',
      scheme: 'https://example.com/categories',
      label: 'Technology',
    }
    const expected = {
      '@term': 'technology',
      '@scheme': 'https://example.com/categories',
      '@label': 'Technology',
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should generate category with minimal properties (term only)', () => {
    const value = {
      term: 'technology',
    }
    const expected = {
      '@term': 'technology',
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      term: undefined,
      scheme: undefined,
      label: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateCategory(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateCategory(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateCategory(undefined)).toBeUndefined()
  })
})

describe('generateGenerator', () => {
  it('should generate valid generator object with all properties', () => {
    const value = {
      text: 'Example Generator',
      uri: 'https://example.com/generator',
      version: '1.0',
    }
    const expected = {
      '#text': 'Example Generator',
      '@uri': 'https://example.com/generator',
      '@version': '1.0',
    }

    expect(generateGenerator(value)).toEqual(expected)
  })

  it('should generate generator with minimal properties (text only)', () => {
    const value = {
      text: 'Simple Generator',
    }
    const expected = {
      '#text': 'Simple Generator',
    }

    expect(generateGenerator(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      text: undefined,
      uri: undefined,
      version: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateGenerator(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateGenerator(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateGenerator(undefined)).toBeUndefined()
  })
})

describe('generateSource', () => {
  it('should generate valid source object with all properties', () => {
    const date = new Date('2023-03-15T12:00:00Z')
    const value = {
      authors: [{ name: 'John Doe' }],
      categories: [{ term: 'technology' }],
      contributors: [{ name: 'Jane Smith' }],
      generator: { text: 'Generator' },
      icon: 'https://example.com/icon.png',
      id: 'https://example.com/source',
      links: [{ href: 'https://example.com' }],
      logo: 'https://example.com/logo.png',
      rights: 'Copyright 2023',
      subtitle: 'Source subtitle',
      title: 'Source Title',
      updated: date,
    }
    const expected = {
      author: [{ name: 'John Doe' }],
      category: [{ '@term': 'technology' }],
      contributor: [{ name: 'Jane Smith' }],
      generator: { '#text': 'Generator' },
      icon: 'https://example.com/icon.png',
      id: 'https://example.com/source',
      link: [{ '@href': 'https://example.com' }],
      logo: 'https://example.com/logo.png',
      rights: 'Copyright 2023',
      subtitle: 'Source subtitle',
      title: 'Source Title',
      updated: '2023-03-15T12:00:00.000Z',
    }

    expect(generateSource(value)).toEqual(expected)
  })

  it('should generate source with minimal properties', () => {
    const value = {
      id: 'https://example.com/source',
      title: 'Minimal Source',
    }
    const expected = {
      id: 'https://example.com/source',
      title: 'Minimal Source',
    }

    expect(generateSource(value)).toEqual(expected)
  })

  it('should handle empty arrays', () => {
    const value = {
      id: 'https://example.com/source',
      title: 'Source with empty arrays',
      authors: [],
      categories: [],
      links: [],
    }
    const expected = {
      id: 'https://example.com/source',
      title: 'Source with empty arrays',
    }

    expect(generateSource(value)).toEqual(expected)
  })

  it('should handle invalid date objects', () => {
    const value = {
      id: 'https://example.com/source',
      title: 'Source with invalid date',
      updated: new Date('invalid-date'),
    }
    const expected = {
      id: 'https://example.com/source',
      title: 'Source with invalid date',
    }

    expect(generateSource(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      id: undefined,
      title: undefined,
      updated: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateSource(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateSource(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateSource(undefined)).toBeUndefined()
  })
})

describe('generateEntry', () => {
  it('should generate valid entry object with all properties', () => {
    const publishedDate = new Date('2023-03-10T08:00:00Z')
    const updatedDate = new Date('2023-03-15T12:00:00Z')
    const value = {
      authors: [{ name: 'John Doe' }],
      categories: [{ term: 'technology' }],
      content: 'Entry content here',
      contributors: [{ name: 'Jane Smith' }],
      id: 'https://example.com/entry/1',
      links: [{ href: 'https://example.com/entry/1' }],
      published: publishedDate,
      rights: 'Copyright 2023',
      source: { id: 'https://example.com/source', title: 'Source' },
      summary: 'Entry summary',
      title: 'Entry Title',
      updated: updatedDate,
    }
    const expected = {
      author: [{ name: 'John Doe' }],
      category: [{ '@term': 'technology' }],
      content: 'Entry content here',
      contributor: [{ name: 'Jane Smith' }],
      id: 'https://example.com/entry/1',
      link: [{ '@href': 'https://example.com/entry/1' }],
      published: '2023-03-10T08:00:00.000Z',
      rights: 'Copyright 2023',
      source: { id: 'https://example.com/source', title: 'Source' },
      summary: 'Entry summary',
      title: 'Entry Title',
      updated: '2023-03-15T12:00:00.000Z',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with minimal properties (id and title only)', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Minimal Entry',
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Minimal Entry',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle empty arrays', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with empty arrays',
      authors: [],
      categories: [],
      links: [],
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with empty arrays',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle invalid date objects', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with invalid dates',
      published: new Date('invalid-date'),
      updated: new Date(Number.NaN),
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with invalid dates',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      id: undefined,
      title: undefined,
      content: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateEntry(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateEntry(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateEntry(undefined)).toBeUndefined()
  })

  it('should generate entry with dc namespace properties', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with DC namespace',
      dc: {
        creator: 'Jane Smith',
        date: new Date('2023-02-01T00:00:00Z'),
        rights: 'Copyright 2023',
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with DC namespace',
      'dc:creator': 'Jane Smith',
      'dc:date': '2023-02-01T00:00:00.000Z',
      'dc:rights': 'Copyright 2023',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with slash namespace properties', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with Slash namespace',
      slash: {
        section: 'Technology',
        department: 'News',
        comments: 42,
        hit_parade: [1, 2, 3, 4, 5],
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with Slash namespace',
      'slash:section': 'Technology',
      'slash:department': 'News',
      'slash:comments': 42,
      'slash:hit_parade': '1,2,3,4,5',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with thr namespace properties', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with Threading namespace',
      thr: {
        total: 42,
        inReplyTos: [
          {
            ref: 'http://example.com/original-post',
            href: 'http://example.com/original-post#comment-1',
          },
        ],
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with Threading namespace',
      'thr:total': 42,
      'thr:in-reply-to': [
        {
          '@ref': 'http://example.com/original-post',
          '@href': 'http://example.com/original-post#comment-1',
        },
      ],
    }

    expect(generateEntry(value)).toEqual(expected)
  })
})

describe('generateFeed', () => {
  it('should generate complete Atom feed', () => {
    const updatedDate = new Date('2023-03-15T12:00:00Z')
    const value = {
      authors: [{ name: 'John Doe', email: 'john@example.com' }],
      categories: [{ term: 'technology', label: 'Technology' }],
      contributors: [{ name: 'Jane Smith' }],
      generator: { text: 'Example Generator', version: '1.0' },
      icon: 'https://example.com/icon.png',
      id: 'https://example.com/feed',
      links: [{ href: 'https://example.com/feed.xml', rel: 'self' }],
      logo: 'https://example.com/logo.png',
      rights: 'Copyright 2023',
      subtitle: 'Example feed subtitle',
      title: 'Example Feed',
      updated: updatedDate,
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: 'Example Entry',
          updated: updatedDate,
        },
      ],
    }

    const result = generateFeed(value)

    expect(result).toHaveProperty('feed')
    expect(result.feed['@xmlns']).toEqual('http://www.w3.org/2005/Atom')
    expect(result.feed.id).toEqual('https://example.com/feed')
    expect(result.feed.title).toEqual('Example Feed')
    expect(result.feed.updated).toEqual('2023-03-15T12:00:00.000Z')
    expect(result.feed.entry).toHaveLength(1)
  })

  it('should generate Atom feed with minimal required fields', () => {
    const updatedDate = new Date('2023-03-15T12:00:00Z')
    const value = {
      id: 'https://example.com/feed',
      title: 'Minimal Feed',
      updated: updatedDate,
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        id: 'https://example.com/feed',
        title: 'Minimal Feed',
        updated: '2023-03-15T12:00:00.000Z',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty arrays', () => {
    const updatedDate = new Date('2023-03-15T12:00:00Z')
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with empty arrays',
      updated: updatedDate,
      authors: [],
      categories: [],
      links: [],
      entries: [],
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        id: 'https://example.com/feed',
        title: 'Feed with empty arrays',
        updated: '2023-03-15T12:00:00.000Z',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle invalid date objects', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with invalid date',
      updated: new Date('invalid-date'),
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        id: 'https://example.com/feed',
        title: 'Feed with invalid date',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should filter out invalid entries', () => {
    const updatedDate = new Date('2023-03-15T12:00:00Z')
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with mixed entries',
      updated: updatedDate,
      entries: [
        { id: 'https://example.com/entry/1', title: 'Valid entry' },
        {}, // Invalid entry.
        { id: 'https://example.com/entry/2', title: 'Another valid entry' },
        undefined, // Invalid entry.
      ],
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        id: 'https://example.com/feed',
        title: 'Feed with mixed entries',
        updated: '2023-03-15T12:00:00.000Z',
        entry: [
          { id: 'https://example.com/entry/1', title: 'Valid entry' },
          { id: 'https://example.com/entry/2', title: 'Another valid entry' },
        ],
      },
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle very long text values', () => {
    const updatedDate = new Date('2023-03-15T12:00:00Z')
    const longText = 'A'.repeat(1000)
    const value = {
      id: 'https://example.com/feed',
      title: longText,
      subtitle: longText,
      updated: updatedDate,
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        id: 'https://example.com/feed',
        title: longText,
        subtitle: longText,
        updated: '2023-03-15T12:00:00.000Z',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      id: undefined,
      title: undefined,
      updated: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateFeed(undefined)).toBeUndefined()
  })

  it('should generate Atom feed with dc namespace properties', () => {
    const updatedDate = new Date('2023-03-15T12:00:00Z')
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with DC namespace',
      updated: updatedDate,
      dc: {
        creator: 'John Doe',
        rights: 'Copyright 2023',
        date: new Date('2023-01-01T00:00:00Z'),
      },
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        id: 'https://example.com/feed',
        title: 'Feed with DC namespace',
        updated: '2023-03-15T12:00:00.000Z',
        'dc:creator': 'John Doe',
        'dc:rights': 'Copyright 2023',
        'dc:date': '2023-01-01T00:00:00.000Z',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate Atom feed with sy namespace properties', () => {
    const updatedDate = new Date('2023-03-15T12:00:00Z')
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with SY namespace',
      updated: updatedDate,
      sy: {
        updatePeriod: 'hourly',
        updateFrequency: 2,
        updateBase: new Date('2023-01-01T00:00:00Z'),
      },
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
        id: 'https://example.com/feed',
        title: 'Feed with SY namespace',
        updated: '2023-03-15T12:00:00.000Z',
        'sy:updatePeriod': 'hourly',
        'sy:updateFrequency': 2,
        'sy:updateBase': '2023-01-01T00:00:00.000Z',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
