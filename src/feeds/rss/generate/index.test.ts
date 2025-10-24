import { describe, expect, it } from 'bun:test'
import type { DateLike, DeepPartial } from '../../../common/types.js'
import type { Rss } from '../common/types.js'
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

  it('should correctly generate elements with attributes and CDATA content', () => {
    const value = {
      title: 'CDATA with Attributes Test',
      description: 'Test feed for CDATA nesting fix',
      items: [
        {
          title: 'Test Item',
          categories: [
            {
              name: 'Technology & Science',
              domain: 'example.com',
            },
          ],
          media: {
            description: {
              value: '<p>HTML content with <strong>tags</strong> & special chars</p>',
              type: 'html',
            },
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>CDATA with Attributes Test</title>
    <description>Test feed for CDATA nesting fix</description>
    <item>
      <title>Test Item</title>
      <category domain="example.com">
        <![CDATA[Technology & Science]]>
      </category>
      <media:description type="html">
        <![CDATA[<p>HTML content with <strong>tags</strong> & special chars</p>]]>
      </media:description>
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
<rss version="2.0" xmlns:georss="http://www.georss.org/georss">
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

  it('should generate RSS with wfw namespace', () => {
    const value = {
      title: 'Feed with wfw namespace',
      description: 'Test feed with Well-Formed Web namespace',
      items: [
        {
          title: 'Item with comments',
          wfw: {
            comment: 'https://example.com/posts/item1/comment',
            commentRss: 'https://example.com/posts/item1/comments/feed',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:wfw="http://wellformedweb.org/CommentAPI/">
  <channel>
    <title>Feed with wfw namespace</title>
    <description>Test feed with Well-Formed Web namespace</description>
    <item>
      <title>Item with comments</title>
      <wfw:comment>https://example.com/posts/item1/comment</wfw:comment>
      <wfw:commentRss>https://example.com/posts/item1/comments/feed</wfw:commentRss>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with source namespace', () => {
    const value = {
      title: 'Feed with source namespace',
      description: 'Test feed with Source namespace',
      sourceNs: {
        accounts: [{ service: 'twitter', value: 'johndoe' }, { service: 'github' }],
        likes: { server: 'http://likes.example.com/' },
        blogroll: 'https://blog.example.com/blogroll.opml',
      },
      items: [
        {
          title: 'Item with source metadata',
          sourceNs: {
            markdown: '# Example Post - This is markdown content for the post.',
            outlines: ['<outline text="Section 1"/>', '<outline text="Section 2"/>'],
            localTime: '2024-01-15 10:30:00',
            linkFull: 'https://example.com/posts/full-version',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:source="http://source.scripting.com/">
  <channel>
    <title>Feed with source namespace</title>
    <description>Test feed with Source namespace</description>
    <source:account service="twitter">johndoe</source:account>
    <source:account service="github"/>
    <source:likes server="http://likes.example.com/"/>
    <source:blogroll>https://blog.example.com/blogroll.opml</source:blogroll>
    <item>
      <title>Item with source metadata</title>
      <source:markdown># Example Post - This is markdown content for the post.</source:markdown>
      <source:outline>
        <![CDATA[<outline text="Section 1"/>]]>
      </source:outline>
      <source:outline>
        <![CDATA[<outline text="Section 2"/>]]>
      </source:outline>
      <source:localTime>2024-01-15 10:30:00</source:localTime>
      <source:linkFull>https://example.com/posts/full-version</source:linkFull>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with ccREL namespace', () => {
    const value = {
      title: 'Feed with ccREL namespace',
      description: 'Test feed with ccREL namespace',
      cc: {
        license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        morePermissions: 'https://example.com/commercial-license',
      },
      items: [
        {
          title: 'Item with ccREL',
          cc: {
            license: 'https://creativecommons.org/licenses/by/4.0/',
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:cc="http://creativecommons.org/ns#">
  <channel>
    <title>Feed with ccREL namespace</title>
    <description>Test feed with ccREL namespace</description>
    <cc:license>https://creativecommons.org/licenses/by-nc-sa/4.0/</cc:license>
    <cc:morePermissions>https://example.com/commercial-license</cc:morePermissions>
    <item>
      <title>Item with ccREL</title>
      <cc:license>https://creativecommons.org/licenses/by/4.0/</cc:license>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with creativecommons namespace', () => {
    const value = {
      title: 'Feed with creativecommons namespace',
      description: 'Test feed with Creative Commons namespace',
      creativeCommons: {
        license: 'http://creativecommons.org/licenses/by-nc-nd/2.0/',
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:creativeCommons="http://backend.userland.com/creativeCommonsRssModule">
  <channel>
    <title>Feed with creativecommons namespace</title>
    <description>Test feed with Creative Commons namespace</description>
    <creativeCommons:license>http://creativecommons.org/licenses/by-nc-nd/2.0/</creativeCommons:license>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with feedpress namespace', () => {
    const value = {
      title: 'Feed with feedpress namespace',
      description: 'Test feed with FeedPress namespace',
      feedpress: {
        link: 'https://feed.press/example',
        newsletterId: '12345',
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:feedpress="https://feed.press/xmlns">
  <channel>
    <title>Feed with feedpress namespace</title>
    <description>Test feed with FeedPress namespace</description>
    <feedpress:link>https://feed.press/example</feedpress:link>
    <feedpress:newsletterId>12345</feedpress:newsletterId>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with psc namespace', () => {
    const value = {
      title: 'Feed with psc namespace',
      description: 'Test feed with Podlove Simple Chapters',
      items: [
        {
          title: 'Episode with chapters',
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
<rss version="2.0" xmlns:psc="http://podlove.org/simple-chapters">
  <channel>
    <title>Feed with psc namespace</title>
    <description>Test feed with Podlove Simple Chapters</description>
    <item>
      <title>Episode with chapters</title>
      <psc:chapters>
        <psc:chapter start="00:00:00" title="Introduction"/>
        <psc:chapter start="00:05:30" title="Main Content" href="https://example.com/chapter2"/>
      </psc:chapters>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with rawvoice namespace', () => {
    const value = {
      title: 'Feed with rawvoice namespace',
      description: 'Test feed with RawVoice namespace',
      rawvoice: {
        rating: {
          value: 'TV-PG',
        },
        frequency: 'weekly',
      },
      items: [
        {
          title: 'Episode with poster',
          rawvoice: {
            poster: {
              url: 'https://example.com/poster.jpg',
            },
          },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:rawvoice="https://blubrry.com/developer/rawvoice-rss">
  <channel>
    <title>Feed with rawvoice namespace</title>
    <description>Test feed with RawVoice namespace</description>
    <rawvoice:rating>TV-PG</rawvoice:rating>
    <rawvoice:frequency>weekly</rawvoice:frequency>
    <item>
      <title>Episode with poster</title>
      <rawvoice:poster url="https://example.com/poster.jpg"/>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS with spotify namespace', () => {
    const value = {
      title: 'Feed with spotify namespace',
      description: 'Test feed with Spotify namespace',
      spotify: {
        countryOfOrigin: 'US',
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:spotify="http://www.spotify.com/ns/rss">
  <channel>
    <title>Feed with spotify namespace</title>
    <description>Test feed with Spotify namespace</description>
    <spotify:countryOfOrigin>US</spotify:countryOfOrigin>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })

  it('should generate RSS feed with stylesheets', () => {
    const value = {
      title: 'Feed with Stylesheet',
      description: 'Test feed with stylesheet support',
    }
    const options = {
      stylesheets: [{ type: 'text/xsl', href: '/styles/rss.xsl' }],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet type="text/xsl" href="/styles/rss.xsl"?>
<rss version="2.0">
  <channel>
    <title>Feed with Stylesheet</title>
    <description>Test feed with stylesheet support</description>
  </channel>
</rss>
`

    expect(generate(value, options)).toEqual(expected)
  })

  it('should generate RSS feed with multiple enclosures per item', () => {
    const value = {
      title: 'Podcast with Multiple Media Files',
      description: 'A podcast that provides multiple formats',
      items: [
        {
          title: 'Episode 1: Getting Started',
          link: 'https://example.com/episode1',
          description: 'First episode with audio, video, and transcript',
          enclosures: [
            {
              url: 'https://example.com/ep1-audio.mp3',
              length: 15000000,
              type: 'audio/mpeg',
            },
            {
              url: 'https://example.com/ep1-video.mp4',
              length: 50000000,
              type: 'video/mp4',
            },
            {
              url: 'https://example.com/ep1-transcript.pdf',
              length: 500000,
              type: 'application/pdf',
            },
          ],
          pubDate: new Date('2024-01-01T12:00:00Z'),
          guid: { value: 'https://example.com/episode1' },
        },
        {
          title: 'Episode 2: Advanced Topics',
          link: 'https://example.com/episode2',
          description: 'Second episode with multiple audio formats',
          enclosures: [
            {
              url: 'https://example.com/ep2-high.mp3',
              length: 20000000,
              type: 'audio/mpeg',
            },
            {
              url: 'https://example.com/ep2-low.mp3',
              length: 8000000,
              type: 'audio/mpeg',
            },
          ],
          pubDate: new Date('2024-01-08T12:00:00Z'),
          guid: { value: 'https://example.com/episode2' },
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>Podcast with Multiple Media Files</title>
    <description>A podcast that provides multiple formats</description>
    <item>
      <title>Episode 1: Getting Started</title>
      <link>https://example.com/episode1</link>
      <description>First episode with audio, video, and transcript</description>
      <enclosure url="https://example.com/ep1-audio.mp3" length="15000000" type="audio/mpeg"/>
      <enclosure url="https://example.com/ep1-video.mp4" length="50000000" type="video/mp4"/>
      <enclosure url="https://example.com/ep1-transcript.pdf" length="500000" type="application/pdf"/>
      <guid>https://example.com/episode1</guid>
      <pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Episode 2: Advanced Topics</title>
      <link>https://example.com/episode2</link>
      <description>Second episode with multiple audio formats</description>
      <enclosure url="https://example.com/ep2-high.mp3" length="20000000" type="audio/mpeg"/>
      <enclosure url="https://example.com/ep2-low.mp3" length="8000000" type="audio/mpeg"/>
      <guid>https://example.com/episode2</guid>
      <pubDate>Mon, 08 Jan 2024 12:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
`

    expect(generate(value)).toEqual(expected)
  })
})

describe('generate with lenient mode', () => {
  it('should accept partial feeds with lenient: true', () => {
    const value: DeepPartial<Rss.Feed<DateLike>> = {
      title: 'Test Feed',
      // Missing required 'description' field.
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
  </channel>
</rss>
`

    expect(generate(value, { lenient: true })).toEqual(expected)
  })

  it('should accept feeds with string dates in lenient mode', () => {
    const value: DeepPartial<Rss.Feed<DateLike>> = {
      title: 'Test Feed',
      description: 'Test Description',
      pubDate: '2023-01-01T00:00:00.000Z',
      items: [
        {
          title: 'Test Item',
          pubDate: 'Mon, 01 Jan 2023 12:00:00 GMT',
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <description>Test Description</description>
    <pubDate>Sun, 01 Jan 2023 00:00:00 GMT</pubDate>
    <item>
      <title>Test Item</title>
      <pubDate>Sun, 01 Jan 2023 12:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
`

    expect(generate(value, { lenient: true })).toEqual(expected)
  })

  it('should preserve invalid date strings in lenient mode', () => {
    const value: DeepPartial<Rss.Feed<DateLike>> = {
      title: 'Test Feed',
      description: 'Test Description',
      pubDate: 'not-a-valid-date',
      items: [
        {
          title: 'Test Item',
          pubDate: 'also-invalid-date',
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <description>Test Description</description>
    <pubDate>not-a-valid-date</pubDate>
    <item>
      <title>Test Item</title>
      <pubDate>also-invalid-date</pubDate>
    </item>
  </channel>
</rss>
`

    expect(generate(value, { lenient: true })).toEqual(expected)
  })

  it('should handle deeply nested partial objects', () => {
    const value: DeepPartial<Rss.Feed<DateLike>> = {
      title: 'Test Feed',
      items: [
        {
          title: 'Item 1',
          guid: {
            value: 'guid-1',
          },
        },
      ],
      image: {
        url: 'https://example.com/image.png',
        title: 'Image Title',
        link: 'https://example.com',
      },
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <image>
      <url>https://example.com/image.png</url>
      <title>Image Title</title>
      <link>https://example.com</link>
    </image>
    <item>
      <title>Item 1</title>
      <guid>guid-1</guid>
    </item>
  </channel>
</rss>
`

    expect(generate(value, { lenient: true })).toEqual(expected)
  })

  it('should handle mixed Date objects and string dates', () => {
    const value: DeepPartial<Rss.Feed<DateLike>> = {
      title: 'Mixed Dates Feed',
      description: 'Feed with both Date objects and strings',
      pubDate: new Date('2023-01-01T00:00:00.000Z'),
      lastBuildDate: '2023-06-01T00:00:00.000Z',
      items: [
        {
          title: 'Item with Date object',
          pubDate: new Date('2023-02-01T00:00:00.000Z'),
        },
        {
          title: 'Item with string date',
          pubDate: '2023-03-01T00:00:00.000Z',
        },
      ],
    }
    const expected = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>Mixed Dates Feed</title>
    <description>Feed with both Date objects and strings</description>
    <pubDate>Sun, 01 Jan 2023 00:00:00 GMT</pubDate>
    <lastBuildDate>Thu, 01 Jun 2023 00:00:00 GMT</lastBuildDate>
    <item>
      <title>Item with Date object</title>
      <pubDate>Wed, 01 Feb 2023 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Item with string date</title>
      <pubDate>Wed, 01 Mar 2023 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
`

    expect(generate(value, { lenient: true })).toEqual(expected)
  })
})
