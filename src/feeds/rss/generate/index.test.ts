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

  it('should generate RSS with itunes namespace', () => {
    const input = {
      title: 'Feed with iTunes namespace',
      description: 'Test feed with Apple Podcasts namespace',
      itunes: {
        author: 'Podcast Author',
        categories: [
          {
            text: 'Technology',
            categories: [
              {
                text: 'Tech News',
              },
            ],
          },
        ],
        explicit: false,
        type: 'episodic',
        owner: {
          name: 'Owner Name',
          email: 'owner@example.com',
        },
        image: 'https://example.com/podcast-cover.jpg',
      },
      items: [
        {
          title: 'Episode 1',
          itunes: {
            title: 'Episode 1 - Special Title',
            duration: 1800,
            episode: 1,
            season: 1,
            episodeType: 'full',
            explicit: false,
            image: 'https://example.com/episode1.jpg',
            keywords: ['tech', 'news', 'podcast'],
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Feed with iTunes namespace</title>
    <description>Test feed with Apple Podcasts namespace</description>
    <itunes:image href="https://example.com/podcast-cover.jpg"/>
    <itunes:category text="Technology">
      <itunes:category text="Tech News"/>
    </itunes:category>
    <itunes:explicit>no</itunes:explicit>
    <itunes:author>Podcast Author</itunes:author>
    <itunes:type>episodic</itunes:type>
    <itunes:owner>
      <itunes:name>Owner Name</itunes:name>
      <itunes:email>owner@example.com</itunes:email>
    </itunes:owner>
    <item>
      <title>Episode 1</title>
      <itunes:duration>1800</itunes:duration>
      <itunes:image href="https://example.com/episode1.jpg"/>
      <itunes:explicit>no</itunes:explicit>
      <itunes:title>Episode 1 - Special Title</itunes:title>
      <itunes:episode>1</itunes:episode>
      <itunes:season>1</itunes:season>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:keywords>tech,news,podcast</itunes:keywords>
    </item>
  </channel>
</rss>
`

    expect(generate(input)).toEqual(expected)
  })

  it('should generate RSS with podcast namespace', () => {
    const input = {
      title: 'Feed with podcast namespace',
      description: 'Test feed with Podcast 2.0 namespace',
      podcast: {
        guid: 'podcast-feed-guid-123',
        locked: {
          value: true,
          owner: 'owner@example.com',
        },
        fundings: [
          {
            url: 'https://example.com/support',
            display: 'Support the show',
          },
        ],
      },
      items: [
        {
          title: 'Episode 1',
          podcast: {
            episode: { number: 1 },
            season: { number: 1 },
            persons: [
              {
                display: 'Host Name',
                role: 'host',
              },
            ],
            transcripts: [
              {
                url: 'https://example.com/transcript.txt',
                type: 'text/plain',
              },
            ],
          },
        },
      ],
    }

    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>Feed with podcast namespace</title>
    <description>Test feed with Podcast 2.0 namespace</description>
    <podcast:locked owner="owner@example.com">yes</podcast:locked>
    <podcast:funding url="https://example.com/support">Support the show</podcast:funding>
    <podcast:guid>podcast-feed-guid-123</podcast:guid>
    <item>
      <title>Episode 1</title>
      <podcast:transcript url="https://example.com/transcript.txt" type="text/plain"/>
      <podcast:person role="host">Host Name</podcast:person>
      <podcast:season>1</podcast:season>
      <podcast:episode>1</podcast:episode>
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
})
