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

  it('should generate person with both name and email', () => {
    const value = {
      name: 'John Doe',
      email: 'john.doe@example.com',
    }
    const expected = 'john.doe@example.com (John Doe)'

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should generate person with only name', () => {
    const value = {
      name: 'John Doe',
    }
    const expected = 'John Doe'

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should generate person with only email', () => {
    const value = {
      email: 'john.doe@example.com',
    }
    const expected = 'john.doe@example.com'

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generatePerson(value)).toBeUndefined()
  })

  it('should handle object with empty strings', () => {
    const value = {
      name: '',
      email: '',
    }
    const expected = undefined

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should trim whitespace around name and email', () => {
    const value = {
      name: '  John Doe  ',
      email: '  john@example.com  ',
    }
    const expected = 'john@example.com (John Doe)'

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should handle whitespace-only name with valid email', () => {
    const value = {
      name: '   ',
      email: 'john@example.com',
    }
    const expected = 'john@example.com'

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should handle whitespace-only email with valid name', () => {
    const value = {
      name: 'John Doe',
      email: '   ',
    }
    const expected = 'John Doe'

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should handle whitespace-only for both fields', () => {
    const value = {
      name: '   ',
      email: '  ',
    }

    expect(generatePerson(value)).toBeUndefined()
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

    expect(generateCategory(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

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

    expect(generateCloud(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

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

    expect(generateEnclosure(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

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
    expect(generateSkipHours([])).toBeUndefined()
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
    expect(generateSkipDays([])).toBeUndefined()
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

    expect(generateGuid(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

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

  it('should generate source with all required properties', () => {
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

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      title: undefined,
      url: undefined,
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

  it('should generate item with prism namespace properties', () => {
    const value = {
      title: 'Item with PRISM namespace',
      prism: {
        doi: '10.1038/s41586-023-05842-x',
        volume: '615',
        startingPage: '425',
        endingPage: '432',
      },
    }
    const expected = {
      title: 'Item with PRISM namespace',
      'prism:doi': '10.1038/s41586-023-05842-x',
      'prism:volume': '615',
      'prism:startingPage': '425',
      'prism:endingPage': '432',
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

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

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

  it('should generate item with geo namespace properties', () => {
    const value = {
      title: 'Example Location',
      geo: {
        lat: 37.8199,
        long: -122.4783,
        alt: 67.0,
      },
    }
    const expected = {
      title: 'Example Location',
      'geo:lat': 37.8199,
      'geo:long': -122.4783,
      'geo:alt': 67,
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

  it('should generate item with pingback namespace properties', () => {
    const value = {
      title: 'Item with pingback namespace',
      pingback: {
        server: 'https://example.com/xmlrpc.php',
        target: 'https://referenced-blog.com/article',
      },
    }
    const expected = {
      title: 'Item with pingback namespace',
      'pingback:server': 'https://example.com/xmlrpc.php',
      'pingback:target': 'https://referenced-blog.com/article',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with trackback namespace properties', () => {
    const value = {
      title: 'Item with trackback namespace',
      trackback: {
        ping: 'https://example.com/trackback/123',
        abouts: ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
      },
    }
    const expected = {
      title: 'Item with trackback namespace',
      'trackback:ping': 'https://example.com/trackback/123',
      'trackback:about': ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
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

  it('should generate item with ccREL namespace properties', () => {
    const value = {
      title: 'Item with ccREL namespace',
      cc: {
        license: 'https://creativecommons.org/licenses/by/4.0/',
        morePermissions: 'https://example.com/additional-permissions',
      },
    }
    const expected = {
      title: 'Item with ccREL namespace',
      'cc:license': 'https://creativecommons.org/licenses/by/4.0/',
      'cc:morePermissions': 'https://example.com/additional-permissions',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with psc namespace properties', () => {
    const value = {
      title: 'Item with PSC chapters',
      psc: {
        chapters: [
          { start: '00:00:00', title: 'Introduction', href: 'https://example.com/intro' },
          { start: '00:05:30', title: 'Main Content' },
        ],
      },
    }
    const expected = {
      title: 'Item with PSC chapters',
      'psc:chapters': {
        'psc:chapter': [
          {
            '@start': '00:00:00',
            '@title': 'Introduction',
            '@href': 'https://example.com/intro',
          },
          {
            '@start': '00:05:30',
            '@title': 'Main Content',
          },
        ],
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with rawvoice namespace properties', () => {
    const value = {
      title: 'Item with RawVoice properties',
      rawvoice: {
        poster: {
          url: 'https://example.com/poster.jpg',
        },
        isHd: true,
      },
    }
    const expected = {
      title: 'Item with RawVoice properties',
      'rawvoice:poster': {
        '@url': 'https://example.com/poster.jpg',
      },
      'rawvoice:isHd': 'yes',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with creativecommons namespace properties', () => {
    const value = {
      title: 'Item with Creative Commons license',
      creativeCommons: {
        licenses: ['http://creativecommons.org/licenses/by-sa/4.0/'],
      },
    }
    const expected = {
      title: 'Item with Creative Commons license',
      'creativeCommons:license': ['http://creativecommons.org/licenses/by-sa/4.0/'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with googleplay namespace properties', () => {
    const value = {
      title: 'Item with Google Play properties',
      googleplay: {
        author: 'Episode Guest Speaker',
        description: 'A detailed episode description',
        explicit: false,
        block: false,
      },
    }
    const expected = {
      title: 'Item with Google Play properties',
      'googleplay:author': 'Episode Guest Speaker',
      'googleplay:description': 'A detailed episode description',
      'googleplay:explicit': 'no',
      'googleplay:block': 'no',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with spotify namespace properties', () => {
    const value = {
      title: 'Item with Spotify access',
      spotify: {
        access: {
          entitlement: {
            name: 'premium_content',
          },
        },
      },
    }
    const expected = {
      title: 'Item with Spotify access',
      'spotify:access': {
        entitlement: {
          '@name': 'premium_content',
        },
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

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

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

  it('should generate prism namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with PRISM namespace',
      description: 'Description',
      prism: {
        publicationName: 'Nature',
        issn: '0028-0836',
        volume: '615',
        publicationDates: [new Date('2023-03-15T00:00:00Z')],
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:prism': 'http://prismstandard.org/namespaces/basic/3.0/',
        channel: {
          title: 'Feed with PRISM namespace',
          description: 'Description',
          'prism:publicationName': 'Nature',
          'prism:issn': '0028-0836',
          'prism:volume': '615',
          'prism:publicationDate': ['2023-03-15T00:00:00.000Z'],
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
        '@xmlns:georss': 'http://www.georss.org/georss',
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

  it('should generate pingback namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with pingback namespace',
      description: 'A feed with Pingback service endpoint',
      pingback: {
        to: 'https://example.com/pingback-service',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:pingback': 'http://madskills.com/public/xml/rss/module/pingback/',
        channel: {
          title: 'Feed with pingback namespace',
          description: 'A feed with Pingback service endpoint',
          'pingback:to': 'https://example.com/pingback-service',
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

  it('should generate blogChannel namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with blogChannel namespace',
      description: 'A feed with blogChannel properties',
      blogChannel: {
        blogRoll: 'http://example.com/blogroll.opml',
        blink: 'http://recommended-site.com/',
        mySubscriptions: 'http://example.com/subscriptions.opml',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:blogChannel': 'http://backend.userland.com/blogChannelModule',
        channel: {
          title: 'Feed with blogChannel namespace',
          description: 'A feed with blogChannel properties',
          'blogChannel:blogRoll': 'http://example.com/blogroll.opml',
          'blogChannel:blink': 'http://recommended-site.com/',
          'blogChannel:mySubscriptions': 'http://example.com/subscriptions.opml',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate ccREL namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with ccREL namespace',
      description: 'A feed with ccREL license',
      cc: {
        license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        morePermissions: 'https://example.com/commercial-license',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:cc': 'http://creativecommons.org/ns#',
        channel: {
          title: 'Feed with ccREL namespace',
          description: 'A feed with ccREL license',
          'cc:license': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
          'cc:morePermissions': 'https://example.com/commercial-license',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate creativecommons namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with Creative Commons namespace',
      description: 'A feed with Creative Commons license',
      creativeCommons: {
        licenses: ['http://creativecommons.org/licenses/by-nc-nd/2.0/'],
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:creativeCommons': 'http://backend.userland.com/creativeCommonsRssModule',
        channel: {
          title: 'Feed with Creative Commons namespace',
          description: 'A feed with Creative Commons license',
          'creativeCommons:license': ['http://creativecommons.org/licenses/by-nc-nd/2.0/'],
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feedpress namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with FeedPress namespace',
      description: 'A feed with FeedPress properties',
      feedpress: {
        link: 'https://feed.press/example',
        newsletterId: '12345',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:feedpress': 'https://feed.press/xmlns',
        channel: {
          title: 'Feed with FeedPress namespace',
          description: 'A feed with FeedPress properties',
          'feedpress:link': 'https://feed.press/example',
          'feedpress:newsletterId': '12345',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate admin namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with admin namespace',
      description: 'A feed with admin properties',
      admin: {
        errorReportsTo: 'mailto:webmaster@example.com',
        generatorAgent: 'http://www.movabletype.org/?v=3.2',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:admin': 'http://webns.net/mvcb/',
        '@xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        channel: {
          title: 'Feed with admin namespace',
          description: 'A feed with admin properties',
          'admin:errorReportsTo': {
            '@rdf:resource': 'mailto:webmaster@example.com',
          },
          'admin:generatorAgent': {
            '@rdf:resource': 'http://www.movabletype.org/?v=3.2',
          },
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate opensearch namespace properties for feed', () => {
    const value = {
      title: 'Search Results',
      description: 'Search results feed',
      opensearch: {
        totalResults: 1000,
        startIndex: 21,
        itemsPerPage: 10,
        queries: [
          {
            role: 'request',
            searchTerms: 'quantum computing',
          },
        ],
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:opensearch': 'http://a9.com/-/spec/opensearch/1.1/',
        channel: {
          title: 'Search Results',
          description: 'Search results feed',
          'opensearch:totalResults': 1000,
          'opensearch:startIndex': 21,
          'opensearch:itemsPerPage': 10,
          'opensearch:Query': [
            {
              '@role': 'request',
              '@searchTerms': 'quantum computing',
            },
          ],
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate rawvoice namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with RawVoice namespace',
      description: 'A feed with RawVoice properties',
      rawvoice: {
        rating: {
          value: 'TV-PG',
        },
        frequency: 'weekly',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:rawvoice': 'http://www.rawvoice.com/rawvoiceRssModule/',
        channel: {
          title: 'Feed with RawVoice namespace',
          description: 'A feed with RawVoice properties',
          'rawvoice:rating': {
            '#text': 'TV-PG',
          },
          'rawvoice:frequency': 'weekly',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate spotify namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with Spotify namespace',
      description: 'A feed with Spotify properties',
      spotify: {
        countryOfOrigin: 'US',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:spotify': 'http://www.spotify.com/ns/rss',
        channel: {
          title: 'Feed with Spotify namespace',
          description: 'A feed with Spotify properties',
          'spotify:countryOfOrigin': 'US',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate RSS feed with geo namespace properties', () => {
    const value = {
      title: 'Example City Feed',
      description: 'Feed with geographic coordinates',
      geo: {
        lat: 37.7749,
        long: -122.4194,
      },
      items: [
        {
          title: 'Example Location',
          geo: {
            lat: 37.8199,
            long: -122.4783,
            alt: 67.0,
          },
        },
      ],
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:geo': 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        channel: {
          title: 'Example City Feed',
          description: 'Feed with geographic coordinates',
          'geo:lat': 37.7749,
          'geo:long': -122.4194,
          item: [
            {
              title: 'Example Location',
              'geo:lat': 37.8199,
              'geo:long': -122.4783,
              'geo:alt': 67,
            },
          ],
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate acast namespace properties and attributes for feed', () => {
    const value = {
      title: 'Feed with Acast namespace',
      description: 'A feed with Acast properties',
      acast: {
        showId: '664fde3eda02bb0012bad909',
        showUrl: 'software-unscripted',
        signature: {
          key: 'EXAMPLE_KEY',
          algorithm: 'aes-256-cbc',
          value: 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
        },
        settings: 'FYjHyZbXWHZ7gmX8Pp1rmTHg2/BXqPr07kkpFZ5JfhvEZqggcpunI6E1w81XpUaB',
        network: {
          id: '664fdd227c6b200013652ed6',
          slug: 'richard-feldman-664fdd227c6b200013652ed6',
          value: 'Richard Feldman',
        },
        importedFeed: 'https://feeds.resonaterecordings.com/software-unscripted',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:acast': 'https://schema.acast.com/1.0/',
        channel: {
          title: 'Feed with Acast namespace',
          description: 'A feed with Acast properties',
          'acast:showId': '664fde3eda02bb0012bad909',
          'acast:showUrl': 'software-unscripted',
          'acast:signature': {
            '@key': 'EXAMPLE_KEY',
            '@algorithm': 'aes-256-cbc',
            '#text': 'wbG1Z7+6h9QOi+CR1Dv0uQ==',
          },
          'acast:settings': 'FYjHyZbXWHZ7gmX8Pp1rmTHg2/BXqPr07kkpFZ5JfhvEZqggcpunI6E1w81XpUaB',
          'acast:network': {
            '@id': '664fdd227c6b200013652ed6',
            '@slug': 'richard-feldman-664fdd227c6b200013652ed6',
            '#text': 'Richard Feldman',
          },
          'acast:importedFeed': 'https://feeds.resonaterecordings.com/software-unscripted',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate acast namespace properties for item', () => {
    const value = {
      title: 'Feed with Acast items',
      description: 'A feed with Acast item properties',
      items: [
        {
          title: 'Episode with Acast metadata',
          acast: {
            episodeId: '6918f06ee42e3466f29467f9',
            showId: '664fde3eda02bb0012bad909',
            episodeUrl: 'jonathan-blow-on-programming-language-design',
            settings: 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
          },
        },
      ],
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:acast': 'https://schema.acast.com/1.0/',
        channel: {
          title: 'Feed with Acast items',
          description: 'A feed with Acast item properties',
          item: [
            {
              title: 'Episode with Acast metadata',
              'acast:episodeId': '6918f06ee42e3466f29467f9',
              'acast:showId': '664fde3eda02bb0012bad909',
              'acast:episodeUrl': 'jonathan-blow-on-programming-language-design',
              'acast:settings': 'FYjHyZbXWHZ7gmX8Pp1rmbKbhgrQiwYShz70Q9/ffXZMTtedvdcRQbP4eiLMjXzC',
            },
          ],
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate RSS feed with blogChannel namespace properties', () => {
    const value = {
      title: 'Blog Feed',
      description: 'A feed with blogChannel properties',
      blogChannel: {
        blogRoll: 'http://example.com/blogroll.opml',
        blink: 'http://recommended-site.com/',
        mySubscriptions: 'http://example.com/subscriptions.opml',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:blogChannel': 'http://backend.userland.com/blogChannelModule',
        channel: {
          title: 'Blog Feed',
          description: 'A feed with blogChannel properties',
          'blogChannel:blogRoll': 'http://example.com/blogroll.opml',
          'blogChannel:blink': 'http://recommended-site.com/',
          'blogChannel:mySubscriptions': 'http://example.com/subscriptions.opml',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate RSS feed with feedpress namespace properties', () => {
    const value = {
      title: 'Podcast Feed',
      description: 'A feed with FeedPress properties',
      feedpress: {
        link: 'https://feedpress.com/examplepodcast',
        newsletterId: 'newsletter123456',
        locale: 'en',
        podcastId: '1234567890',
        cssFile: 'https://example.com/custom-feed-styles.css',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:feedpress': 'https://feed.press/xmlns',
        channel: {
          title: 'Podcast Feed',
          description: 'A feed with FeedPress properties',
          'feedpress:link': 'https://feedpress.com/examplepodcast',
          'feedpress:newsletterId': 'newsletter123456',
          'feedpress:locale': 'en',
          'feedpress:podcastId': '1234567890',
          'feedpress:cssFile': 'https://example.com/custom-feed-styles.css',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate RSS feed with googleplay namespace properties', () => {
    const value = {
      title: 'Podcast Feed',
      description: 'A feed with Google Play properties',
      googleplay: {
        author: 'Example Podcast Network',
        description: 'A comprehensive podcast description',
        explicit: false,
        email: 'contact@example.com',
        categories: ['Technology', 'Education'],
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:googleplay': 'https://www.google.com/schemas/play-podcasts/1.0/',
        channel: {
          title: 'Podcast Feed',
          description: 'A feed with Google Play properties',
          'googleplay:author': 'Example Podcast Network',
          'googleplay:description': 'A comprehensive podcast description',
          'googleplay:explicit': 'no',
          'googleplay:email': 'contact@example.com',
          'googleplay:category': [{ '@text': 'Technology' }, { '@text': 'Education' }],
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate RSS feed with opensearch namespace properties', () => {
    const value = {
      title: 'Search Results Feed',
      description: 'A feed with OpenSearch properties',
      opensearch: {
        totalResults: 1000,
        startIndex: 21,
        itemsPerPage: 10,
        queries: [
          {
            role: 'request',
            searchTerms: 'quantum computing',
            startIndex: 21,
            count: 10,
          },
        ],
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:opensearch': 'http://a9.com/-/spec/opensearch/1.1/',
        channel: {
          title: 'Search Results Feed',
          description: 'A feed with OpenSearch properties',
          'opensearch:totalResults': 1000,
          'opensearch:startIndex': 21,
          'opensearch:itemsPerPage': 10,
          'opensearch:Query': [
            {
              '@role': 'request',
              '@searchTerms': 'quantum computing',
              '@startIndex': 21,
              '@count': 10,
            },
          ],
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate RSS feed with spotify namespace properties', () => {
    const value = {
      title: 'Podcast Feed',
      description: 'A feed with Spotify properties',
      spotify: {
        limit: {
          recentCount: 10,
        },
        countryOfOrigin: 'US',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:spotify': 'http://www.spotify.com/ns/rss',
        channel: {
          title: 'Podcast Feed',
          description: 'A feed with Spotify properties',
          'spotify:limit': {
            '@recentCount': 10,
          },
          'spotify:countryOfOrigin': 'US',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate RSS feed with ccREL namespace properties', () => {
    const value = {
      title: 'Licensed Feed',
      description: 'A feed with ccREL properties',
      cc: {
        license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        attributionName: 'Example Publishing Company',
        attributionURL: 'https://example.com/',
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:cc': 'http://creativecommons.org/ns#',
        channel: {
          title: 'Licensed Feed',
          description: 'A feed with ccREL properties',
          'cc:license': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
          'cc:attributionName': 'Example Publishing Company',
          'cc:attributionURL': 'https://example.com/',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate RSS feed with creativecommons namespace properties', () => {
    const value = {
      title: 'Licensed Feed',
      description: 'A feed with Creative Commons properties',
      creativeCommons: {
        licenses: ['http://creativecommons.org/licenses/by-nc-nd/2.0/'],
      },
    }
    const expected = {
      rss: {
        '@version': '2.0',
        '@xmlns:creativeCommons': 'http://backend.userland.com/creativeCommonsRssModule',
        channel: {
          title: 'Licensed Feed',
          description: 'A feed with Creative Commons properties',
          'creativeCommons:license': ['http://creativecommons.org/licenses/by-nc-nd/2.0/'],
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
