import { describe, expect, it } from 'bun:test'
import { generateBody, generateHead, generateOpml, generateOutline } from './utils.js'

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
      '@created': 'Wed, 15 Mar 2023 00:00:00 GMT',
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

  it('should handle empty object in outlines array', () => {
    const value = {
      outlines: [{}],
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateOutline(value)).toBeUndefined()
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      text: undefined,
      xmlUrl: undefined,
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateOutline(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateOutline({})).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateOutline(undefined)).toBeUndefined()
  })
})

describe('generateHead', () => {
  it('should generate head object with all properties', () => {
    const date = new Date('2023-03-15T12:00:00Z')
    const value = {
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

    expect(generateHead(value)).toEqual(expected)
  })

  it('should generate head with minimal properties', () => {
    const value = {
      title: 'Minimal Head',
    }
    const expected = {
      title: 'Minimal Head',
    }

    expect(generateHead(value)).toEqual(expected)
  })

  it('should handle expansionState with array of one zero', () => {
    const value = {
      title: 'Test OPML',
      expansionState: [0],
    }
    const expected = {
      title: 'Test OPML',
      expansionState: '0',
    }

    expect(generateHead(value)).toEqual(expected)
  })

  it('should handle empty expansionState array', () => {
    const value = {
      expansionState: [],
    }

    expect(generateHead(value)).toBeUndefined()
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      title: undefined,
      ownerName: undefined,
    }

    expect(generateHead(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateHead({})).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateHead(undefined)).toBeUndefined()
  })
})

describe('generateBody', () => {
  it('should generate body object with outlines', () => {
    const value = {
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

    expect(generateBody(value)).toEqual(expected)
  })

  it('should handle empty outlines array', () => {
    const value = {
      outlines: [],
    }

    expect(generateBody(value)).toBeUndefined()
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      outlines: undefined,
    }

    expect(generateBody(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateBody({})).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateBody(undefined)).toBeUndefined()
  })
})

describe('generateOpml', () => {
  it('should generate complete OPML object', () => {
    const date = new Date('2023-03-15T12:00:00Z')
    const value = {
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

    expect(generateOpml(value)).toEqual(expected)
  })

  it('should generate OPML with minimal required fields', () => {
    const value = {
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

    expect(generateOpml(value)).toEqual(expected)
  })

  it('should handle OPML with empty body outlines', () => {
    const value = {
      body: {
        outlines: [],
      },
    }

    expect(generateOpml(value)).toBeUndefined()
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      outlines: undefined,
      body: undefined,
    }

    expect(generateOpml(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateOpml({})).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateOpml(undefined)).toBeUndefined()
  })
})
