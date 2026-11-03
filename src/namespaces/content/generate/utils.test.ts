import { describe, expect, it } from 'bun:test'
import { generateContentItem, generateFeed, generateItem, generateItems } from './utils.js'

describe('generateContentItem', () => {
  it('should generate content item with all properties', () => {
    const value = {
      about: 'http://example.com/item/content.html',
      format: 'http://www.w3.org/TR/html4/',
      encoding: 'http://www.w3.org/TR/REC-xml#dt-wellformed',
      value: 'This is very cool.',
    }
    const expected = {
      '@rdf:about': 'http://example.com/item/content.html',
      'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
      'content:encoding': { '@rdf:resource': 'http://www.w3.org/TR/REC-xml#dt-wellformed' },
      'rdf:value': 'This is very cool.',
    }

    expect(generateContentItem(value)).toEqual(expected)
  })

  it('should generate content item with only format', () => {
    const value = {
      format: 'http://www.w3.org/2000/svg',
    }
    const expected = {
      'content:format': { '@rdf:resource': 'http://www.w3.org/2000/svg' },
    }

    expect(generateContentItem(value)).toEqual(expected)
  })

  it('should generate value with CDATA for HTML content', () => {
    const value = {
      value: 'This is <em>very</em> cool.',
    }
    const expected = {
      'rdf:value': { '#cdata': 'This is <em>very</em> cool.' },
    }

    expect(generateContentItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      about: '',
      format: '',
      encoding: '',
      value: '',
    }

    expect(generateContentItem(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      about: '   ',
      format: '   ',
      encoding: '   ',
      value: '   ',
    }

    expect(generateContentItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateContentItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateContentItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateContentItem(123)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateContentItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateContentItem([])).toBeUndefined()
  })
})

describe('generateItems', () => {
  it('should generate bag with every content item', () => {
    const value = [
      {
        format: 'http://www.w3.org/TR/html4/',
        value: 'This is very cool.',
      },
      {
        about: 'http://example.com/item/content.svg',
        format: 'http://www.w3.org/2000/svg',
      },
    ]
    const expected = {
      'rdf:Bag': {
        'rdf:li': [
          {
            'content:item': {
              'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
              'rdf:value': 'This is very cool.',
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

    expect(generateItems(value)).toEqual(expected)
  })

  it('should skip empty content items', () => {
    const value = [{}, { format: 'http://www.w3.org/TR/html4/' }]
    const expected = {
      'rdf:Bag': {
        'rdf:li': [
          {
            'content:item': {
              'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
            },
          },
        ],
      },
    }

    expect(generateItems(value)).toEqual(expected)
  })

  it('should handle array of empty content items', () => {
    const value = [{}, {}]

    expect(generateItems(value)).toBeUndefined()
  })

  it('should handle empty array', () => {
    const value: Array<never> = []

    expect(generateItems(value)).toBeUndefined()
  })

  it('should handle non-array inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItems('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItems({})).toBeUndefined()
    expect(generateItems(undefined)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with items', () => {
    const value = {
      items: [
        {
          format: 'http://www.w3.org/TR/html4/',
          value: 'This is very cool.',
        },
      ],
    }
    const expected = {
      'content:items': {
        'rdf:Bag': {
          'rdf:li': [
            {
              'content:item': {
                'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
                'rdf:value': 'This is very cool.',
              },
            },
          ],
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed([])).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with encoded content and items', () => {
    const value = {
      encoded: 'Simple text content without HTML',
      items: [
        {
          format: 'http://www.w3.org/TR/html4/',
        },
      ],
    }
    const expected = {
      'content:encoded': 'Simple text content without HTML',
      'content:items': {
        'rdf:Bag': {
          'rdf:li': [
            {
              'content:item': {
                'content:format': { '@rdf:resource': 'http://www.w3.org/TR/html4/' },
              },
            },
          ],
        },
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate content with CDATA for HTML content', () => {
    const value = {
      encoded: '<p>Full HTML content here</p>',
    }
    const expected = {
      'content:encoded': { '#cdata': '<p>Full HTML content here</p>' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate content without CDATA for simple text', () => {
    const value = {
      encoded: 'Simple text content without HTML',
    }
    const expected = {
      'content:encoded': 'Simple text content without HTML',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate content with CDATA for text containing ampersands', () => {
    const value = {
      encoded: 'Text with & ampersand characters',
    }
    const expected = {
      'content:encoded': { '#cdata': 'Text with & ampersand characters' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      encoded: '',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      encoded: '   ',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle undefined input', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(123)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})
