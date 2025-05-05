import { describe, expect, it } from 'bun:test'
import { generate } from './index.js'

describe('generate', () => {
  const references = ['category', 'directory', 'places', 'script', 'countries', 'subscriptions']

  for (const reference of references) {
    it(`should correctly generate ${reference} OPML from JSON`, async () => {
      const path = `${import.meta.dir}/../references/${reference}`
      const value = await Bun.file(`${path}.json`).json()
      const expected = await Bun.file(`${path}.opml`).text()

      expect(generate(value)).toEqual(expected)
    })
  }

  it('should generate minimal valid OPML', () => {
    const value = {
      body: {
        outlines: [{ text: 'Simple Outline' }],
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<opml version="2.0">
  <body>
    <outline text="Simple Outline"/>
  </body>
</opml>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate OPML with head information', () => {
    const now = new Date('2023-03-15T12:00:00Z')
    const value = {
      head: {
        title: 'My OPML Document',
        dateCreated: now,
        dateModified: now,
        ownerName: 'John Doe',
        ownerEmail: 'john@example.com',
      },
      body: {
        outlines: [{ text: 'Simple Outline' }],
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<opml version="2.0">
  <head>
    <title>My OPML Document</title>
    <dateCreated>Wed, 15 Mar 2023 12:00:00 GMT</dateCreated>
    <dateModified>Wed, 15 Mar 2023 12:00:00 GMT</dateModified>
    <ownerName>John Doe</ownerName>
    <ownerEmail>john@example.com</ownerEmail>
  </head>
  <body>
    <outline text="Simple Outline"/>
  </body>
</opml>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate OPML with nested outlines', () => {
    const value = {
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
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<opml version="2.0">
  <body>
    <outline text="Category 1">
      <outline text="Subcategory 1" type="rss" xmlUrl="https://example.com/feed1.xml"/>
      <outline text="Subcategory 2" type="rss" xmlUrl="https://example.com/feed2.xml"/>
    </outline>
    <outline text="Category 2" type="link" url="https://example.com"/>
  </body>
</opml>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate OPML with boolean attributes', () => {
    const value = {
      body: {
        outlines: [
          {
            text: 'With Boolean Attributes',
            isComment: true,
            isBreakpoint: false,
          },
        ],
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<opml version="2.0">
  <body>
    <outline text="With Boolean Attributes" isComment="true" isBreakpoint="false"/>
  </body>
</opml>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate complete OPML with all fields', () => {
    const now = new Date('2023-03-15T12:00:00Z')

    const opml = {
      head: {
        title: 'Complete OPML Example',
        dateCreated: now,
        dateModified: now,
        ownerName: 'John Doe',
        ownerEmail: 'john@example.com',
        ownerId: 'http://example.com/users/john',
        docs: 'http://example.com/docs',
        expansionState: [1, 2, 3],
        vertScrollState: 0,
        windowTop: 100,
        windowLeft: 50,
        windowBottom: 500,
        windowRight: 700,
      },
      body: {
        outlines: [
          {
            text: 'Feed Category',
            outlines: [
              {
                text: 'Example Feed',
                type: 'rss',
                description: 'Example feed description',
                xmlUrl: 'https://example.com/feed.xml',
                htmlUrl: 'https://example.com',
                language: 'en',
                title: 'Example Feed Title',
                version: '2.0',
                url: 'https://example.com/alternate',
              },
            ],
          },
          {
            text: 'Simple Link',
            type: 'link',
            url: 'https://example.com',
          },
        ],
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<opml version="2.0">
  <head>
    <title>Complete OPML Example</title>
    <dateCreated>Wed, 15 Mar 2023 12:00:00 GMT</dateCreated>
    <dateModified>Wed, 15 Mar 2023 12:00:00 GMT</dateModified>
    <ownerName>John Doe</ownerName>
    <ownerEmail>john@example.com</ownerEmail>
    <ownerId>http://example.com/users/john</ownerId>
    <docs>http://example.com/docs</docs>
    <expansionState>1,2,3</expansionState>
    <vertScrollState>0</vertScrollState>
    <windowTop>100</windowTop>
    <windowLeft>50</windowLeft>
    <windowBottom>500</windowBottom>
    <windowRight>700</windowRight>
  </head>
  <body>
    <outline text="Feed Category">
      <outline text="Example Feed" type="rss" description="Example feed description" xmlUrl="https://example.com/feed.xml" htmlUrl="https://example.com" language="en" title="Example Feed Title" version="2.0" url="https://example.com/alternate"/>
    </outline>
    <outline text="Simple Link" type="link" url="https://example.com"/>
  </body>
</opml>
`

    expect(generate(opml)).toEqual(expected)
  })

  it('should handle outlines with empty arrays', () => {
    const value = {
      body: {
        outlines: [
          {
            text: 'Empty Outlines',
            outlines: [],
          },
        ],
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<opml version="2.0">
  <body>
    <outline text="Empty Outlines"/>
  </body>
</opml>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should throw error for invalid OPML structure', () => {
    const value = {
      head: {
        title: 'Invalid OPML',
      },
    }

    // @ts-ignore: Testing invalid input.
    expect(() => generate(value)).toThrow()
  })

  it('should properly encode special characters in attributes', () => {
    const opml = {
      body: {
        outlines: [
          {
            text: 'Special & Characters > Need "Escaping"',
            url: 'https://example.com?param1=value&param2=value',
          },
        ],
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<opml version="2.0">
  <body>
    <outline text="Special &amp; Characters &gt; Need &quot;Escaping&quot;" url="https://example.com?param1=value&amp;param2=value"/>
  </body>
</opml>
`

    expect(generate(opml)).toEqual(expected)
  })
})
