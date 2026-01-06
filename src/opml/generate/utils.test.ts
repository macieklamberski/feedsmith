import { describe, expect, it } from 'bun:test'
import { generateBody, generateDocument, generateHead, generateOutline } from './utils.js'

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

    expect(generateOutline(value)).toBeUndefined()
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      text: undefined,
      xmlUrl: undefined,
    }

    expect(generateOutline(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateOutline({})).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateOutline(undefined)).toBeUndefined()
  })

  describe('custom attributes', () => {
    it('should generate outline with custom attributes when specified in options', () => {
      const outline = {
        text: 'Feed with custom attrs',
        type: 'rss',
        xmlUrl: 'https://example.com/feed.xml',
        customField1: 'value1',
        customField2: 'value2',
        rating: '5',
      }
      const options = {
        extraOutlineAttributes: ['customField1', 'customField2', 'rating'],
      }
      const result = generateOutline(outline, options)

      expect(result).toEqual({
        '@text': 'Feed with custom attrs',
        '@type': 'rss',
        '@xmlUrl': 'https://example.com/feed.xml',
        '@customField1': 'value1',
        '@customField2': 'value2',
        '@rating': '5',
      })
    })

    it('should not include custom attributes when not in options', () => {
      const outline = {
        text: 'Feed with custom attrs',
        type: 'rss',
        xmlUrl: 'https://example.com/feed.xml',
        customField1: 'value1',
        customField2: 'value2',
        rating: '5',
      }
      const result = generateOutline(outline)

      expect(result).toEqual({
        '@text': 'Feed with custom attrs',
        '@type': 'rss',
        '@xmlUrl': 'https://example.com/feed.xml',
      })
    })

    it('should handle nested outlines with custom attributes', () => {
      const outline = {
        text: 'Parent',
        customParent: 'parentValue',
        outlines: [
          {
            text: 'Child 1',
            customChild: 'childValue1',
          },
          {
            text: 'Child 2',
            customChild: 'childValue2',
          },
        ],
      }
      const options = {
        extraOutlineAttributes: ['customParent', 'customChild'],
      }
      const result = generateOutline(outline, options)

      expect(result).toEqual({
        '@text': 'Parent',
        '@customParent': 'parentValue',
        outline: [
          {
            '@text': 'Child 1',
            '@customChild': 'childValue1',
          },
          {
            '@text': 'Child 2',
            '@customChild': 'childValue2',
          },
        ],
      })
    })

    it('should only include specified custom attributes', () => {
      const outline = {
        text: 'Selective',
        type: 'rss',
        customField1: 'included',
        customField2: 'not included',
        customField3: 'included',
      }
      const options = {
        extraOutlineAttributes: ['customField1', 'customField3'],
      }
      const result = generateOutline(outline, options)

      expect(result).toEqual({
        '@text': 'Selective',
        '@type': 'rss',
        '@customField1': 'included',
        '@customField3': 'included',
      })
    })

    it('should handle custom attributes as strings', () => {
      const outline = {
        text: 'Test',
        stringAttr: 'text value',
        numberAttr: '123',
        boolAttr: 'true',
      }
      const options = {
        extraOutlineAttributes: ['stringAttr', 'numberAttr', 'boolAttr'],
      }
      const result = generateOutline(outline, options)

      expect(result).toEqual({
        '@text': 'Test',
        '@stringAttr': 'text value',
        '@numberAttr': '123',
        '@boolAttr': 'true',
      })
    })
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

describe('generateDocument', () => {
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

    expect(generateDocument(value)).toEqual(expected)
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

    expect(generateDocument(value)).toEqual(expected)
  })

  it('should handle OPML with empty body outlines', () => {
    const value = {
      body: {
        outlines: [],
      },
    }

    expect(generateDocument(value)).toBeUndefined()
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      outlines: undefined,
      body: undefined,
    }

    expect(generateDocument(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateDocument({})).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateDocument(undefined)).toBeUndefined()
  })
})
