import { describe, expect, it } from 'bun:test'
import {
  generateCategory,
  generateCloud,
  generateEnclosure,
  generateFeed,
  generateGuid,
  generateImage,
  generateItem,
  generatePerson,
  generateSkipDays,
  generateSkipHours,
  generateSource,
  generateTextInput,
} from './utils.js'

describe('generatePerson', () => {
  it('should pass through string person', () => {
    const value = 'john.doe@example.com (John Doe)'
    const expected = 'john.doe@example.com (John Doe)'

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generatePerson(undefined)).toBeUndefined()
  })
})

describe('generateCategory', () => {
  it('should generate valid category object with all properties', () => {
    const value = {
      name: 'Technology',
      domain: 'https://example.com/categories',
    }
    const expected = {
      '@domain': 'https://example.com/categories',
      '#text': 'Technology',
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should generate category with minimal properties', () => {
    const value = {
      name: 'Technology',
    }
    const expected = {
      '#text': 'Technology',
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      name: undefined,
      domain: undefined,
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

describe('generateCloud', () => {
  it('should generate valid cloud object with all properties', () => {
    const value = {
      domain: 'rpc.sys.com',
      port: 80,
      path: '/RPC2',
      registerProcedure: 'pingMe',
      protocol: 'soap',
    }
    const expected = {
      '@domain': 'rpc.sys.com',
      '@port': 80,
      '@path': '/RPC2',
      '@registerProcedure': 'pingMe',
      '@protocol': 'soap',
    }

    expect(generateCloud(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      domain: undefined,
      port: undefined,
      path: undefined,
      registerProcedure: undefined,
      protocol: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateCloud(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateCloud(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateCloud(undefined)).toBeUndefined()
  })
})

describe('generateImage', () => {
  it('should pass through image object with all properties', () => {
    const value = {
      url: 'https://example.com/logo.png',
      title: 'Example Logo',
      link: 'https://example.com',
      description: 'Company logo',
      height: 100,
      width: 200,
    }
    const expected = {
      url: 'https://example.com/logo.png',
      title: 'Example Logo',
      link: 'https://example.com',
      description: 'Company logo',
      height: 100,
      width: 200,
    }

    expect(generateImage(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      url: undefined,
      title: undefined,
      link: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateImage(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateImage(undefined)).toBeUndefined()
  })
})

describe('generateTextInput', () => {
  it('should pass through text input object with all properties', () => {
    const value = {
      title: 'Search',
      description: 'Search our site',
      name: 'query',
      link: 'https://example.com/search',
    }
    const expected = {
      title: 'Search',
      description: 'Search our site',
      name: 'query',
      link: 'https://example.com/search',
    }

    expect(generateTextInput(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      title: undefined,
      description: undefined,
      name: undefined,
      link: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateTextInput(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateTextInput(undefined)).toBeUndefined()
  })
})

describe('generateEnclosure', () => {
  it('should generate valid enclosure object with all properties', () => {
    const value = {
      url: 'https://example.com/audio.mp3',
      length: 12345678,
      type: 'audio/mpeg',
    }
    const expected = {
      '@url': 'https://example.com/audio.mp3',
      '@length': 12345678,
      '@type': 'audio/mpeg',
    }

    expect(generateEnclosure(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      url: undefined,
      length: undefined,
      type: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateEnclosure(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateEnclosure(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateEnclosure(undefined)).toBeUndefined()
  })
})

describe('generateSkipHours', () => {
  it('should generate skip hours with valid array', () => {
    const value = [0, 6, 12, 18]
    const expected = {
      hour: [0, 6, 12, 18],
    }

    expect(generateSkipHours(value)).toEqual(expected)
  })

  it('should handle array with mixed values', () => {
    const value = [0, null, 6, undefined, 12]
    const expected = {
      hour: [0, 6, 12],
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateSkipHours(value)).toEqual(expected)
  })

  it('should handle empty array', () => {
    const value = []

    expect(generateSkipHours(value)).toBeUndefined()
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      hours: undefined,
      time: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateSkipHours(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateSkipHours(undefined)).toBeUndefined()
  })
})

describe('generateSkipDays', () => {
  it('should generate skip days with valid array', () => {
    const value = ['Monday', 'Wednesday', 'Friday']
    const expected = {
      day: ['Monday', 'Wednesday', 'Friday'],
    }

    expect(generateSkipDays(value)).toEqual(expected)
  })

  it('should handle empty array', () => {
    const value = []

    expect(generateSkipDays(value)).toBeUndefined()
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      days: undefined,
      schedule: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateSkipDays(value)).toBeUndefined()
  })

  it('should handle array with mixed values', () => {
    const value = ['Monday', null, 'Wednesday', undefined, 'Friday']
    const expected = {
      day: ['Monday', 'Wednesday', 'Friday'],
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateSkipDays(value)).toEqual(expected)
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateSkipDays(undefined)).toBeUndefined()
  })
})

describe('generateGuid', () => {
  it('should generate valid guid object with all properties', () => {
    const value = {
      value: 'https://example.com/item/123',
      isPermaLink: true,
    }
    const expected = {
      '#text': 'https://example.com/item/123',
      '@isPermaLink': true,
    }

    expect(generateGuid(value)).toEqual(expected)
  })

  it('should generate guid with minimal properties', () => {
    const value = {
      value: 'unique-id-123',
    }
    const expected = {
      '#text': 'unique-id-123',
    }

    expect(generateGuid(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      value: undefined,
      isPermaLink: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateGuid(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateGuid(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateGuid(undefined)).toBeUndefined()
  })
})

describe('generateSource', () => {
  it('should generate valid source object with all properties', () => {
    const value = {
      title: 'Example Source',
      url: 'https://example.com/feed.xml',
    }
    const expected = {
      '#text': 'Example Source',
      '@url': 'https://example.com/feed.xml',
    }

    expect(generateSource(value)).toEqual(expected)
  })

  it('should generate source with minimal properties', () => {
    const value = {
      title: 'Example Source',
    }
    const expected = {
      '#text': 'Example Source',
    }

    expect(generateSource(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      title: undefined,
      url: undefined,
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

describe('generateItem', () => {
  it('should generate valid item object with all properties', () => {
    const value = {
      title: 'Example Item',
      link: 'https://example.com/item/123',
      description: 'Item description',
      authors: ['john.doe@example.com (John Doe)'],
      categories: [{ name: 'Technology', domain: 'https://example.com/categories' }],
      comments: 'https://example.com/item/123/comments',
      enclosure: {
        url: 'https://example.com/audio.mp3',
        length: 12345678,
        type: 'audio/mpeg',
      },
      guid: {
        value: 'https://example.com/item/123',
        isPermaLink: true,
      },
      pubDate: new Date('2023-03-15T12:00:00Z'),
      source: {
        title: 'Example Source',
        url: 'https://example.com/feed.xml',
      },
    }
    const expected = {
      title: 'Example Item',
      link: 'https://example.com/item/123',
      description: 'Item description',
      author: ['john.doe@example.com (John Doe)'],
      category: [
        {
          '@domain': 'https://example.com/categories',
          '#text': 'Technology',
        },
      ],
      comments: 'https://example.com/item/123/comments',
      enclosure: {
        '@url': 'https://example.com/audio.mp3',
        '@length': 12345678,
        '@type': 'audio/mpeg',
      },
      guid: {
        '#text': 'https://example.com/item/123',
        '@isPermaLink': true,
      },
      pubDate: new Date('2023-03-15T12:00:00Z'),
      source: {
        '#text': 'Example Source',
        '@url': 'https://example.com/feed.xml',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with minimal properties (title only)', () => {
    const value = {
      title: 'Minimal Item',
    }
    const expected = {
      title: 'Minimal Item',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with minimal properties (description only)', () => {
    const value = {
      description: 'Item with only description',
    }
    const expected = {
      description: 'Item with only description',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with dc namespace properties', () => {
    const value = {
      title: 'Item with dc namespace',
      dc: {
        creator: 'Jane Smith',
        date: new Date('2023-02-01T00:00:00Z'),
        rights: 'Copyright 2023',
      },
    }
    const expected = {
      title: 'Item with dc namespace',
      'dc:creator': 'Jane Smith',
      'dc:date': '2023-02-01T00:00:00.000Z',
      'dc:rights': 'Copyright 2023',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with content namespace properties', () => {
    const value = {
      title: 'Item with content namespace',
      content: {
        encoded: '<p>Full HTML content here</p>',
      },
    }
    const expected = {
      title: 'Item with content namespace',
      'content:encoded': { '#cdata': '<p>Full HTML content here</p>' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with slash namespace properties', () => {
    const value = {
      title: 'Item with slash namespace',
      slash: {
        section: 'Technology',
        department: 'News',
        comments: 15,
        hit_parade: [1, 2, 3],
      },
    }
    const expected = {
      title: 'Item with slash namespace',
      'slash:section': 'Technology',
      'slash:department': 'News',
      'slash:comments': 15,
      'slash:hit_parade': '1,2,3',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with thr namespace properties', () => {
    const value = {
      title: 'Item with threading namespace',
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
      title: 'Item with threading namespace',
      'thr:total': 42,
      'thr:in-reply-to': [
        {
          '@ref': 'http://example.com/original-post',
          '@href': 'http://example.com/original-post#comment-1',
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty arrays', () => {
    const value = {
      title: 'Item with empty arrays',
      authors: [],
      categories: [],
    }
    const expected = {
      title: 'Item with empty arrays',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      title: undefined,
      description: undefined,
      link: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })

  it('should generate item with atom namespace properties', () => {
    const value = {
      title: 'Item with atom namespace',
      atom: {
        id: 'https://example.com/entry/1',
        title: 'Atom Entry Title',
        updated: new Date('2023-01-01T00:00:00Z'),
        content: 'Atom entry content',
        authors: [{ name: 'John Doe', email: 'john@example.com' }],
      },
    }
    const expected = {
      title: 'Item with atom namespace',
      'atom:id': 'https://example.com/entry/1',
      'atom:title': 'Atom Entry Title',
      'atom:updated': '2023-01-01T00:00:00.000Z',
      'atom:content': 'Atom entry content',
      'atom:author': [{ name: 'John Doe', email: 'john@example.com' }],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with podcast namespace properties', () => {
    const value = {
      title: 'Item with podcast namespace',
      podcast: {
        episode: { number: 42 },
        season: { number: 2 },
        persons: [
          {
            display: 'Host Name',
            role: 'host',
            group: 'cast',
          },
        ],
        transcripts: [
          {
            url: 'https://example.com/transcript.txt',
            type: 'text/plain',
            language: 'en',
          },
        ],
        chapters: {
          url: 'https://example.com/chapters.json',
          type: 'application/json+chapters',
        },
        soundbites: [
          {
            startTime: 120.5,
            duration: 30.2,
            display: 'Great quote',
          },
        ],
        location: {
          display: 'Austin, TX',
          geo: 'geo:30.2672,-97.7431',
        },
        license: {
          display: 'Creative Commons',
          url: 'https://creativecommons.org/licenses/by/4.0/',
        },
        value: {
          type: 'lightning',
          method: 'keysend',
        },
      },
    }
    const expected = {
      title: 'Item with podcast namespace',
      'podcast:episode': { '#text': 42 },
      'podcast:season': { '#text': 2 },
      'podcast:person': [
        {
          '#text': 'Host Name',
          '@role': 'host',
          '@group': 'cast',
        },
      ],
      'podcast:transcript': [
        {
          '@url': 'https://example.com/transcript.txt',
          '@type': 'text/plain',
          '@language': 'en',
        },
      ],
      'podcast:chapters': {
        '@url': 'https://example.com/chapters.json',
        '@type': 'application/json+chapters',
      },
      'podcast:soundbite': [
        {
          '#text': 'Great quote',
          '@startTime': 120.5,
          '@duration': 30.2,
        },
      ],
      'podcast:location': {
        '#text': 'Austin, TX',
        '@geo': 'geo:30.2672,-97.7431',
      },
      'podcast:license': {
        '#text': 'Creative Commons',
        '@url': 'https://creativecommons.org/licenses/by/4.0/',
      },
      'podcast:value': {
        '@type': 'lightning',
        '@method': 'keysend',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })
})

describe('generateFeed', () => {
  it('should generate complete RSS feed', () => {
    const value = {
      title: 'Example Feed',
      link: 'https://example.com',
      description: 'Example feed description',
      language: 'en-US',
      copyright: '© 2023 Example Corp',
      managingEditor: 'editor@example.com (Editor Name)',
      webMaster: 'webmaster@example.com (Webmaster Name)',
      pubDate: new Date('2023-03-15T12:00:00Z'),
      lastBuildDate: new Date('2023-03-15T12:00:00Z'),
      categories: [{ name: 'Technology' }],
      generator: 'Example Generator',
      docs: 'https://example.com/docs',
      cloud: {
        domain: 'rpc.sys.com',
        port: 80,
        path: '/RPC2',
        registerProcedure: 'pingMe',
        protocol: 'soap',
      },
      ttl: 60,
      image: {
        url: 'https://example.com/logo.png',
        title: 'Example Logo',
        link: 'https://example.com',
      },
      rating: 'general',
      textInput: {
        title: 'Search',
        description: 'Search our site',
        name: 'query',
        link: 'https://example.com/search',
      },
      skipHours: [0, 6, 12, 18],
      skipDays: ['Monday', 'Wednesday'],
      items: [
        {
          title: 'Example Item',
          description: 'Item description',
        },
      ],
    }
    const expected = {
      rss: {
        '@version': '2.0',
        channel: {
          title: 'Example Feed',
          link: 'https://example.com',
          description: 'Example feed description',
          language: 'en-US',
          copyright: '© 2023 Example Corp',
          managingEditor: 'editor@example.com (Editor Name)',
          webMaster: 'webmaster@example.com (Webmaster Name)',
          pubDate: 'Wed, 15 Mar 2023 12:00:00 GMT',
          lastBuildDate: 'Wed, 15 Mar 2023 12:00:00 GMT',
          category: [{ '@domain': undefined, '#text': 'Technology' }],
          generator: 'Example Generator',
          docs: 'https://example.com/docs',
          cloud: {
            '@domain': 'rpc.sys.com',
            '@port': 80,
            '@path': '/RPC2',
            '@registerProcedure': 'pingMe',
            '@protocol': 'soap',
          },
          ttl: 60,
          image: {
            url: 'https://example.com/logo.png',
            title: 'Example Logo',
            link: 'https://example.com',
          },
          rating: 'general',
          textInput: {
            title: 'Search',
            description: 'Search our site',
            name: 'query',
            link: 'https://example.com/search',
          },
          skipHours: { hour: [0, 6, 12, 18] },
          skipDays: { day: ['Monday', 'Wednesday'] },
          item: [
            {
              title: 'Example Item',
              description: 'Item description',
            },
          ],
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate RSS with minimal required fields', () => {
    const value = {
      title: 'Minimal Feed',
      description: 'Minimal description',
    }
    const expected = {
      rss: {
        '@version': '2.0',
        channel: {
          title: 'Minimal Feed',
          description: 'Minimal description',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty arrays', () => {
    const value = {
      title: 'Feed with empty arrays',
      description: 'Description',
      categories: [],
      items: [],
      skipHours: [],
      skipDays: [],
    }
    const expected = {
      rss: {
        '@version': '2.0',
        channel: {
          title: 'Feed with empty arrays',
          description: 'Description',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      title: undefined,
      description: undefined,
      link: undefined,
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

  it('should handle invalid date objects', () => {
    const value = {
      title: 'Feed with invalid dates',
      description: 'Description',
      pubDate: new Date('invalid-date'),
      lastBuildDate: new Date(Number.NaN),
    }
    const expected = {
      rss: {
        '@version': '2.0',
        channel: {
          title: 'Feed with invalid dates',
          description: 'Description',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should filter out invalid items', () => {
    const value = {
      title: 'Feed with mixed items',
      description: 'Description',
      items: [
        { title: 'Valid item' },
        {}, // Invalid item.
        { description: 'Another valid item' },
        undefined, // Invalid item.
      ],
    }
    const expected = {
      rss: {
        '@version': '2.0',
        channel: {
          title: 'Feed with mixed items',
          description: 'Description',
          item: [{ title: 'Valid item' }, { description: 'Another valid item' }],
        },
      },
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate sy namespace properties and attributes', () => {
    const value = {
      title: 'Feed with sy namespace',
      description: 'Description',
      sy: {
        updatePeriod: 'hourly',
        updateFrequency: 2,
        updateBase: new Date('2023-01-01T00:00:00Z'),
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
        channel: {
          title: 'Feed with sy namespace',
          description: 'Description',
          'sy:updatePeriod': 'hourly',
          'sy:updateFrequency': 2,
          'sy:updateBase': '2023-01-01T00:00:00.000Z',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate dc namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with dc namespace',
      description: 'Description',
      dc: {
        creator: 'John Doe',
        subject: 'Technology',
        date: new Date('2023-01-01T00:00:00Z'),
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        channel: {
          title: 'Feed with dc namespace',
          description: 'Description',
          'dc:creator': 'John Doe',
          'dc:subject': 'Technology',
          'dc:date': '2023-01-01T00:00:00.000Z',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate atom namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with atom namespace',
      description: 'Description',
      atom: {
        id: 'https://example.com/feed',
        title: 'Atom Feed Title',
        updated: new Date('2023-01-01T00:00:00Z'),
        links: [
          {
            href: 'https://example.com/feed.xml',
            rel: 'self',
            type: 'application/atom+xml',
          },
        ],
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:atom': 'http://www.w3.org/2005/Atom',
        channel: {
          title: 'Feed with atom namespace',
          description: 'Description',
          'atom:id': 'https://example.com/feed',
          'atom:title': 'Atom Feed Title',
          'atom:updated': '2023-01-01T00:00:00.000Z',
          'atom:link': [
            {
              '@href': 'https://example.com/feed.xml',
              '@rel': 'self',
              '@type': 'application/atom+xml',
            },
          ],
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate podcast namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with podcast namespace',
      description: 'A podcast feed with Podcast 2.0 features',
      podcast: {
        guid: 'podcast-feed-guid-123',
        locked: {
          value: true,
          owner: 'owner@example.com',
        },
        fundings: [
          {
            url: 'https://example.com/support',
            display: 'Support the show',
          },
        ],
        persons: [
          {
            display: 'Host Name',
            role: 'host',
            group: 'cast',
            img: 'https://example.com/host.jpg',
          },
        ],
        location: {
          display: 'Austin, TX',
          geo: 'geo:30.2672,-97.7431',
          osm: 'R113314',
        },
        trailers: [
          {
            display: 'Season 2 Trailer',
            url: 'https://example.com/trailer.mp3',
            pubDate: new Date('2023-01-01T00:00:00Z'),
            length: 12345,
            type: 'audio/mpeg',
            season: 2,
          },
        ],
        license: {
          display: 'Creative Commons Attribution 4.0',
          url: 'https://creativecommons.org/licenses/by/4.0/',
        },
        value: {
          type: 'lightning',
          method: 'keysend',
          suggested: 0.00000005,
        },
        medium: 'podcast',
        images: {
          srcset: 'https://example.com/image-400.jpg 400w, https://example.com/image-800.jpg 800w',
        },
        blocks: [
          {
            value: true,
            id: 'service-id-123',
          },
        ],
        txts: [
          {
            display: 'Copyright 2023 Example Podcast',
            purpose: 'copyright',
          },
        ],
        remoteItems: [
          {
            feedGuid: 'remote-feed-guid-456',
            feedUrl: 'https://remote.example.com/feed.xml',
          },
        ],
        updateFrequency: {
          display: 'Weekly on Mondays',
          complete: false,
          dtstart: new Date('2023-01-01T00:00:00Z'),
          rrule: 'FREQ=WEEKLY;BYDAY=MO',
        },
        podping: {
          usesPodping: true,
        },
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:podcast': 'https://podcastindex.org/namespace/1.0',
        channel: {
          title: 'Feed with podcast namespace',
          description: 'A podcast feed with Podcast 2.0 features',
          'podcast:guid': 'podcast-feed-guid-123',
          'podcast:locked': {
            '#text': 'yes',
            '@owner': 'owner@example.com',
          },
          'podcast:funding': [
            {
              '#text': 'Support the show',
              '@url': 'https://example.com/support',
            },
          ],
          'podcast:person': [
            {
              '#text': 'Host Name',
              '@role': 'host',
              '@group': 'cast',
              '@img': 'https://example.com/host.jpg',
            },
          ],
          'podcast:location': {
            '#text': 'Austin, TX',
            '@geo': 'geo:30.2672,-97.7431',
            '@osm': 'R113314',
          },
          'podcast:trailer': [
            {
              '#text': 'Season 2 Trailer',
              '@url': 'https://example.com/trailer.mp3',
              '@pubdate': 'Sun, 01 Jan 2023 00:00:00 GMT',
              '@length': 12345,
              '@type': 'audio/mpeg',
              '@season': 2,
            },
          ],
          'podcast:license': {
            '#text': 'Creative Commons Attribution 4.0',
            '@url': 'https://creativecommons.org/licenses/by/4.0/',
          },
          'podcast:value': {
            '@type': 'lightning',
            '@method': 'keysend',
            '@suggested': 0.00000005,
          },
          'podcast:medium': 'podcast',
          'podcast:images': {
            '@srcset':
              'https://example.com/image-400.jpg 400w, https://example.com/image-800.jpg 800w',
          },
          'podcast:block': [
            {
              '#text': 'yes',
              '@id': 'service-id-123',
            },
          ],
          'podcast:txt': [
            {
              '#text': 'Copyright 2023 Example Podcast',
              '@purpose': 'copyright',
            },
          ],
          'podcast:remoteItem': [
            {
              '@feedGuid': 'remote-feed-guid-456',
              '@feedUrl': 'https://remote.example.com/feed.xml',
            },
          ],
          'podcast:updateFrequency': {
            '#text': 'Weekly on Mondays',
            '@complete': false,
            '@dtstart': '2023-01-01T00:00:00.000Z',
            '@rrule': 'FREQ=WEEKLY;BYDAY=MO',
          },
          'podcast:podping': {
            '@usesPodping': true,
          },
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
