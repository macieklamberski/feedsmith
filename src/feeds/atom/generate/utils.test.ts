import { describe, expect, it } from 'bun:test'
import {
  createNamespaceSetter,
  generateCategory,
  generateEntry,
  generateFeed,
  generateGenerator,
  generateLink,
  generatePerson,
  generateSource,
  generateText,
} from './utils.js'

describe('createNamespaceSetter', () => {
  it('should return function that adds prefix when prefix is provided', () => {
    const key = createNamespaceSetter('atom:')

    expect(key('title')).toBe('atom:title')
    expect(key('link')).toBe('atom:link')
    expect(key('updated')).toBe('atom:updated')
  })

  it('should return function that returns key unchanged when prefix is undefined', () => {
    const key = createNamespaceSetter(undefined)

    expect(key('title')).toBe('title')
    expect(key('link')).toBe('link')
    expect(key('updated')).toBe('updated')
  })

  it('should return function that returns key unchanged when prefix is empty string', () => {
    const key = createNamespaceSetter('')

    expect(key('title')).toBe('title')
    expect(key('link')).toBe('link')
    expect(key('updated')).toBe('updated')
  })

  it('should handle various key formats correctly', () => {
    const key = createNamespaceSetter('ns:')

    expect(key('simple')).toBe('ns:simple')
    expect(key('camelCase')).toBe('ns:camelCase')
    expect(key('kebab-case')).toBe('ns:kebab-case')
    expect(key('snake_case')).toBe('ns:snake_case')
    expect(key('123numeric')).toBe('ns:123numeric')
  })
})

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

    // @ts-expect-error: This is for testing purposes.
    expect(generateLink(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
    expect(generatePerson(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
    expect(generateCategory(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
    expect(generateGenerator(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
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

    expect(generateSource(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateSource(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateSource(undefined)).toBeUndefined()
  })
})

describe('generateEntry', () => {
  it('should generate valid entry object with all properties', () => {
    const value = {
      authors: [{ name: 'John Doe' }],
      categories: [{ term: 'technology' }],
      content: 'Entry content here',
      contributors: [{ name: 'Jane Smith' }],
      id: 'https://example.com/entry/1',
      links: [{ href: 'https://example.com/entry/1' }],
      published: new Date('2023-03-10T08:00:00Z'),
      rights: 'Copyright 2023',
      source: { id: 'https://example.com/source', title: 'Source' },
      summary: 'Entry summary',
      title: 'Entry Title',
      updated: new Date('2023-03-15T12:00:00Z'),
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

    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry(value)).toBeUndefined()
  })

  it('should exclude namespace properties when asNamespace is true', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with namespaces',
      dc: {
        creator: 'Jane Smith',
        date: new Date('2023-02-01T00:00:00Z'),
      },
      slash: {
        section: 'Technology',
        comments: 42,
      },
      thr: {
        total: 5,
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with namespaces',
    }

    expect(generateEntry(value, { asNamespace: true })).toEqual(expected)
  })

  it('should include namespace properties when asNamespace is false or undefined', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with namespaces',
      dc: {
        creator: 'Jane Smith',
        date: new Date('2023-02-01T00:00:00Z'),
      },
      slash: {
        section: 'Technology',
        comments: 42,
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with namespaces',
      'dc:creator': 'Jane Smith',
      'dc:date': '2023-02-01T00:00:00.000Z',
      'slash:section': 'Technology',
      'slash:comments': 42,
    }

    expect(generateEntry(value, { asNamespace: false })).toEqual(expected)
    expect(generateEntry(value)).toEqual(expected)
  })

  it('should apply prefix when asNamespace is true', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with prefix',
      updated: new Date('2023-03-15T12:00:00Z'),
    }
    const expected = {
      'atom:id': 'https://example.com/entry/1',
      'atom:title': 'Entry with prefix',
      'atom:updated': '2023-03-15T12:00:00.000Z',
    }

    expect(generateEntry(value, { prefix: 'atom:' })).toEqual(expected)
  })

  it('should apply prefix and exclude namespaces when asNamespace is true', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with prefix and namespaces',
      dc: {
        creator: 'Jane Smith',
      },
    }
    const expected = {
      'atom:id': 'https://example.com/entry/1',
      'atom:title': 'Entry with prefix and namespaces',
    }

    expect(generateEntry(value, { prefix: 'atom:', asNamespace: true })).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
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
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with DC namespace',
      'dc:creator': 'Jane Smith',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with slash namespace properties', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with Slash namespace',
      slash: {
        section: 'Technology',
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with Slash namespace',
      'slash:section': 'Technology',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with thr namespace properties', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with Threading namespace',
      thr: {
        total: 42,
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with Threading namespace',
      'thr:total': 42,
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with media namespace properties', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with Media namespace',
      media: {
        title: {
          value: 'Media Entry Title',
        },
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with Media namespace',
      'media:title': {
        '#text': 'Media Entry Title',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with itunes namespace properties', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with iTunes namespace',
      itunes: {
        title: 'Episode 1 - Special Title',
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with iTunes namespace',
      'itunes:title': 'Episode 1 - Special Title',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with georss namespace properties', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with georss namespace',
      georss: {
        point: { lat: 45.256, lng: -71.92 },
        featureName: 'Boston',
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with georss namespace',
      'georss:point': '45.256 -71.92',
      'georss:featureName': 'Boston',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with dcterms namespace properties', () => {
    const value = {
      id: 'https://example.com/entry/1',
      title: 'Entry with DCTerms namespace',
      dcterms: {
        created: new Date('2023-02-01T00:00:00Z'),
        license: 'MIT License',
      },
    }
    const expected = {
      id: 'https://example.com/entry/1',
      title: 'Entry with DCTerms namespace',
      'dcterms:created': '2023-02-01T00:00:00.000Z',
      'dcterms:license': 'MIT License',
    }

    expect(generateEntry(value)).toEqual(expected)
  })
})

describe('generateFeed', () => {
  it('should generate complete Atom feed', () => {
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
      updated: new Date('2023-03-15T12:00:00Z'),
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: 'Example Entry',
          updated: new Date('2023-03-15T12:00:00Z'),
        },
      ],
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        id: 'https://example.com/feed',
        title: 'Example Feed',
        updated: '2023-03-15T12:00:00.000Z',
        subtitle: 'Example feed subtitle',
        rights: 'Copyright 2023',
        icon: 'https://example.com/icon.png',
        logo: 'https://example.com/logo.png',
        author: [
          {
            name: 'John Doe',
            email: 'john@example.com',
          },
        ],
        category: [
          {
            '@term': 'technology',
            '@label': 'Technology',
          },
        ],
        contributor: [
          {
            name: 'Jane Smith',
          },
        ],
        generator: {
          '#text': 'Example Generator',
          '@version': '1.0',
        },
        link: [
          {
            '@href': 'https://example.com/feed.xml',
            '@rel': 'self',
          },
        ],
        entry: [
          {
            id: 'https://example.com/entry/1',
            title: 'Example Entry',
            updated: '2023-03-15T12:00:00.000Z',
          },
        ],
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate Atom feed with minimal required fields', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Minimal Feed',
      updated: new Date('2023-03-15T12:00:00Z'),
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
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with empty arrays',
      updated: new Date('2023-03-15T12:00:00Z'),
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
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with mixed entries',
      updated: new Date('2023-03-15T12:00:00Z'),
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

    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(value)).toEqual(expected)
  })

  it('should return feed object directly when asNamespace is true', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with asNamespace',
      updated: new Date('2023-03-15T12:00:00Z'),
      dc: {
        creator: 'Jane Smith',
        rights: 'Copyright 2023',
      },
      sy: {
        updatePeriod: 'hourly',
        updateFrequency: 2,
      },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: 'Entry 1',
        },
      ],
    }
    const expected = {
      feed: {
        id: 'https://example.com/feed',
        title: 'Feed with asNamespace',
        updated: '2023-03-15T12:00:00.000Z',
        entry: [
          {
            id: 'https://example.com/entry/1',
            title: 'Entry 1',
          },
        ],
      },
    }

    expect(generateFeed(value, { asNamespace: true })).toEqual(expected)
  })

  it('should include xmlns attributes and namespaces when asNamespace is false or undefined', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with namespaces',
      updated: new Date('2023-03-15T12:00:00Z'),
      dc: {
        creator: 'Jane Smith',
        rights: 'Copyright 2023',
      },
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        id: 'https://example.com/feed',
        title: 'Feed with namespaces',
        updated: '2023-03-15T12:00:00.000Z',
        'dc:creator': 'Jane Smith',
        'dc:rights': 'Copyright 2023',
      },
    }

    expect(generateFeed(value, { asNamespace: false })).toEqual(expected)
    expect(generateFeed(value)).toEqual(expected)
  })

  it('should apply prefix when asNamespace is true', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with prefix',
      updated: new Date('2023-03-15T12:00:00Z'),
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: 'Entry 1',
        },
      ],
    }
    const expected = {
      feed: {
        'atom:id': 'https://example.com/feed',
        'atom:title': 'Feed with prefix',
        'atom:updated': '2023-03-15T12:00:00.000Z',
        'atom:entry': [
          {
            'atom:id': 'https://example.com/entry/1',
            'atom:title': 'Entry 1',
          },
        ],
      },
    }

    expect(generateFeed(value, { prefix: 'atom:', asNamespace: true })).toEqual(expected)
  })

  it('should apply prefix and exclude xmlns when asNamespace is true', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with prefix and namespaces',
      updated: new Date('2023-03-15T12:00:00Z'),
      dc: {
        creator: 'Jane Smith',
      },
    }
    const expected = {
      feed: {
        'atom:id': 'https://example.com/feed',
        'atom:title': 'Feed with prefix and namespaces',
        'atom:updated': '2023-03-15T12:00:00.000Z',
      },
    }

    expect(generateFeed(value, { prefix: 'atom:', asNamespace: true })).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      id: undefined,
      title: undefined,
      updated: undefined,
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateFeed(undefined)).toBeUndefined()
  })

  it('should generate Atom feed with dc namespace properties', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with DC namespace',
      updated: new Date('2023-03-15T12:00:00Z'),
      dc: {
        creator: 'John Doe',
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
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate Atom feed with sy namespace properties', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with SY namespace',
      updated: new Date('2023-03-15T12:00:00Z'),
      sy: {
        updatePeriod: 'hourly',
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
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate Atom feed with media namespace properties', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with Media namespace',
      updated: new Date('2023-03-15T12:00:00Z'),
      media: {
        title: {
          value: 'Feed Media Title',
          type: 'plain',
        },
        description: {
          value: 'Feed Media Description',
        },
        keywords: ['media', 'video', 'audio'],
        thumbnails: [
          {
            url: 'https://example.com/feed-thumb.jpg',
            width: 200,
            height: 150,
          },
        ],
        categories: [
          {
            name: 'Technology/Podcasts',
            scheme: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
            label: 'Technology Podcasts',
          },
        ],
        copyright: {
          value: '2023 Media Feed Corp',
          url: 'https://example.com/copyright',
        },
        ratings: [
          {
            value: 'nonadult',
            scheme: 'urn:simple',
          },
        ],
      },
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        '@xmlns:media': 'http://search.yahoo.com/mrss/',
        id: 'https://example.com/feed',
        title: 'Feed with Media namespace',
        updated: '2023-03-15T12:00:00.000Z',
        'media:title': {
          '#text': 'Feed Media Title',
          '@type': 'plain',
        },
        'media:description': {
          '#text': 'Feed Media Description',
        },
        'media:keywords': 'media,video,audio',
        'media:thumbnail': [
          {
            '@url': 'https://example.com/feed-thumb.jpg',
            '@height': 150,
            '@width': 200,
          },
        ],
        'media:category': [
          {
            '#text': 'Technology/Podcasts',
            '@scheme': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
            '@label': 'Technology Podcasts',
          },
        ],
        'media:copyright': {
          '#text': '2023 Media Feed Corp',
          '@url': 'https://example.com/copyright',
        },
        'media:rating': [
          {
            '#text': 'nonadult',
            '@scheme': 'urn:simple',
          },
        ],
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate Atom feed with itunes namespace properties', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with iTunes namespace',
      updated: new Date('2023-03-15T12:00:00Z'),
      itunes: {
        author: 'Podcast Author',
        categories: [
          {
            text: 'Technology',
            categories: [
              {
                text: 'Tech News',
              },
            ],
          },
        ],
        explicit: false,
        type: 'episodic',
        owner: {
          name: 'Owner Name',
          email: 'owner@example.com',
        },
        image: 'https://example.com/podcast-cover.jpg',
      },
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        '@xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        id: 'https://example.com/feed',
        title: 'Feed with iTunes namespace',
        updated: '2023-03-15T12:00:00.000Z',
        'itunes:image': {
          '@href': 'https://example.com/podcast-cover.jpg',
        },
        'itunes:category': [
          {
            '@text': 'Technology',
            'itunes:category': [
              {
                '@text': 'Tech News',
              },
            ],
          },
        ],
        'itunes:explicit': 'no',
        'itunes:author': 'Podcast Author',
        'itunes:type': 'episodic',
        'itunes:owner': {
          'itunes:name': 'Owner Name',
          'itunes:email': 'owner@example.com',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate Atom feed with georss namespace properties', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with georss namespace',
      updated: new Date('2023-03-15T12:00:00Z'),
      georss: {
        point: { lat: 45.256, lng: -71.92 },
        featureName: 'Boston',
      },
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        '@xmlns:georss': 'http://www.georss.org/georss/',
        id: 'https://example.com/feed',
        title: 'Feed with georss namespace',
        updated: '2023-03-15T12:00:00.000Z',
        'georss:point': '45.256 -71.92',
        'georss:featureName': 'Boston',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate Atom feed with dcterms namespace properties', () => {
    const value = {
      id: 'https://example.com/feed',
      title: 'Feed with DCTerms namespace',
      updated: new Date('2023-03-15T12:00:00Z'),
      dcterms: {
        created: new Date('2023-01-01T00:00:00Z'),
        license: 'Creative Commons Attribution 4.0',
      },
    }
    const expected = {
      feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        '@xmlns:dcterms': 'http://purl.org/dc/terms/',
        id: 'https://example.com/feed',
        title: 'Feed with DCTerms namespace',
        updated: '2023-03-15T12:00:00.000Z',
        'dcterms:created': '2023-01-01T00:00:00.000Z',
        'dcterms:license': 'Creative Commons Attribution 4.0',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
