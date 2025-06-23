import { describe, expect, it } from 'bun:test'
import { parseBody, parseHead, parseOpml, parseOutline } from './utils.js'

describe('parseOutline', () => {
  it('should handle valid outline object', () => {
    const value = {
      '@text': 'Outline Title',
      '@type': 'rss',
      '@xmlurl': 'https://example.com/feed.xml',
      '@htmlurl': 'https://example.com',
      '@description': 'Example outline description',
      '@language': 'en',
      '@title': 'Outline Link Title',
      '@version': '2.0',
      '@url': 'https://example.com/alternate',
      outline: [{ '@text': 'Child Outline 1' }, { '@text': 'Child Outline 2' }],
    }
    const expected = {
      text: 'Outline Title',
      type: 'rss',
      xmlUrl: 'https://example.com/feed.xml',
      htmlUrl: 'https://example.com',
      description: 'Example outline description',
      language: 'en',
      title: 'Outline Link Title',
      version: '2.0',
      url: 'https://example.com/alternate',
      outlines: [{ text: 'Child Outline 1' }, { text: 'Child Outline 2' }],
    }

    expect(parseOutline(value)).toEqual(expected)
  })

  it('should handle minimal outline with only text attribute', () => {
    const value = {
      '@text': 'Minimal Outline',
    }
    const expected = {
      text: 'Minimal Outline',
    }

    expect(parseOutline(value)).toEqual(expected)
  })

  it('should handle boolean attributes', () => {
    const value = {
      '@text': 'Boolean Outline',
      '@iscomment': 'true',
      '@isbreakpoint': 'false',
    }
    const expected = {
      text: 'Boolean Outline',
      isComment: true,
      isBreakpoint: false,
    }

    expect(parseOutline(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@text': 123,
      '@type': 456,
      '@version': 789,
    }
    const expected = {
      text: '123',
      type: '456',
      version: '789',
    }

    expect(parseOutline(value)).toEqual(expected)
  })

  it('should handle deep nested outlines', () => {
    const value = {
      '@text': 'Parent',
      outline: [
        {
          '@text': 'Child',
          outline: [{ '@text': 'Grandchild' }],
        },
      ],
    }
    const expected = {
      text: 'Parent',
      outlines: [
        {
          text: 'Child',
          outlines: [{ text: 'Grandchild' }],
        },
      ],
    }

    expect(parseOutline(value)).toEqual(expected)
  })

  it('should handle empty outline object', () => {
    const value = {}

    expect(parseOutline(value)).toBeUndefined()
  })

  it('should handle non-object value', () => {
    expect(parseOutline('not an object')).toBeUndefined()
    expect(parseOutline(undefined)).toBeUndefined()
    expect(parseOutline(null)).toBeUndefined()
  })
})

describe('parseHead', () => {
  const expectedFull = {
    title: 'My OPML Document',
    dateCreated: 'Mon, 15 Mar 2023 12:00:00 GMT',
    dateModified: 'Mon, 15 Mar 2023 13:00:00 GMT',
    ownerName: 'John Doe',
    ownerEmail: 'john@example.com',
    ownerId: 'http://example.com/users/john',
    docs: 'http://example.com/opml-docs',
    expansionState: [1, 2, 3, 4],
    vertScrollState: 1,
    windowTop: 100,
    windowLeft: 50,
    windowBottom: 500,
    windowRight: 700,
  }

  it('should parse complete head object (with #text)', () => {
    const value = {
      title: { '#text': 'My OPML Document' },
      datecreated: { '#text': 'Mon, 15 Mar 2023 12:00:00 GMT' },
      datemodified: { '#text': 'Mon, 15 Mar 2023 13:00:00 GMT' },
      ownername: { '#text': 'John Doe' },
      owneremail: { '#text': 'john@example.com' },
      ownerid: { '#text': 'http://example.com/users/john' },
      docs: { '#text': 'http://example.com/opml-docs' },
      expansionstate: { '#text': '1,2,3,4' },
      vertscrollstate: { '#text': '1' },
      windowtop: { '#text': '100' },
      windowleft: { '#text': '50' },
      windowbottom: { '#text': '500' },
      windowright: { '#text': '700' },
    }

    expect(parseHead(value)).toEqual(expectedFull)
  })

  it('should parse complete head object (without #text)', () => {
    const value = {
      title: 'My OPML Document',
      datecreated: 'Mon, 15 Mar 2023 12:00:00 GMT',
      datemodified: 'Mon, 15 Mar 2023 13:00:00 GMT',
      ownername: 'John Doe',
      owneremail: 'john@example.com',
      ownerid: 'http://example.com/users/john',
      docs: 'http://example.com/opml-docs',
      expansionstate: '1,2,3,4',
      vertscrollstate: '1',
      windowtop: '100',
      windowleft: '50',
      windowbottom: '500',
      windowright: '700',
    }

    expect(parseHead(value)).toEqual(expectedFull)
  })

  it('should parse complete head object (with array of values)', () => {
    const value = {
      title: ['My OPML Document', ''],
      datecreated: ['Mon, 15 Mar 2023 12:00:00 GMT', ''],
      datemodified: ['Mon, 15 Mar 2023 13:00:00 GMT', ''],
      ownername: ['John Doe', ''],
      owneremail: ['john@example.com', ''],
      ownerid: ['http://example.com/users/john', ''],
      docs: ['http://example.com/opml-docs', ''],
      expansionstate: ['1,2,3,4', ''],
      vertscrollstate: ['1', ''],
      windowtop: ['100', ''],
      windowleft: ['50', ''],
      windowbottom: ['500', ''],
      windowright: ['700', ''],
    }

    expect(parseHead(value)).toEqual(expectedFull)
  })

  it('should handle partial head object', () => {
    const value = {
      title: { '#text': 'My OPML Document' },
      ownername: { '#text': 'John Doe' },
    }
    const expected = {
      title: 'My OPML Document',
      ownerName: 'John Doe',
    }

    expect(parseHead(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      title: { '#text': 123 },
      vertscrollstate: { '#text': '10.5' },
      windowtop: { '#text': 'not a number' },
    }
    const expected = {
      title: '123',
      vertScrollState: 10.5,
    }

    expect(parseHead(value)).toEqual(expected)
  })

  it('should return undefined for empty head object', () => {
    const value = {}

    expect(parseHead(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseHead('not an object')).toBeUndefined()
    expect(parseHead(undefined)).toBeUndefined()
    expect(parseHead(null)).toBeUndefined()
  })
})

describe('parseBody', () => {
  it('should parse complete body object', () => {
    const value = {
      outline: [
        {
          '@text': 'Category 1',
          outline: [
            {
              '@text': 'Subcategory 1',
              '@type': 'rss',
              '@xmlurl': 'https://example.com/feed1.xml',
            },
            {
              '@text': 'Subcategory 2',
              '@type': 'rss',
              '@xmlurl': 'https://example.com/feed2.xml',
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
    const expected = {
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

    expect(parseBody(value)).toEqual(expected)
  })

  it('should handle single outline in body (not in array)', () => {
    const value = {
      outline: { '@text': 'Single Outline' },
    }
    const expected = {
      outlines: [{ text: 'Single Outline' }],
    }

    expect(parseBody(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      outline: [{ '@text': 456 }],
    }
    const expected = {
      outlines: [{ text: '456' }],
    }

    expect(parseBody(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(parseBody('not an object')).toBeUndefined()
    expect(parseBody(undefined)).toBeUndefined()
    expect(parseBody(null)).toBeUndefined()
  })

  it('should handle empty body or missing outlines', () => {
    const value = {}

    expect(parseBody(value)).toBeUndefined()
  })
})

describe('parseOpml', () => {
  it('should parse complete opml document', () => {
    const value = {
      opml: {
        '@version': '2.0',
        head: {
          title: { '#text': 'My OPML Document' },
          datemodified: { '#text': 'Mon, 15 Mar 2023 13:00:00 GMT' },
        },
        body: {
          outline: [
            {
              '@text': 'Category 1',
              outline: [
                {
                  '@text': 'Subcategory 1',
                  '@type': 'rss',
                  '@xmlurl': 'https://example.com/feed1.xml',
                },
                {
                  '@text': 'Subcategory 2',
                  '@type': 'rss',
                  '@xmlurl': 'https://example.com/feed2.xml',
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
    const expected = {
      head: {
        title: 'My OPML Document',
        dateModified: 'Mon, 15 Mar 2023 13:00:00 GMT',
      },
      body: {
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
      },
    }

    expect(parseOpml(value)).toEqual(expected)
  })

  it('should handle minimal opml with only version and head', () => {
    const value = {
      opml: {
        '@version': '2.0',
        head: {
          title: 'Test',
        },
      },
    }
    const expected = {
      head: {
        title: 'Test',
      },
    }

    expect(parseOpml(value)).toEqual(expected)
  })

  it('should handle minimal opml with only version and body', () => {
    const value = {
      opml: {
        '@version': '2.0',
        body: {
          outline: [{ '@text': 'Simple Outline' }],
        },
      },
    }
    const expected = {
      body: {
        outlines: [{ text: 'Simple Outline' }],
      },
    }

    expect(parseOpml(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      opml: {
        '@version': 2.0,
        head: {
          title: { '#text': 123 },
        },
        body: {
          outline: [{ '@text': 456 }],
        },
      },
    }
    const expected = {
      head: {
        title: '123',
      },
      body: {
        outlines: [{ text: '456' }],
      },
    }

    expect(parseOpml(value)).toEqual(expected)
  })

  it('should return undefined for invalid opml structure', () => {
    const value = {
      notOpml: {},
    }

    expect(parseOpml(value)).toBeUndefined()
  })

  it('should return undefined for empty head and body objects', () => {
    const value = {
      opml: {
        '@version': '2.0',
        head: {},
        body: {},
      },
    }

    expect(parseOpml(value)).toBeUndefined()
  })

  it('should return undefined for empty opml object', () => {
    const value = {
      opml: {},
    }

    expect(parseOpml(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseOpml('not an object')).toBeUndefined()
    expect(parseOpml(undefined)).toBeUndefined()
    expect(parseOpml(null)).toBeUndefined()
  })
})
