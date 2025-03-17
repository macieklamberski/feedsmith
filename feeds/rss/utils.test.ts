import { describe, expect, it } from 'bun:test'
import {
  parseAuthor,
  parseCategory,
  parseCloud,
  parseEnclosure,
  parseFeed,
  parseImage,
  parseItem,
  parseSkipDays,
  parseSkipHours,
  parseSource,
  parseTextInput,
} from './utils'

describe('parseTextInput', () => {
  it('should handle valid textInput object', () => {
    const value = {
      title: { '#text': 'Search Title' },
      description: { '#text': 'Search Description' },
      name: { '#text': 'searchForm' },
      link: { '#text': 'https://example.com/search' },
    }

    expect(parseTextInput(value, 'coerce')).toEqual({
      title: 'Search Title',
      description: 'Search Description',
      name: 'searchForm',
      link: 'https://example.com/search',
    })
  })

  it('should handle partial textInput object', () => {
    const value = {
      title: { '#text': 'Search Title' },
      link: { '#text': 'https://example.com/search' },
    }

    expect(parseTextInput(value, 'coerce')).toEqual({
      title: 'Search Title',
      link: 'https://example.com/search',
    })
  })

  it('should handle empty textInput object', () => {
    const value = {}

    expect(parseTextInput(value, 'coerce')).toEqual({})
  })

  it('should handle non-object value', () => {
    expect(parseTextInput('not an object', 'coerce')).toBeUndefined()
    expect(parseTextInput(undefined, 'coerce')).toBeUndefined()
  })

  it('should handle nested structures with coercible values', () => {
    const value = {
      title: { '#text': 123 },
      description: { '#text': true },
    }

    expect(parseTextInput(value, 'coerce')).toEqual({ title: '123' })
  })
})

describe('parseCloud', () => {
  it('should handle valid cloud object', () => {
    const value = {
      domain: 'rpc.example.com',
      port: '80',
      path: '/RPC2',
      registerprocedure: 'pingMe',
      protocol: 'soap',
    }

    expect(parseCloud(value, 'coerce')).toEqual({
      domain: 'rpc.example.com',
      port: 80,
      path: '/RPC2',
      registerProcedure: 'pingMe',
      protocol: 'soap',
    })
  })

  it('should handle partial cloud object', () => {
    const value = {
      domain: 'rpc.example.com',
      protocol: 'soap',
    }

    expect(parseCloud(value, 'coerce')).toEqual({
      domain: 'rpc.example.com',
      protocol: 'soap',
    })
  })

  it('should handle empty cloud object', () => {
    const value = {}

    expect(parseCloud(value, 'coerce')).toEqual({})
  })

  it('should handle non-object value', () => {
    expect(parseCloud('not an object', 'coerce')).toBeUndefined()
    expect(parseCloud(undefined, 'coerce')).toBeUndefined()
  })

  it('should handle coercible values', () => {
    const value = {
      domain: 123,
      port: '80',
      path: true,
    }

    expect(parseCloud(value, 'coerce')).toEqual({ domain: '123', port: 80 })
  })
})

describe('parseSkipHours', () => {
  it('should parse array of hour objects', () => {
    const value = {
      hour: [{ '#text': '0' }, { '#text': '1' }, { '#text': '2' }, { '#text': '23' }],
    }

    expect(parseSkipHours(value, 'coerce')).toEqual([0, 1, 2, 23])
  })

  it('should handle coercible values', () => {
    const value = {
      hour: [{ '#text': '0' }, { '#text': 'not a number' }, { '#text': '5' }],
    }

    expect(parseSkipHours(value, 'coerce')).toEqual([0, 5])
  })

  it('should return undefined for non-array hour', () => {
    const value = {
      hour: { '#text': '0' },
    }

    expect(parseSkipHours(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for missing hour', () => {
    const value = {}

    expect(parseSkipHours(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for non-object value', () => {
    expect(parseSkipHours('not an object', 'coerce')).toBeUndefined()
    expect(parseSkipHours(undefined, 'coerce')).toBeUndefined()
  })
})

describe('parseSkipDays', () => {
  it('should parse array of day objects', () => {
    const value = {
      day: [{ '#text': 'Monday' }, { '#text': 'Saturday' }, { '#text': 'Sunday' }],
    }

    expect(parseSkipDays(value, 'coerce')).toEqual(['Monday', 'Saturday', 'Sunday'])
  })

  it('should handle coercible values', () => {
    const value = {
      day: [{ '#text': 'Monday' }, { '#text': 123 }, { '#text': '' }],
    }

    expect(parseSkipDays(value, 'coerce')).toEqual(['Monday', '123', ''])
  })

  it('should return undefined for non-array day', () => {
    const value = {
      day: { '#text': 'Monday' },
    }

    expect(parseSkipDays(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for missing day', () => {
    const value = {}

    expect(parseSkipDays(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for non-object value', () => {
    expect(parseSkipDays('not an object', 'coerce')).toBeUndefined()
    expect(parseSkipDays(undefined, 'coerce')).toBeUndefined()
  })
})

describe('parseEnclosure', () => {
  it('should parse valid enclosure object', () => {
    const value = {
      url: { '#text': 'https://example.com/audio.mp3' },
      length: { '#text': '12345678' },
      type: { '#text': 'audio/mpeg' },
    }

    expect(parseEnclosure(value, 'coerce')).toEqual({
      url: 'https://example.com/audio.mp3',
      length: 12345678,
      type: 'audio/mpeg',
    })
  })

  it('should handle partial enclosure object', () => {
    const value = {
      url: { '#text': 'https://example.com/audio.mp3' },
      type: { '#text': 'audio/mpeg' },
    }

    expect(parseEnclosure(value, 'coerce')).toEqual({
      url: 'https://example.com/audio.mp3',
      type: 'audio/mpeg',
    })
  })

  it('should handle coercible values', () => {
    const value = {
      url: { '#text': 'https://example.com/audio.mp3' },
      length: { '#text': 'not a number' },
      type: { '#text': 123 },
    }

    expect(parseEnclosure(value, 'coerce')).toEqual({
      url: 'https://example.com/audio.mp3',
      type: '123',
    })
  })

  // TODO: Figure out what to do with enclosure with all empty fields.
  // it('should return undefined for missing enclosure', () => {
  //   const value = {}

  //   expect(parseEnclosure(value, 'coerce')).toBeUndefined()
  // })

  it('should return undefined for non-object value', () => {
    expect(parseEnclosure('not an object', 'coerce')).toBeUndefined()
    expect(parseEnclosure(undefined, 'coerce')).toBeUndefined()
  })
})

describe('parseSource', () => {
  it('should parse complete source object', () => {
    const value = {
      '#text': 'Technology',
      url: 'http://example.com/source',
    }

    expect(parseSource(value, 'coerce')).toEqual({
      title: 'Technology',
      url: 'http://example.com/source',
    })
  })

  it('should handle source with only title', () => {
    const value = {
      '#text': 'Technology',
    }

    expect(parseSource(value, 'coerce')).toEqual({ title: 'Technology' })
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      url: true,
    }

    expect(parseSource(value, 'coerce')).toEqual({ title: '123' })
  })

  it('should return undefined if title is missing', () => {
    const value = {
      url: 'http://example.com/categories',
    }

    expect(parseSource(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseSource(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for non-object value', () => {
    expect(parseSource(null, 'coerce')).toBeUndefined()
  })
})

describe('parseImage', () => {
  it('should parse complete image object', () => {
    const value = {
      url: { '#text': 'https://example.com/image.jpg' },
      title: { '#text': 'Example Image' },
      link: { '#text': 'https://example.com' },
      description: { '#text': 'Example description' },
      height: { '#text': '32' },
      width: { '#text': '32' },
    }

    expect(parseImage(value, 'coerce')).toEqual({
      url: 'https://example.com/image.jpg',
      title: 'Example Image',
      link: 'https://example.com',
      description: 'Example description',
      height: 32,
      width: 32,
    })
  })

  it('should handle partial image object', () => {
    const value = {
      url: { '#text': 'https://example.com/image.jpg' },
      title: { '#text': 'Example Image' },
    }

    expect(parseImage(value, 'coerce')).toEqual({
      url: 'https://example.com/image.jpg',
      title: 'Example Image',
    })
  })

  it('should handle coercible values', () => {
    const value = {
      url: { '#text': 'https://example.com/image.jpg' },
      title: { '#text': 123 },
      height: { '#text': 'not a number' },
      width: { '#text': '32' },
    }

    expect(parseImage(value, 'coerce')).toEqual({
      url: 'https://example.com/image.jpg',
      title: '123',
      width: 32,
    })
  })

  it('should return undefined for non-object value', () => {
    expect(parseImage('not an object', 'coerce')).toBeUndefined()
    expect(parseImage(undefined, 'coerce')).toBeUndefined()
  })

  it('should handle empty image object', () => {
    const value = {}

    expect(parseImage(value, 'coerce')).toEqual({})
  })
})

describe('parseCategory', () => {
  it('should parse complete category object', () => {
    const value = {
      '#text': 'Technology',
      domain: 'http://example.com/categories',
    }

    expect(parseCategory(value, 'coerce')).toEqual({
      name: 'Technology',
      domain: 'http://example.com/categories',
    })
  })

  it('should handle category with only name', () => {
    const value = {
      '#text': 'Technology',
    }

    expect(parseCategory(value, 'coerce')).toEqual({
      name: 'Technology',
    })
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      domain: true,
    }

    expect(parseCategory(value, 'coerce')).toEqual({
      name: '123',
    })
  })

  it('should return undefined if name is missing', () => {
    const value = {
      domain: 'http://example.com/categories',
    }

    expect(parseCategory(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseCategory(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for non-object value', () => {
    expect(parseCategory(null, 'coerce')).toBeUndefined()
  })
})

describe('parseAuthor', () => {
  it('should parse author string', () => {
    const value = {
      '#text': 'John Doe (john@example.com)',
    }

    expect(parseAuthor(value, 'coerce')).toBe('John Doe (john@example.com)')
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
    }

    expect(parseAuthor(value, 'coerce')).toBe('123')
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseAuthor(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for undefined value', () => {
    expect(parseAuthor(undefined, 'coerce')).toBeUndefined()
  })
})

describe('parseItem', () => {
  it('should parse complete item object', () => {
    const value = {
      title: { '#text': 'Item Title' },
      link: { '#text': 'https://example.com/item' },
      description: { '#text': 'Item Description' },
      author: [{ '#text': 'John Doe (john@example.com)' }],
      category: [
        { '#text': 'Technology', domain: 'http://example.com/categories' },
        { '#text': 'Web Development' },
      ],
      comments: { '#text': 'https://example.com/item/comments' },
      enclosure: {
        url: { '#text': 'https://example.com/audio.mp3' },
        length: { '#text': '12345678' },
        type: { '#text': 'audio/mpeg' },
      },
      guid: { '#text': 'https://example.com/guid/1234' },
      pubdate: { '#text': 'Mon, 15 Mar 2023 12:30:00 GMT' },
      source: { '#text': 'Example Source', url: 'https://example.com/source.xml' },
    }
    const expected = {
      title: 'Item Title',
      link: 'https://example.com/item',
      description: 'Item Description',
      authors: ['John Doe (john@example.com)'],
      categories: [
        { name: 'Technology', domain: 'http://example.com/categories' },
        { name: 'Web Development' },
      ],
      comments: 'https://example.com/item/comments',
      enclosure: {
        url: 'https://example.com/audio.mp3',
        length: 12345678,
        type: 'audio/mpeg',
      },
      guid: 'https://example.com/guid/1234',
      pubDate: 'Mon, 15 Mar 2023 12:30:00 GMT',
      source: { title: 'Example Source', url: 'https://example.com/source.xml' },
    }

    expect(parseItem(value, 'coerce')).toEqual(expected)
  })

  it('should handle minimal item with title only', () => {
    const value = {
      title: { '#text': 'Item Title' },
    }

    const expected = {
      title: 'Item Title',
    }

    expect(parseItem(value, 'coerce')).toEqual(expected)
  })

  it('should handle minimal item with description only', () => {
    const value = {
      description: { '#text': 'Item Description' },
    }

    const expected = {
      description: 'Item Description',
    }

    expect(parseItem(value, 'coerce')).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      title: { '#text': 123 },
      pubDate: { '#text': true },
      author: [{ '#text': 456 }],
    }

    expect(parseItem(value, 'coerce')).toEqual({
      title: '123',
      authors: ['456'],
    })
  })

  it('should return empty object for empty input', () => {
    const value = {}

    expect(parseItem(value, 'coerce')).toEqual({})
  })

  it('should return undefined for non-object input', () => {
    expect(parseItem('not an object', 'coerce')).toBeUndefined()
    expect(parseItem(undefined, 'coerce')).toBeUndefined()
  })
})

describe('parseFeed', () => {
  it('should parse complete feed object', () => {
    const value = {
      channel: {
        title: { '#text': 'Feed Title' },
        link: { '#text': 'https://example.com' },
        description: { '#text': 'Feed Description' },
        language: { '#text': 'en-us' },
        copyright: { '#text': '© 2023 Example' },
        managingeditor: { '#text': 'editor@example.com' },
        webmaster: { '#text': 'webmaster@example.com' },
        pubdate: { '#text': 'Mon, 15 Mar 2023 12:00:00 GMT' },
        lastbuilddate: { '#text': 'Mon, 15 Mar 2023 13:00:00 GMT' },
        category: [{ '#text': 'Technology', domain: 'http://example.com/categories' }],
        generator: { '#text': 'Example RSS Generator' },
        docs: { '#text': 'https://example.com/rss-docs' },
        cloud: {
          domain: 'rpc.example.com',
          port: '80',
          path: '/RPC2',
          registerprocedure: 'pingMe',
          protocol: 'soap',
        },
        ttl: { '#text': '60' },
        image: {
          url: { '#text': 'https://example.com/image.jpg' },
          title: { '#text': 'Example Image' },
          link: { '#text': 'https://example.com' },
        },
        rating: { '#text': 'The PICS rating of the feed' },
        textinput: {
          title: { '#text': 'Search' },
          description: { '#text': 'Search this feed' },
          name: { '#text': 'q' },
          link: { '#text': 'https://example.com/search' },
        },
        skiphours: {
          hour: [{ '#text': '0' }, { '#text': '1' }],
        },
        skipdays: {
          day: [{ '#text': 'Saturday' }, { '#text': 'Sunday' }],
        },
        item: [
          {
            title: { '#text': 'Item 1 Title' },
            link: { '#text': 'https://example.com/item1' },
            description: { '#text': 'Item 1 Description' },
          },
          {
            title: { '#text': 'Item 2 Title' },
            link: { '#text': 'https://example.com/item2' },
            description: { '#text': 'Item 2 Description' },
          },
        ],
      },
    }

    const expected = {
      title: 'Feed Title',
      link: 'https://example.com',
      description: 'Feed Description',
      language: 'en-us',
      copyright: '© 2023 Example',
      managingEditor: 'editor@example.com',
      webMaster: 'webmaster@example.com',
      pubDate: 'Mon, 15 Mar 2023 12:00:00 GMT',
      lastBuildDate: 'Mon, 15 Mar 2023 13:00:00 GMT',
      categories: [{ name: 'Technology', domain: 'http://example.com/categories' }],
      generator: 'Example RSS Generator',
      docs: 'https://example.com/rss-docs',
      cloud: {
        domain: 'rpc.example.com',
        port: 80,
        path: '/RPC2',
        registerProcedure: 'pingMe',
        protocol: 'soap',
      },
      ttl: 60,
      image: {
        url: 'https://example.com/image.jpg',
        title: 'Example Image',
        link: 'https://example.com',
      },
      rating: 'The PICS rating of the feed',
      textInput: {
        title: 'Search',
        description: 'Search this feed',
        name: 'q',
        link: 'https://example.com/search',
      },
      skipHours: [0, 1],
      skipDays: ['Saturday', 'Sunday'],
      items: [
        {
          title: 'Item 1 Title',
          link: 'https://example.com/item1',
          description: 'Item 1 Description',
        },
        {
          title: 'Item 2 Title',
          link: 'https://example.com/item2',
          description: 'Item 2 Description',
        },
      ],
    }

    expect(parseFeed(value, 'coerce')).toEqual(expected)
  })

  it('should handle minimal feed with only required fields', () => {
    const value = {
      channel: {
        title: { '#text': 'Feed Title' },
        link: { '#text': 'https://example.com' },
      },
    }

    const expected = {
      title: 'Feed Title',
      link: 'https://example.com',
    }

    expect(parseFeed(value, 'coerce')).toEqual(expected)
  })

  it('should return undefined when title is missing', () => {
    const value = {
      channel: {
        link: { '#text': 'https://example.com' },
        description: { '#text': 'Feed Description' },
      },
    }

    expect(parseFeed(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined when link is missing', () => {
    const value = {
      channel: {
        title: { '#text': 'Feed Title' },
        description: { '#text': 'Feed Description' },
      },
    }

    expect(parseFeed(value, 'coerce')).toBeUndefined()
  })

  it('should handle coercible values', () => {
    const value = {
      channel: {
        title: { '#text': 123 },
        link: { '#text': 456 },
        ttl: { '#text': '60' },
        category: [{ '#text': 789 }],
        item: [
          {
            title: { '#text': 'Item Title' },
            guid: { '#text': 101112 },
          },
        ],
      },
    }

    expect(parseFeed(value, 'coerce')).toEqual({
      title: '123',
      link: '456',
      ttl: 60,
      categories: [{ name: '789' }],
      items: [{ title: 'Item Title', guid: '101112' }],
    })
  })

  it('should return undefined for empty channel', () => {
    const value = {
      channel: {},
    }

    expect(parseFeed(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for missing channel', () => {
    const value = {}

    expect(parseFeed(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseFeed('not an object', 'coerce')).toBeUndefined()
    expect(parseFeed(undefined, 'coerce')).toBeUndefined()
  })

  it('should handle complex nested structures', () => {
    const value = {
      channel: {
        title: { '#text': 'Feed Title' },
        link: { '#text': 'https://example.com' },
        item: [
          {
            title: { '#text': 'Item 1' },
            category: [
              { '#text': 'Category 1' },
              { '#text': 'Category 2', domain: 'http://example.com/cat' },
            ],
            enclosure: {
              url: { '#text': 'https://example.com/file.mp3' },
              length: { '#text': '12345' },
              type: { '#text': 'audio/mpeg' },
            },
          },
          {
            title: { '#text': 'Item 2' },
            description: { '#text': 'Item 2 Description' },
            author: [{ '#text': 'Author 1' }, { '#text': 'Author 2' }],
          },
        ],
        image: {
          url: { '#text': 'https://example.com/image.jpg' },
          title: { '#text': 'Image Title' },
          link: { '#text': 'https://example.com' },
          height: { '#text': '32' },
          width: { '#text': '32' },
        },
      },
    }
    const expected = {
      title: 'Feed Title',
      link: 'https://example.com',
      items: [
        {
          title: 'Item 1',
          categories: [
            { name: 'Category 1' },
            { name: 'Category 2', domain: 'http://example.com/cat' },
          ],
          enclosure: {
            url: 'https://example.com/file.mp3',
            length: 12345,
            type: 'audio/mpeg',
          },
        },
        {
          title: 'Item 2',
          description: 'Item 2 Description',
          authors: ['Author 1', 'Author 2'],
        },
      ],
      image: {
        url: 'https://example.com/image.jpg',
        title: 'Image Title',
        link: 'https://example.com',
        height: 32,
        width: 32,
      },
    }

    expect(parseFeed(value, 'coerce')).toEqual(expected)
  })
})
