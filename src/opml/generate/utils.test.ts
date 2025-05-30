import { describe, expect, it } from 'bun:test'
import {
  generateBody,
  generateHead,
  generateOpml,
  generateOutline,
  generateRfc822Date,
} from './utils.js'

describe('generateRfc822Date', () => {
  it('should format Date object to RFC822 string', () => {
    const value = new Date('2023-03-15T12:00:00Z')
    const expected = 'Wed, 15 Mar 2023 12:00:00 GMT'

    expect(generateRfc822Date(value)).toEqual(expected)
  })

  it('should format valid date string to RFC822 string', () => {
    const value = '2023-03-15T12:00:00Z'
    const expected = 'Wed, 15 Mar 2023 12:00:00 GMT'

    expect(generateRfc822Date(value)).toEqual(expected)
  })

  it('should return undefined for invalid date string', () => {
    expect(generateRfc822Date('not a date')).toBeUndefined()
  })
})

describe('generateOutline', () => {
  it('should generate valid outline object with all properties', () => {
    const value = {
      text: 'Test Outline',
      type: 'rss',
      isComment: true,
      isBreakpoint: false,
      created: '2023-03-15',
      category: 'Test Category',
      description: 'Test Description',
      xmlUrl: 'https://example.com/feed.xml',
      htmlUrl: 'https://example.com',
      language: 'en',
      title: 'Outline Title',
      version: '2.0',
      url: 'https://example.com/alternate',
      outlines: [{ text: 'Child Outline' }],
    }
    const expected = {
      '@text': 'Test Outline',
      '@type': 'rss',
      '@isComment': true,
      '@isBreakpoint': false,
      '@created': '2023-03-15',
      '@category': 'Test Category',
      '@description': 'Test Description',
      '@xmlUrl': 'https://example.com/feed.xml',
      '@htmlUrl': 'https://example.com',
      '@language': 'en',
      '@title': 'Outline Title',
      '@version': '2.0',
      '@url': 'https://example.com/alternate',
      outline: [{ '@text': 'Child Outline' }],
    }

    expect(generateOutline(value)).toEqual(expected)
  })

  it('should generate outline with minimal properties', () => {
    const value = {
      text: 'Minimal Outline',
    }
    const expected = {
      '@text': 'Minimal Outline',
    }

    expect(generateOutline(value)).toEqual(expected)
  })

  it('should handle nested outlines', () => {
    const value = {
      text: 'Parent',
      outlines: [
        {
          text: 'Child',
          outlines: [{ text: 'Grandchild' }],
        },
      ],
    }
    const expected = {
      '@text': 'Parent',
      outline: [
        {
          '@text': 'Child',
          outline: [{ '@text': 'Grandchild' }],
        },
      ],
    }

    expect(generateOutline(value)).toEqual(expected)
  })

  it('should handle empty outlines array', () => {
    const value = {
      text: 'Parent',
      outlines: [],
    }
    const expected = {
      '@text': 'Parent',
    }

    expect(generateOutline(value)).toEqual(expected)
  })
})

describe('generateHead', () => {
  it('should generate head object with all properties', () => {
    const date = new Date('2023-03-15T12:00:00Z')
    const input = {
      title: 'Test OPML',
      dateCreated: date,
      dateModified: date,
      ownerName: 'John Doe',
      ownerEmail: 'john@example.com',
      ownerId: 'http://example.com/john',
      docs: 'http://example.com/docs',
      expansionState: [1, 2, 3, 4],
      vertScrollState: 10,
      windowTop: 100,
      windowLeft: 50,
      windowBottom: 500,
      windowRight: 700,
    }
    const expected = {
      title: 'Test OPML',
      dateCreated: 'Wed, 15 Mar 2023 12:00:00 GMT',
      dateModified: 'Wed, 15 Mar 2023 12:00:00 GMT',
      ownerName: 'John Doe',
      ownerEmail: 'john@example.com',
      ownerId: 'http://example.com/john',
      docs: 'http://example.com/docs',
      expansionState: '1,2,3,4',
      vertScrollState: 10,
      windowTop: 100,
      windowLeft: 50,
      windowBottom: 500,
      windowRight: 700,
    }

    expect(generateHead(input)).toEqual(expected)
  })

  it('should generate head with minimal properties', () => {
    const input = {
      title: 'Minimal Head',
    }
    const expected = {
      title: 'Minimal Head',
    }

    expect(generateHead(input)).toEqual(expected)
  })

  it('should handle empty expansionState array', () => {
    const input = {
      title: 'Test OPML',
      expansionState: [],
    }
    const expected = {
      title: 'Test OPML',
    }

    expect(generateHead(input)).toEqual(expected)
  })
})

describe('generateBody', () => {
  it('should generate body object with outlines', () => {
    const input = {
      outlines: [
        {
          text: 'Category 1',
          outlines: [
            { text: 'Subcategory 1', type: 'rss', xmlUrl: 'https://example.com/feed1.xml' },
            { text: 'Subcategory 2', type: 'rss', xmlUrl: 'https://example.com/feed2.xml' },
          ],
        },
        {
          text: 'Category 2',
          type: 'link',
          url: 'https://example.com',
        },
      ],
    }
    const expected = {
      outline: [
        {
          '@text': 'Category 1',
          outline: [
            {
              '@text': 'Subcategory 1',
              '@type': 'rss',
              '@xmlUrl': 'https://example.com/feed1.xml',
            },
            {
              '@text': 'Subcategory 2',
              '@type': 'rss',
              '@xmlUrl': 'https://example.com/feed2.xml',
            },
          ],
        },
        {
          '@text': 'Category 2',
          '@type': 'link',
          '@url': 'https://example.com',
        },
      ],
    }

    expect(generateBody(input)).toEqual(expected)
  })

  it('should handle empty outlines array', () => {
    const input = {
      outlines: [],
    }

    expect(generateBody(input)).toBeUndefined()
  })
})

describe('generateOpml', () => {
  it('should generate complete OPML object', () => {
    const date = new Date('2023-03-15T12:00:00Z')
    const input = {
      head: {
        title: 'Test OPML',
        dateCreated: date,
        dateModified: date,
      },
      body: {
        outlines: [
          {
            text: 'Category 1',
            outlines: [
              { text: 'Subcategory 1', type: 'rss', xmlUrl: 'https://example.com/feed1.xml' },
            ],
          },
          { text: 'Category 2', type: 'link', url: 'https://example.com' },
        ],
      },
    }
    const expected = {
      opml: {
        '@version': '2.0',
        head: {
          title: 'Test OPML',
          dateCreated: 'Wed, 15 Mar 2023 12:00:00 GMT',
          dateModified: 'Wed, 15 Mar 2023 12:00:00 GMT',
        },
        body: {
          outline: [
            {
              '@text': 'Category 1',
              outline: [
                {
                  '@text': 'Subcategory 1',
                  '@type': 'rss',
                  '@xmlUrl': 'https://example.com/feed1.xml',
                },
              ],
            },
            {
              '@text': 'Category 2',
              '@type': 'link',
              '@url': 'https://example.com',
            },
          ],
        },
      },
    }

    expect(generateOpml(input)).toEqual(expected)
  })

  it('should generate OPML with minimal required fields', () => {
    const input = {
      body: {
        outlines: [{ text: 'Simple Outline' }],
      },
    }
    const expected = {
      opml: {
        '@version': '2.0',
        body: {
          outline: [{ '@text': 'Simple Outline' }],
        },
      },
    }

    expect(generateOpml(input)).toEqual(expected)
  })

  it('should handle OPML with empty body outlines', () => {
    const input = {
      body: {
        outlines: [],
      },
    }

    expect(generateOpml(input)).toBeUndefined()
  })
})
