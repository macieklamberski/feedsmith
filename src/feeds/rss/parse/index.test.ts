import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
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
      const expectation = await Bun.file(`${reference}.json`).json()
      const result = parse(input)

      expect(result).toEqual(expectation)
    })
  }

  it('should correctly parse RSS with mixed case tags', async () => {
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
    const expectation = {
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

    expect(parse(value)).toEqual(expectation)
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
    const expectation = {
      title: 'Test Feed',
      link: 'https://example.com',
      description: 'Testing alternating case items',
      items: [{ title: 'First' }, { title: 'Second' }, { title: 'Third' }],
    }

    expect(parse(value)).toEqual(expectation)
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
    expect(() => parse('not a feed')).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle null input', () => {
    expect(() => parse(null)).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle undefined input', () => {
    expect(() => parse(undefined)).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle array input', () => {
    expect(() => parse([])).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle empty object input', () => {
    expect(() => parse({})).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle string input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle number input', () => {
    expect(() => parse(123)).toThrowError(locales.invalidFeedFormat)
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
              creator: 'John Doe',
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
              creator: 'John Doe',
              date: '2023-01-01',
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
              creator: 'John Doe',
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
              creator: 'John Doe',
              date: '2023-01-01',
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
              creator: 'Should not be normalized (empty URI)',
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
              creator: 'John Doe',
              date: '2023-01-01',
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
                creator: 'John',
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
                creator: 'John',
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
                creator: 'John',
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
                creator: 'John',
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
                creator: 'John',
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
                creator: 'John',
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
                creator: 'Jane Doe',
                title: 'DC Terms Title',
              },
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
})
