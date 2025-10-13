import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { parse } from './index.js'

describe('parse', () => {
  const versions = {
    '03': '0.3',
    '10': '1.0',
    ns: 'with namespaces',
  }

  for (const [key, label] of Object.entries(versions)) {
    it(`should correctly parse Atom ${label} feed`, async () => {
      const reference = `${import.meta.dir}/../references/atom-${key}`
      const input = await Bun.file(`${reference}.xml`).text()
      const expected = await Bun.file(`${reference}.json`).json()
      const result = parse(input)

      expect(result).toEqual(expected)
    })
  }

  it('should correctly parse Atom 1.0 feed with mixed case tags', async () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <FeEd xmlns="http://www.w3.org/2005/Atom">
        <TiTlE>Mixed Case Atom Feed</TiTlE>
        <SuBtItLe>A test feed with mixed case tags</SuBtItLe>
        <LiNk href="https://example.com/" rel="alternate"/>
        <LiNk href="https://example.com/atom.xml" rel="self"/>
        <Id>urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6</Id>
        <UpDaTeD>2024-01-10T12:00:00Z</UpDaTeD>
        <RiGhTs>Copyright 2024, Example Corp</RiGhTs>
        <AuThOr>
          <NaMe>John Doe</NaMe>
          <EmAiL>john@example.com</EmAiL>
          <UrI>https://example.com/john</UrI>
        </AuThOr>
        <CoNtRiBuToR>
          <NaMe>Jane Smith</NaMe>
          <EmAiL>jane@example.com</EmAiL>
        </CoNtRiBuToR>
        <CaTeGoRy term="tech" scheme="https://example.com/categories" label="Technology"/>
        <GeNeRaToR uri="https://example.com/generator" version="1.0">Example Generator</GeNeRaToR>
        <IcOn>https://example.com/favicon.ico</IcOn>
        <LoGo>https://example.com/logo.png</LoGo>
        <EnTrY>
          <TiTlE>First Entry</TiTlE>
          <LiNk href="https://example.com/entry1" rel="alternate"/>
          <Id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</Id>
          <PuBlIsHeD>2024-01-01T12:00:00Z</PuBlIsHeD>
          <UpDaTeD>2024-01-02T09:30:00Z</UpDaTeD>
          <AuThOr>
            <NaMe>John Doe</NaMe>
          </AuThOr>
          <CoNtEnT type="html">
            &lt;p&gt;This is the first entry in a mixed case Atom feed.&lt;/p&gt;
          </CoNtEnT>
          <SuMmArY>Summary of the first entry</SuMmArY>
          <CaTeGoRy term="samples" label="Samples"/>
        </EnTrY>
        <entry>
          <title>Second Entry</title>
          <link href="https://example.com/entry2" rel="alternate"/>
          <id>urn:uuid:1225c695-cfb8-4ebb-bbbb-80da344efa6a</id>
          <published>2024-01-03T14:30:00Z</published>
          <updated>2024-01-03T15:45:00Z</updated>
          <author>
            <name>Jane Smith</name>
          </author>
          <content type="text">
            This is the second entry in a mixed case Atom feed.
          </content>
          <summary>Summary of the second entry</summary>
          <category term="docs" label="Documentation"/>
        </entry>
      </FeEd>
    `
    const expected = {
      title: 'Mixed Case Atom Feed',
      subtitle: 'A test feed with mixed case tags',
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      updated: '2024-01-10T12:00:00Z',
      links: [
        { href: 'https://example.com/', rel: 'alternate' },
        { href: 'https://example.com/atom.xml', rel: 'self' },
      ],
      rights: 'Copyright 2024, Example Corp',
      authors: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          uri: 'https://example.com/john',
        },
      ],
      contributors: [
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      ],
      categories: [
        {
          term: 'tech',
          scheme: 'https://example.com/categories',
          label: 'Technology',
        },
      ],
      generator: {
        text: 'Example Generator',
        uri: 'https://example.com/generator',
        version: '1.0',
      },
      icon: 'https://example.com/favicon.ico',
      logo: 'https://example.com/logo.png',
      entries: [
        {
          title: 'First Entry',
          id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
          links: [{ href: 'https://example.com/entry1', rel: 'alternate' }],
          published: '2024-01-01T12:00:00Z',
          updated: '2024-01-02T09:30:00Z',
          authors: [{ name: 'John Doe' }],
          content: '<p>This is the first entry in a mixed case Atom feed.</p>',
          summary: 'Summary of the first entry',
          categories: [{ term: 'samples', label: 'Samples' }],
        },
        {
          title: 'Second Entry',
          id: 'urn:uuid:1225c695-cfb8-4ebb-bbbb-80da344efa6a',
          links: [{ href: 'https://example.com/entry2', rel: 'alternate' }],
          published: '2024-01-03T14:30:00Z',
          updated: '2024-01-03T15:45:00Z',
          authors: [{ name: 'Jane Smith' }],
          content: 'This is the second entry in a mixed case Atom feed.',
          summary: 'Summary of the second entry',
          categories: [{ term: 'docs', label: 'Documentation' }],
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should correctly parse namespaced Atom feed', async () => {
    const value = `
      <?xml version="1.0" encoding="utf-8"?>
      <atom:feed atom:xmlns="http://www.w3.org/2005/Atom">
        <atom:title>Example Feed</title>
        <atom:id>example-feed</id>
        <atom:entry>
          <atom:title>Example Entry</title>
          <atom:id>example-entry</id>
        </atom:entry>
      </atom:feed>
    `
    const expected = {
      id: 'example-feed',
      title: 'Example Feed',
      entries: [
        {
          id: 'example-entry',
          title: 'Example Entry',
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

  it('should correctly parse Atom feed with YouTube namespace', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015">
        <title>YouTube Channel Feed</title>
        <id>yt:channel:UCuAXFkgsw1L7xaCfnd5JJOw</id>
        <yt:channelId>UCuAXFkgsw1L7xaCfnd5JJOw</yt:channelId>
        <updated>2024-01-10T12:00:00Z</updated>
        <entry>
          <id>yt:video:dQw4w9WgXcQ</id>
          <yt:videoId>dQw4w9WgXcQ</yt:videoId>
          <yt:channelId>UCuAXFkgsw1L7xaCfnd5JJOw</yt:channelId>
          <title>Example YouTube Video</title>
          <updated>2024-01-05T10:30:00Z</updated>
        </entry>
      </feed>
    `
    const expected = {
      title: 'YouTube Channel Feed',
      id: 'yt:channel:UCuAXFkgsw1L7xaCfnd5JJOw',
      updated: '2024-01-10T12:00:00Z',
      yt: {
        channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
      },
      entries: [
        {
          id: 'yt:video:dQw4w9WgXcQ',
          title: 'Example YouTube Video',
          updated: '2024-01-05T10:30:00Z',
          yt: {
            videoId: 'dQw4w9WgXcQ',
            channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
          },
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should correctly parse Atom feed with YouTube playlist', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015">
        <title>YouTube Playlist Feed</title>
        <id>yt:playlist:PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf</id>
        <yt:playlistId>PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf</yt:playlistId>
        <updated>2024-01-10T12:00:00Z</updated>
        <entry>
          <id>yt:video:OTYFJaT-Glk</id>
          <yt:videoId>OTYFJaT-Glk</yt:videoId>
          <yt:channelId>UCtNjkMLQQOX251hjGqimx2w</yt:channelId>
          <title>Video in Playlist</title>
          <updated>2024-01-08T14:20:00Z</updated>
        </entry>
      </feed>
    `
    const expected = {
      title: 'YouTube Playlist Feed',
      id: 'yt:playlist:PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
      updated: '2024-01-10T12:00:00Z',
      yt: {
        playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
      },
      entries: [
        {
          id: 'yt:video:OTYFJaT-Glk',
          title: 'Video in Playlist',
          updated: '2024-01-08T14:20:00Z',
          yt: {
            videoId: 'OTYFJaT-Glk',
            channelId: 'UCtNjkMLQQOX251hjGqimx2w',
          },
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  describe('namespace normalization integration', () => {
    it('should handle feeds with no namespace', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed>
          <title>Simple Feed</title>
          <id>urn:uuid:12345</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <entry>
            <title>Simple Entry</title>
            <id>urn:uuid:67890</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </entry>
        </feed>
      `
      const expected = {
        title: 'Simple Feed',
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Simple Entry',
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle default Atom namespace with primary namespace', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Test Feed</title>
          <id>urn:uuid:12345</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <entry>
            <title>Test Entry</title>
            <id>urn:uuid:67890</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </entry>
        </feed>
      `
      const expected = {
        title: 'Test Feed',
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Test Entry',
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle custom Atom prefix with primary namespace', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <a:feed xmlns:a="http://www.w3.org/2005/Atom">
          <a:title>Test Feed</a:title>
          <a:id>urn:uuid:12345</a:id>
          <a:updated>2024-01-01T00:00:00Z</a:updated>
          <a:entry>
            <a:title>Test Entry</a:title>
            <a:id>urn:uuid:67890</a:id>
            <a:updated>2024-01-01T00:00:00Z</a:updated>
          </a:entry>
        </a:feed>
      `
      const expected = {
        title: 'Test Feed',
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Test Entry',
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should normalize custom prefixes to standard prefixes', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom" xmlns:custom="http://purl.org/dc/elements/1.1/">
          <title>Atom Feed</title>
          <id>urn:uuid:12345</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <entry>
            <title>Entry Title</title>
            <id>urn:uuid:67890</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <custom:creator>John Doe</custom:creator>
          </entry>
        </feed>
      `
      const expected = {
        title: 'Atom Feed',
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Entry Title',
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
            dc: {
              creator: 'John Doe',
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
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Atom Feed</title>
          <id>urn:uuid:12345</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <entry xmlns:dc="http://purl.org/dc/elements/1.1/">
            <title>Entry Title</title>
            <id>urn:uuid:67890</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <dc:creator>John Doe</dc:creator>
            <dc:date>2023-01-01</dc:date>
          </entry>
          <entry>
            <title>Entry Without Namespace</title>
            <id>urn:uuid:abcdef</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </entry>
        </feed>
      `
      const expected = {
        title: 'Atom Feed',
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Entry Title',
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
            dc: {
              creator: 'John Doe',
              creators: ['John Doe'],
              date: '2023-01-01',
              dates: ['2023-01-01'],
            },
          },
          {
            title: 'Entry Without Namespace',
            id: 'urn:uuid:abcdef',
            updated: '2024-01-01T00:00:00Z',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle mixed case with namespace logic', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <FEED xmlns="http://www.w3.org/2005/Atom" xmlns:DC="http://purl.org/dc/elements/1.1/">
          <TITLE>Feed Title</TITLE>
          <ID>urn:uuid:12345</ID>
          <UPDATED>2024-01-01T00:00:00Z</UPDATED>
          <ENTRY>
            <TITLE>Entry Title</TITLE>
            <ID>urn:uuid:67890</ID>
            <UPDATED>2024-01-01T00:00:00Z</UPDATED>
            <DC:Creator>John Doe</DC:Creator>
          </ENTRY>
        </FEED>
      `
      const expected = {
        title: 'Feed Title',
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Entry Title',
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
            dc: {
              creator: 'John Doe',
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
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Atom Feed</title>
          <id>urn:uuid:12345</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <entry>
            <title>Entry 1</title>
            <id>urn:uuid:67890</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="http://example.com/thumb.jpg"/>
          </entry>
          <entry>
            <title>Entry 2</title>
            <id>urn:uuid:abcdef</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <summary>No media namespace here</summary>
          </entry>
        </feed>
      `
      const expected = {
        title: 'Atom Feed',
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Entry 1',
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
            media: {
              thumbnails: [
                {
                  url: 'http://example.com/thumb.jpg',
                },
              ],
            },
          },
          {
            title: 'Entry 2',
            id: 'urn:uuid:abcdef',
            updated: '2024-01-01T00:00:00Z',
            summary: 'No media namespace here',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle namespace URIs with leading/trailing whitespace', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed
          xmlns="http://www.w3.org/2005/Atom"
          xmlns:dc="  http://purl.org/dc/elements/1.1/  "
          xmlns:media=" http://search.yahoo.com/mrss/ "
          xmlns:thr="	http://purl.org/syndication/thread/1.0	"
        >
          <title>Atom Feed</title>
          <id>urn:uuid:12345</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <entry>
            <title>Entry Title</title>
            <id>urn:uuid:67890</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <dc:creator>John Doe</dc:creator>
            <dc:date>2023-01-01</dc:date>
            <media:title>Media Title</media:title>
            <thr:in-reply-to ref="urn:uuid:parent-id" />
          </entry>
        </feed>
      `
      const expected = {
        title: 'Atom Feed',
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Entry Title',
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
            dc: {
              creator: 'John Doe',
              creators: ['John Doe'],
              date: '2023-01-01',
              dates: ['2023-01-01'],
            },
            media: {
              title: { value: 'Media Title' },
            },
            thr: {
              inReplyTos: [
                {
                  ref: 'urn:uuid:parent-id',
                },
              ],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle malformed namespace declarations in Atom feeds', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed
          xmlns="http://www.w3.org/2005/Atom"
          xmlns:123="http://example.com/invalid"
          xmlns:dc=""
        >
          <title>Atom Feed</title>
          <id>urn:uuid:12345</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <entry>
            <title>Entry Title</title>
            <id>urn:uuid:67890</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <dc:creator>Should not normalize (empty URI)</dc:creator>
            <123:field>Invalid prefix</123:field>
          </entry>
        </feed>
      `
      const expected = {
        title: 'Atom Feed',
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Entry Title',
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
            dc: {
              creator: 'Should not normalize (empty URI)',
              creators: ['Should not normalize (empty URI)'],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle Atom feed with wrong default namespace', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed
          xmlns="http://example.com/not-atom"
          xmlns:atom="http://www.w3.org/2005/Atom"
        >
          <atom:title>Atom Feed with Custom Default NS</atom:title>
          <atom:id>urn:uuid:12345</atom:id>
          <atom:updated>2024-01-01T00:00:00Z</atom:updated>
          <customElement>This is in the wrong default namespace</customElement>
        </feed>
      `
      const expected = {
        title: 'Atom Feed with Custom Default NS',
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle missing required Atom elements', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed
          xmlns="http://www.w3.org/2005/Atom"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
        >
          <!-- Missing required id and updated -->
          <title>Incomplete Feed</title>
          <entry>
            <!-- Missing required id, updated -->
            <title>Incomplete Entry</title>
            <dc:creator>John Doe</dc:creator>
          </entry>
        </feed>
      `
      const expected = {
        title: 'Incomplete Feed',
        entries: [
          {
            title: 'Incomplete Entry',
            dc: {
              creator: 'John Doe',
              creators: ['John Doe'],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle namespace conflicts in nested Atom elements', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Feed Title</title>
          <id>urn:uuid:feed</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <entry
            xmlns="http://example.com/not-atom"
            xmlns:atom="http://www.w3.org/2005/Atom"
          >
            <atom:title>Entry with different default namespace</atom:title>
            <atom:id>urn:uuid:entry</atom:id>
            <atom:updated>2024-01-01T00:00:00Z</atom:updated>
            <customField>Not in Atom namespace</customField>
          </entry>
        </feed>
      `
      const expected = {
        title: 'Feed Title',
        id: 'urn:uuid:feed',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Entry with different default namespace',
            id: 'urn:uuid:entry',
            updated: '2024-01-01T00:00:00Z',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })
  })
})
