import { describe, expect, it } from 'bun:test'
import { parse } from './index.js'

describe('parse', () => {
  const references = ['category', 'directory', 'places', 'script', 'countries', 'subscriptions']

  for (const reference of references) {
    it(`should correctly parse ${reference} OPML to JSON`, async () => {
      const path = `${import.meta.dir}/../references/${reference}`
      const value = await Bun.file(`${path}.opml`).text()
      const expected = await Bun.file(`${path}.json`).json()

      expect(parse(value)).toEqual(expected)
    })
  }

  it('should handle OPML with one outline', () => {
    const mixedCaseOpml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <OPML version="2.0">
        <HEAD>
          <title>Mixed Case Example</title>
        </HEAD>
        <Body>
          <outline TEXT="Item 1" Type="link" />
        </Body>
      </OPML>
    `
    const expected = {
      head: {
        title: 'Mixed Case Example',
      },
      body: {
        outlines: [{ text: 'Item 1', type: 'link' }],
      },
    }

    expect(parse(mixedCaseOpml)).toEqual(expected)
  })

  it('should handle case-insensitive XML tags and attributes', () => {
    const mixedCaseOpml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <OPML version="2.0">
        <HEAD>
          <title>Mixed Case Example</title>
        </HEAD>
        <Body>
          <outline TEXT="Item 1" Type="link" />
          <OUTLINE text="Item 2" URL="https://example.com">
            <OutLIne tExT="Subitem 1" />
          </OUTLINE>
        </Body>
      </OPML>
    `
    const expected = {
      head: {
        title: 'Mixed Case Example',
      },
      body: {
        outlines: [
          { text: 'Item 1', type: 'link' },
          {
            text: 'Item 2',
            url: 'https://example.com',
            outlines: [{ text: 'Subitem 1' }],
          },
        ],
      },
    }

    expect(parse(mixedCaseOpml)).toEqual(expected)
  })

  it('should handle alternating case outlines', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <opml version="2.0">
        <head>
          <title>Test Feed</title>
        </head>
        <body>
          <outline text="First" />
          <OUTLINE text="Second" />
          <outline text="Third" />
        </body>
      </opml>
    `
    const expected = {
      head: {
        title: 'Test Feed',
      },
      body: {
        outlines: [{ text: 'First' }, { text: 'Second' }, { text: 'Third' }],
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle empty string input', () => {
    const value = ''

    expect(() => parse(value)).toThrow()
  })

  it('should handle invalid XML input', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <OPML version="2.0">
        <HEAD>
          <title>Invalid XML Example
        </HEAD>
        <Body>
          <outline TEXT="Unclosed tag
        </Body>
      </OPML>
    `

    expect(() => parse(value)).toThrow()
  })

  describe('custom attributes', () => {
    it('should parse OPML with custom attributes when specified in options', () => {
      const opmlString = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Test OPML</title>
  </head>
  <body>
    <outline text="Feed 1" type="rss" xmlUrl="https://feed1.com/rss" customRating="5" customTags="tech,news" />
    <outline text="Feed 2" type="rss" xmlUrl="https://feed2.com/rss" customRating="3" customTags="blog" />
  </body>
</opml>`

      const options = {
        extraOutlineAttributes: ['customRating', 'customTags'],
      }
      const expected = {
        head: {
          title: 'Test OPML',
        },
        body: {
          outlines: [
            {
              text: 'Feed 1',
              type: 'rss',
              xmlUrl: 'https://feed1.com/rss',
              customRating: '5',
              customTags: 'tech,news',
            },
            {
              text: 'Feed 2',
              type: 'rss',
              xmlUrl: 'https://feed2.com/rss',
              customRating: '3',
              customTags: 'blog',
            },
          ],
        },
      }

      expect(parse(opmlString, options)).toEqual(expected)
    })

    it('should not include custom attributes when not specified in options', () => {
      const opmlString = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <body>
    <outline text="Feed" type="rss" xmlUrl="https://feed.com/rss" customRating="5" customTags="tech" />
  </body>
</opml>`

      const expected = {
        body: {
          outlines: [
            {
              text: 'Feed',
              type: 'rss',
              xmlUrl: 'https://feed.com/rss',
            },
          ],
        },
      }

      expect(parse(opmlString)).toEqual(expected)
    })
  })
})
