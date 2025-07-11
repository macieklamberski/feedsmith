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

  it('should generate RSS with atom namespace', () => {
    const value = {
      title: 'Feed with Atom namespace',
      description: 'Test feed with Atom namespace elements',
      atom: {
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
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Feed with Atom namespace</title>
    <description>Test feed with Atom namespace elements</description>
    <atom:link href="https://example.com/feed.xml" rel="self" type="application/atom+xml"/>
    <item>
      <title>First item</title>
      <atom:id>https://example.com/entry/1</atom:id>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with dc namespace', () => {
    const value = {
      title: 'Feed with dc namespace',
      description: 'Test feed with Dublin Core namespace',
      dc: {
        creator: 'John Doe',
      },
      items: [
        {
          title: 'First item',
          dc: {
            creator: 'Jane Smith',
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
    <item>
      <title>First item</title>
      <dc:creator>Jane Smith</dc:creator>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with dcterms namespace', () => {
    const value = {
      title: 'Feed with dcterms namespace',
      description: 'Test feed with Dublin Core Terms namespace',
      dcterms: {
        created: new Date('2023-01-01T00:00:00Z'),
        license: 'Creative Commons Attribution 4.0',
      },
      items: [
        {
          title: 'First item',
          dcterms: {
            created: new Date('2023-02-01T00:00:00Z'),
            license: 'MIT License',
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dcterms="http://purl.org/dc/terms/">
  <channel>
    <title>Feed with dcterms namespace</title>
    <description>Test feed with Dublin Core Terms namespace</description>
    <dcterms:created>2023-01-01T00:00:00.000Z</dcterms:created>
    <dcterms:license>Creative Commons Attribution 4.0</dcterms:license>
    <item>
      <title>First item</title>
      <dcterms:created>2023-02-01T00:00:00.000Z</dcterms:created>
      <dcterms:license>MIT License</dcterms:license>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with sy namespace', () => {
    const value = {
      title: 'Feed with sy namespace',
      description: 'Test feed with syndication namespace',
      sy: {
        updatePeriod: 'hourly',
      },
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
  <channel>
    <title>Feed with sy namespace</title>
    <description>Test feed with syndication namespace</description>
    <sy:updatePeriod>hourly</sy:updatePeriod>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with itunes namespace', () => {
    const value = {
      title: 'Feed with iTunes namespace',
      description: 'Test feed with Apple Podcasts namespace',
      itunes: {
        author: 'Podcast Author',
      },
      items: [
        {
          title: 'Episode 1',
          itunes: {
            title: 'Episode 1 - Special Title',
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Feed with iTunes namespace</title>
    <description>Test feed with Apple Podcasts namespace</description>
    <itunes:author>Podcast Author</itunes:author>
    <item>
      <title>Episode 1</title>
      <itunes:title>Episode 1 - Special Title</itunes:title>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with podcast namespace', () => {
    const value = {
      title: 'Feed with podcast namespace',
      description: 'Test feed with Podcast 2.0 namespace',
      podcast: {
        guid: 'podcast-feed-guid-123',
      },
      items: [
        {
          title: 'Episode 1',
          podcast: {
            episode: { number: 1 },
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>Feed with podcast namespace</title>
    <description>Test feed with Podcast 2.0 namespace</description>
    <podcast:guid>podcast-feed-guid-123</podcast:guid>
    <item>
      <title>Episode 1</title>
      <podcast:episode>1</podcast:episode>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with media namespace', () => {
    const value = {
      title: 'Feed with media namespace',
      description: 'Test feed with Media RSS namespace',
      media: {
        title: {
          value: 'Feed Media Title',
        },
      },
      items: [
        {
          title: 'Episode with Media',
          media: {
            title: {
              value: 'Media Item Title',
            },
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Feed with media namespace</title>
    <description>Test feed with Media RSS namespace</description>
    <media:title>Feed Media Title</media:title>
    <item>
      <title>Episode with Media</title>
      <media:title>Media Item Title</media:title>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with content namespace', () => {
    const value = {
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

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with slash namespace', () => {
    const value = {
      title: 'Feed with slash namespace',
      description: 'Test feed with Slash namespace',
      items: [
        {
          title: 'First item',
          slash: {
            section: 'Technology',
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
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with thr namespace', () => {
    const value = {
      title: 'Feed with thr namespace',
      description: 'Test feed with Threading namespace',
      items: [
        {
          title: 'Discussion post',
          thr: {
            total: 42,
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
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with georss namespace', () => {
    const value = {
      title: 'Feed with georss namespace',
      description: 'Test feed with GeoRSS namespace',
      georss: {
        point: { lat: 45.256, lng: -71.92 },
      },
      items: [
        {
          title: 'Location item',
          georss: {
            point: { lat: 42.3601, lng: -71.0589 },
            featureName: 'Boston',
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:georss="http://www.georss.org/georss/">
  <channel>
    <title>Feed with georss namespace</title>
    <description>Test feed with GeoRSS namespace</description>
    <georss:point>45.256 -71.92</georss:point>
    <item>
      <title>Location item</title>
      <georss:point>42.3601 -71.0589</georss:point>
      <georss:featureName>Boston</georss:featureName>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })
})
