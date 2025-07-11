import { describe, expect, it } from 'bun:test'
import {
  parseCategory,
  parseCloud,
  parseEnclosure,
  parseFeed,
  parseGuid,
  parseImage,
  parseItem,
  parsePerson,
  parseSkipDays,
  parseSkipHours,
  parseSource,
  parseTextInput,
  retrieveFeed,
} from './utils.js'

describe('parsePerson', () => {
  it('should parse author string (with #text)', () => {
    const value = {
      '#text': 'John Doe (john@example.com)',
    }
    const expected = 'John Doe (john@example.com)'

    expect(parsePerson(value)).toBe(expected)
  })

  it('should parse author string (without #text)', () => {
    const value = 'John Doe (john@example.com)'
    const expected = 'John Doe (john@example.com)'

    expect(parsePerson(value)).toBe(expected)
  })

  it('should parse author nested under author.name', () => {
    const value = {
      name: {
        '#text': 'John Doe',
      },
    }

    expect(parsePerson(value)).toBe('John Doe')
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
    }

    expect(parsePerson(value)).toBe('123')
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parsePerson(value)).toBeUndefined()
  })

  it('should return undefined for undefined value', () => {
    expect(parsePerson(undefined)).toBeUndefined()
  })
})

describe('parseCategory', () => {
  it('should parse complete category object', () => {
    const value = {
      '#text': 'Technology',
      '@domain': 'http://example.com/categories',
    }
    const expected = {
      name: 'Technology',
      domain: 'http://example.com/categories',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should handle category with only name (with #text)', () => {
    const value = {
      '#text': 'Technology',
    }
    const expected = {
      name: 'Technology',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should handle category with only name (without #text)', () => {
    const value = 'Technology'
    const expected = {
      name: 'Technology',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@domain': true,
    }
    const expected = {
      name: '123',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should handle partial objects (missing name)', () => {
    const value = {
      '@domain': 'http://example.com/categories',
    }
    const expected = {
      domain: 'http://example.com/categories',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseCategory(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseCategory(null)).toBeUndefined()
  })
})

describe('parseCloud', () => {
  it('should handle valid cloud object (also with coercible values)', () => {
    const value = {
      '@domain': 'rpc.example.com',
      '@port': '80',
      '@path': '/RPC2',
      '@registerprocedure': 'pingMe',
      '@protocol': 'soap',
    }
    const expected = {
      domain: 'rpc.example.com',
      port: 80,
      path: '/RPC2',
      registerProcedure: 'pingMe',
      protocol: 'soap',
    }

    expect(parseCloud(value)).toEqual(expected)
  })

  it('should handle partial objects (missing required fields)', () => {
    const value = {
      '@domain': 'rpc.example.com',
      '@protocol': 'soap',
    }
    const expected = {
      domain: 'rpc.example.com',
      protocol: 'soap',
    }

    expect(parseCloud(value)).toEqual(expected)
  })

  it('should handle empty cloud object', () => {
    const value = {}

    expect(parseCloud(value)).toBeUndefined()
  })

  it('should handle non-object value', () => {
    expect(parseCloud('not an object')).toBeUndefined()
    expect(parseCloud(undefined)).toBeUndefined()
  })
})

describe('parseImage', () => {
  const expectedFull = {
    url: 'https://example.com/image.jpg',
    title: 'Example Image',
    link: 'https://example.com',
    description: 'Example description',
    height: 32,
    width: 32,
  }

  it('should parse complete image object (with correct values) (with #text)', () => {
    const value = {
      url: { '#text': 'https://example.com/image.jpg' },
      title: { '#text': 'Example Image' },
      link: { '#text': 'https://example.com' },
      description: { '#text': 'Example description' },
      height: { '#text': '32' },
      width: { '#text': '32' },
    }

    expect(parseImage(value)).toEqual(expectedFull)
  })

  it('should parse complete image object (with correct values) (without #text)', () => {
    const value = {
      url: 'https://example.com/image.jpg',
      title: 'Example Image',
      link: 'https://example.com',
      description: 'Example description',
      height: '32',
      width: '32',
    }

    expect(parseImage(value)).toEqual(expectedFull)
  })

  it('should parse complete image object (with correct values) (with array of values)', () => {
    const value = {
      url: ['https://example.com/image.jpg', 'https://example.com/alternate-image.jpg'],
      title: ['Example Image', 'Alternative Image Title'],
      link: ['https://example.com', 'https://example.com/alternate'],
      description: ['Example description', 'Alternative description'],
      height: ['32', '64'],
      width: ['32', '64'],
    }

    expect(parseImage(value)).toEqual(expectedFull)
  })

  it('should handle partial objects (missing required fields)', () => {
    const value = {
      url: { '#text': 'https://example.com/image.jpg' },
      title: { '#text': 'Example Image' },
    }
    const expected = {
      url: 'https://example.com/image.jpg',
      title: 'Example Image',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(parseImage('not an object')).toBeUndefined()
    expect(parseImage(undefined)).toBeUndefined()
  })

  it('should handle empty image object', () => {
    const value = {}

    expect(parseImage(value)).toBeUndefined()
  })
})

describe('parseTextInput', () => {
  const expectedFull = {
    title: 'Search Title',
    description: 'Search Description',
    name: 'searchForm',
    link: 'https://example.com/search',
  }

  it('should handle valid textInput object (with #text)', () => {
    const value = {
      title: { '#text': 'Search Title' },
      description: { '#text': 'Search Description' },
      name: { '#text': 'searchForm' },
      link: { '#text': 'https://example.com/search' },
    }

    expect(parseTextInput(value)).toEqual(expectedFull)
  })

  it('should handle valid textInput object (without #text)', () => {
    const value = {
      title: 'Search Title',
      description: 'Search Description',
      name: 'searchForm',
      link: 'https://example.com/search',
    }

    expect(parseTextInput(value)).toEqual(expectedFull)
  })

  it('should handle valid textInput object (with array of values)', () => {
    const value = {
      title: ['Search Title', 'Alternative Search Title'],
      description: ['Search Description', 'Extended Search Description'],
      name: ['searchForm', 'advancedSearchForm'],
      link: ['https://example.com/search', 'https://example.com/advanced-search'],
    }

    expect(parseTextInput(value)).toEqual(expectedFull)
  })

  it('should handle partial objects (missing some fields)', () => {
    const value = {
      title: { '#text': 'Search Title' },
      link: { '#text': 'https://example.com/search' },
    }
    const expected = {
      title: 'Search Title',
      link: 'https://example.com/search',
    }

    expect(parseTextInput(value)).toEqual(expected)
  })

  it('should handle empty textInput object', () => {
    const value = {}

    expect(parseTextInput(value)).toBeUndefined()
  })

  it('should handle non-object value', () => {
    expect(parseTextInput('not an object')).toBeUndefined()
    expect(parseTextInput(undefined)).toBeUndefined()
  })

  it('should handle coercible values', () => {
    const value = {
      title: { '#text': 123 },
      description: { '#text': 'Search Description' },
      name: { '#text': 'searchForm' },
      link: { '#text': 'https://example.com/search' },
    }
    const expected = {
      title: '123',
      description: 'Search Description',
      name: 'searchForm',
      link: 'https://example.com/search',
    }

    expect(parseTextInput(value)).toEqual(expected)
  })
})

describe('parseSkipHours', () => {
  it('should parse array of hour objects (with #text)', () => {
    const value = {
      hour: [{ '#text': '0' }, { '#text': '1' }, { '#text': '2' }, { '#text': '23' }],
    }
    const expected = [0, 1, 2, 23]

    expect(parseSkipHours(value)).toEqual(expected)
  })

  it('should parse array of hour objects (without #text)', () => {
    const value = {
      hour: ['0', '1', '2', '23'],
    }
    const expected = [0, 1, 2, 23]

    expect(parseSkipHours(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      hour: [{ '#text': '0' }, { '#text': 'not a number' }, { '#text': '5' }],
    }

    expect(parseSkipHours(value)).toEqual([0, 5])
  })

  it('should return undefined for non-array hour', () => {
    const value = {
      hour: { '#text': '0' },
    }

    expect(parseSkipHours(value)).toBeUndefined()
  })

  it('should return undefined for missing hour', () => {
    const value = {}

    expect(parseSkipHours(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseSkipHours('not an object')).toBeUndefined()
    expect(parseSkipHours(undefined)).toBeUndefined()
  })
})

describe('parseSkipDays', () => {
  it('should parse array of day objects (with #text)', () => {
    const value = {
      day: [{ '#text': 'Monday' }, { '#text': 'Saturday' }, { '#text': 'Sunday' }],
    }
    const expected = ['Monday', 'Saturday', 'Sunday']

    expect(parseSkipDays(value)).toEqual(expected)
  })

  it('should parse array of day objects (without #text)', () => {
    const value = {
      day: ['Monday', 'Saturday', 'Sunday'],
    }
    const expected = ['Monday', 'Saturday', 'Sunday']

    expect(parseSkipDays(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      day: [{ '#text': 'Monday' }, { '#text': 123 }, { '#text': '' }],
    }

    expect(parseSkipDays(value)).toEqual(['Monday', '123'])
  })

  it('should return undefined for non-array day', () => {
    const value = {
      day: { '#text': 'Monday' },
    }

    expect(parseSkipDays(value)).toBeUndefined()
  })

  it('should return undefined for missing day', () => {
    const value = {}

    expect(parseSkipDays(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseSkipDays('not an object')).toBeUndefined()
    expect(parseSkipDays(undefined)).toBeUndefined()
  })
})

describe('parseEnclosure', () => {
  it('should parse valid enclosure object', () => {
    const value = {
      '@url': 'https://example.com/audio.mp3',
      '@length': '12345678',
      '@type': 'audio/mpeg',
    }
    const expected = {
      url: 'https://example.com/audio.mp3',
      length: 12345678,
      type: 'audio/mpeg',
    }

    expect(parseEnclosure(value)).toEqual(expected)
  })

  it('should handle partial objects (missing required fields)', () => {
    const value = {
      '@url': 'https://example.com/audio.mp3',
      '@type': 'audio/mpeg',
    }
    const expected = {
      url: 'https://example.com/audio.mp3',
      type: 'audio/mpeg',
    }

    expect(parseEnclosure(value)).toEqual(expected)
  })

  it('should handle partial objects (with invalid values)', () => {
    const value = {
      '@url': 'https://example.com/audio.mp3',
      '@length': 'not a number',
      '@type': 123,
    }
    const expected = {
      url: 'https://example.com/audio.mp3',
      type: '123',
    }

    expect(parseEnclosure(value)).toEqual(expected)
  })

  it('should return undefined for missing enclosure', () => {
    const value = {}

    expect(parseEnclosure(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseEnclosure('not an object')).toBeUndefined()
    expect(parseEnclosure(undefined)).toBeUndefined()
  })
})

describe('parseGuid', () => {
  it('should parse complete guid object', () => {
    const value = {
      '#text': 'https://example.com/posts/123456',
      '@ispermalink': 'true',
    }
    const expected = {
      value: 'https://example.com/posts/123456',
      isPermaLink: true,
    }

    expect(parseGuid(value)).toEqual(expected)
  })

  it('should parse guid with only required value field (as object)', () => {
    const value = {
      '#text': 'https://example.com/posts/123456',
    }
    const expected = {
      value: 'https://example.com/posts/123456',
    }

    expect(parseGuid(value)).toEqual(expected)
  })

  it('should parse guid with only required value field (as string)', () => {
    const value = 'https://example.com/posts/123456'
    const expected = {
      value: 'https://example.com/posts/123456',
    }

    expect(parseGuid(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123456,
    }
    const expected = {
      value: '123456',
    }

    expect(parseGuid(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'https://example.com/posts/123456',
      '@ispermalink': 'false',
      '@invalid': 'property',
    }
    const expected = {
      value: 'https://example.com/posts/123456',
      isPermaLink: false,
    }

    expect(parseGuid(value)).toEqual(expected)
  })

  it('should handle partial objects (missing value)', () => {
    const value = {
      '@ispermalink': 'true',
    }
    const expected = {
      isPermaLink: true,
    }

    expect(parseGuid(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseGuid(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseGuid(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseGuid(undefined)).toBeUndefined()
    expect(parseGuid(null)).toBeUndefined()
    expect(parseGuid([])).toBeUndefined()
  })
})

describe('parseSource', () => {
  it('should parse complete source object', () => {
    const value = {
      '#text': 'Technology',
      '@url': 'http://example.com/source',
    }
    const expected = {
      title: 'Technology',
      url: 'http://example.com/source',
    }

    expect(parseSource(value)).toEqual(expected)
  })

  it('should handle source with only title (with #text)', () => {
    const value = { '#text': 'Technology' }
    const expected = { title: 'Technology' }

    expect(parseSource(value)).toEqual(expected)
  })

  it('should handle source with only title (without #text)', () => {
    const value = 'Technology'
    const expected = { title: 'Technology' }

    expect(parseSource(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@url': true,
    }
    const expected = { title: '123' }

    expect(parseSource(value)).toEqual(expected)
  })

  it('should handle partial objects (missing title)', () => {
    const value = {
      '@url': 'http://example.com/categories',
    }
    const expected = {
      url: 'http://example.com/categories',
    }

    expect(parseSource(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseSource(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseSource(null)).toBeUndefined()
  })
})

describe('parseItem', () => {
  const expectedFull = {
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
    guid: { value: 'https://example.com/guid/1234' },
    pubDate: 'Mon, 15 Mar 2023 12:30:00 GMT',
    source: { title: 'Example Source', url: 'https://example.com/source.xml' },
  }

  it('should parse complete item object (with #text)', () => {
    const value = {
      title: { '#text': 'Item Title' },
      link: { '#text': 'https://example.com/item' },
      description: { '#text': 'Item Description' },
      author: [{ '#text': 'John Doe (john@example.com)' }],
      category: [
        { '#text': 'Technology', '@domain': 'http://example.com/categories' },
        { '#text': 'Web Development' },
      ],
      comments: { '#text': 'https://example.com/item/comments' },
      enclosure: {
        '@url': 'https://example.com/audio.mp3',
        '@length': '12345678',
        '@type': 'audio/mpeg',
      },
      guid: { '#text': 'https://example.com/guid/1234' },
      pubdate: { '#text': 'Mon, 15 Mar 2023 12:30:00 GMT' },
      source: { '#text': 'Example Source', '@url': 'https://example.com/source.xml' },
    }

    expect(parseItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object (without array of values)', () => {
    const value = {
      title: ['Item Title', 'Alternative Item Title'],
      link: ['https://example.com/item', 'https://example.com/item-alternate'],
      description: ['Item Description', 'Extended Item Description'],
      author: ['John Doe (john@example.com)'],
      category: [
        { '#text': 'Technology', '@domain': 'http://example.com/categories' },
        'Web Development',
      ],
      comments: ['https://example.com/item/comments', 'https://example.com/item/discussion'],
      enclosure: [
        {
          '@url': 'https://example.com/audio.mp3',
          '@length': '12345678',
          '@type': 'audio/mpeg',
        },
        {
          '@url': 'https://example.com/audio-alt.mp3',
          '@length': '87654321',
          '@type': 'audio/mpeg',
        },
      ],
      guid: ['https://example.com/guid/1234', 'https://example.com/guid/5678'],
      pubdate: ['Mon, 15 Mar 2023 12:30:00 GMT', 'Tue, 16 Mar 2023 14:45:00 GMT'],
      source: [
        { '#text': 'Example Source', '@url': 'https://example.com/source.xml' },
        { '#text': 'Alternative Source', '@url': 'https://example.com/alt-source.xml' },
      ],
    }

    expect(parseItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object (without #text)', () => {
    const value = {
      title: 'Item Title',
      link: 'https://example.com/item',
      description: 'Item Description',
      author: ['John Doe (john@example.com)'],
      category: [
        { '#text': 'Technology', '@domain': 'http://example.com/categories' },
        'Web Development',
      ],
      comments: 'https://example.com/item/comments',
      enclosure: {
        '@url': 'https://example.com/audio.mp3',
        '@length': '12345678',
        '@type': 'audio/mpeg',
      },
      guid: 'https://example.com/guid/1234',
      pubdate: 'Mon, 15 Mar 2023 12:30:00 GMT',
      source: { '#text': 'Example Source', '@url': 'https://example.com/source.xml' },
    }

    expect(parseItem(value)).toEqual(expectedFull)
  })

  it('should handle minimal item with title only', () => {
    const value = {
      title: { '#text': 'Item Title' },
    }
    const expected = {
      title: 'Item Title',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle minimal item with description only', () => {
    const value = {
      description: { '#text': 'Item Description' },
    }
    const expected = {
      description: 'Item Description',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      title: { '#text': 123 },
      pubDate: { '#text': true },
      author: [{ '#text': 456 }],
    }

    expect(parseItem(value)).toEqual({
      title: '123',
      authors: ['456'],
    })
  })

  it('should return empty object for empty input', () => {
    const value = {}

    expect(parseItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseItem('not an object')).toBeUndefined()
    expect(parseItem(undefined)).toBeUndefined()
  })

  it('should handle atom namespace', () => {
    const value = {
      title: { '#text': 'Item 1' },
      'atom:link': { '@href': 'http://example.com', '@rel': 'self' },
    }
    const expected = {
      title: 'Item 1',
      atom: { links: [{ href: 'http://example.com', rel: 'self' }] },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle content namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      'content:encoded': { '#text': '<![CDATA[<div>John Doe</div>]]>' },
    }
    const expected = {
      title: 'Example Entry',
      content: { encoded: '<div>John Doe</div>' },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle dc namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      'dc:creator': { '#text': 'John Doe' },
    }
    const expected = {
      title: 'Example Entry',
      dc: { creator: 'John Doe' },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle slash namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      'slash:comments': { '#text': '10' },
    }
    const expected = {
      title: 'Example Entry',
      slash: { comments: 10 },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle dcterms namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      'dcterms:created': { '#text': '2023-02-01T00:00:00Z' },
      'dcterms:license': { '#text': 'MIT License' },
    }
    const expected = {
      title: 'Example Entry',
      dcterms: {
        created: '2023-02-01T00:00:00Z',
        license: 'MIT License',
      },
    }

    expect(parseItem(value)).toEqual(expected)
  })
})

describe('parseFeed', () => {
  const expectedFull = {
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
      description: 'Some image description',
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

  it('should parse complete feed object (with #text)', () => {
    const value = {
      title: { '#text': 'Feed Title' },
      link: { '#text': 'https://example.com' },
      description: { '#text': 'Feed Description' },
      language: { '#text': 'en-us' },
      copyright: { '#text': '© 2023 Example' },
      managingeditor: { '#text': 'editor@example.com' },
      webmaster: { '#text': 'webmaster@example.com' },
      pubdate: { '#text': 'Mon, 15 Mar 2023 12:00:00 GMT' },
      lastbuilddate: { '#text': 'Mon, 15 Mar 2023 13:00:00 GMT' },
      category: [{ '#text': 'Technology', '@domain': 'http://example.com/categories' }],
      generator: { '#text': 'Example RSS Generator' },
      docs: { '#text': 'https://example.com/rss-docs' },
      cloud: {
        '@domain': 'rpc.example.com',
        '@port': '80',
        '@path': '/RPC2',
        '@registerprocedure': 'pingMe',
        '@protocol': 'soap',
      },
      ttl: { '#text': '60' },
      image: {
        url: { '#text': 'https://example.com/image.jpg' },
        title: { '#text': 'Example Image' },
        link: { '#text': 'https://example.com' },
        description: { '#text': 'Some image description' },
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
    }

    expect(parseFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete feed object (without #text)', () => {
    const value = {
      title: 'Feed Title',
      link: 'https://example.com',
      description: 'Feed Description',
      language: 'en-us',
      copyright: '© 2023 Example',
      managingeditor: 'editor@example.com',
      webmaster: 'webmaster@example.com',
      pubdate: 'Mon, 15 Mar 2023 12:00:00 GMT',
      lastbuilddate: 'Mon, 15 Mar 2023 13:00:00 GMT',
      category: [{ '#text': 'Technology', '@domain': 'http://example.com/categories' }],
      generator: 'Example RSS Generator',
      docs: 'https://example.com/rss-docs',
      cloud: {
        '@domain': 'rpc.example.com',
        '@port': '80',
        '@path': '/RPC2',
        '@registerprocedure': 'pingMe',
        '@protocol': 'soap',
      },
      ttl: '60',
      image: {
        url: 'https://example.com/image.jpg',
        title: 'Example Image',
        link: 'https://example.com',
        description: 'Some image description',
      },
      rating: 'The PICS rating of the feed',
      textinput: {
        title: 'Search',
        description: 'Search this feed',
        name: 'q',
        link: 'https://example.com/search',
      },
      skiphours: {
        hour: ['0', '1'],
      },
      skipdays: {
        day: ['Saturday', 'Sunday'],
      },
      item: [
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

    expect(parseFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete feed object (with array of values)', () => {
    const value = {
      title: ['Feed Title', 'Alternative Feed Title'],
      link: ['https://example.com', 'https://example.com/alternate'],
      description: ['Feed Description', 'Extended Feed Description'],
      language: ['en-us', 'fr-fr'],
      copyright: ['© 2023 Example', 'Copyright 2023, Example Inc.'],
      managingeditor: ['editor@example.com', 'chief-editor@example.com'],
      webmaster: ['webmaster@example.com', 'tech@example.com'],
      pubdate: ['Mon, 15 Mar 2023 12:00:00 GMT', 'Tue, 16 Mar 2023 12:00:00 GMT'],
      lastbuilddate: ['Mon, 15 Mar 2023 13:00:00 GMT', 'Tue, 16 Mar 2023 14:00:00 GMT'],
      category: [{ '#text': 'Technology', '@domain': 'http://example.com/categories' }],
      generator: ['Example RSS Generator', 'Alternative RSS Generator'],
      docs: ['https://example.com/rss-docs', 'https://example.com/rss-specification'],
      cloud: [
        {
          '@domain': 'rpc.example.com',
          '@port': '80',
          '@path': '/RPC2',
          '@registerprocedure': 'pingMe',
          '@protocol': 'soap',
        },
        {
          '@domain': 'rpc2.example.com',
          '@port': '443',
          '@path': '/RPC3',
          '@registerprocedure': 'notifyMe',
          '@protocol': 'xml-rpc',
        },
      ],
      ttl: ['60', '120'],
      image: [
        {
          url: 'https://example.com/image.jpg',
          title: 'Example Image',
          link: 'https://example.com',
          description: 'Some image description',
        },
        {
          url: 'https://example.com/alternate-image.jpg',
          title: 'Alternative Image',
          link: 'https://example.com/alternate',
          description: 'Alternative image description',
        },
      ],
      rating: ['The PICS rating of the feed', 'Alternative PICS rating'],
      textinput: [
        {
          title: 'Search',
          description: 'Search this feed',
          name: 'q',
          link: 'https://example.com/search',
        },
        {
          title: 'Advanced Search',
          description: 'Advanced search options',
          name: 'query',
          link: 'https://example.com/advanced-search',
        },
      ],
      skiphours: [{ hour: ['0', '1'] }, { hour: ['22', '23'] }],
      skipdays: [{ day: ['Saturday', 'Sunday'] }, { day: ['Monday', 'Friday'] }],
      item: [
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

    expect(parseFeed(value)).toEqual(expectedFull)
  })

  it('should handle minimal feed with only required fields', () => {
    const value = {
      title: { '#text': 'Feed Title' },
    }
    const expected = {
      title: 'Feed Title',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle partial objects (missing required fields)', () => {
    const value = {
      description: { '#text': 'Feed Description' },
    }
    const expected = {
      description: 'Feed Description',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
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
    }
    const expected = {
      title: '123',
      link: '456',
      ttl: 60,
      categories: [{ name: '789' }],
      items: [{ title: 'Item Title', guid: { value: '101112' } }],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should return undefined for missing channel', () => {
    const value = {}

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseFeed('not an object')).toBeUndefined()
    expect(parseFeed(undefined)).toBeUndefined()
  })

  it('should handle complex nested structures', () => {
    const value = {
      title: { '#text': 'Feed Title' },
      link: { '#text': 'https://example.com' },
      item: [
        {
          title: { '#text': 'Item 1' },
          category: [
            { '#text': 'Category 1' },
            { '#text': 'Category 2', '@domain': 'http://example.com/cat' },
          ],
          enclosure: {
            '@url': 'https://example.com/file.mp3',
            '@length': '12345',
            '@type': 'audio/mpeg',
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

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle atom namespace', () => {
    const value = {
      title: { '#text': 'Feed Title' },
      link: { '#text': 'https://example.com' },
      'atom:link': { '@href': 'http://example.com', '@rel': 'self' },
    }
    const expected = {
      title: 'Feed Title',
      link: 'https://example.com',
      atom: { links: [{ href: 'http://example.com', rel: 'self' }] },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle dc namespace', () => {
    const value = {
      title: { '#text': 'Feed Title' },
      link: { '#text': 'https://example.com' },
      'dc:creator': { '#text': 'John Doe' },
    }
    const expected = {
      title: 'Feed Title',
      link: 'https://example.com',
      dc: { creator: 'John Doe' },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle sy namespace', () => {
    const value = {
      title: { '#text': 'Example Feed' },
      link: { '#text': 'https://example.com' },
      'sy:updatefrequency': { '#text': '5' },
    }
    const expected = {
      title: 'Example Feed',
      link: 'https://example.com',
      sy: { updateFrequency: 5 },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle dcterms namespace', () => {
    const value = {
      title: { '#text': 'Example Feed' },
      link: { '#text': 'https://example.com' },
      'dcterms:created': { '#text': '2023-01-01T00:00:00Z' },
      'dcterms:license': { '#text': 'Creative Commons Attribution 4.0' },
    }
    const expected = {
      title: 'Example Feed',
      link: 'https://example.com',
      dcterms: {
        created: '2023-01-01T00:00:00Z',
        license: 'Creative Commons Attribution 4.0',
      },
    }

    expect(parseFeed(value)).toEqual(expected)
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
    title: 'Feed Title',
    link: 'https://example.com',
  }

  it('should retrieve feed with only required fields (with #text)', () => {
    const value = {
      rss: {
        channel: {
          title: { '#text': 'Feed Title' },
          link: { '#text': 'https://example.com' },
        },
      },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should retrieve feed with only required fields (without #text)', () => {
    const value = {
      rss: {
        channel: {
          title: 'Feed Title',
          link: 'https://example.com',
        },
      },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should retrieve feed with only required fields (with array of values)', () => {
    const value = {
      rss: {
        channel: [
          {
            title: 'Feed Title',
            link: 'https://example.com',
          },
          {
            title: 'Feed Title 2',
            link: 'https://example.com/2',
          },
        ],
      },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })
})
