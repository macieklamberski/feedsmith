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
})
