import { describe, expect, it } from 'bun:test'
import {
  parseFeed,
  parseImage,
  parseItem,
  parseTextInput,
  retrieveFeed,
  retrieveImage,
  retrieveItems,
  retrieveTextInput,
} from './utils.js'

describe('parseImage', () => {
  const expectedFull = {
    title: 'Image Title',
    link: 'https://example.com',
    url: 'https://example.com/image.jpg',
  }

  it('should handle complete image object (with #text)', () => {
    const value = {
      title: { '#text': 'Image Title' },
      link: { '#text': 'https://example.com' },
      url: { '#text': 'https://example.com/image.jpg' },
    }

    expect(parseImage(value)).toEqual(expectedFull)
  })

  it('should handle complete image object (without #text)', () => {
    const value = {
      title: 'Image Title',
      link: 'https://example.com',
      url: 'https://example.com/image.jpg',
    }

    expect(parseImage(value)).toEqual(expectedFull)
  })

  it('should handle complete image object (with array of values)', () => {
    const value = {
      title: ['Image Title', 'Alternative Image Title'],
      link: ['https://example.com', 'https://example.com/alternate'],
      url: ['https://example.com/image.jpg', 'https://example.com/alternate-image.jpg'],
    }

    expect(parseImage(value)).toEqual(expectedFull)
  })

  it('should handle image with only required fields', () => {
    const value = {
      title: { '#text': 'Image Title' },
      link: { '#text': 'https://example.com' },
    }
    const expected = {
      title: 'Image Title',
      link: 'https://example.com',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      title: { '#text': 123 },
      link: { '#text': 456 },
      url: { '#text': true },
    }
    const expected = {
      title: '123',
      link: '456',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should handle partial objects (missing title)', () => {
    const value = {
      link: { '#text': 'https://example.com' },
      url: { '#text': 'https://example.com/image.jpg' },
    }
    const expected = {
      link: 'https://example.com',
      url: 'https://example.com/image.jpg',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should handle partial objects (missing link)', () => {
    const value = {
      title: { '#text': 'Image Title' },
      url: { '#text': 'https://example.com/image.jpg' },
    }
    const expected = {
      title: 'Image Title',
      url: 'https://example.com/image.jpg',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(parseImage('not an object')).toBeUndefined()
    expect(parseImage(undefined)).toBeUndefined()
    expect(parseImage(null)).toBeUndefined()
    expect(parseImage([])).toBeUndefined()
  })

  it('should return undefined for missing image property', () => {
    const value = {
      someOtherProperty: {},
    }

    expect(parseImage(value)).toBeUndefined()
  })

  it('should handle rdf namespace attributes', () => {
    const value = {
      '@rdf:about': 'http://example.com/image',
      title: { '#text': 'Image Title' },
      link: { '#text': 'https://example.com' },
    }
    const expected = {
      title: 'Image Title',
      link: 'https://example.com',
      rdf: { about: 'http://example.com/image' },
    }

    expect(parseImage(value)).toEqual(expected)
  })
})

describe('retrieveImage', () => {
  it('should retrieve complete image object', () => {
    const value = {
      image: {
        title: { '#text': 'Image Title' },
        link: { '#text': 'https://example.com' },
        url: { '#text': 'https://example.com/image.jpg' },
      },
    }
    const expected = {
      title: 'Image Title',
      link: 'https://example.com',
      url: 'https://example.com/image.jpg',
    }

    expect(retrieveImage(value)).toEqual(expected)
  })

  it('should retrieve image using ToC reference', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        image: { '@resource': 'http://example.com/image' },
      },
      image: {
        '@about': 'http://example.com/image',
        title: 'Logo',
        url: 'http://example.com/logo.png',
      },
    }
    const expected = {
      title: 'Logo',
      url: 'http://example.com/logo.png',
      rdf: { about: 'http://example.com/image' },
    }

    expect(retrieveImage(value)).toEqual(expected)
  })

  it('should retrieve correct image when multiple images exist', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        image: { '@resource': 'http://example.com/image2' },
      },
      image: [
        {
          '@about': 'http://example.com/image1',
          title: 'First Image',
          url: 'http://example.com/first.png',
        },
        {
          '@about': 'http://example.com/image2',
          title: 'Second Image',
          url: 'http://example.com/second.png',
        },
      ],
    }
    const expected = {
      title: 'Second Image',
      url: 'http://example.com/second.png',
      rdf: { about: 'http://example.com/image2' },
    }

    expect(retrieveImage(value)).toEqual(expected)
  })

  it('should fall back to direct parsing when no ToC reference', () => {
    const value = {
      channel: {
        title: 'Test Feed',
      },
      image: {
        title: 'Fallback Image',
        url: 'http://example.com/fallback.png',
      },
    }
    const expected = {
      title: 'Fallback Image',
      url: 'http://example.com/fallback.png',
    }

    expect(retrieveImage(value)).toEqual(expected)
  })

  it('should fall back to direct parsing when referenced image not found', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        image: { '@resource': 'http://example.com/missing' },
      },
      image: {
        '@about': 'http://example.com/other',
        title: 'Other Image',
        url: 'http://example.com/other.png',
      },
    }
    const expected = {
      title: 'Other Image',
      url: 'http://example.com/other.png',
      rdf: { about: 'http://example.com/other' },
    }

    expect(retrieveImage(value)).toEqual(expected)
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveImage('string')).toBeUndefined()
    expect(retrieveImage(123)).toBeUndefined()
    expect(retrieveImage(null)).toBeUndefined()
    expect(retrieveImage(undefined)).toBeUndefined()
  })
})

describe('parseTextInput', () => {
  const expectedFull = {
    title: 'Search Title',
    description: 'Search Description',
    name: 'q',
    link: 'https://example.com/search',
  }

  it('should handle complete textInput object (with #text)', () => {
    const value = {
      title: { '#text': 'Search Title' },
      description: { '#text': 'Search Description' },
      name: { '#text': 'q' },
      link: { '#text': 'https://example.com/search' },
    }

    expect(parseTextInput(value)).toEqual(expectedFull)
  })

  it('should handle complete textInput object (without #text)', () => {
    const value = {
      title: 'Search Title',
      description: 'Search Description',
      name: 'q',
      link: 'https://example.com/search',
    }

    expect(parseTextInput(value)).toEqual(expectedFull)
  })

  it('should handle complete textInput object (with array of values)', () => {
    const value = {
      title: ['Search Title', 'Alternative Search Title'],
      description: ['Search Description', 'Extended Search Description'],
      name: ['q', 'query'],
      link: ['https://example.com/search', 'https://example.com/advanced-search'],
    }

    expect(parseTextInput(value)).toEqual(expectedFull)
  })

  it('should handle partial objects (missing some fields)', () => {
    const value = {
      title: { '#text': 'Search Title' },
      name: { '#text': 'q' },
    }
    const expected = {
      title: 'Search Title',
      name: 'q',
    }

    expect(parseTextInput(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      title: { '#text': 123 },
      description: { '#text': 456 },
      name: { '#text': 789 },
      link: { '#text': 101 },
    }
    const expected = {
      title: '123',
      description: '456',
      name: '789',
      link: '101',
    }

    expect(parseTextInput(value)).toEqual(expected)
  })

  it('should handle partial objects (missing required fields)', () => {
    const value = {
      title: { '#text': 'Search Title' },
      description: { '#text': 'Search Description' },
    }
    const expected = {
      title: 'Search Title',
      description: 'Search Description',
    }

    expect(parseTextInput(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(parseTextInput('not an object')).toBeUndefined()
    expect(parseTextInput(undefined)).toBeUndefined()
    expect(parseTextInput(null)).toBeUndefined()
    expect(parseTextInput([])).toBeUndefined()
  })

  it('should return undefined for missing textInput property', () => {
    const value = {
      someOtherProperty: {},
    }

    expect(parseTextInput(value)).toBeUndefined()
  })

  it('should handle rdf namespace attributes', () => {
    const value = {
      '@rdf:about': 'http://example.com/search',
      title: { '#text': 'Search Title' },
      description: { '#text': 'Search Description' },
      name: { '#text': 'q' },
      link: { '#text': 'https://example.com/search' },
    }
    const expected = {
      title: 'Search Title',
      description: 'Search Description',
      name: 'q',
      link: 'https://example.com/search',
      rdf: { about: 'http://example.com/search' },
    }

    expect(parseTextInput(value)).toEqual(expected)
  })
})

describe('retrieveTextInput', () => {
  it('should retrieve complete textInput object (with #text)', () => {
    const value = {
      textinput: {
        title: { '#text': 'Search Title' },
        description: { '#text': 'Search Description' },
        name: { '#text': 'q' },
        link: { '#text': 'https://example.com/search' },
      },
    }
    const expected = {
      title: 'Search Title',
      description: 'Search Description',
      name: 'q',
      link: 'https://example.com/search',
    }

    expect(retrieveTextInput(value)).toEqual(expected)
  })

  it('should retrieve complete textInput object (without #text)', () => {
    const value = {
      textinput: {
        title: 'Search Title',
        description: 'Search Description',
        name: 'q',
        link: 'https://example.com/search',
      },
    }
    const expected = {
      title: 'Search Title',
      description: 'Search Description',
      name: 'q',
      link: 'https://example.com/search',
    }

    expect(retrieveTextInput(value)).toEqual(expected)
  })

  it('should retrieve textInput using ToC reference', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        textinput: { '@resource': 'http://example.com/search' },
      },
      textinput: {
        '@about': 'http://example.com/search',
        title: 'Search',
        name: 'q',
      },
    }
    const expected = {
      title: 'Search',
      name: 'q',
      rdf: { about: 'http://example.com/search' },
    }

    expect(retrieveTextInput(value)).toEqual(expected)
  })

  it('should retrieve correct textInput when multiple exist', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        textinput: { '@resource': 'http://example.com/search2' },
      },
      textinput: [
        {
          '@about': 'http://example.com/search1',
          title: 'Search 1',
          name: 'q1',
        },
        {
          '@about': 'http://example.com/search2',
          title: 'Search 2',
          name: 'q2',
        },
      ],
    }
    const expected = {
      title: 'Search 2',
      name: 'q2',
      rdf: { about: 'http://example.com/search2' },
    }

    expect(retrieveTextInput(value)).toEqual(expected)
  })

  it('should fall back to direct parsing when no ToC reference', () => {
    const value = {
      channel: {
        title: 'Test Feed',
      },
      textinput: {
        title: 'Fallback Search',
        name: 'query',
      },
    }
    const expected = {
      title: 'Fallback Search',
      name: 'query',
    }

    expect(retrieveTextInput(value)).toEqual(expected)
  })

  it('should fall back to direct parsing when referenced textInput not found', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        textinput: { '@resource': 'http://example.com/missing' },
      },
      textinput: {
        '@about': 'http://example.com/other',
        title: 'Other Search',
        name: 'q',
      },
    }
    const expected = {
      title: 'Other Search',
      name: 'q',
      rdf: { about: 'http://example.com/other' },
    }

    expect(retrieveTextInput(value)).toEqual(expected)
  })
})

describe('parseItem', () => {
  const expectedFull = {
    title: 'Item Title',
    link: 'https://example.com/item',
    description: 'Item Description',
  }

  it('should parse complete item object (with #text)', () => {
    const value = {
      title: { '#text': 'Item Title' },
      link: { '#text': 'https://example.com/item' },
      description: { '#text': 'Item Description' },
    }

    expect(parseItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object (without #text)', () => {
    const value = {
      title: 'Item Title',
      link: 'https://example.com/item',
      description: 'Item Description',
    }

    expect(parseItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object (with array of values)', () => {
    const value = {
      title: ['Item Title', 'Alternative Item Title'],
      link: ['https://example.com/item', 'https://example.com/item-alternate'],
      description: ['Item Description', 'Extended Item Description'],
    }

    expect(parseItem(value)).toEqual(expectedFull)
  })

  it('should parse item with only required fields', () => {
    const value = {
      title: { '#text': 'Item Title' },
      link: { '#text': 'https://example.com/item' },
    }
    const expected = {
      title: 'Item Title',
      link: 'https://example.com/item',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      title: { '#text': 123 },
      link: { '#text': 456 },
      description: { '#text': true },
    }
    const expected = {
      title: '123',
      link: '456',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle partial objects (missing title)', () => {
    const value = {
      link: { '#text': 'https://example.com/item' },
      description: { '#text': 'Item Description' },
    }
    const expected = {
      link: 'https://example.com/item',
      description: 'Item Description',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle partial objects (missing link)', () => {
    const value = {
      title: { '#text': 'Item Title' },
      description: { '#text': 'Item Description' },
    }
    const expected = {
      title: 'Item Title',
      description: 'Item Description',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(parseItem('not an object')).toBeUndefined()
    expect(parseItem(undefined)).toBeUndefined()
    expect(parseItem(null)).toBeUndefined()
    expect(parseItem([])).toBeUndefined()
  })

  it('should handle atom namespace', () => {
    const value = {
      title: { '#text': 'Item 1' },
      link: { '#text': 'https://example.com/item1' },
      'atom:link': { '@href': 'http://example.com', '@rel': 'self' },
    }
    const expected = {
      title: 'Item 1',
      link: 'https://example.com/item1',
      atom: { links: [{ href: 'http://example.com', rel: 'self' }] },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle content namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      link: { '#text': 'http://example.com' },
      'content:encoded': { '#text': '<![CDATA[<div>John Doe</div>]]>' },
    }
    const expected = {
      title: 'Example Entry',
      link: 'http://example.com',
      content: { encoded: '<div>John Doe</div>' },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle dc namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      link: { '#text': 'http://example.com' },
      'dc:creator': { '#text': 'John Doe' },
    }
    const expected = {
      title: 'Example Entry',
      link: 'http://example.com',
      dc: {
        creators: ['John Doe'],
      },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle slash namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      link: { '#text': 'http://example.com' },
      'slash:comments': { '#text': '10' },
    }
    const expected = {
      title: 'Example Entry',
      link: 'http://example.com',
      slash: { comments: 10 },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle dcterms namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      link: { '#text': 'http://example.com' },
      'dcterms:created': { '#text': '2023-02-01T00:00:00Z' },
      'dcterms:license': { '#text': 'MIT License' },
    }
    const expected = {
      title: 'Example Entry',
      link: 'http://example.com',
      dcterms: {
        licenses: ['MIT License'],
        created: ['2023-02-01T00:00:00Z'],
      },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle media namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      link: { '#text': 'http://example.com' },
      'media:content': { '@url': 'http://example.com/video.mp4', '@type': 'video/mp4' },
      'media:title': { '#text': 'Video Title' },
    }
    const expected = {
      title: 'Example Entry',
      link: 'http://example.com',
      media: {
        contents: [{ url: 'http://example.com/video.mp4', type: 'video/mp4' }],
        title: { value: 'Video Title' },
      },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle georss namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      link: { '#text': 'http://example.com' },
      'georss:point': { '#text': '45.256 -71.92' },
    }
    const expected = {
      title: 'Example Entry',
      link: 'http://example.com',
      georss: {
        point: { lat: 45.256, lng: -71.92 },
      },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle wfw namespace', () => {
    const value = {
      title: { '#text': 'Example Entry' },
      link: { '#text': 'http://example.com' },
      'wfw:comment': { '#text': 'https://example.com/comment' },
      'wfw:commentrss': { '#text': 'https://example.com/comments/feed' },
    }
    const expected = {
      title: 'Example Entry',
      link: 'http://example.com',
      wfw: {
        comment: 'https://example.com/comment',
        commentRss: 'https://example.com/comments/feed',
      },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle rdf namespace attributes', () => {
    const value = {
      '@rdf:about': 'http://example.com/item/1',
      title: { '#text': 'Example Entry' },
      link: { '#text': 'http://example.com' },
    }
    const expected = {
      title: 'Example Entry',
      link: 'http://example.com',
      rdf: { about: 'http://example.com/item/1' },
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle rdf:about attribute on item', () => {
    const value = {
      '@rdf:about': 'http://example.com/item/1',
      title: { '#text': 'Example Entry' },
      link: { '#text': 'http://example.com' },
    }
    const expected = {
      title: 'Example Entry',
      link: 'http://example.com',
      rdf: {
        about: 'http://example.com/item/1',
      },
    }

    expect(parseItem(value)).toEqual(expected)
  })
})

describe('retrieveItems', () => {
  it('should parse array of items', () => {
    const value = {
      item: [
        {
          title: { '#text': 'First Item' },
          link: { '#text': 'https://example.com/item1' },
          description: { '#text': 'First Description' },
        },
        {
          title: { '#text': 'Second Item' },
          link: { '#text': 'https://example.com/item2' },
          description: { '#text': 'Second Description' },
        },
      ],
    }
    const expected = [
      {
        title: 'First Item',
        link: 'https://example.com/item1',
        description: 'First Description',
      },
      {
        title: 'Second Item',
        link: 'https://example.com/item2',
        description: 'Second Description',
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should include partial items from array', () => {
    const value = {
      item: [
        {
          title: { '#text': 'Valid Item' },
          link: { '#text': 'https://example.com/valid' },
        },
        {
          title: { '#text': 'Missing Link' },
          description: { '#text': 'This item has no link' },
        },
        {
          link: { '#text': 'https://example.com/missing-title' },
          description: { '#text': 'This item has no title' },
        },
      ],
    }
    const expected = [
      {
        title: 'Valid Item',
        link: 'https://example.com/valid',
      },
      {
        title: 'Missing Link',
        description: 'This item has no link',
      },
      {
        link: 'https://example.com/missing-title',
        description: 'This item has no title',
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should handle coercible values in items', () => {
    const value = {
      item: [
        {
          title: { '#text': 123 },
          link: { '#text': 456 },
          description: { '#text': true },
        },
      ],
    }
    const expected = [
      {
        title: '123',
        link: '456',
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should handle empty array of items', () => {
    const value = {
      item: [],
    }

    expect(retrieveItems(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItems('not an object')).toBeUndefined()
    expect(retrieveItems(undefined)).toBeUndefined()
    expect(retrieveItems(null)).toBeUndefined()
    expect(retrieveItems([])).toBeUndefined()
  })

  it('should return array of one item when item is not an array', () => {
    const value = {
      item: {
        title: { '#text': 'Single Item' },
        link: { '#text': 'https://example.com/item' },
      },
    }
    const expected = [
      {
        title: 'Single Item',
        link: 'https://example.com/item',
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should return undefined when required property is missing', () => {
    const value = {
      someOtherProperty: {},
    }

    expect(retrieveItems(value)).toBeUndefined()
  })

  it('should retrieve items using ToC references', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        items: {
          seq: {
            li: [
              { '@resource': 'http://example.com/item1' },
              { '@resource': 'http://example.com/item2' },
            ],
          },
        },
      },
      item: [
        {
          '@about': 'http://example.com/item1',
          title: 'First Item',
          link: 'http://example.com/item1',
        },
        {
          '@about': 'http://example.com/item2',
          title: 'Second Item',
          link: 'http://example.com/item2',
        },
      ],
    }
    const expected = [
      {
        title: 'First Item',
        link: 'http://example.com/item1',
        rdf: { about: 'http://example.com/item1' },
      },
      {
        title: 'Second Item',
        link: 'http://example.com/item2',
        rdf: { about: 'http://example.com/item2' },
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should return items in ToC order not document order', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        items: {
          seq: {
            li: [
              { '@resource': 'http://example.com/item2' },
              { '@resource': 'http://example.com/item1' },
            ],
          },
        },
      },
      item: [
        {
          '@about': 'http://example.com/item1',
          title: 'First in Document',
        },
        {
          '@about': 'http://example.com/item2',
          title: 'Second in Document',
        },
      ],
    }
    const expected = [
      {
        title: 'Second in Document',
        rdf: { about: 'http://example.com/item2' },
      },
      {
        title: 'First in Document',
        rdf: { about: 'http://example.com/item1' },
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should handle single li element in ToC', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        items: {
          seq: {
            li: { '@resource': 'http://example.com/item1' },
          },
        },
      },
      item: {
        '@about': 'http://example.com/item1',
        title: 'Single Item',
      },
    }
    const expected = [
      {
        title: 'Single Item',
        rdf: { about: 'http://example.com/item1' },
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should skip items not found in document', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        items: {
          seq: {
            li: [
              { '@resource': 'http://example.com/item1' },
              { '@resource': 'http://example.com/missing' },
              { '@resource': 'http://example.com/item2' },
            ],
          },
        },
      },
      item: [
        {
          '@about': 'http://example.com/item1',
          title: 'First Item',
        },
        {
          '@about': 'http://example.com/item2',
          title: 'Second Item',
        },
      ],
    }
    const expected = [
      {
        title: 'First Item',
        rdf: { about: 'http://example.com/item1' },
      },
      {
        title: 'Second Item',
        rdf: { about: 'http://example.com/item2' },
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should fall back to direct parsing when no ToC', () => {
    const value = {
      channel: {
        title: 'Test Feed',
      },
      item: [
        {
          title: 'Direct Item 1',
        },
        {
          title: 'Direct Item 2',
        },
      ],
    }
    const expected = [
      {
        title: 'Direct Item 1',
      },
      {
        title: 'Direct Item 2',
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should skip invalid ToC references and return only valid items', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        items: {
          seq: {
            li: [
              { '@resource': 'http://example.com/item1' },
              { '@resource': 'http://example.com/missing' },
              { '@resource': 'http://example.com/item2' },
            ],
          },
        },
      },
      item: [
        {
          '@about': 'http://example.com/item1',
          title: 'First Item',
        },
        {
          '@about': 'http://example.com/item2',
          title: 'Second Item',
        },
      ],
    }
    const expected = [
      {
        title: 'First Item',
        rdf: { about: 'http://example.com/item1' },
      },
      {
        title: 'Second Item',
        rdf: { about: 'http://example.com/item2' },
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should fall back to direct parsing when all ToC references missing', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        items: {
          seq: {
            li: [
              { '@resource': 'http://example.com/missing1' },
              { '@resource': 'http://example.com/missing2' },
            ],
          },
        },
      },
      item: [
        {
          '@about': 'http://example.com/item1',
          title: 'Fallback Item',
        },
      ],
    }
    const expected = [
      {
        title: 'Fallback Item',
        rdf: { about: 'http://example.com/item1' },
      },
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should respect maxItems option with ToC', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        items: {
          seq: {
            li: [
              { '@resource': 'http://example.com/item1' },
              { '@resource': 'http://example.com/item2' },
              { '@resource': 'http://example.com/item3' },
            ],
          },
        },
      },
      item: [
        { '@about': 'http://example.com/item1', title: 'Item 1' },
        { '@about': 'http://example.com/item2', title: 'Item 2' },
        { '@about': 'http://example.com/item3', title: 'Item 3' },
      ],
    }
    const expected = [
      { title: 'Item 1', rdf: { about: 'http://example.com/item1' } },
      { title: 'Item 2', rdf: { about: 'http://example.com/item2' } },
    ]

    expect(retrieveItems(value, { maxItems: 2 })).toEqual(expected)
  })

  it('should limit ToC references before parsing (not after)', () => {
    const value = {
      channel: {
        title: 'Test Feed',
        items: {
          seq: {
            li: [
              { '@resource': 'http://example.com/missing' },
              { '@resource': 'http://example.com/item1' },
              { '@resource': 'http://example.com/item2' },
              { '@resource': 'http://example.com/item3' },
            ],
          },
        },
      },
      item: [
        { '@about': 'http://example.com/item1', title: 'Item 1' },
        { '@about': 'http://example.com/item2', title: 'Item 2' },
        { '@about': 'http://example.com/item3', title: 'Item 3' },
      ],
    }
    // maxItems=2 limits ToC refs first: [missing, item1]
    // After parsing: [item1] (missing is skipped)
    // NOT [item1, item2] (which would happen if we parsed all then sliced)
    const expected = [{ title: 'Item 1', rdf: { about: 'http://example.com/item1' } }]

    expect(retrieveItems(value, { maxItems: 2 })).toEqual(expected)
  })

  describe('ToC edge cases', () => {
    it('should fall back when items has no seq', () => {
      const value = {
        channel: { items: {} },
        item: [{ title: 'Direct Item' }],
      }

      expect(retrieveItems(value)).toEqual([{ title: 'Direct Item' }])
    })

    it('should fall back when seq has no li', () => {
      const value = {
        channel: { items: { seq: {} } },
        item: [{ title: 'Direct Item' }],
      }

      expect(retrieveItems(value)).toEqual([{ title: 'Direct Item' }])
    })

    it('should fall back when li is empty array', () => {
      const value = {
        channel: { items: { seq: { li: [] } } },
        item: [{ title: 'Direct Item' }],
      }

      expect(retrieveItems(value)).toEqual([{ title: 'Direct Item' }])
    })

    it('should fall back when items is string', () => {
      const value = {
        channel: { items: 'invalid' },
        item: [{ title: 'Direct Item' }],
      }

      expect(retrieveItems(value)).toEqual([{ title: 'Direct Item' }])
    })

    it('should fall back when items is number', () => {
      const value = {
        channel: { items: 123 },
        item: [{ title: 'Direct Item' }],
      }

      expect(retrieveItems(value)).toEqual([{ title: 'Direct Item' }])
    })

    it('should fall back when seq is string', () => {
      const value = {
        channel: { items: { seq: 'invalid' } },
        item: [{ title: 'Direct Item' }],
      }

      expect(retrieveItems(value)).toEqual([{ title: 'Direct Item' }])
    })

    it('should fall back when seq is number', () => {
      const value = {
        channel: { items: { seq: 456 } },
        item: [{ title: 'Direct Item' }],
      }

      expect(retrieveItems(value)).toEqual([{ title: 'Direct Item' }])
    })

    it('should fall back when li contains only invalid types', () => {
      const value = {
        channel: { items: { seq: { li: ['string', 123, null] } } },
        item: [{ title: 'Direct Item' }],
      }

      expect(retrieveItems(value)).toEqual([{ title: 'Direct Item' }])
    })

    it('should fall back when channel is string', () => {
      const value = {
        channel: 'invalid',
        item: [{ title: 'Direct Item' }],
      }

      expect(retrieveItems(value)).toEqual([{ title: 'Direct Item' }])
    })

    it('should fall back when channel is null', () => {
      const value = {
        channel: null,
        item: [{ title: 'Direct Item' }],
      }

      expect(retrieveItems(value)).toEqual([{ title: 'Direct Item' }])
    })
  })
})

describe('parseFeed', () => {
  const expectedFull = {
    title: 'Feed Title',
    link: 'https://example.com',
    description: 'Feed Description',
    image: {
      title: 'Image Title',
      link: 'https://example.com',
      url: 'https://example.com/image.jpg',
    },
    items: [
      {
        title: 'Item 1',
        link: 'https://example.com/item1',
      },
      {
        title: 'Item 2',
        link: 'https://example.com/item2',
      },
    ],
    textInput: {
      title: 'Search',
      description: 'Search this site',
      name: 'q',
      link: 'https://example.com/search',
    },
  }

  it('should parse complete feed object (with #text)', () => {
    const value = {
      channel: {
        title: { '#text': 'Feed Title' },
        link: { '#text': 'https://example.com' },
        description: { '#text': 'Feed Description' },
      },
      image: {
        title: { '#text': 'Image Title' },
        link: { '#text': 'https://example.com' },
        url: { '#text': 'https://example.com/image.jpg' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
        {
          title: { '#text': 'Item 2' },
          link: { '#text': 'https://example.com/item2' },
        },
      ],
      textinput: {
        title: { '#text': 'Search' },
        description: { '#text': 'Search this site' },
        name: { '#text': 'q' },
        link: { '#text': 'https://example.com/search' },
      },
    }

    expect(parseFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete feed object (without #text)', () => {
    const value = {
      channel: {
        title: 'Feed Title',
        link: 'https://example.com',
        description: 'Feed Description',
      },
      image: {
        title: 'Image Title',
        link: 'https://example.com',
        url: 'https://example.com/image.jpg',
      },
      item: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
        {
          title: 'Item 2',
          link: 'https://example.com/item2',
        },
      ],
      textinput: {
        title: 'Search',
        description: 'Search this site',
        name: 'q',
        link: 'https://example.com/search',
      },
    }

    expect(parseFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete feed object (with array of values)', () => {
    const value = {
      channel: [
        {
          title: ['Feed Title', 'Alternative Feed Title'],
          link: ['https://example.com', 'https://example.com/alternate'],
          description: ['Feed Description', 'Extended Feed Description'],
        },
        {
          title: ['Feed Title 2', 'Alternative Feed Title 2'],
          link: ['https://example.com/feed2', 'https://example.com/feed2-alternate'],
          description: ['Feed Description 2', 'Extended Feed Description 2'],
        },
      ],
      image: [
        {
          title: 'Image Title',
          link: 'https://example.com',
          url: 'https://example.com/image.jpg',
        },
        {
          title: 'Alternative Image Title',
          link: 'https://example.com/alternate',
          url: 'https://example.com/alternate-image.jpg',
        },
      ],
      item: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
        {
          title: 'Item 2',
          link: 'https://example.com/item2',
        },
      ],
      textinput: [
        {
          title: 'Search',
          description: 'Search this site',
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
    }

    expect(parseFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with minimal required fields', () => {
    const value = {
      channel: {
        title: { '#text': 'Feed Title' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
      ],
    }
    const expected = {
      title: 'Feed Title',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      channel: {
        title: { '#text': 123 },
        link: { '#text': true },
      },
      item: [
        {
          title: { '#text': 456 },
          link: { '#text': 789 },
        },
      ],
    }
    const expected = {
      title: '123',
      items: [
        {
          title: '456',
          link: '789',
        },
      ],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle partial objects (missing title)', () => {
    const value = {
      channel: {
        link: { '#text': 'https://example.com' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
      ],
    }
    const expected = {
      link: 'https://example.com',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should return undefined for non-object rdf:rdf', () => {
    const value = 'not an object'

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should return undefined for missing rdf:rdf', () => {
    const value = {
      someOtherProperty: {},
    }

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseFeed('not an object')).toBeUndefined()
    expect(parseFeed(undefined)).toBeUndefined()
    expect(parseFeed(null)).toBeUndefined()
    expect(parseFeed([])).toBeUndefined()
  })

  it('should handle feed with not defined items array', () => {
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

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle feed with empty items array', () => {
    const value = {
      channel: {
        title: { '#text': 'Feed Title' },
        link: { '#text': 'https://example.com' },
      },
      items: [],
    }
    const expected = {
      title: 'Feed Title',
      link: 'https://example.com',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle atom namespace', () => {
    const value = {
      channel: {
        title: { '#text': 'Feed Title' },
        'atom:link': { '@href': 'http://example.com', '@rel': 'self' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
      ],
    }
    const expected = {
      title: 'Feed Title',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
      atom: { links: [{ href: 'http://example.com', rel: 'self' }] },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle dc namespace', () => {
    const value = {
      channel: {
        title: { '#text': 'Feed Title' },
        'dc:creator': { '#text': 'John Doe' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
      ],
    }
    const expected = {
      title: 'Feed Title',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
      dc: {
        creators: ['John Doe'],
      },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle sy namespace', () => {
    const value = {
      channel: {
        title: { '#text': 'Example Feed' },
        'sy:updatefrequency': { '#text': '5' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
      ],
    }
    const expected = {
      title: 'Example Feed',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
      sy: { updateFrequency: 5 },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle dcterms namespace', () => {
    const value = {
      channel: {
        title: { '#text': 'Example Feed' },
        'dcterms:created': { '#text': '2023-01-01T00:00:00Z' },
        'dcterms:license': { '#text': 'Creative Commons Attribution 4.0' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
      ],
    }
    const expected = {
      title: 'Example Feed',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
      dcterms: {
        licenses: ['Creative Commons Attribution 4.0'],
        created: ['2023-01-01T00:00:00Z'],
      },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle media namespace', () => {
    const value = {
      channel: {
        title: { '#text': 'Example Feed' },
        'media:title': { '#text': 'Media Feed Title' },
        'media:description': { '#text': 'A feed with media content' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
      ],
    }
    const expected = {
      title: 'Example Feed',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
      media: {
        title: { value: 'Media Feed Title' },
        description: { value: 'A feed with media content' },
      },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle georss namespace', () => {
    const value = {
      channel: {
        title: { '#text': 'Example Feed' },
        'georss:point': { '#text': '40.689 -74.044' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
      ],
    }
    const expected = {
      title: 'Example Feed',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
      georss: {
        point: { lat: 40.689, lng: -74.044 },
      },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle admin namespace', () => {
    const value = {
      channel: {
        title: { '#text': 'Example Feed' },
        'admin:errorreportsto': {
          '@rdf:resource': 'mailto:webmaster@example.com',
        },
        'admin:generatoragent': {
          '@rdf:resource': 'http://www.movabletype.org/?v=3.2',
        },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
      ],
    }
    const expected = {
      title: 'Example Feed',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
      admin: {
        errorReportsTo: 'mailto:webmaster@example.com',
        generatorAgent: 'http://www.movabletype.org/?v=3.2',
      },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle rdf namespace attributes on channel', () => {
    const value = {
      channel: {
        '@rdf:about': 'http://example.com/feed',
        title: { '#text': 'Example Feed' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
      ],
    }
    const expected = {
      title: 'Example Feed',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
      rdf: { about: 'http://example.com/feed' },
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should limit items to specified maxItems', () => {
    const value = {
      channel: {
        title: { '#text': 'Test Feed' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
        {
          title: { '#text': 'Item 2' },
          link: { '#text': 'https://example.com/item2' },
        },
        {
          title: { '#text': 'Item 3' },
          link: { '#text': 'https://example.com/item3' },
        },
      ],
    }
    const expected = {
      title: 'Test Feed',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
        {
          title: 'Item 2',
          link: 'https://example.com/item2',
        },
      ],
    }

    expect(parseFeed(value, { maxItems: 2 })).toEqual(expected)
  })

  it('should skip all items when maxItems is 0', () => {
    const value = {
      channel: {
        title: { '#text': 'Test Feed' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
        {
          title: { '#text': 'Item 2' },
          link: { '#text': 'https://example.com/item2' },
        },
      ],
    }
    const expected = {
      title: 'Test Feed',
    }

    expect(parseFeed(value, { maxItems: 0 })).toEqual(expected)
  })

  it('should return all items when maxItems is undefined', () => {
    const value = {
      channel: {
        title: { '#text': 'Test Feed' },
      },
      item: [
        {
          title: { '#text': 'Item 1' },
          link: { '#text': 'https://example.com/item1' },
        },
        {
          title: { '#text': 'Item 2' },
          link: { '#text': 'https://example.com/item2' },
        },
      ],
    }
    const expected = {
      title: 'Test Feed',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
        {
          title: 'Item 2',
          link: 'https://example.com/item2',
        },
      ],
    }

    expect(parseFeed(value, { maxItems: undefined })).toEqual(expected)
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
    title: 'Feed Title',
    items: [
      {
        title: 'Item 1',
        link: 'https://example.com/item1',
      },
    ],
  }

  it('should retrieve feed with only required fields (with #text)', () => {
    const value = {
      rdf: {
        channel: {
          title: { '#text': 'Feed Title' },
        },
        item: [
          {
            title: { '#text': 'Item 1' },
            link: { '#text': 'https://example.com/item1' },
          },
        ],
      },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should retrieve feed with only required fields (without #text)', () => {
    const value = {
      rdf: {
        channel: {
          title: 'Feed Title',
        },
        item: [
          {
            title: 'Item 1',
            link: 'https://example.com/item1',
          },
        ],
      },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should retrieve feed with only required fields (with array of values)', () => {
    const value = {
      rdf: [
        {
          channel: {
            title: 'Feed Title',
          },
          item: [
            {
              title: 'Item 1',
              link: 'https://example.com/item1',
            },
          ],
        },
        {
          channel: {
            title: 'Feed Title 2',
          },
          item: [
            {
              title: 'Item 2',
              link: 'https://example.com/item1',
            },
          ],
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })
})
