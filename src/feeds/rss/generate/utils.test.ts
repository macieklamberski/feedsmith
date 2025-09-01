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

    // @ts-expect-error: This is for testing purposes.
    expect(generateCloud(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
    expect(generateEnclosure(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
    expect(generateSkipDays(value)).toBeUndefined()
  })

  it('should handle array with mixed values', () => {
    const value = ['Monday', null, 'Wednesday', undefined, 'Friday']
    const expected = {
      day: ['Monday', 'Wednesday', 'Friday'],
    }

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
    expect(generateGuid(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
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

    // @ts-expect-error: This is for testing purposes.
    expect(generateSource(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
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
      enclosures: [
        {
          url: 'https://example.com/audio.mp3',
          length: 12345678,
          type: 'audio/mpeg',
        },
      ],
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
      enclosure: [
        {
          '@url': 'https://example.com/audio.mp3',
          '@length': 12345678,
          '@type': 'audio/mpeg',
        },
      ],
      guid: {
        '#text': 'https://example.com/item/123',
        '@isPermaLink': true,
      },
      pubDate: 'Wed, 15 Mar 2023 12:00:00 GMT',
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
      },
    }
    const expected = {
      title: 'Item with dc namespace',
      'dc:creator': 'Jane Smith',
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
      },
    }
    const expected = {
      title: 'Item with slash namespace',
      'slash:section': 'Technology',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with thr namespace properties', () => {
    const value = {
      title: 'Item with threading namespace',
      thr: {
        total: 42,
      },
    }
    const expected = {
      title: 'Item with threading namespace',
      'thr:total': 42,
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with dcterms namespace properties', () => {
    const value = {
      title: 'Item with DCTerms namespace',
      dcterms: {
        created: new Date('2023-02-01T00:00:00Z'),
        license: 'MIT License',
      },
    }
    const expected = {
      title: 'Item with DCTerms namespace',
      'dcterms:created': '2023-02-01T00:00:00.000Z',
      'dcterms:license': 'MIT License',
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

    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })

  it('should generate item with atom namespace properties', () => {
    const value = {
      title: 'Item with atom namespace',
      atom: {
        links: [
          {
            href: 'https://example.com/entry/1',
            rel: 'alternate',
            type: 'text/html',
          },
        ],
      },
    }
    const expected = {
      title: 'Item with atom namespace',
      'atom:link': [
        {
          '@href': 'https://example.com/entry/1',
          '@rel': 'alternate',
          '@type': 'text/html',
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with podcast namespace properties', () => {
    const value = {
      title: 'Item with podcast namespace',
      podcast: {
        episode: { number: 42 },
      },
    }
    const expected = {
      title: 'Item with podcast namespace',
      'podcast:episode': { '#text': 42 },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with itunes namespace properties', () => {
    const value = {
      title: 'Item with iTunes namespace',
      itunes: {
        title: 'Episode 1 - Special Title',
        duration: 1800,
        episode: 1,
        season: 1,
        episodeType: 'full',
        explicit: false,
        keywords: ['tech', 'news', 'podcast'],
        subtitle: 'Episode subtitle',
        summary: 'Episode summary',
        block: false,
        image: 'https://example.com/episode-cover.jpg',
      },
    }
    const expected = {
      title: 'Item with iTunes namespace',
      'itunes:duration': 1800,
      'itunes:explicit': 'no',
      'itunes:title': 'Episode 1 - Special Title',
      'itunes:episode': 1,
      'itunes:season': 1,
      'itunes:episodeType': 'full',
      'itunes:keywords': 'tech,news,podcast',
      'itunes:subtitle': 'Episode subtitle',
      'itunes:summary': 'Episode summary',
      'itunes:block': 'no',
      'itunes:image': {
        '@href': 'https://example.com/episode-cover.jpg',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with media namespace properties', () => {
    const value = {
      title: 'Item with media namespace',
      media: {
        title: {
          value: 'Media Item Title',
          type: 'plain',
        },
      },
    }
    const expected = {
      title: 'Item with media namespace',
      'media:title': {
        '#text': 'Media Item Title',
        '@type': 'plain',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with georss namespace properties', () => {
    const value = {
      title: 'Item with georss namespace',
      georss: {
        point: { lat: 45.256, lng: -71.92 },
        featureName: 'Boston',
      },
    }
    const expected = {
      title: 'Item with georss namespace',
      'georss:point': '45.256 -71.92',
      'georss:featureName': 'Boston',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with wfw namespace properties', () => {
    const value = {
      title: 'Item with wfw namespace',
      wfw: {
        comment: 'https://example.com/comment',
        commentRss: 'https://example.com/comments/feed',
      },
    }
    const expected = {
      title: 'Item with wfw namespace',
      'wfw:comment': 'https://example.com/comment',
      'wfw:commentRss': 'https://example.com/comments/feed',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with source namespace properties', () => {
    const value = {
      title: 'Item with source namespace',
      sourceNs: {
        markdown: '# Example markdown content',
        outlines: ['<outline text="Section 1"/>', '<outline text="Section 2"/>'],
        localTime: '2024-01-15 10:30:00',
        linkFull: 'https://example.com/full-article',
      },
    }
    const expected = {
      title: 'Item with source namespace',
      'source:markdown': '# Example markdown content',
      'source:outline': [
        { '#cdata': '<outline text="Section 1"/>' },
        { '#cdata': '<outline text="Section 2"/>' },
      ],
      'source:localTime': '2024-01-15 10:30:00',
      'source:linkFull': 'https://example.com/full-article',
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

    // @ts-expect-error: This is for testing purposes.
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
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate dcterms namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with DCTerms namespace',
      description: 'Description',
      dcterms: {
        created: new Date('2023-01-01T00:00:00Z'),
        license: 'Creative Commons Attribution 4.0',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:dcterms': 'http://purl.org/dc/terms/',
        channel: {
          title: 'Feed with DCTerms namespace',
          description: 'Description',
          'dcterms:created': '2023-01-01T00:00:00.000Z',
          'dcterms:license': 'Creative Commons Attribution 4.0',
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
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate media namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with media namespace',
      description: 'A media-rich feed with Media RSS features',
      media: {
        title: {
          value: 'Feed Media Title',
          type: 'plain',
        },
        description: {
          value: 'Feed Media Description',
        },
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:media': 'http://search.yahoo.com/mrss/',
        channel: {
          title: 'Feed with media namespace',
          description: 'A media-rich feed with Media RSS features',
          'media:title': {
            '#text': 'Feed Media Title',
            '@type': 'plain',
          },
          'media:description': {
            '#text': 'Feed Media Description',
          },
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate itunes namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with iTunes namespace',
      description: 'A podcast feed with iTunes features',
      itunes: {
        author: 'Podcast Author',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        channel: {
          title: 'Feed with iTunes namespace',
          description: 'A podcast feed with iTunes features',
          'itunes:author': 'Podcast Author',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate georss namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with georss namespace',
      description: 'A feed with geographic data',
      georss: {
        point: { lat: 45.256, lng: -71.92 },
        featureName: 'Boston',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:georss': 'http://www.georss.org/georss/',
        channel: {
          title: 'Feed with georss namespace',
          description: 'A feed with geographic data',
          'georss:point': '45.256 -71.92',
          'georss:featureName': 'Boston',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate source namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with source namespace',
      description: 'A feed with Source namespace features',
      sourceNs: {
        accounts: [{ service: 'twitter', value: 'johndoe' }, { service: 'github' }],
        likes: { server: 'http://likes.example.com/' },
        blogroll: 'https://example.com/blogroll.opml',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:source': 'http://source.scripting.com/',
        channel: {
          title: 'Feed with source namespace',
          description: 'A feed with Source namespace features',
          'source:account': [
            { '@service': 'twitter', '#text': 'johndoe' },
            { '@service': 'github' },
          ],
          'source:likes': { '@server': 'http://likes.example.com/' },
          'source:blogroll': 'https://example.com/blogroll.opml',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
