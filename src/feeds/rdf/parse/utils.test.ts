import { describe, expect, it } from 'bun:test'
import {
  parseFeed,
  parseImage,
  parseItem,
  parseTextinput,
  retrieveFeed,
  retrieveImage,
  retrieveItems,
  retrieveTextinput,
} from './utils'

describe('parseImage', () => {
  it('should handle complete image object', () => {
    const value = {
      title: { '#text': 'Image Title' },
      link: { '#text': 'https://example.com' },
      url: { '#text': 'https://example.com/image.jpg' },
    }
    const expected = {
      title: 'Image Title',
      link: 'https://example.com',
      url: 'https://example.com/image.jpg',
    }

    expect(parseImage(value)).toEqual(expected)
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

  it('should return undefined if title is missing', () => {
    const value = {
      link: { '#text': 'https://example.com' },
      url: { '#text': 'https://example.com/image.jpg' },
    }

    expect(parseImage(value)).toBeUndefined()
  })

  it('should return undefined if link is missing', () => {
    const value = {
      title: { '#text': 'Image Title' },
      url: { '#text': 'https://example.com/image.jpg' },
    }

    expect(parseImage(value)).toBeUndefined()
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
})

describe('parseItem', () => {
  it('should parse complete item object', () => {
    const value = {
      title: { '#text': 'Item Title' },
      link: { '#text': 'https://example.com/item' },
      description: { '#text': 'Item Description' },
    }
    const expected = {
      title: 'Item Title',
      link: 'https://example.com/item',
      description: 'Item Description',
    }

    expect(parseItem(value)).toEqual(expected)
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

  it('should return undefined if title is missing', () => {
    const value = {
      link: { '#text': 'https://example.com/item' },
      description: { '#text': 'Item Description' },
    }

    expect(parseItem(value)).toBeUndefined()
  })

  it('should return undefined if link is missing', () => {
    const value = {
      title: { '#text': 'Item Title' },
      description: { '#text': 'Item Description' },
    }

    expect(parseItem(value)).toBeUndefined()
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
      dc: { creator: 'John Doe' },
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

  it('should filter out invalid items from array', () => {
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
    ]

    expect(retrieveItems(value)).toEqual(expected)
  })

  it('should handle empty array of items', () => {
    const value = {
      item: [],
    }

    expect(retrieveItems(value)).toEqual([])
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

  it('should return undefined when item property is missing', () => {
    const value = {
      someOtherProperty: {},
    }

    expect(retrieveItems(value)).toBeUndefined()
  })
})

describe('parseTextinput', () => {
  it('should handle complete textinput object', () => {
    const value = {
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
    }

    expect(parseTextinput(value)).toEqual(expected)
  })

  it('should handle partial textinput object', () => {
    const value = {
      title: { '#text': 'Search Title' },
      name: { '#text': 'q' },
    }

    expect(parseTextinput(value)).toBeUndefined()
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

    expect(parseTextinput(value)).toEqual(expected)
  })

  it('should return undefined if not all fields are present', () => {
    const value = {
      title: { '#text': 'Search Title' },
      description: { '#text': 'Search Description' },
    }

    expect(parseTextinput(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseTextinput('not an object')).toBeUndefined()
    expect(parseTextinput(undefined)).toBeUndefined()
    expect(parseTextinput(null)).toBeUndefined()
    expect(parseTextinput([])).toBeUndefined()
  })

  it('should return undefined for missing textinput property', () => {
    const value = {
      someOtherProperty: {},
    }

    expect(parseTextinput(value)).toBeUndefined()
  })
})

describe('retrieveTextinput', () => {
  it('should retrieve complete textinput object', () => {
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

    expect(retrieveTextinput(value)).toEqual(expected)
  })
})

describe('parseFeed', () => {
  it('should parse complete feed object', () => {
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
    const expected = {
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
      textinput: {
        title: 'Search',
        description: 'Search this site',
        name: 'q',
        link: 'https://example.com/search',
      },
    }

    expect(parseFeed(value)).toEqual(expected)
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

  it('should return undefined if title is missing', () => {
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

    expect(parseFeed(value)).toBeUndefined()
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
      dc: { creator: 'John Doe' },
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
})

describe('retrieveFeed', () => {
  it('should retrieve feed with only required fields', () => {
    const value = {
      'rdf:rdf': {
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
    const expected = {
      title: 'Feed Title',
      items: [
        {
          title: 'Item 1',
          link: 'https://example.com/item1',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })
})
