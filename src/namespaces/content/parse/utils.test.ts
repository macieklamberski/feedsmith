import { describe, expect, it } from 'bun:test'
import type { ContentNs } from '../common/types.js'
import { parseContentItem, parseItems, retrieveFeed, retrieveItem } from './utils.js'

describe('parseContentItem', () => {
  it('should parse content item with all properties', () => {
    const value = {
      '@rdf:about': 'http://example.com/item/content.html',
      'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
      'content:encoding': { '@rdf:resource': 'http://www.w3.org/TR/REC-xml#dt-wellformed' },
      'rdf:value': '<em>This is very cool.</em>',
    }
    const expected: ContentNs.ContentItem = {
      about: 'http://example.com/item/content.html',
      format: 'http://www.w3.org/TR/html4/',
      encoding: 'http://www.w3.org/TR/REC-xml#dt-wellformed',
      value: '<em>This is very cool.</em>',
    }

    expect(parseContentItem(value)).toEqual(expected)
  })

  it('should parse content item with unprefixed rdf names when rdfPrefix is empty', () => {
    const value = {
      '@about': 'http://example.com/item/content.html',
      'content:format': { '@resource': 'http://www.w3.org/TR/html4/' },
      'content:encoding': { '@resource': 'http://www.w3.org/TR/REC-xml#dt-wellformed' },
      value: '<em>This is very cool.</em>',
    }
    const expected: ContentNs.ContentItem = {
      about: 'http://example.com/item/content.html',
      format: 'http://www.w3.org/TR/html4/',
      encoding: 'http://www.w3.org/TR/REC-xml#dt-wellformed',
      value: '<em>This is very cool.</em>',
    }

    expect(parseContentItem(value, { rdfPrefix: '' })).toEqual(expected)
  })

  it('should not parse unprefixed about by default', () => {
    const value = {
      '@about': 'http://example.com/item/content.html',
    }

    expect(parseContentItem(value)).toBeUndefined()
  })

  it('should not parse unprefixed value by default', () => {
    const value = {
      value: '<em>This is very cool.</em>',
    }

    expect(parseContentItem(value)).toBeUndefined()
  })

  it('should parse content item with only format', () => {
    const value = {
      'content:format': { '@rdf:resource': 'http://www.w3.org/2000/svg' },
    }
    const expected: ContentNs.ContentItem = {
      format: 'http://www.w3.org/2000/svg',
    }

    expect(parseContentItem(value)).toEqual(expected)
  })

  it('should parse value with attributes', () => {
    const value = {
      'rdf:value': {
        '#text': '<em>This is very cool.</em>',
        '@rdf:parsetype': 'Literal',
      },
    }
    const expected: ContentNs.ContentItem = {
      value: '<em>This is very cool.</em>',
    }

    expect(parseContentItem(value)).toEqual(expected)
  })

  it('should decode HTML entities in value', () => {
    const value = {
      'rdf:value': 'This is &lt;em&gt;very&lt;/em&gt; cool.',
    }
    const expected: ContentNs.ContentItem = {
      value: 'This is <em>very</em> cool.',
    }

    expect(parseContentItem(value)).toEqual(expected)
  })

  it('should parse value wrapped in CDATA', () => {
    const value = {
      'rdf:value': '<![CDATA[This is <em>very</em> cool.]]>',
    }
    const expected: ContentNs.ContentItem = {
      value: 'This is <em>very</em> cool.',
    }

    expect(parseContentItem(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      '@rdf:about': '',
      'content:format': { '@rdf:resource': '' },
      'rdf:value': '',
    }

    expect(parseContentItem(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      '@rdf:about': '   ',
      'content:format': { '@rdf:resource': '   ' },
      'rdf:value': '   ',
    }

    expect(parseContentItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseContentItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseContentItem('not an object')).toBeUndefined()
    expect(parseContentItem(undefined)).toBeUndefined()
    expect(parseContentItem(null)).toBeUndefined()
    expect(parseContentItem([])).toBeUndefined()
  })
})

describe('parseItems', () => {
  it('should parse every content item in the bag', () => {
    const value = {
      'rdf:bag': {
        'rdf:li': [
          {
            'content:item': {
              'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
              'rdf:value': '<em>This is very cool.</em>',
            },
          },
          {
            'content:item': {
              '@rdf:about': 'http://example.com/item/content.svg',
              'content:format': { '@rdf:resource': 'http://www.w3.org/2000/svg' },
            },
          },
        ],
      },
    }
    const expected: Array<ContentNs.ContentItem> = [
      {
        format: 'http://www.w3.org/TR/html4/',
        value: '<em>This is very cool.</em>',
      },
      {
        about: 'http://example.com/item/content.svg',
        format: 'http://www.w3.org/2000/svg',
      },
    ]

    expect(parseItems(value)).toEqual(expected)
  })

  it('should parse bag with a single content item', () => {
    const value = {
      'rdf:bag': {
        'rdf:li': {
          'content:item': {
            'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
          },
        },
      },
    }
    const expected: Array<ContentNs.ContentItem> = [
      {
        format: 'http://www.w3.org/TR/html4/',
      },
    ]

    expect(parseItems(value)).toEqual(expected)
  })

  it('should parse bag with unprefixed rdf names when rdfPrefix is empty', () => {
    const value = {
      bag: {
        li: {
          'content:item': {
            '@about': 'http://example.com/item/content.html',
          },
        },
      },
    }
    const expected: Array<ContentNs.ContentItem> = [
      {
        about: 'http://example.com/item/content.html',
      },
    ]

    expect(parseItems(value, { rdfPrefix: '' })).toEqual(expected)
  })

  it('should not parse unprefixed bag by default', () => {
    const value = {
      bag: {
        'rdf:li': {
          'content:item': {
            'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
          },
        },
      },
    }

    expect(parseItems(value)).toBeUndefined()
  })

  it('should not parse unprefixed li by default', () => {
    const value = {
      'rdf:bag': {
        li: {
          'content:item': {
            'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
          },
        },
      },
    }

    expect(parseItems(value)).toBeUndefined()
  })

  it('should skip list entries without content item', () => {
    const value = {
      'rdf:bag': {
        'rdf:li': [
          'http://example.com/item/content.html',
          {
            'content:item': {
              'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
            },
          },
        ],
      },
    }
    const expected: Array<ContentNs.ContentItem> = [
      {
        format: 'http://www.w3.org/TR/html4/',
      },
    ]

    expect(parseItems(value)).toEqual(expected)
  })

  it('should return undefined for empty bag', () => {
    const value = {
      'rdf:bag': {},
    }

    expect(parseItems(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseItems(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseItems('not an object')).toBeUndefined()
    expect(parseItems(undefined)).toBeUndefined()
    expect(parseItems(null)).toBeUndefined()
    expect(parseItems([])).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse feed with items', () => {
    const value = {
      'content:items': {
        'rdf:bag': {
          'rdf:li': {
            'content:item': {
              'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
              'rdf:value': '<em>This is very cool.</em>',
            },
          },
        },
      },
    }
    const expected: ContentNs.Feed = {
      items: [
        {
          format: 'http://www.w3.org/TR/html4/',
          value: '<em>This is very cool.</em>',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed('not an object')).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse item with encoded content and items', () => {
    const value = {
      'content:encoded': '<p>This is encoded content</p>',
      'content:items': {
        'rdf:bag': {
          'rdf:li': {
            'content:item': {
              'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
              'rdf:value': '<em>This is very cool.</em>',
            },
          },
        },
      },
    }
    const expected: ContentNs.Item = {
      encoded: '<p>This is encoded content</p>',
      items: [
        {
          format: 'http://www.w3.org/TR/html4/',
          value: '<em>This is very cool.</em>',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  const expectedFull = {
    encoded: '<p>This is encoded content</p>',
  }

  it('should parse complete item object with encoded content (with #text)', () => {
    const value = {
      'content:encoded': { '#text': '<p>This is encoded content</p>' },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object with encoded content (without #text)', () => {
    const value = {
      'content:encoded': '<p>This is encoded content</p>',
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object with encoded content (with array of values)', () => {
    const value = {
      'content:encoded': ['<p>This is encoded content</p>', '<p>Another encoded content</p>'],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should handle HTML content in encoded field', () => {
    const value = {
      'content:encoded': {
        '#text': '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>',
      },
    }
    const expected = {
      encoded: '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA content in encoded field', () => {
    const value = {
      'content:encoded': {
        '#text': '<![CDATA[<h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>]]>',
      },
    }
    const expected = {
      encoded: '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'content:encoded': { '#text': 123 },
    }
    const expected = {
      encoded: '123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })

  it('should handle object with content:encoded but missing #text property', () => {
    const value = {
      'content:encoded': {},
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should handle object with unrelated properties', () => {
    const value = {
      'other:property': { '#text': 'value' },
      'something:else': { '#text': 'another value' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should handle boolean values', () => {
    const value = {
      'content:encoded': { '#text': true },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should handle empty string in encoded field', () => {
    const value = {
      'content:encoded': { '#text': '' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should handle null in encoded field', () => {
    const value = {
      'content:encoded': { '#text': null },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })
})
