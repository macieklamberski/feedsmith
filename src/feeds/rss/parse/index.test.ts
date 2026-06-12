import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { DetectError, MalformedError, ParseError } from '../../../common/errors.js'
import { parse } from './index.js'

describe('parse', () => {
  const versions = {
    '090': '0.90',
    '091': '0.91',
    '092': '0.92',
    '093': '0.93',
    '094': '0.94',
    '20': '2.0',
    ns: 'with namespaces',
  }

  for (const [key, label] of Object.entries(versions)) {
    it(`should correctly parse RSS ${label}`, async () => {
      const reference = `${import.meta.dir}/../references/rss-${key}`
      const input = await Bun.file(`${reference}.xml`).text()
      const expected = await Bun.file(`${reference}.json`).json()

      expect(parse(input)).toEqual(expected)
    })
  }

  it('should correctly parse RSS with mixed case tags', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <rSs version="2.0">
        <ChAnNeL>
          <TiTlE>Mixed Case Feed</TiTlE>
          <LiNk>https://example.com/</LiNk>
          <DeScRiPtIoN>A test feed with mixed case tags</DeScRiPtIoN>
          <category DOMAin="http://www.example.com/cusips">Cat 1</category>
          <ITEM>
            <TiTlE>First Item</TiTlE>
            <LiNk>https://example.com/item1</LiNk>
            <DeScRiPtIoN>Description of first item</DeScRiPtIoN>
            <PuBdAtE>Mon, 01 Jan 2024 12:00:00 GMT</PuBdAtE>
          </ITEM>
          <item>
            <title>Second Item</title>
            <link>https://example.com/item2</link>
            <description>Description of second item</description>
            <pubDate>Tue, 02 Jan 2024 12:00:00 GMT</pubDate>
          </item>
        </ChAnNeL>
      </rSs>
    `
    const expected = {
      title: 'Mixed Case Feed',
      link: 'https://example.com/',
      description: 'A test feed with mixed case tags',
      categories: [{ name: 'Cat 1', domain: 'http://www.example.com/cusips' }],
      items: [
        {
          title: 'First Item',
          link: 'https://example.com/item1',
          description: 'Description of first item',
          pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT',
        },
        {
          title: 'Second Item',
          link: 'https://example.com/item2',
          description: 'Description of second item',
          pubDate: 'Tue, 02 Jan 2024 12:00:00 GMT',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle alternating case items', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>Test Feed</title>
          <link>https://example.com</link>
          <description>Testing alternating case items</description>
          <item>
            <title>First</title>
          </item>
          <ITEM>
            <title>Second</title>
          </ITEM>
          <item>
            <title>Third</title>
          </item>
        </channel>
      </rss>
    `
    const expected = {
      title: 'Test Feed',
      link: 'https://example.com',
      description: 'Testing alternating case items',
      items: [{ title: 'First' }, { title: 'Second' }, { title: 'Third' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse RSS feed with multiple enclosures per item', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>Podcast with Multiple Media Files</title>
          <link>https://example.com</link>
          <description>A podcast that provides multiple formats</description>
          <item>
            <title>Episode 1: Getting Started</title>
            <link>https://example.com/episode1</link>
            <description>First episode with audio, video, and transcript</description>
            <enclosure url="https://example.com/ep1-audio.mp3" length="15000000" type="audio/mpeg"/>
            <enclosure url="https://example.com/ep1-video.mp4" length="50000000" type="video/mp4"/>
            <enclosure url="https://example.com/ep1-transcript.pdf" length="500000" type="application/pdf"/>
            <pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
            <guid>https://example.com/episode1</guid>
          </item>
          <item>
            <title>Episode 2: Advanced Topics</title>
            <link>https://example.com/episode2</link>
            <description>Second episode with multiple audio formats</description>
            <enclosure url="https://example.com/ep2-high.mp3" length="20000000" type="audio/mpeg"/>
            <enclosure url="https://example.com/ep2-low.mp3" length="8000000" type="audio/mpeg"/>
            <pubDate>Mon, 08 Jan 2024 12:00:00 GMT</pubDate>
            <guid>https://example.com/episode2</guid>
          </item>
        </channel>
      </rss>
    `
    const expected = {
      title: 'Podcast with Multiple Media Files',
      link: 'https://example.com',
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
          pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT',
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
          pubDate: 'Mon, 08 Jan 2024 12:00:00 GMT',
          guid: { value: 'https://example.com/episode2' },
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should throw error for invalid input', () => {
    const throwing = () => parse('not a feed')

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle null input', () => {
    const throwing = () => parse(null)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle undefined input', () => {
    const throwing = () => parse(undefined)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle array input', () => {
    const throwing = () => parse([])

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle empty object input', () => {
    const throwing = () => parse({})

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle empty string input', () => {
    const throwing = () => parse('')

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle whitespace-only string input', () => {
    const throwing = () => parse('   \n  ')

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle number input', () => {
    const throwing = () => parse(123)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  describe('error types', () => {
    it('should throw DetectError for non-feed input', () => {
      const throwing = () => parse('not a feed')

      expect(throwing).toThrowError(DetectError)
      expect(throwing).toThrowError(locales.invalidFeedFormat)
    })

    it('should throw MalformedError for malformed XML', () => {
      const value = `
        <?xml version="1.0"?>
        <rss version="2.0">
          <channel>
            <title>Test</title
          </channel>
        </rss>
      `
      const throwing = () => parse(value)

      expect(throwing).toThrowError(MalformedError)
      expect(throwing).toThrowError(locales.invalidFeedFormat)
    })

    it('should throw ParseError for valid XML with invalid structure', () => {
      const value = '<rss version="2.0"></rss>'
      const throwing = () => parse(value)

      expect(throwing).toThrowError(ParseError)
      expect(throwing).toThrowError(locales.invalidFeedFormat)
    })
  })

  it('should handle non-standard atom namespace prefix', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rss
        version="2.0"
        xmlns:a10="http://www.w3.org/2005/Atom"
      >
        <channel>
          <title>Test Feed</title>
          <link>https://example.com</link>
          <description>Test feed description</description>
          <a10:link href="https://example.com/feed" rel="self" />
          <item>
            <title>Test Item</title>
            <link>https://example.com/item1</link>
            <description>Test item description</description>
            <a10:link href="https://example.com/item1" rel="alternate" />
          </item>
        </channel>
      </rss>
    `
    const expected = {
      title: 'Test Feed',
      link: 'https://example.com',
      description: 'Test feed description',
      atom: {
        links: [{ href: 'https://example.com/feed', rel: 'self' }],
      },
      items: [
        {
          title: 'Test Item',
          link: 'https://example.com/item1',
          description: 'Test item description',
          atom: {
            links: [{ href: 'https://example.com/item1', rel: 'alternate' }],
          },
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  describe('namespace normalization integration', () => {
    it('should handle feeds with no namespaces', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Simple Feed</title>
            <link>http://example.com</link>
            <description>Simple Description</description>
            <item>
              <title>Simple Item</title>
              <link>http://example.com/item</link>
              <description>Simple Item Description</description>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Simple Feed',
        link: 'http://example.com',
        description: 'Simple Description',
        items: [
          {
            title: 'Simple Item',
            link: 'http://example.com/item',
            description: 'Simple Item Description',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should normalize custom prefixes to standard prefixes', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0" xmlns:custom="http://purl.org/dc/elements/1.1/">
          <channel>
            <title>RSS Feed</title>
            <link>http://example.com</link>
            <description>RSS Feed Description</description>
            <item>
              <title>Item Title</title>
              <link>http://example.com/item</link>
              <description>Item Description</description>
              <custom:creator>John Doe</custom:creator>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'RSS Feed',
        link: 'http://example.com',
        description: 'RSS Feed Description',
        items: [
          {
            title: 'Item Title',
            link: 'http://example.com/item',
            description: 'Item Description',
            dc: {
              creators: ['John Doe'],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle namespace declarations in nested elements', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>RSS Feed</title>
            <link>http://example.com</link>
            <description>RSS Feed Description</description>
            <item xmlns:dc="http://purl.org/dc/elements/1.1/">
              <title>Item Title</title>
              <link>http://example.com/item1</link>
              <description>Item Description</description>
              <dc:creator>John Doe</dc:creator>
              <dc:date>2023-01-01</dc:date>
            </item>
            <item>
              <title>Item Without Namespace</title>
              <link>http://example.com/item2</link>
              <description>Item Description</description>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'RSS Feed',
        link: 'http://example.com',
        description: 'RSS Feed Description',
        items: [
          {
            title: 'Item Title',
            link: 'http://example.com/item1',
            description: 'Item Description',
            dc: {
              creators: ['John Doe'],
              dates: ['2023-01-01'],
            },
          },
          {
            title: 'Item Without Namespace',
            link: 'http://example.com/item2',
            description: 'Item Description',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle mixed case with namespace logic', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <RSS version="2.0" xmlns:DC="http://purl.org/dc/elements/1.1/">
          <Channel>
            <TITLE>Feed Title</TITLE>
            <LINK>http://example.com</LINK>
            <DESCRIPTION>Feed Description</DESCRIPTION>
            <Item>
              <Title>Item Title</Title>
              <Link>http://example.com/item</Link>
              <Description>Item Description</Description>
              <DC:Creator>John Doe</DC:Creator>
            </Item>
          </Channel>
        </RSS>
      `
      const expected = {
        title: 'Feed Title',
        link: 'http://example.com',
        description: 'Feed Description',
        items: [
          {
            title: 'Item Title',
            link: 'http://example.com/item',
            description: 'Item Description',
            dc: {
              creators: ['John Doe'],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle self-closing elements with namespace declarations', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>RSS Feed</title>
            <link>http://example.com</link>
            <description>RSS Feed Description</description>
            <item>
              <title>Item 1</title>
              <link>http://example.com/item1</link>
              <description>Item Description</description>
              <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="http://example.com/thumb.jpg"/>
            </item>
            <item>
              <title>Item 2</title>
              <link>http://example.com/item2</link>
              <description>No media namespace here</description>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'RSS Feed',
        link: 'http://example.com',
        description: 'RSS Feed Description',
        items: [
          {
            title: 'Item 1',
            link: 'http://example.com/item1',
            description: 'Item Description',
            media: {
              thumbnails: [
                {
                  url: 'http://example.com/thumb.jpg',
                },
              ],
            },
          },
          {
            title: 'Item 2',
            link: 'http://example.com/item2',
            description: 'No media namespace here',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle namespace URIs with leading/trailing whitespace', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss
          version="2.0"
          xmlns:dc="  http://purl.org/dc/elements/1.1/  "
          xmlns:media=" http://search.yahoo.com/mrss/ "
          xmlns:content="	http://purl.org/rss/1.0/modules/content/	"
        >
          <channel>
            <title>RSS Feed</title>
            <link>http://example.com</link>
            <description>RSS Feed Description</description>
            <item>
              <title>Item Title</title>
              <link>http://example.com/item</link>
              <description>Item Description</description>
              <dc:creator>John Doe</dc:creator>
              <dc:date>2023-01-01</dc:date>
              <media:title>Media Title</media:title>
              <content:encoded><![CDATA[<p>HTML content</p>]]></content:encoded>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'RSS Feed',
        link: 'http://example.com',
        description: 'RSS Feed Description',
        items: [
          {
            title: 'Item Title',
            link: 'http://example.com/item',
            description: 'Item Description',
            dc: {
              creators: ['John Doe'],
              dates: ['2023-01-01'],
            },
            media: {
              title: {
                value: 'Media Title',
              },
            },
            content: {
              encoded: '<p>HTML content</p>',
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle malformed namespace declarations gracefully', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss
          version="2.0"
          xmlns:123="http://example.com/invalid"
          xmlns:="http://example.com/empty"
          xmlns:dc=""
        >
          <channel>
            <title>RSS Feed</title>
            <link>http://example.com</link>
            <description>Feed with malformed namespaces</description>
            <item>
              <title>Item Title</title>
              <dc:creator>Should not be normalized (empty URI)</dc:creator>
              <123:field>Invalid prefix starting with number</123:field>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'RSS Feed',
        link: 'http://example.com',
        description: 'Feed with malformed namespaces',
        items: [
          {
            title: 'Item Title',
            dc: {
              creators: ['Should not be normalized (empty URI)'],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle conflicting namespace usage', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>RSS Feed</title>
            <link>http://example.com</link>
            <description>Feed with conflicting namespaces</description>
            <item xmlns:content="http://example.com/wrong-content-namespace/">
              <title>Item with wrong content namespace</title>
              <content:encoded>This uses wrong (unknown) namespace URI</content:encoded>
            </item>
            <item xmlns:content="http://purl.org/rss/1.0/modules/content/">
              <title>Item with correct content namespace</title>
              <content:encoded><![CDATA[<p>Correct namespace</p>]]></content:encoded>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'RSS Feed',
        link: 'http://example.com',
        description: 'Feed with conflicting namespaces',
        items: [
          {
            title: 'Item with wrong content namespace',
            content: {
              encoded: 'This uses wrong (unknown) namespace URI',
            },
          },
          {
            title: 'Item with correct content namespace',
            content: {
              encoded: '<p>Correct namespace</p>',
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle missing required elements gracefully', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss
          version="2.0"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
        >
          <channel>
            <!-- Missing required title, link, description -->
            <item>
              <!-- Item with only namespaced elements -->
              <dc:creator>John Doe</dc:creator>
              <dc:date>2023-01-01</dc:date>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        items: [
          {
            dc: {
              creators: ['John Doe'],
              dates: ['2023-01-01'],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    describe('non-standard namespace URIs', () => {
      it('should work with HTTPS variant and custom prefix', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dublincore="https://purl.org/dc/elements/1.1/">
            <channel>
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
              <item>
                <title>Item</title>
                <dublincore:creator>John</dublincore:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
                creators: ['John'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should work without trailing slash and custom prefix', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dublincore="http://purl.org/dc/elements/1.1">
            <channel>
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
              <item>
                <title>Item</title>
                <dublincore:creator>John</dublincore:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
                creators: ['John'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should work with uppercase URI and custom prefix', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dublincore="HTTP://PURL.ORG/DC/ELEMENTS/1.1/">
            <channel>
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
              <item>
                <title>Item</title>
                <dublincore:creator>John</dublincore:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
                creators: ['John'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should work with mixed case URI and custom prefix', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dublincore="Http://Purl.Org/Dc/Elements/1.1/">
            <channel>
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
              <item>
                <title>Item</title>
                <dublincore:creator>John</dublincore:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
                creators: ['John'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should work with uppercase HTTPS URI and custom prefix', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dublincore="HTTPS://PURL.ORG/DC/ELEMENTS/1.1/">
            <channel>
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
              <item>
                <title>Item</title>
                <dublincore:creator>John</dublincore:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
                creators: ['John'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should work with URI containing whitespace around it', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dublincore="  http://purl.org/dc/elements/1.1/ ">
            <channel>
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
              <item>
                <title>Item</title>
                <dublincore:creator>John</dublincore:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
                creators: ['John'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should work with DC Terms namespace', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dcterms="http://purl.org/dc/terms/">
            <channel>
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
              <item>
                <title>Item</title>
                <dcterms:creator>Jane Doe</dcterms:creator>
                <dcterms:title>DC Terms Title</dcterms:title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dcterms: {
                creators: ['Jane Doe'],
                titles: ['DC Terms Title'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })
  })

  // Edge cases and quirks observed in feeds found in the wild.
  describe('real world feeds', () => {
    it('should preserve HTML entities inside CDATA in content:encoded (RW-C01)', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
          <channel>
            <title>Test Blog</title>
            <link>https://example.com</link>
            <description>A test blog</description>
            <item>
              <title>How to use the link element</title>
              <link>https://example.com/post</link>
              <content:encoded><![CDATA[<p>Use <code>&lt;link rel="alternate"&gt;</code> in your HTML.</p>]]></content:encoded>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Test Blog',
        link: 'https://example.com',
        description: 'A test blog',
        items: [
          {
            title: 'How to use the link element',
            link: 'https://example.com/post',
            content: {
              encoded: '<p>Use <code>&lt;link rel="alternate"&gt;</code> in your HTML.</p>',
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    describe('author', () => {
      it('should parse item author in RFC 2822 format (RW-M03)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test Blog</title>
              <link>https://example.com</link>
              <description>A test blog</description>
              <item>
                <title>Test Post</title>
                <author>john@example.com (John Doe)</author>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test Blog',
          link: 'https://example.com',
          description: 'A test blog',
          items: [
            {
              title: 'Test Post',
              authors: [{ email: 'john@example.com', name: 'John Doe' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse item author with nested name element (RW-M03)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test Blog</title>
              <link>https://example.com</link>
              <description>A test blog</description>
              <item>
                <title>Test Post</title>
                <author><name>John Doe</name></author>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test Blog',
          link: 'https://example.com',
          description: 'A test blog',
          items: [
            {
              title: 'Test Post',
              authors: [{ name: 'John Doe' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('character encoding', () => {
      it('should decode HTML numeric character references in text (RW-E01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Caf&#233; Culture</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Café Culture' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode hex numeric character references (RW-E02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Caf&#xE9; Culture</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Café Culture' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode named HTML entities in text (RW-E03)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>News &ndash; Update</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'News \u2013 Update' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should single-decode double-encoded entities (RW-E04)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Tom &amp;amp; Jerry</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Tom &amp; Jerry' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode multiple entity types in a single field (RW-E05)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Price: &#36;5 &amp; &#x20AC;4</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Price: $5 & \u20AC4' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('cdata handling', () => {
      it('should handle mixed CDATA and regular text in same element (RW-C05)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title><![CDATA[Hello]]> &amp; World</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Hello & World' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle empty CDATA section (RW-C02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description><![CDATA[]]></description>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle CDATA in title element (RW-C02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title><![CDATA[Test & Blog]]></title>
              <link>https://example.com</link>
              <description>Test</description>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test & Blog',
          link: 'https://example.com',
          description: 'Test',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve HTML entities inside CDATA verbatim per XML spec (RW-C12)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title><![CDATA[Jahresr&uuml;ckblick 2017]]></title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Jahresr&uuml;ckblick 2017',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle CDATA preceded by whitespace and newlines (RW-C11)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <description>
                  <![CDATA[<p>Actual content here</p>]]>
                </description>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              description: '<p>Actual content here</p>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve entities inside CDATA without decoding (RW-C01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <content:encoded><![CDATA[Use &amp; for ampersands]]></content:encoded>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              content: { encoded: 'Use &amp; for ampersands' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('escaped cdata', () => {
      it('should preserve entity-escaped CDATA markers as literal text (RW-C10)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <description>&lt;![CDATA[Some escaped CDATA content]]&gt;</description>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              description: '<![CDATA[Some escaped CDATA content]]>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('content and description', () => {
      it('should parse both content:encoded and description independently (RW-D01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <description>Short summary</description>
                <content:encoded><![CDATA[<p>Full HTML content</p>]]></content:encoded>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              description: 'Short summary',
              content: { encoded: '<p>Full HTML content</p>' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle empty self-closing description tag (RW-D02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description/>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle whitespace-only description (RW-D03)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>   </description>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode escaped HTML in description (RW-D04)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <description>&lt;p&gt;HTML content&lt;/p&gt;</description>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              description: '<p>HTML content</p>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('link and URL handling', () => {
      it('should preserve relative URLs as-is (RW-L01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <link>/blog/post-1</link>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              link: '/blog/post-1',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle URLs with encoded ampersands in query parameters (RW-L02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <link>https://example.com/search?q=hello&amp;lang=en</link>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              link: 'https://example.com/search?q=hello&lang=en',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse atom:link in RSS feed (RW-L03)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <atom:link href="https://example.com/feed.xml" rel="self" type="application/rss+xml"/>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          atom: {
            links: [
              { href: 'https://example.com/feed.xml', rel: 'self', type: 'application/rss+xml' },
            ],
          },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse plain link when mixed with attribute-only link elements (RW-L12)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <link href="https://example.com/rss" rel="self" type="application/rss+xml"/>
              <atom:link href="https://example.com/rss" rel="self" type="application/rss+xml"/>
              <description>Test</description>
              <item>
                <title>Post</title>
                <link>https://example.com/post/1</link>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          atom: {
            links: [{ href: 'https://example.com/rss', rel: 'self', type: 'application/rss+xml' }],
          },
          items: [
            {
              title: 'Post',
              link: 'https://example.com/post/1',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('multiple elements', () => {
      it('should parse multiple enclosures (RW-M01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Episode 1</title>
                <enclosure url="https://example.com/audio.mp3" type="audio/mpeg" length="12345"/>
                <enclosure url="https://example.com/audio.ogg" type="audio/ogg" length="23456"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Episode 1',
              enclosures: [
                { url: 'https://example.com/audio.mp3', type: 'audio/mpeg', length: 12345 },
                { url: 'https://example.com/audio.ogg', type: 'audio/ogg', length: 23456 },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse multiple categories with domains (RW-M02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <category>Technology</category>
                <category domain="https://example.com/tags">JavaScript</category>
                <category domain="https://example.com/tags">TypeScript</category>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              categories: [
                { name: 'Technology' },
                { name: 'JavaScript', domain: 'https://example.com/tags' },
                { name: 'TypeScript', domain: 'https://example.com/tags' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse multiple authors (RW-M03)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <author>alice@example.com (Alice)</author>
                <author>bob@example.com (Bob)</author>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              authors: [
                { email: 'alice@example.com', name: 'Alice' },
                { email: 'bob@example.com', name: 'Bob' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('missing and empty elements', () => {
      it('should parse feed with no items (RW-N01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Empty Feed</title>
              <link>https://example.com</link>
              <description>No items here</description>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Empty Feed',
          link: 'https://example.com',
          description: 'No items here',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse item with only description (RW-N02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <description>Just a description, no title or link</description>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ description: 'Just a description, no title or link' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle self-closing empty tags gracefully (RW-N03)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <author/>
                <category/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse feed with minimal channel info (RW-N06)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Minimal</title>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Minimal',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should throw for empty channel container (RW-N14)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel></channel>
          </rss>
        `
        const throwing = () => parse(value)

        expect(throwing).toThrowError(ParseError)
      })

      it('should parse RSS feed with no channel title (RW-N16)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <link>https://example.com</link>
              <description>A feed without a title</description>
              <item>
                <title>Post</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          link: 'https://example.com',
          description: 'A feed without a title',
          items: [{ title: 'Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should treat empty guid element as absent (RW-N18)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <guid></guid>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('attribute handling', () => {
      it('should parse guid with isPermaLink false (RW-A01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <guid isPermaLink="false">unique-id-123</guid>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              guid: { value: 'unique-id-123', isPermaLink: false },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse guid with uppercase isPermaLink value (RW-A02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <guid isPermaLink="False">unique-id-456</guid>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              guid: { value: 'unique-id-456', isPermaLink: false },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse enclosure with all attributes (RW-A03)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Episode</title>
                <enclosure url="https://example.com/ep.mp3" length="12345678" type="audio/mpeg"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Episode',
              enclosures: [
                { url: 'https://example.com/ep.mp3', length: 12345678, type: 'audio/mpeg' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('namespace edge cases', () => {
      it('should handle non-standard prefix for known namespace URI (RW-NS01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:mydc="http://purl.org/dc/elements/1.1/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <mydc:creator>John Doe</mydc:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              dc: {
                creators: ['John Doe'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle multiple namespaces with non-standard prefixes (RW-NS02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0"
            xmlns:mydc="http://purl.org/dc/elements/1.1/"
            xmlns:myatom="http://www.w3.org/2005/Atom"
          >
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <myatom:link href="https://example.com/feed.xml" rel="self"/>
              <item>
                <title>Post</title>
                <mydc:creator>Jane</mydc:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          atom: {
            links: [{ href: 'https://example.com/feed.xml', rel: 'self' }],
          },
          items: [
            {
              title: 'Post',
              dc: {
                creators: ['Jane'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle namespace URI without trailing slash variant (RW-NS03)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <dc:creator>Author</dc:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              dc: {
                creators: ['Author'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle namespace declared inline on item element (RW-NS12)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item xmlns:dc="http://purl.org/dc/elements/1.1/">
                <title>Post</title>
                <dc:creator>Inline Author</dc:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              dc: {
                creators: ['Inline Author'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('feed-specific quirks', () => {
      it('should parse podcast feed with itunes namespace (RW-Q02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
            <channel>
              <title>My Podcast</title>
              <link>https://example.com</link>
              <description>A podcast</description>
              <itunes:author>Host Name</itunes:author>
              <itunes:explicit>false</itunes:explicit>
              <item>
                <title>Episode 1</title>
                <enclosure url="https://example.com/ep1.mp3" type="audio/mpeg" length="12345"/>
                <itunes:duration>01:23:45</itunes:duration>
                <itunes:explicit>false</itunes:explicit>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'My Podcast',
          link: 'https://example.com',
          description: 'A podcast',
          items: [
            {
              title: 'Episode 1',
              enclosures: [
                { url: 'https://example.com/ep1.mp3', length: 12345, type: 'audio/mpeg' },
              ],
              itunes: { duration: 5025, explicit: false },
            },
          ],
          itunes: { explicit: false, author: 'Host Name' },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse feed with source element on item (RW-Q03)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Aggregator</title>
              <link>https://example.com</link>
              <description>Aggregated feed</description>
              <item>
                <title>Cross-posted Article</title>
                <source url="https://example.org/feed.xml">Original Blog</source>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Aggregator',
          link: 'https://example.com',
          description: 'Aggregated feed',
          items: [
            {
              title: 'Cross-posted Article',
              source: { title: 'Original Blog', url: 'https://example.org/feed.xml' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse feed with comments URL on item (RW-Q04)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <comments>https://example.com/post/1#comments</comments>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              comments: 'https://example.com/post/1#comments',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse RFC 2822 author email format into structured person (RW-Q09)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <author>john@example.com (John Doe)</author>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              authors: [{ email: 'john@example.com', name: 'John Doe' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('malformed XML resilience', () => {
      it('should handle BOM at start of XML (RW-E10)', () => {
        const value = `\uFEFF<?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>BOM Feed</title>
              <link>https://example.com</link>
              <description>Feed with BOM</description>
            </channel>
          </rss>
        `
        const expected = {
          title: 'BOM Feed',
          link: 'https://example.com',
          description: 'Feed with BOM',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle unescaped ampersand in title (RW-E12)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Tom & Jerry</title>
              <link>https://example.com</link>
              <description>Test</description>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Tom & Jerry',
          link: 'https://example.com',
          description: 'Test',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle unescaped ampersand in item description (RW-E12)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <description>Fish & Chips are great</description>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              description: 'Fish & Chips are great',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle HTML entity &nbsp; in text (RW-E06)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Hello&nbsp;World</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Hello\u00A0World' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle &copy; entity in text (RW-E07)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>&copy; 2024 Example Corp</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: '\u00A9 2024 Example Corp' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should throw on truncated XML (RW-X01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Incomplete
        `
        const throwing = () => parse(value)

        expect(throwing).toThrowError(MalformedError)
      })

      it('should throw on unescaped less-than in title (RW-E17)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Price: $5 < $10</title>
              </item>
            </channel>
          </rss>
        `
        const throwing = () => parse(value)

        expect(throwing).toThrowError(MalformedError)
      })

      it('should handle control character U+0008 in content (RW-E11)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Text with\u0008backspace</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Text with\u0008backspace' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse feed with DOCTYPE declaration (RW-X04)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <!DOCTYPE rss SYSTEM "https://example.com/rss.dtd">
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should strip XML comments from element content (RW-X08)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test<!-- hidden --> Feed</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post<!-- comment --> Title</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test Feed',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post Title' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should use first channel when multiple channel elements exist (RW-X10)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>First Channel</title>
              <link>https://first.example.com</link>
              <description>First</description>
              <item>
                <title>First Post</title>
              </item>
            </channel>
            <channel>
              <title>Second Channel</title>
              <link>https://second.example.com</link>
              <description>Second</description>
            </channel>
          </rss>
        `
        const expected = {
          title: 'First Channel',
          link: 'https://first.example.com',
          description: 'First',
          items: [{ title: 'First Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse items placed outside channel element (RW-X11)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Feed</title>
              <link>https://example.com</link>
              <description>Test</description>
            </channel>
            <item>
              <title>Outside Item</title>
              <link>https://example.com/outside</link>
            </item>
          </rss>
        `
        const expected = {
          title: 'Feed',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Outside Item',
              link: 'https://example.com/outside',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should drop unquoted attribute values (fast-xml-parser limitation) (RW-X12)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <enclosure url="https://example.com/file.mp3" length=12345 type="audio/mpeg"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              enclosures: [
                {
                  url: 'https://example.com/file.mp3',
                  type: 'audio/mpeg',
                },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('stop node edge cases', () => {
      it('should preserve HTML tags in title as text (RW-D04)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title><b>Bold</b> title</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: '<b>Bold</b> title' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle CDATA with code containing angle brackets (RW-C04)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Code Example</title>
                <content:encoded><![CDATA[<pre>for (i = 0; i < 10; i++) { console.log(i); }</pre>]]></content:encoded>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Code Example',
              content: {
                encoded: '<pre>for (i = 0; i < 10; i++) { console.log(i); }</pre>',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle description with escaped HTML link (RW-D04)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <description>Click &lt;a href=&quot;https://example.com&quot;&gt;here&lt;/a&gt; for more</description>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              description: 'Click <a href="https://example.com">here</a> for more',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('partial attributes', () => {
      it('should handle enclosure with missing url attribute (RW-A04)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Episode</title>
                <enclosure type="audio/mpeg" length="5000000"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Episode',
              enclosures: [{ type: 'audio/mpeg', length: 5000000 }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should drop enclosure with no attributes (RW-A05)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <enclosure/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse item with only guid (RW-N02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <guid isPermaLink="false">unique-12345</guid>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              guid: { value: 'unique-12345', isPermaLink: false },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle invalid date strings as plain strings (RW-T01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <pubDate>sometime in January</pubDate>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              pubDate: 'sometime in January',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle large enclosure length values (RW-A06)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Episode</title>
                <enclosure url="https://example.com/ep.mp3" type="audio/mpeg" length="9007199254740992"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Episode',
              enclosures: [
                { url: 'https://example.com/ep.mp3', length: 9007199254740992, type: 'audio/mpeg' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse nested iTunes categories (RW-NS07)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
            <channel>
              <title>My Podcast</title>
              <link>https://example.com</link>
              <description>A podcast</description>
              <itunes:category text="Technology">
                <itunes:category text="Podcasting"/>
              </itunes:category>
              <itunes:category text="Society &amp; Culture"/>
              <item>
                <title>Episode 1</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'My Podcast',
          link: 'https://example.com',
          description: 'A podcast',
          items: [{ title: 'Episode 1' }],
          itunes: {
            categories: [
              { text: 'Technology', categories: [{ text: 'Podcasting' }] },
              { text: 'Society & Culture' },
            ],
          },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should unwrap CDATA-wrapped pubDate (RW-C13)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <pubDate><![CDATA[Mon, 01 Jan 2024 00:00:00 GMT]]></pubDate>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              pubDate: 'Mon, 01 Jan 2024 00:00:00 GMT',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should omit empty content:encoded and keep description (RW-C14)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <content:encoded/>
                <description>Fallback content</description>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              description: 'Fallback content',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse guid with isPermaLink true and no link element (RW-L14)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <guid isPermaLink="true">https://example.com/post/1</guid>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              guid: { value: 'https://example.com/post/1', isPermaLink: true },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should store non-MIME enclosure type as-is (RW-A13)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Episode</title>
                <enclosure url="https://example.com/audio.mp3" type="mp3" length="12345"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Episode',
              enclosures: [
                {
                  url: 'https://example.com/audio.mp3',
                  type: 'mp3',
                  length: 12345,
                },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse dc:date in RSS 2.0 (RW-NS14)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <dc:date>2025-02-21T16:00:00Z</dc:date>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              dc: {
                dates: ['2025-02-21T16:00:00Z'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse media:content with nested child elements (RW-NS15)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <media:content url="https://example.com/image.png" type="image/png" medium="image">
                  <media:rating scheme="urn:simple">nonadult</media:rating>
                </media:content>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              media: {
                contents: [
                  {
                    url: 'https://example.com/image.png',
                    type: 'image/png',
                    medium: 'image',
                    ratings: [{ value: 'nonadult', scheme: 'urn:simple' }],
                  },
                ],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse both media:content and media:thumbnail (RW-NS16)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <media:content url="https://example.com/full.jpg" type="image/jpeg"/>
                <media:thumbnail url="https://example.com/thumb.jpg" width="120" height="90"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              media: {
                contents: [
                  {
                    url: 'https://example.com/full.jpg',
                    type: 'image/jpeg',
                  },
                ],
                thumbnails: [
                  {
                    url: 'https://example.com/thumb.jpg',
                    width: 120,
                    height: 90,
                  },
                ],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse itunes:duration with MM:SS format (RW-NS17)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
            <channel>
              <title>My Podcast</title>
              <link>https://example.com</link>
              <description>A podcast</description>
              <item>
                <title>Episode 1</title>
                <itunes:duration>03:19</itunes:duration>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'My Podcast',
          link: 'https://example.com',
          description: 'A podcast',
          items: [
            {
              title: 'Episode 1',
              itunes: {
                duration: 199,
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle HTTPS variant of DC namespace URI (RW-NS18)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dc="https://purl.org/dc/elements/1.1/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <dc:creator>John Doe</dc:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              dc: {
                creators: ['John Doe'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse atom:link declared inline on channel element (RW-NS19)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="self" href="https://example.com/feed.xml" type="application/rss+xml"/>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          atom: {
            links: [
              {
                href: 'https://example.com/feed.xml',
                rel: 'self',
                type: 'application/rss+xml',
              },
            ],
          },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode numeric character reference &#39; in description (RW-X13)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <description>It doesn&#39;t work</description>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              description: "It doesn't work",
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should omit self-closing empty link element (RW-X14)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <link/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle leading whitespace before XML declaration (RW-X17)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should ignore xml-stylesheet processing instruction (RW-X18)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="style.xsl"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve raw XML inside stop node pubDate (RW-X19)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <pubDate><time datetime="2019-05-12">Sun, 05/12/2019</time></pubDate>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              pubDate: '<time datetime="2019-05-12">Sun, 05/12/2019</time>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should scope image child elements without polluting channel (RW-X20)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Channel Title</title>
              <link>https://example.com</link>
              <description>Test</description>
              <image>
                <title>Image Title</title>
                <url>https://example.com/logo.png</url>
                <link>https://example.com</link>
              </image>
              <item>
                <title>Item</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Channel Title',
          link: 'https://example.com',
          description: 'Test',
          image: {
            title: 'Image Title',
            url: 'https://example.com/logo.png',
            link: 'https://example.com',
          },
          items: [{ title: 'Item' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should scope textInput child elements without polluting channel (RW-X21)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Channel Title</title>
              <link>https://example.com</link>
              <description>Channel Desc</description>
              <textInput>
                <title>Search</title>
                <description>Search this site</description>
                <name>q</name>
                <link>https://example.com/search</link>
              </textInput>
              <item>
                <title>Item</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Channel Title',
          link: 'https://example.com',
          description: 'Channel Desc',
          textInput: {
            title: 'Search',
            description: 'Search this site',
            name: 'q',
            link: 'https://example.com/search',
          },
          items: [{ title: 'Item' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve both author and dc:creator (RW-Q11)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <author>Regular Author</author>
                <dc:creator>DC Author</dc:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              authors: [{ name: 'Regular Author' }],
              dc: {
                creators: ['DC Author'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should collect multiple dc:creator elements (RW-Q12)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <dc:creator>Alice</dc:creator>
                <dc:creator>Bob</dc:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              dc: {
                creators: ['Alice', 'Bob'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should treat itunes:explicit "1" as false (RW-Q13)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
            <channel>
              <title>My Podcast</title>
              <link>https://example.com</link>
              <description>A podcast</description>
              <item>
                <title>Episode 1</title>
                <itunes:explicit>1</itunes:explicit>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'My Podcast',
          link: 'https://example.com',
          description: 'A podcast',
          items: [{ title: 'Episode 1', itunes: { explicit: false } }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse itunes:duration with fractional seconds (RW-Q14)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
            <channel>
              <title>My Podcast</title>
              <link>https://example.com</link>
              <description>A podcast</description>
              <item>
                <title>Episode 1</title>
                <itunes:duration>3661.5</itunes:duration>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'My Podcast',
          link: 'https://example.com',
          description: 'A podcast',
          items: [{ title: 'Episode 1', itunes: { duration: 3661.5 } }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse itunes:image as text content without @href (RW-Q15)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
            <channel>
              <title>My Podcast</title>
              <link>https://example.com</link>
              <description>A podcast</description>
              <item>
                <title>Episode 1</title>
                <itunes:image>https://example.com/art.jpg</itunes:image>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'My Podcast',
          link: 'https://example.com',
          description: 'A podcast',
          items: [{ title: 'Episode 1', itunes: { image: 'https://example.com/art.jpg' } }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('unicode and special characters', () => {
      it('should preserve BiDi control characters in category text (RW-E18)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <category>\u202ASports\u202C</category>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post', categories: [{ name: '\u202ASports\u202C' }] }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('description and content interaction', () => {
      it('should parse both description and content:encoded regardless of order (RW-D18)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>First</title>
                <description>Desc first</description>
                <content:encoded><![CDATA[<p>Content first</p>]]></content:encoded>
              </item>
              <item>
                <title>Second</title>
                <content:encoded><![CDATA[<p>Content second</p>]]></content:encoded>
                <description>Desc second</description>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'First',
              description: 'Desc first',
              content: { encoded: '<p>Content first</p>' },
            },
            {
              title: 'Second',
              description: 'Desc second',
              content: { encoded: '<p>Content second</p>' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve bare HTML children inside description stop node (RW-D23)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <description><p>Hello world</p></description>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post', description: '<p>Hello world</p>' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('link edge cases', () => {
      it('should parse text link separately from atom:link (RW-L17)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <atom:link href="https://example.com/feed" rel="self" type="application/rss+xml"/>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          atom: {
            links: [{ href: 'https://example.com/feed', rel: 'self', type: 'application/rss+xml' }],
          },
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('dc namespace edge cases', () => {
      it('should collect multiple dc:creator elements in order (RW-M09)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <dc:creator>Alice</dc:creator>
                <dc:creator>Bob</dc:creator>
                <dc:creator>Charlie</dc:creator>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              dc: { creators: ['Alice', 'Bob', 'Charlie'] },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should ignore empty dc:title and keep core title (RW-NS24)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Real Title</title>
                <dc:title/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Real Title' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('duplicate element handling', () => {
      it('should use first guid when multiple guid elements exist (RW-M11)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <guid>first-guid</guid>
                <guid>second-guid</guid>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post', guid: { value: 'first-guid' } }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('image edge cases', () => {
      it('should parse channel image with only url (RW-N22)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <image>
                <url>https://example.com/logo.png</url>
              </image>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          image: { url: 'https://example.com/logo.png' },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should not parse image element at item level (RW-Q16)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <image>https://example.com/pic.jpg</image>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('enclosure edge cases', () => {
      it('should omit length for empty string enclosure length (RW-A14)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Episode</title>
                <enclosure url="https://example.com/file.mp3" length="" type="audio/mpeg"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Episode',
              enclosures: [{ url: 'https://example.com/file.mp3', type: 'audio/mpeg' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should omit length for non-numeric enclosure length (RW-A14)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Episode</title>
                <enclosure url="https://example.com/file.mp3" length="abc" type="audio/mpeg"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Episode',
              enclosures: [{ url: 'https://example.com/file.mp3', type: 'audio/mpeg' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse float enclosure length as number (RW-A15)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Episode</title>
                <enclosure url="https://example.com/file.mp3" length="1.5" type="audio/mpeg"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Episode',
              enclosures: [
                { url: 'https://example.com/file.mp3', length: 1.5, type: 'audio/mpeg' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should ignore enclosure text content without attributes (RW-A19)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Episode</title>
                <enclosure>https://example.com/file.mp3</enclosure>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [{ title: 'Episode' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve MIME type with parameters in enclosure (RW-A20)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <enclosure url="https://example.com/page" length="5000" type="text/html; charset=utf-8"/>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              enclosures: [
                { url: 'https://example.com/page', length: 5000, type: 'text/html; charset=utf-8' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('guid edge cases', () => {
      it('should parse guid without isPermaLink attribute (RW-A16)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <guid>internal-id-12345</guid>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              guid: { value: 'internal-id-12345' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('source element', () => {
      it('should parse source with url attribute and text (RW-A17)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <source url="https://example.com/feed">Source Name</source>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              source: {
                title: 'Source Name',
                url: 'https://example.com/feed',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('author edge cases', () => {
      it('should parse plain author name string (RW-A18)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <author>John Doe</author>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              authors: [{ name: 'John Doe' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('person fields', () => {
      it('should parse managingEditor in RFC 2822 format', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <managingEditor>editor@example.com (Editor Name)</managingEditor>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          managingEditor: { email: 'editor@example.com', name: 'Editor Name' },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse webMaster in RFC 2822 format', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <webMaster>webmaster@example.com (Webmaster)</webMaster>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          webMaster: { email: 'webmaster@example.com', name: 'Webmaster' },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse managingEditor with email only', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <managingEditor>editor@example.com</managingEditor>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          managingEditor: { email: 'editor@example.com' },
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('foreign namespace on core elements', () => {
      it('should handle default namespace override on link element (RW-NS25)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link xmlns="http://apache.org/cocoon/i18n/2.1">https://example.com</link>
              <description>Test</description>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('atom namespace in RSS items', () => {
      it('should parse atom:author inside RSS item (RW-NS26)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <atom:author>
                  <atom:name>John Doe</atom:name>
                </atom:author>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              atom: {
                authors: [{ name: 'John Doe' }],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('sy namespace edge cases', () => {
      it('should preserve bad date string in sy:updateBase (RW-NS27)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <sy:updateBase>not-a-date</sy:updateBase>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          sy: {
            updateBase: 'not-a-date',
          },
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('namespace scoping', () => {
      it('should not leak dc:identifier nested inside media:content to item level (RW-NS28)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0"
            xmlns:media="http://search.yahoo.com/mrss/"
            xmlns:dc="http://purl.org/dc/elements/1.1/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <media:content url="https://example.com/video.mp4">
                  <dc:identifier>1</dc:identifier>
                </media:content>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              media: {
                contents: [{ url: 'https://example.com/video.mp4' }],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('itunes and core field independence', () => {
      it('should parse itunes:summary and description independently (RW-NS29)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
            <channel>
              <title>My Podcast</title>
              <link>https://example.com</link>
              <description>A podcast</description>
              <item>
                <title>Episode 1</title>
                <description>Real description</description>
                <itunes:summary>iTunes summary</itunes:summary>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'My Podcast',
          link: 'https://example.com',
          description: 'A podcast',
          items: [
            {
              title: 'Episode 1',
              description: 'Real description',
              itunes: {
                summary: 'iTunes summary',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('concatenated and malformed XML', () => {
      it('should parse only first document from concatenated RSS documents (RW-X22)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>First Feed</title>
              <link>https://first.example.com</link>
              <description>First</description>
            </channel>
          </rss>
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Second Feed</title>
              <link>https://second.example.com</link>
              <description>Second</description>
            </channel>
          </rss>
        `
        const expected = {
          title: 'First Feed',
          link: 'https://first.example.com',
          description: 'First',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse adjacent elements without whitespace (RW-X23)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0"
            xmlns:media="http://search.yahoo.com/mrss/"
            xmlns:content="http://purl.org/rss/1.0/modules/content/">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <media:content url="https://example.com/img.jpg"/><content:encoded><![CDATA[Article text]]></content:encoded>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              content: {
                encoded: 'Article text',
              },
              media: {
                contents: [{ url: 'https://example.com/img.jpg' }],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('non-standard RSS version', () => {
      it('should parse RSS with version 0.91 (RW-X24)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="0.91">
            <channel>
              <title>Old Feed</title>
              <link>https://example.com</link>
              <description>An old RSS feed</description>
              <item>
                <title>Post</title>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Old Feed',
          link: 'https://example.com',
          description: 'An old RSS feed',
          items: [{ title: 'Post' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('itunes:explicit values', () => {
      it('should treat itunes:explicit "no" as false (RW-Q17)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
            <channel>
              <title>My Podcast</title>
              <link>https://example.com</link>
              <description>A podcast</description>
              <item>
                <title>Episode 1</title>
                <itunes:explicit>no</itunes:explicit>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'My Podcast',
          link: 'https://example.com',
          description: 'A podcast',
          items: [
            {
              title: 'Episode 1',
              itunes: {
                explicit: false,
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('category edge cases', () => {
      it('should parse category with domain but empty text (RW-Q18)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
            <channel>
              <title>Test</title>
              <link>https://example.com</link>
              <description>Test</description>
              <item>
                <title>Post</title>
                <category domain="dmoz"></category>
              </item>
            </channel>
          </rss>
        `
        const expected = {
          title: 'Test',
          link: 'https://example.com',
          description: 'Test',
          items: [
            {
              title: 'Post',
              categories: [{ domain: 'dmoz' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })
  })

  describe('with maxItems option', () => {
    it('should limit items to specified number', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Test Feed</title>
            <link>https://example.com</link>
            <description>Testing maxItems option</description>
            <item>
              <title>First</title>
            </item>
            <item>
              <title>Second</title>
            </item>
            <item>
              <title>Third</title>
            </item>
            <item>
              <title>Fourth</title>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Test Feed',
        link: 'https://example.com',
        description: 'Testing maxItems option',
        items: [{ title: 'First' }, { title: 'Second' }],
      }

      expect(parse(value, { maxItems: 2 })).toEqual(expected)
    })

    it('should skip all items when maxItems is 0', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Test Feed</title>
            <link>https://example.com</link>
            <description>Testing maxItems with 0</description>
            <item>
              <title>First</title>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Test Feed',
        link: 'https://example.com',
        description: 'Testing maxItems with 0',
      }

      expect(parse(value, { maxItems: 0 })).toEqual(expected)
    })

    it('should return all items when maxItems is undefined', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Test Feed</title>
            <link>https://example.com</link>
            <description>Testing without maxItems</description>
            <item>
              <title>First</title>
            </item>
            <item>
              <title>Second</title>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Test Feed',
        link: 'https://example.com',
        description: 'Testing without maxItems',
        items: [{ title: 'First' }, { title: 'Second' }],
      }

      expect(parse(value, { maxItems: undefined })).toEqual(expected)
    })
  })

  describe('parseDateFn', () => {
    it('should apply custom parseDateFn to feed and item dates', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0">
          <channel>
            <title>Test</title>
            <pubDate>Wed, 15 Mar 2023 12:00:00 GMT</pubDate>
            <item>
              <title>Item</title>
              <pubDate>Thu, 16 Mar 2023 12:00:00 GMT</pubDate>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Test',
        pubDate: new Date('Wed, 15 Mar 2023 12:00:00 GMT'),
        items: [
          {
            title: 'Item',
            pubDate: new Date('Thu, 16 Mar 2023 12:00:00 GMT'),
          },
        ],
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should apply custom parseDateFn to namespace dates', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
          <channel>
            <title>Test</title>
            <item>
              <title>Item</title>
              <dc:date>2023-03-15T12:00:00Z</dc:date>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Test',
        items: [
          {
            title: 'Item',
            dc: {
              dates: [new Date('2023-03-15T12:00:00Z')],
            },
          },
        ],
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should propagate error when parseDateFn throws', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0">
          <channel>
            <title>Test</title>
            <pubDate>invalid</pubDate>
          </channel>
        </rss>
      `
      const parseDateFn = () => {
        throw new Error('Parse failed')
      }
      const throwing = () => parse(value, { parseDateFn })

      expect(throwing).toThrowError('Parse failed')
    })

    it('should apply custom parseDateFn to podcast namespace dates', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:podcast="https://podcastindex.org/namespace/1.0">
          <channel>
            <title>Test</title>
            <podcast:trailer pubdate="Thu, 16 Mar 2023 12:00:00 GMT" url="https://example.com/trailer.mp3">Trailer</podcast:trailer>
            <podcast:liveItem status="live" start="2023-03-15T12:00:00Z" end="2023-03-15T13:00:00Z" />
            <podcast:updateFrequency dtstart="2023-03-20T00:00:00Z" rrule="FREQ=WEEKLY">Weekly</podcast:updateFrequency>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Test',
        podcast: {
          trailers: [
            {
              display: 'Trailer',
              url: 'https://example.com/trailer.mp3',
              pubDate: new Date('Thu, 16 Mar 2023 12:00:00 GMT'),
            },
          ],
          liveItems: [
            {
              status: 'live',
              start: new Date('2023-03-15T12:00:00Z'),
              end: new Date('2023-03-15T13:00:00Z'),
            },
          ],
          updateFrequency: {
            display: 'Weekly',
            dtstart: new Date('2023-03-20T00:00:00Z'),
            rrule: 'FREQ=WEEKLY',
          },
        },
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should apply custom parseDateFn to sy namespace dates', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
          <channel>
            <title>Test</title>
            <sy:updateBase>2023-03-15T12:00:00Z</sy:updateBase>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Test',
        sy: {
          updateBase: new Date('2023-03-15T12:00:00Z'),
        },
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should apply custom parseDateFn to prism namespace dates', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:prism="http://prismstandard.org/namespaces/basic/3.0/">
          <channel>
            <title>Test</title>
            <item>
              <title>Item</title>
              <prism:publicationDate>2023-03-15T12:00:00Z</prism:publicationDate>
              <prism:modificationDate>2023-03-16T12:00:00Z</prism:modificationDate>
            </item>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Test',
        items: [
          {
            title: 'Item',
            prism: {
              publicationDates: [new Date('2023-03-15T12:00:00Z')],
              modificationDate: new Date('2023-03-16T12:00:00Z'),
            },
          },
        ],
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should apply custom parseDateFn to rawvoice namespace dates', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:rawvoice="http://www.rawvoice.com/rawvoiceRssModule/">
          <channel>
            <title>Test</title>
            <rawvoice:liveStream schedule="2023-03-15T12:00:00Z" duration="01:00:00">https://example.com/stream</rawvoice:liveStream>
          </channel>
        </rss>
      `
      const expected = {
        title: 'Test',
        rawvoice: {
          liveStream: {
            url: 'https://example.com/stream',
            schedule: new Date('2023-03-15T12:00:00Z'),
            duration: '01:00:00',
          },
        },
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })
  })
})
