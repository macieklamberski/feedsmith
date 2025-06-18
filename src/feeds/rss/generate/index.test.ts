import { describe, expect, it } from 'bun:test'
import { generate } from './index.js'

describe('generate', () => {
  const versions = {
    '20': '2.0',
    // ns: 'with namespaces',
  }

  for (const [key, label] of Object.entries(versions)) {
    it(`should correctly generate RSS ${label}`, async () => {
      const reference = `${import.meta.dir}/../references/rss-${key}`
      const input = await Bun.file(`${reference}.json`).json()
      const expectation = await Bun.file(`${reference}.xml`).text()
      const result = generate(input)

      expect(result).toEqual(expectation)
    })
  }

  it('should generate RSS with sy namespace', () => {
    const input = {
      title: 'Feed with sy namespace',
      description: 'Test feed with syndication namespace',
      sy: {
        updatePeriod: 'hourly',
        updateFrequency: 2,
        updateBase: new Date('2023-01-01T00:00:00Z'),
      },
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
  <channel>
    <title>Feed with sy namespace</title>
    <description>Test feed with syndication namespace</description>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>2</sy:updateFrequency>
    <sy:updateBase>2023-01-01T00:00:00.000Z</sy:updateBase>
  </channel>
</rss>
`

    expect(generate(input)).toEqual(expected)
  })

  it('should generate RSS with dc namespace', () => {
    const input = {
      title: 'Feed with dc namespace',
      description: 'Test feed with Dublin Core namespace',
      dc: {
        creator: 'John Doe',
        rights: 'Copyright 2023',
      },
      items: [
        {
          title: 'First item',
          dc: {
            creator: 'Jane Smith',
            date: new Date('2023-01-01T00:00:00Z'),
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Feed with dc namespace</title>
    <description>Test feed with Dublin Core namespace</description>
    <dc:creator>John Doe</dc:creator>
    <dc:rights>Copyright 2023</dc:rights>
    <item>
      <title>First item</title>
      <dc:creator>Jane Smith</dc:creator>
      <dc:date>2023-01-01T00:00:00.000Z</dc:date>
    </item>
  </channel>
</rss>
`

    expect(generate(input)).toEqual(expected)
  })

  it('should generate RSS with slash namespace', () => {
    const input = {
      title: 'Feed with slash namespace',
      description: 'Test feed with Slash namespace',
      items: [
        {
          title: 'First item',
          slash: {
            section: 'Technology',
            department: 'News',
            comments: 42,
            hit_parade: [1, 2, 3, 4, 5],
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>Feed with slash namespace</title>
    <description>Test feed with Slash namespace</description>
    <item>
      <title>First item</title>
      <slash:section>Technology</slash:section>
      <slash:department>News</slash:department>
      <slash:comments>42</slash:comments>
      <slash:hit_parade>1,2,3,4,5</slash:hit_parade>
    </item>
  </channel>
</rss>
`

    expect(generate(input)).toEqual(expected)
  })

  it('should generate RSS with content namespace', () => {
    const input = {
      title: 'Feed with content namespace',
      description: 'Test feed with Content namespace',
      items: [
        {
          title: 'First item',
          content: {
            encoded: '<p>Full HTML content with <strong>formatting</strong></p>',
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Feed with content namespace</title>
    <description>Test feed with Content namespace</description>
    <item>
      <title>First item</title>
      <content:encoded>
        <![CDATA[<p>Full HTML content with <strong>formatting</strong></p>]]>
      </content:encoded>
    </item>
  </channel>
</rss>
`

    expect(generate(input)).toEqual(expected)
  })

  it('should generate RSS with content namespace for simple text', () => {
    const input = {
      title: 'Feed with simple content',
      description: 'Test feed with simple text content',
      items: [
        {
          title: 'Simple item',
          content: {
            encoded: 'Simple text content without HTML or special characters',
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Feed with simple content</title>
    <description>Test feed with simple text content</description>
    <item>
      <title>Simple item</title>
      <content:encoded>Simple text content without HTML or special characters</content:encoded>
    </item>
  </channel>
</rss>
`

    expect(generate(input)).toEqual(expected)
  })

  it('should generate RSS with thr namespace', () => {
    const input = {
      title: 'Feed with thr namespace',
      description: 'Test feed with Threading namespace',
      items: [
        {
          title: 'Discussion post',
          thr: {
            total: 42,
            inReplyTos: [
              {
                ref: 'http://example.com/original-post',
                href: 'http://example.com/original-post#comment-1',
              },
            ],
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:thr="http://purl.org/syndication/thread/1.0">
  <channel>
    <title>Feed with thr namespace</title>
    <description>Test feed with Threading namespace</description>
    <item>
      <title>Discussion post</title>
      <thr:total>42</thr:total>
      <thr:in-reply-to ref="http://example.com/original-post" href="http://example.com/original-post#comment-1"/>
    </item>
  </channel>
</rss>
`

    expect(generate(input)).toEqual(expected)
  })

  it('should generate RSS with atom namespace', () => {
    const input = {
      title: 'Feed with Atom namespace',
      description: 'Test feed with Atom namespace elements',
      atom: {
        id: 'https://example.com/feed',
        title: 'Atom Feed Title',
        updated: new Date('2023-01-01T00:00:00Z'),
        links: [
          {
            href: 'https://example.com/feed.xml',
            rel: 'self',
            type: 'application/atom+xml',
          },
        ],
      },
      items: [
        {
          title: 'First item',
          atom: {
            id: 'https://example.com/entry/1',
            title: 'Atom Entry Title',
            updated: new Date('2023-01-01T00:00:00Z'),
            content: 'Atom entry content',
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Feed with Atom namespace</title>
    <description>Test feed with Atom namespace elements</description>
    <atom:id>https://example.com/feed</atom:id>
    <atom:link href="https://example.com/feed.xml" rel="self" type="application/atom+xml"/>
    <atom:title>Atom Feed Title</atom:title>
    <atom:updated>2023-01-01T00:00:00.000Z</atom:updated>
    <item>
      <title>First item</title>
      <atom:content>Atom entry content</atom:content>
      <atom:id>https://example.com/entry/1</atom:id>
      <atom:title>Atom Entry Title</atom:title>
      <atom:updated>2023-01-01T00:00:00.000Z</atom:updated>
    </item>
  </channel>
</rss>
`

    expect(generate(input)).toEqual(expected)
  })
})
