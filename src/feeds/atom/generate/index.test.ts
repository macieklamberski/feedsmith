import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { generate } from './index.js'

describe('generate', () => {
  const versions = {
    // TODO: Enable reference tests once advanced features like Text fields being an object of
    // { value: string, type: 'text' | 'html' | 'xhtml' }
    // '10': '1.0',
    // ns: 'with namespaces',
  }

  for (const [key, label] of Object.entries(versions)) {
    it(`should correctly generate Atom ${label}`, async () => {
      const reference = `${import.meta.dir}/../references/atom-${key}`
      const input = await Bun.file(`${reference}.json`).json()
      const expectation = await Bun.file(`${reference}.xml`).text()
      const result = generate(input)

      expect(result).toEqual(expectation)
    })
  }

  it('should generate minimal valid Atom feed', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Minimal Feed' },
      updated: new Date('2023-03-15T12:00:00Z'),
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Minimal Feed</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with entries', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Entries' },
      updated: new Date('2023-03-15T12:00:00Z'),
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'First Entry' },
          updated: new Date('2023-03-15T12:00:00Z'),
        },
        {
          id: 'https://example.com/entry/2',
          title: { value: 'Second Entry' },
          updated: new Date('2023-03-15T12:00:00Z'),
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Feed with Entries</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>First Entry</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
  </entry>
  <entry>
    <id>https://example.com/entry/2</id>
    <title>Second Entry</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with author and links', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Author and Links' },
      updated: new Date('2023-03-15T12:00:00Z'),
      authors: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          uri: 'https://example.com/john',
        },
      ],
      links: [
        {
          href: 'https://example.com/feed.xml',
          rel: 'self',
          type: 'application/atom+xml',
        },
        {
          href: 'https://example.com',
          rel: 'alternate',
          type: 'text/html',
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <author>
    <name>John Doe</name>
    <uri>https://example.com/john</uri>
    <email>john@example.com</email>
  </author>
  <id>https://example.com/feed</id>
  <link href="https://example.com/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="https://example.com" rel="alternate" type="text/html"/>
  <title>Feed with Author and Links</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate complete Atom feed with all fields', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Complete Atom Feed' },
      updated: new Date('2023-03-15T12:00:00Z'),
      authors: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          uri: 'https://example.com/john',
        },
      ],
      categories: [
        {
          term: 'technology',
          scheme: 'https://example.com/categories',
          label: 'Technology',
        },
      ],
      contributors: [
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      ],
      generator: {
        text: 'Example Generator',
        uri: 'https://example.com/generator',
        version: '1.0',
      },
      icon: 'https://example.com/icon.png',
      logo: 'https://example.com/logo.png',
      rights: { value: 'Copyright 2023 Example Corp' },
      subtitle: { value: 'A complete example feed' },
      links: [
        {
          href: 'https://example.com/feed.xml',
          rel: 'self',
          type: 'application/atom+xml',
        },
      ],
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Complete Entry' },
          updated: new Date('2023-03-15T12:00:00Z'),
          published: new Date('2023-03-10T08:00:00Z'),
          content: { value: 'This is the complete entry content' },
          summary: { value: 'Entry summary' },
          authors: [
            {
              name: 'Entry Author',
            },
          ],
          categories: [
            {
              term: 'news',
            },
          ],
          links: [
            {
              href: 'https://example.com/entry/1',
              rel: 'alternate',
              type: 'text/html',
            },
          ],
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <author>
    <name>John Doe</name>
    <uri>https://example.com/john</uri>
    <email>john@example.com</email>
  </author>
  <category term="technology" scheme="https://example.com/categories" label="Technology"/>
  <contributor>
    <name>Jane Smith</name>
    <email>jane@example.com</email>
  </contributor>
  <generator uri="https://example.com/generator" version="1.0">Example Generator</generator>
  <icon>https://example.com/icon.png</icon>
  <id>https://example.com/feed</id>
  <link href="https://example.com/feed.xml" rel="self" type="application/atom+xml"/>
  <logo>https://example.com/logo.png</logo>
  <rights>Copyright 2023 Example Corp</rights>
  <subtitle>A complete example feed</subtitle>
  <title>Complete Atom Feed</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <entry>
    <author>
      <name>Entry Author</name>
    </author>
    <category term="news"/>
    <content>This is the complete entry content</content>
    <id>https://example.com/entry/1</id>
    <link href="https://example.com/entry/1" rel="alternate" type="text/html"/>
    <published>2023-03-10T08:00:00.000Z</published>
    <summary>Entry summary</summary>
    <title>Complete Entry</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should handle empty arrays', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Empty Arrays' },
      updated: new Date('2023-03-15T12:00:00Z'),
      authors: [],
      categories: [],
      entries: [],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Feed with Empty Arrays</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should throw error for invalid Atom feed structure', () => {
    const value = {}

    expect(() => generate(value)).toThrow(locales.invalidInputAtom)
  })

  it('should properly encode special characters in text content', () => {
    const updatedDate = new Date('2023-03-15T12:00:00Z')
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Special & Characters > Need "Escaping"' },
      updated: updatedDate,
      subtitle: { value: 'Content with <tags> & "quotes"' },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Entry with & Special Characters' },
          updated: updatedDate,
          content: { value: 'Content with <b>bold</b> & "quoted" text' },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <subtitle>
    <![CDATA[Content with <tags> & "quotes"]]>
  </subtitle>
  <title>
    <![CDATA[Special & Characters > Need "Escaping"]]>
  </title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <entry>
    <content>
      <![CDATA[Content with <b>bold</b> & "quoted" text]]>
    </content>
    <id>https://example.com/entry/1</id>
    <title>
      <![CDATA[Entry with & Special Characters]]>
    </title>
    <updated>2023-03-15T12:00:00.000Z</updated>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should handle invalid dates gracefully', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Invalid Date' },
      updated: new Date('invalid-date'),
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Feed with Invalid Date</title>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with dc namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with DC namespace' },
      updated: new Date('2023-03-15T12:00:00Z'),
      dc: {
        creator: 'John Doe',
      },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Entry with DC' },
          updated: new Date('2023-03-15T12:00:00Z'),
          dc: {
            creator: 'Jane Smith',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <id>https://example.com/feed</id>
  <title>Feed with DC namespace</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <dc:creator>John Doe</dc:creator>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Entry with DC</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
    <dc:creator>Jane Smith</dc:creator>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with geo namespace', () => {
    const value = {
      id: 'http://example.com/feed',
      title: { value: 'Example City Feed' },
      updated: new Date('2024-01-10T12:00:00Z'),
      geo: {
        lat: 37.7749,
        long: -122.4194,
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">
  <id>http://example.com/feed</id>
  <title>Example City Feed</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <geo:lat>37.7749</geo:lat>
  <geo:long>-122.4194</geo:long>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with dcterms namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with DCTerms namespace' },
      updated: new Date('2023-03-15T12:00:00Z'),
      dcterms: {
        created: new Date('2023-01-01T00:00:00Z'),
        license: 'Creative Commons Attribution 4.0',
      },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Entry with DCTerms' },
          updated: new Date('2023-03-15T12:00:00Z'),
          dcterms: {
            created: new Date('2023-02-01T00:00:00Z'),
            license: 'MIT License',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:dcterms="http://purl.org/dc/terms/">
  <id>https://example.com/feed</id>
  <title>Feed with DCTerms namespace</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <dcterms:created>2023-01-01T00:00:00.000Z</dcterms:created>
  <dcterms:license>Creative Commons Attribution 4.0</dcterms:license>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Entry with DCTerms</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
    <dcterms:created>2023-02-01T00:00:00.000Z</dcterms:created>
    <dcterms:license>MIT License</dcterms:license>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with sy namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with SY namespace' },
      updated: new Date('2023-03-15T12:00:00Z'),
      sy: {
        updatePeriod: 'hourly',
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
  <id>https://example.com/feed</id>
  <title>Feed with SY namespace</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <sy:updatePeriod>hourly</sy:updatePeriod>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with slash namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Slash namespace' },
      updated: new Date('2023-03-15T12:00:00Z'),
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Entry with Slash' },
          updated: new Date('2023-03-15T12:00:00Z'),
          slash: {
            section: 'Technology',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <id>https://example.com/feed</id>
  <title>Feed with Slash namespace</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Entry with Slash</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
    <slash:section>Technology</slash:section>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with thr namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Threading namespace' },
      updated: new Date('2023-03-15T12:00:00Z'),
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Discussion post' },
          updated: new Date('2023-03-15T12:00:00Z'),
          thr: {
            total: 42,
          },
          links: [
            {
              href: 'https://example.com/comments',
              rel: 'replies',
              type: 'application/atom+xml',
              thr: {
                count: 5,
                updated: new Date('2023-03-10T08:00:00Z'),
              },
            },
          ],
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:thr="http://purl.org/syndication/thread/1.0">
  <id>https://example.com/feed</id>
  <title>Feed with Threading namespace</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <entry>
    <id>https://example.com/entry/1</id>
    <link href="https://example.com/comments" rel="replies" type="application/atom+xml" thr:count="5" thr:updated="2023-03-10T08:00:00.000Z"/>
    <title>Discussion post</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
    <thr:total>42</thr:total>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with media namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Media namespace' },
      updated: new Date('2023-03-15T12:00:00Z'),
      media: {
        title: { value: 'Feed Media Title' },
      },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Entry with Media' },
          updated: new Date('2023-03-15T12:00:00Z'),
          media: {
            title: { value: 'Entry Media Title' },
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <id>https://example.com/feed</id>
  <title>Feed with Media namespace</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <media:title>Feed Media Title</media:title>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Entry with Media</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
    <media:title>Entry Media Title</media:title>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with itunes namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with iTunes namespace' },
      updated: new Date('2023-03-15T12:00:00Z'),
      itunes: {
        author: 'Podcast Author',
      },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Episode with iTunes' },
          updated: new Date('2023-03-15T12:00:00Z'),
          itunes: {
            title: 'Episode 1 - Special Title',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <id>https://example.com/feed</id>
  <title>Feed with iTunes namespace</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <itunes:author>Podcast Author</itunes:author>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Episode with iTunes</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
    <itunes:title>Episode 1 - Special Title</itunes:title>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with googleplay namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with GooglePlay namespace' },
      updated: new Date('2023-03-15T12:00:00Z'),
      googleplay: {
        author: 'Podcast Creator',
        explicit: false,
      },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Episode with GooglePlay' },
          updated: new Date('2023-03-15T12:00:00Z'),
          googleplay: {
            author: 'Episode Author',
            explicit: 'clean' as const,
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:googleplay="https://www.google.com/schemas/play-podcasts/1.0/">
  <id>https://example.com/feed</id>
  <title>Feed with GooglePlay namespace</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <googleplay:author>Podcast Creator</googleplay:author>
  <googleplay:explicit>no</googleplay:explicit>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Episode with GooglePlay</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
    <googleplay:author>Episode Author</googleplay:author>
    <googleplay:explicit>clean</googleplay:explicit>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with multiple namespaces', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with multiple namespaces' },
      updated: new Date('2023-03-15T12:00:00Z'),
      dc: {
        creator: 'John Doe',
        rights: 'Copyright 2023',
      },
      sy: {
        updatePeriod: 'daily',
        updateFrequency: 1,
      },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Multi-namespace entry' },
          updated: new Date('2023-03-15T12:00:00Z'),
          dc: {
            creator: 'Jane Smith',
          },
          slash: {
            section: 'Technology',
            comments: 15,
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <id>https://example.com/feed</id>
  <title>Feed with multiple namespaces</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <dc:creator>John Doe</dc:creator>
  <dc:rights>Copyright 2023</dc:rights>
  <sy:updatePeriod>daily</sy:updatePeriod>
  <sy:updateFrequency>1</sy:updateFrequency>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Multi-namespace entry</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
    <dc:creator>Jane Smith</dc:creator>
    <slash:section>Technology</slash:section>
    <slash:comments>15</slash:comments>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with georss namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with GeoRSS namespace' },
      updated: new Date('2023-03-15T12:00:00Z'),
      georss: {
        point: { lat: 45.256, lng: -71.92 },
      },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Location entry' },
          updated: new Date('2023-03-15T12:00:00Z'),
          georss: {
            point: { lat: 42.3601, lng: -71.0589 },
            featureName: 'Boston',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss">
  <id>https://example.com/feed</id>
  <title>Feed with GeoRSS namespace</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
  <georss:point>45.256 -71.92</georss:point>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Location entry</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
    <georss:point>42.3601 -71.0589</georss:point>
    <georss:featureName>Boston</georss:featureName>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with ccREL namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with ccREL' },
      updated: new Date('2024-01-10T12:00:00Z'),
      cc: {
        license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        morePermissions: 'https://example.com/commercial-license',
      },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Entry with ccREL' },
          updated: new Date('2023-03-15T12:00:00Z'),
          cc: {
            license: 'https://creativecommons.org/licenses/by/4.0/',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:cc="http://creativecommons.org/ns#">
  <id>https://example.com/feed</id>
  <title>Feed with ccREL</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <cc:license>https://creativecommons.org/licenses/by-nc-sa/4.0/</cc:license>
  <cc:morePermissions>https://example.com/commercial-license</cc:morePermissions>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Entry with ccREL</title>
    <updated>2023-03-15T12:00:00.000Z</updated>
    <cc:license>https://creativecommons.org/licenses/by/4.0/</cc:license>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with creativecommons namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Creative Commons' },
      updated: new Date('2024-01-10T12:00:00Z'),
      creativeCommons: {
        licenses: ['http://creativecommons.org/licenses/by-nc-nd/2.0/'],
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:creativeCommons="http://backend.userland.com/creativeCommonsRssModule">
  <id>https://example.com/feed</id>
  <title>Feed with Creative Commons</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <creativeCommons:license>http://creativecommons.org/licenses/by-nc-nd/2.0/</creativeCommons:license>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with opensearch namespace', () => {
    const value = {
      id: 'http://example.com/search',
      title: { value: 'Search Results' },
      updated: new Date('2024-01-10T12:00:00Z'),
      opensearch: {
        totalResults: 1000,
        startIndex: 0,
        itemsPerPage: 10,
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">
  <id>http://example.com/search</id>
  <title>Search Results</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <opensearch:totalResults>1000</opensearch:totalResults>
  <opensearch:startIndex>0</opensearch:startIndex>
  <opensearch:itemsPerPage>10</opensearch:itemsPerPage>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with arxiv namespace', () => {
    const value = {
      id: 'http://arxiv.org/api/query',
      title: { value: 'arXiv Query Results' },
      updated: new Date('2024-01-10T12:00:00Z'),
      entries: [
        {
          id: 'http://arxiv.org/abs/2403.12345v1',
          title: { value: 'Example Paper' },
          updated: new Date('2024-03-15T12:00:00Z'),
          authors: [
            {
              name: 'John Doe',
              arxiv: {
                affiliation: 'MIT',
              },
            },
          ],
          arxiv: {
            comment: '23 pages, 8 figures',
            journalRef: 'Eur.Phys.J. C31 (2003) 17-29',
            doi: '10.1234/example',
            primaryCategory: {
              term: 'cs.LG',
              scheme: 'http://arxiv.org/schemas/atom',
              label: 'Machine Learning',
            },
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:arxiv="http://arxiv.org/schemas/atom">
  <id>http://arxiv.org/api/query</id>
  <title>arXiv Query Results</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <entry>
    <author>
      <name>John Doe</name>
      <arxiv:affiliation>MIT</arxiv:affiliation>
    </author>
    <id>http://arxiv.org/abs/2403.12345v1</id>
    <title>Example Paper</title>
    <updated>2024-03-15T12:00:00.000Z</updated>
    <arxiv:comment>23 pages, 8 figures</arxiv:comment>
    <arxiv:journal_ref>Eur.Phys.J. C31 (2003) 17-29</arxiv:journal_ref>
    <arxiv:doi>10.1234/example</arxiv:doi>
    <arxiv:primary_category term="cs.LG" scheme="http://arxiv.org/schemas/atom" label="Machine Learning"/>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with psc namespace', () => {
    const value = {
      id: 'https://example.com/podcast',
      title: { value: 'Podcast with Chapters' },
      updated: new Date('2024-01-10T12:00:00Z'),
      entries: [
        {
          id: 'https://example.com/episode/1',
          title: { value: 'Episode with Chapters' },
          updated: new Date('2024-01-05T10:30:00Z'),
          psc: {
            chapters: [
              { start: '00:00:00', title: 'Introduction' },
              { start: '00:05:30', title: 'Main Content', href: 'https://example.com/chapter2' },
            ],
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:psc="http://podlove.org/simple-chapters">
  <id>https://example.com/podcast</id>
  <title>Podcast with Chapters</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <entry>
    <id>https://example.com/episode/1</id>
    <title>Episode with Chapters</title>
    <updated>2024-01-05T10:30:00.000Z</updated>
    <psc:chapters>
      <psc:chapter start="00:00:00" title="Introduction"/>
      <psc:chapter start="00:05:30" title="Main Content" href="https://example.com/chapter2"/>
    </psc:chapters>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with wfw namespace', () => {
    const value = {
      id: 'https://example.com/blog',
      title: { value: 'Blog with Comments' },
      updated: new Date('2024-01-10T12:00:00Z'),
      entries: [
        {
          id: 'https://example.com/post/1',
          title: { value: 'Post with Comment API' },
          updated: new Date('2024-01-05T10:30:00Z'),
          wfw: {
            comment: 'https://example.com/posts/1/comment',
            commentRss: 'https://example.com/posts/1/comments/feed',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:wfw="http://wellformedweb.org/CommentAPI/">
  <id>https://example.com/blog</id>
  <title>Blog with Comments</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <entry>
    <id>https://example.com/post/1</id>
    <title>Post with Comment API</title>
    <updated>2024-01-05T10:30:00.000Z</updated>
    <wfw:comment>https://example.com/posts/1/comment</wfw:comment>
    <wfw:commentRss>https://example.com/posts/1/comments/feed</wfw:commentRss>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with pingback namespace', () => {
    const value = {
      id: 'https://example.com/blog',
      title: { value: 'Blog with Pingback' },
      updated: new Date('2024-01-10T12:00:00Z'),
      pingback: {
        to: 'https://example.com/pingback-service',
      },
      entries: [
        {
          id: 'https://example.com/post/1',
          title: { value: 'Post with Pingback' },
          updated: new Date('2024-01-05T10:30:00Z'),
          pingback: {
            server: 'https://example.com/xmlrpc.php',
            target: 'https://referenced-blog.com/article',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:pingback="http://madskills.com/public/xml/rss/module/pingback/">
  <id>https://example.com/blog</id>
  <title>Blog with Pingback</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <pingback:to>https://example.com/pingback-service</pingback:to>
  <entry>
    <id>https://example.com/post/1</id>
    <title>Post with Pingback</title>
    <updated>2024-01-05T10:30:00.000Z</updated>
    <pingback:server>https://example.com/xmlrpc.php</pingback:server>
    <pingback:target>https://referenced-blog.com/article</pingback:target>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with admin namespace', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Admin' },
      updated: new Date('2024-01-10T12:00:00Z'),
      admin: {
        errorReportsTo: 'mailto:webmaster@example.com',
        generatorAgent: 'http://www.movabletype.org/?v=3.2',
      },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Entry title' },
          updated: new Date('2024-01-05T10:30:00Z'),
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:admin="http://webns.net/mvcb/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <id>https://example.com/feed</id>
  <title>Feed with Admin</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <admin:errorReportsTo rdf:resource="mailto:webmaster@example.com"/>
  <admin:generatorAgent rdf:resource="http://www.movabletype.org/?v=3.2"/>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Entry title</title>
    <updated>2024-01-05T10:30:00.000Z</updated>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with trackback namespace', () => {
    const value = {
      id: 'https://example.com/blog',
      title: { value: 'Blog with Trackback' },
      updated: new Date('2024-01-10T12:00:00Z'),
      entries: [
        {
          id: 'https://example.com/post/1',
          title: { value: 'Post with Trackback' },
          updated: new Date('2024-01-05T10:30:00Z'),
          trackback: {
            ping: 'https://example.com/trackback/123',
            abouts: ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:trackback="http://madskills.com/public/xml/rss/module/trackback/">
  <id>https://example.com/blog</id>
  <title>Blog with Trackback</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <entry>
    <id>https://example.com/post/1</id>
    <title>Post with Trackback</title>
    <updated>2024-01-05T10:30:00.000Z</updated>
    <trackback:ping>https://example.com/trackback/123</trackback:ping>
    <trackback:about>https://blog1.com/trackback/456</trackback:about>
    <trackback:about>https://blog2.com/trackback/789</trackback:about>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with YouTube namespace', () => {
    const value = {
      id: 'yt:channel:UCuAXFkgsw1L7xaCfnd5JJOw',
      title: { value: 'YouTube Channel Feed' },
      updated: new Date('2024-01-10T12:00:00Z'),
      yt: {
        channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
      },
      entries: [
        {
          id: 'yt:video:dQw4w9WgXcQ',
          title: { value: 'Example YouTube Video' },
          updated: new Date('2024-01-05T10:30:00Z'),
          yt: {
            videoId: 'dQw4w9WgXcQ',
            channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015">
  <id>yt:channel:UCuAXFkgsw1L7xaCfnd5JJOw</id>
  <title>YouTube Channel Feed</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <yt:channelId>UCuAXFkgsw1L7xaCfnd5JJOw</yt:channelId>
  <entry>
    <id>yt:video:dQw4w9WgXcQ</id>
    <title>Example YouTube Video</title>
    <updated>2024-01-05T10:30:00.000Z</updated>
    <yt:videoId>dQw4w9WgXcQ</yt:videoId>
    <yt:channelId>UCuAXFkgsw1L7xaCfnd5JJOw</yt:channelId>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with YouTube playlist', () => {
    const value = {
      id: 'yt:playlist:PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
      title: { value: 'YouTube Playlist Feed' },
      updated: new Date('2024-01-10T12:00:00Z'),
      yt: {
        playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
      },
      entries: [
        {
          id: 'yt:video:OTYFJaT-Glk',
          title: { value: 'Video in Playlist' },
          updated: new Date('2024-01-08T14:20:00Z'),
          yt: {
            videoId: 'OTYFJaT-Glk',
            channelId: 'UCtNjkMLQQOX251hjGqimx2w',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015">
  <id>yt:playlist:PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf</id>
  <title>YouTube Playlist Feed</title>
  <updated>2024-01-10T12:00:00.000Z</updated>
  <yt:playlistId>PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf</yt:playlistId>
  <entry>
    <id>yt:video:OTYFJaT-Glk</id>
    <title>Video in Playlist</title>
    <updated>2024-01-08T14:20:00.000Z</updated>
    <yt:videoId>OTYFJaT-Glk</yt:videoId>
    <yt:channelId>UCtNjkMLQQOX251hjGqimx2w</yt:channelId>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom feed with stylesheets', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Stylesheet' },
      updated: new Date('2023-03-15T12:00:00Z'),
    }
    const options = {
      stylesheets: [{ type: 'text/xsl', href: '/styles/atom.xsl' }],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet type="text/xsl" href="/styles/atom.xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Feed with Stylesheet</title>
  <updated>2023-03-15T12:00:00.000Z</updated>
</feed>
`

    expect(generate(value, options)).toEqual(expected)
  })
})

describe('generate edge cases', () => {
  it('should accept partial feeds', () => {
    const value = {
      title: { value: 'Test Feed' },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Test Feed</title>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should accept feeds with string dates', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Test Feed' },
      updated: '2023-01-01T00:00:00.000Z',
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Test Feed</title>
  <updated>2023-01-01T00:00:00.000Z</updated>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should preserve invalid date strings', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Invalid Date' },
      updated: 'not-a-valid-date',
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Entry with invalid date' },
          updated: 'also-invalid-date',
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Feed with Invalid Date</title>
  <updated>not-a-valid-date</updated>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Entry with invalid date</title>
    <updated>also-invalid-date</updated>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should handle mixed Date objects and string dates', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Mixed Dates Feed' },
      updated: new Date('2023-01-01T00:00:00.000Z'),
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Entry with Date object' },
          updated: new Date('2023-02-01T00:00:00.000Z'),
        },
        {
          id: 'https://example.com/entry/2',
          title: { value: 'Entry with string date' },
          updated: '2023-03-01T00:00:00.000Z',
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Mixed Dates Feed</title>
  <updated>2023-01-01T00:00:00.000Z</updated>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Entry with Date object</title>
    <updated>2023-02-01T00:00:00.000Z</updated>
  </entry>
  <entry>
    <id>https://example.com/entry/2</id>
    <title>Entry with string date</title>
    <updated>2023-03-01T00:00:00.000Z</updated>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should handle deeply nested partial objects', () => {
    const value = {
      id: 'https://example.com/feed',
      title: { value: 'Feed with Nested Partials' },
      entries: [
        {
          id: 'https://example.com/entry/1',
          title: { value: 'Entry 1' },
          author: [
            {
              name: 'John Doe',
            },
          ],
          category: [
            {
              term: 'tech',
              label: 'Technology',
            },
          ],
        },
        {
          id: 'https://example.com/entry/2',
          title: { value: 'Minimal Entry' },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed</id>
  <title>Feed with Nested Partials</title>
  <entry>
    <id>https://example.com/entry/1</id>
    <title>Entry 1</title>
  </entry>
  <entry>
    <id>https://example.com/entry/2</id>
    <title>Minimal Entry</title>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })
})

describe('generate with app namespace', () => {
  it('should generate Atom feed with app namespace', () => {
    const value = {
      id: 'http://example.com/blog',
      title: { value: 'My Blog' },
      updated: new Date('2024-03-15T16:00:00Z'),
      entries: [
        {
          id: 'http://example.com/blog/post/1',
          title: { value: 'Article' },
          updated: new Date('2024-03-15T16:00:00Z'),
          app: {
            edited: new Date('2024-03-15T14:30:00Z'),
            control: {
              draft: false,
            },
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
  <id>http://example.com/blog</id>
  <title>My Blog</title>
  <updated>2024-03-15T16:00:00.000Z</updated>
  <entry>
    <id>http://example.com/blog/post/1</id>
    <title>Article</title>
    <updated>2024-03-15T16:00:00.000Z</updated>
    <app:edited>2024-03-15T14:30:00.000Z</app:edited>
    <app:control>
      <app:draft>no</app:draft>
    </app:control>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate Atom entry with draft status', () => {
    const value = {
      id: 'http://example.com/blog',
      title: { value: 'Blog' },
      updated: new Date('2024-03-15T16:00:00Z'),
      entries: [
        {
          id: 'http://example.com/blog/draft',
          title: { value: 'Draft Article' },
          updated: new Date('2024-03-15T15:00:00Z'),
          app: {
            edited: new Date('2024-03-15T15:00:00Z'),
            control: {
              draft: true,
            },
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
  <id>http://example.com/blog</id>
  <title>Blog</title>
  <updated>2024-03-15T16:00:00.000Z</updated>
  <entry>
    <id>http://example.com/blog/draft</id>
    <title>Draft Article</title>
    <updated>2024-03-15T15:00:00.000Z</updated>
    <app:edited>2024-03-15T15:00:00.000Z</app:edited>
    <app:control>
      <app:draft>yes</app:draft>
    </app:control>
  </entry>
</feed>
`

    expect(generate(value)).toEqual(expected)
  })
})
