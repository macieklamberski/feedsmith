import { describe, expect, it } from 'bun:test'
import { locales, namespaceUris } from '../../../common/config.js'
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

  it('should handle alternating case entries', async () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Test Feed</title>
        <id>urn:uuid:test-feed</id>
        <updated>2024-01-10T12:00:00Z</updated>
        <entry>
          <title>First</title>
          <id>urn:uuid:1</id>
          <updated>2024-01-01T12:00:00Z</updated>
        </entry>
        <ENTRY>
          <title>Second</title>
          <id>urn:uuid:2</id>
          <updated>2024-01-02T12:00:00Z</updated>
        </ENTRY>
        <entry>
          <title>Third</title>
          <id>urn:uuid:3</id>
          <updated>2024-01-03T12:00:00Z</updated>
        </entry>
      </feed>
    `
    const expected = {
      title: 'Test Feed',
      id: 'urn:uuid:test-feed',
      updated: '2024-01-10T12:00:00Z',
      entries: [
        {
          title: 'First',
          id: 'urn:uuid:1',
          updated: '2024-01-01T12:00:00Z',
        },
        {
          title: 'Second',
          id: 'urn:uuid:2',
          updated: '2024-01-02T12:00:00Z',
        },
        {
          title: 'Third',
          id: 'urn:uuid:3',
          updated: '2024-01-03T12:00:00Z',
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
              creators: ['John Doe'],
              dates: ['2023-01-01'],
              creator: 'John Doe',
              date: '2023-01-01',
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
              creators: ['John Doe'],
              dates: ['2023-01-01'],
              creator: 'John Doe',
              date: '2023-01-01',
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
              creators: ['Should not normalize (empty URI)'],
              creator: 'Should not normalize (empty URI)',
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
              creators: ['John Doe'],
              creator: 'John Doe',
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

    it('should parse Atom feed with googleplay namespace', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom" xmlns:googleplay="https://www.google.com/schemas/play-podcasts/1.0/">
          <title>Feed with GooglePlay</title>
          <id>urn:uuid:feed-id</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <googleplay:author>Podcast Creator</googleplay:author>
          <googleplay:explicit>no</googleplay:explicit>
          <entry>
            <title>Episode with GooglePlay</title>
            <id>urn:uuid:entry-id</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <googleplay:author>Episode Author</googleplay:author>
            <googleplay:explicit>clean</googleplay:explicit>
          </entry>
        </feed>
      `
      const expected = {
        title: 'Feed with GooglePlay',
        id: 'urn:uuid:feed-id',
        updated: '2024-01-01T00:00:00Z',
        googleplay: {
          author: 'Podcast Creator',
          explicit: false,
        },
        entries: [
          {
            title: 'Episode with GooglePlay',
            id: 'urn:uuid:entry-id',
            updated: '2024-01-01T00:00:00Z',
            googleplay: {
              author: 'Episode Author',
              explicit: 'clean' as const,
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
          <feed xmlns="http://www.w3.org/2005/Atom" xmlns:dublincore="https://purl.org/dc/elements/1.1/">
            <title>Test</title>
            <id>urn:uuid:feed</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Entry</title>
              <id>urn:uuid:entry</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <dublincore:creator>John</dublincore:creator>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Entry',
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          <feed xmlns="http://www.w3.org/2005/Atom" xmlns:dublincore="http://purl.org/dc/elements/1.1">
            <title>Test</title>
            <id>urn:uuid:feed</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Entry</title>
              <id>urn:uuid:entry</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <dublincore:creator>John</dublincore:creator>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Entry',
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          <feed xmlns="http://www.w3.org/2005/Atom" xmlns:dublincore="HTTP://PURL.ORG/DC/ELEMENTS/1.1/">
            <title>Test</title>
            <id>urn:uuid:feed</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Entry</title>
              <id>urn:uuid:entry</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <dublincore:creator>John</dublincore:creator>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Entry',
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          <feed xmlns="http://www.w3.org/2005/Atom" xmlns:dublincore="Http://Purl.Org/Dc/Elements/1.1/">
            <title>Test</title>
            <id>urn:uuid:feed</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Entry</title>
              <id>urn:uuid:entry</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <dublincore:creator>John</dublincore:creator>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Entry',
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          <feed xmlns="http://www.w3.org/2005/Atom" xmlns:dublincore="HTTPS://PURL.ORG/DC/ELEMENTS/1.1/">
            <title>Test</title>
            <id>urn:uuid:feed</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Entry</title>
              <id>urn:uuid:entry</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <dublincore:creator>John</dublincore:creator>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Entry',
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          <feed xmlns="http://www.w3.org/2005/Atom" xmlns:dublincore="  http://purl.org/dc/elements/1.1/ ">
            <title>Test</title>
            <id>urn:uuid:feed</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Entry</title>
              <id>urn:uuid:entry</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <dublincore:creator>John</dublincore:creator>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Entry',
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          <feed xmlns="http://www.w3.org/2005/Atom" xmlns:dcterms="http://purl.org/dc/terms/">
            <title>Test</title>
            <id>urn:uuid:feed</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Entry</title>
              <id>urn:uuid:entry</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <dcterms:creator>Jane Doe</dcterms:creator>
              <dcterms:title>DC Terms Title</dcterms:title>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Entry',
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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

    describe('Atom namespace URI variants', () => {
      const expected = {
        title: 'Test Feed',
        id: 'urn:uuid:feed-id',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Test Entry',
            id: 'urn:uuid:entry-id',
            updated: '2024-01-01T00:00:00Z',
          },
        ],
      }

      for (const uri of namespaceUris.atom) {
        it(`should parse Atom feed with namespace URI: ${uri}`, () => {
          const value = `
            <?xml version="1.0" encoding="UTF-8"?>
            <feed xmlns="${uri}">
              <title>Test Feed</title>
              <id>urn:uuid:feed-id</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <entry>
                <title>Test Entry</title>
                <id>urn:uuid:entry-id</id>
                <updated>2024-01-01T00:00:00Z</updated>
              </entry>
            </feed>
          `

          expect(parse(value)).toEqual(expected)
        })
      }
    })

    describe('with maxItems option', () => {
      const commonValue = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Test Feed</title>
          <id>urn:uuid:feed-id</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <entry>
            <title>Entry 1</title>
            <id>urn:uuid:entry-1</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </entry>
          <entry>
            <title>Entry 2</title>
            <id>urn:uuid:entry-2</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </entry>
          <entry>
            <title>Entry 3</title>
            <id>urn:uuid:entry-3</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </entry>
        </feed>
      `

      it('should limit entries to specified number', () => {
        const expected = {
          title: 'Test Feed',
          id: 'urn:uuid:feed-id',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Entry 1',
              id: 'urn:uuid:entry-1',
              updated: '2024-01-01T00:00:00Z',
            },
            {
              title: 'Entry 2',
              id: 'urn:uuid:entry-2',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(commonValue, { maxItems: 2 })).toEqual(expected)
      })

      it('should skip all entries when maxItems is 0', () => {
        const expected = {
          title: 'Test Feed',
          id: 'urn:uuid:feed-id',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(commonValue, { maxItems: 0 })).toEqual(expected)
      })

      it('should return all entries when maxItems is undefined', () => {
        const expected = {
          title: 'Test Feed',
          id: 'urn:uuid:feed-id',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Entry 1',
              id: 'urn:uuid:entry-1',
              updated: '2024-01-01T00:00:00Z',
            },
            {
              title: 'Entry 2',
              id: 'urn:uuid:entry-2',
              updated: '2024-01-01T00:00:00Z',
            },
            {
              title: 'Entry 3',
              id: 'urn:uuid:entry-3',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(commonValue, { maxItems: undefined })).toEqual(expected)
      })
    })
  })

  it('should correctly parse Atom feed with OPDS catalog entry', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom" xmlns:opds="http://opds-spec.org/2010/catalog">
        <title>Example OPDS Catalog</title>
        <id>urn:uuid:example-catalog</id>
        <updated>2024-01-15T12:00:00Z</updated>
        <entry>
          <title>Example Book</title>
          <id>urn:isbn:9780000000001</id>
          <updated>2024-01-15T12:00:00Z</updated>
          <link href="https://example.com/book.epub" rel="http://opds-spec.org/acquisition/buy" type="application/epub+zip">
            <opds:price currencycode="USD">9.99</opds:price>
          </link>
          <link href="https://example.com/cover.jpg" rel="http://opds-spec.org/image" type="image/jpeg"/>
        </entry>
      </feed>
    `
    const expected = {
      title: 'Example OPDS Catalog',
      id: 'urn:uuid:example-catalog',
      updated: '2024-01-15T12:00:00Z',
      entries: [
        {
          title: 'Example Book',
          id: 'urn:isbn:9780000000001',
          updated: '2024-01-15T12:00:00Z',
          links: [
            {
              href: 'https://example.com/book.epub',
              rel: 'http://opds-spec.org/acquisition/buy',
              type: 'application/epub+zip',
              opds: {
                prices: [{ value: 9.99, currencyCode: 'USD' }],
              },
            },
            {
              href: 'https://example.com/cover.jpg',
              rel: 'http://opds-spec.org/image',
              type: 'image/jpeg',
            },
          ],
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should correctly parse Atom feed with OPDS faceted navigation', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom" xmlns:opds="http://opds-spec.org/2010/catalog">
        <title>Catalog with Facets</title>
        <id>urn:uuid:catalog-facets</id>
        <updated>2024-01-15T12:00:00Z</updated>
        <link href="https://example.com/catalog?sort=author" rel="http://opds-spec.org/facet" opds:facetGroup="Sort" opds:activeFacet="true"/>
        <link href="https://example.com/catalog?sort=title" rel="http://opds-spec.org/facet" opds:facetGroup="Sort" opds:activeFacet="false"/>
      </feed>
    `
    const expected = {
      title: 'Catalog with Facets',
      id: 'urn:uuid:catalog-facets',
      updated: '2024-01-15T12:00:00Z',
      links: [
        {
          href: 'https://example.com/catalog?sort=author',
          rel: 'http://opds-spec.org/facet',
          opds: {
            facetGroup: 'Sort',
            activeFacet: true,
          },
        },
        {
          href: 'https://example.com/catalog?sort=title',
          rel: 'http://opds-spec.org/facet',
          opds: {
            facetGroup: 'Sort',
            activeFacet: false,
          },
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should correctly parse Atom feed with OPDS indirect acquisition', () => {
    const value = `
      <?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom" xmlns:opds="http://opds-spec.org/2010/catalog">
        <title>Catalog with Indirect Acquisition</title>
        <id>urn:uuid:catalog-indirect</id>
        <updated>2024-01-15T12:00:00Z</updated>
        <entry>
          <title>Book via Checkout</title>
          <id>urn:isbn:9780000000002</id>
          <updated>2024-01-15T12:00:00Z</updated>
          <link href="https://example.com/checkout" rel="http://opds-spec.org/acquisition" type="text/html">
            <opds:indirectAcquisition type="application/epub+zip">
              <opds:indirectAcquisition type="application/x-mobipocket-ebook"/>
            </opds:indirectAcquisition>
          </link>
        </entry>
      </feed>
    `
    const expected = {
      title: 'Catalog with Indirect Acquisition',
      id: 'urn:uuid:catalog-indirect',
      updated: '2024-01-15T12:00:00Z',
      entries: [
        {
          title: 'Book via Checkout',
          id: 'urn:isbn:9780000000002',
          updated: '2024-01-15T12:00:00Z',
          links: [
            {
              href: 'https://example.com/checkout',
              rel: 'http://opds-spec.org/acquisition',
              type: 'text/html',
              opds: {
                indirectAcquisitions: [
                  {
                    type: 'application/epub+zip',
                    indirectAcquisitions: [{ type: 'application/x-mobipocket-ebook' }],
                  },
                ],
              },
            },
          ],
        },
      ],
    }

    expect(parse(value)).toEqual(expected)

  // Edge cases and quirks observed in feeds found in the wild.
  describe('real world feeds', () => {
    describe('character encoding', () => {
      it('RW-E01: should decode HTML numeric character references in entry title', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Caf&#233; Culture</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Caf\u00e9 Culture',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-E03: should decode named HTML entities in summary', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <summary>First &ndash; Second</summary>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              summary: 'First \u2013 Second',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-E04: should single-decode double-encoded entities', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Tom &amp;amp; Jerry</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Tom &amp; Jerry',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('content handling', () => {
      it('RW-D12: should parse entry content with HTML in CDATA', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content><![CDATA[<p>Full <strong>HTML</strong> content</p>]]></content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: '<p>Full <strong>HTML</strong> content</p>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D05: should parse entry with both summary and content', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <summary>A brief summary</summary>
              <content>Full content here</content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              summary: 'A brief summary',
              content: 'Full content here',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D11: should handle empty content element', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D07: should extract raw content from type="xhtml" with div wrapper', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content type="xhtml"><div xmlns="http://www.w3.org/1999/xhtml"><p>Hello <em>world</em></p></div></content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content:
                '<div xmlns="http://www.w3.org/1999/xhtml"><p>Hello <em>world</em></p></div>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D13: should parse content with src attribute as empty (src not captured)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content type="text/html" src="https://example.com/content.html"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D17: should preserve raw XHTML content with nested div', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content type="xhtml"><div xmlns="http://www.w3.org/1999/xhtml"><div class="article"><p>Text</p></div></div></content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content:
                '<div xmlns="http://www.w3.org/1999/xhtml"><div class="article"><p>Text</p></div></div>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D19: should parse content with non-text MIME type as plain text', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content type="image/png">iVBORw0KGgo=</content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: 'iVBORw0KGgo=',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D20: should decode entity-encoded markup in type="text" title', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title type="text">&lt;b&gt;Bold Title&lt;/b&gt;</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </feed>
        `
        const expected = {
          title: '<b>Bold Title</b>',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D21: should preserve raw XHTML content without div wrapper', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content type="xhtml"><p>No wrapper</p></content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: '<p>No wrapper</p>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('link handling', () => {
      it('RW-L04: should parse multiple link elements with different rel values', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <link href="https://example.com/" rel="alternate"/>
            <link href="https://example.com/feed.xml" rel="self" type="application/atom+xml"/>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <link href="https://example.com/post/1" rel="alternate"/>
              <link href="https://example.com/post/1/comments" rel="replies"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          links: [
            { href: 'https://example.com/', rel: 'alternate' },
            { href: 'https://example.com/feed.xml', rel: 'self', type: 'application/atom+xml' },
          ],
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [
                { href: 'https://example.com/post/1', rel: 'alternate' },
                { href: 'https://example.com/post/1/comments', rel: 'replies' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-L05: should parse link with hreflang attribute', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <link href="https://example.com/en/post" rel="alternate" hreflang="en"/>
              <link href="https://example.com/fr/post" rel="alternate" hreflang="fr"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [
                { href: 'https://example.com/en/post', rel: 'alternate', hreflang: 'en' },
                { href: 'https://example.com/fr/post', rel: 'alternate', hreflang: 'fr' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-L01: should preserve relative URLs in links', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <link href="/blog/post-1" rel="alternate"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [{ href: '/blog/post-1', rel: 'alternate' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-L11: should handle link with no href attribute', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <link rel="alternate" type="text/html"/>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <link rel="alternate"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          links: [{ rel: 'alternate', type: 'text/html' }],
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [{ rel: 'alternate' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-L18: should parse link rel="replies" after rel="alternate"', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <link rel="alternate" href="https://example.com/post"/>
              <link rel="replies" href="https://example.com/post/comments"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [
                { href: 'https://example.com/post', rel: 'alternate' },
                { href: 'https://example.com/post/comments', rel: 'replies' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-L19: should fall back to text content as href when link has no href attribute', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <link rel="enclosure" type="image/jpeg">https://example.com/image.jpg</link>
              <link rel="alternate" href="https://example.com/post"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [
                { href: 'https://example.com/image.jpg', rel: 'enclosure', type: 'image/jpeg' },
                { href: 'https://example.com/post', rel: 'alternate' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('author handling', () => {
      it('RW-M03: should parse multiple authors on entry', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Co-authored Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <author>
                <name>Alice</name>
                <email>alice@example.com</email>
              </author>
              <author>
                <name>Bob</name>
                <uri>https://bob.example.com</uri>
              </author>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Co-authored Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              authors: [
                { name: 'Alice', email: 'alice@example.com' },
                { name: 'Bob', uri: 'https://bob.example.com' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-M03: should parse feed-level author', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <author>
              <name>Feed Author</name>
              <uri>https://author.example.com</uri>
              <email>author@example.com</email>
            </author>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          authors: [
            {
              name: 'Feed Author',
              uri: 'https://author.example.com',
              email: 'author@example.com',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-M03: should parse contributor elements', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <author><name>Main Author</name></author>
              <contributor><name>Editor</name></contributor>
              <contributor><name>Reviewer</name></contributor>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              authors: [{ name: 'Main Author' }],
              contributors: [{ name: 'Editor' }, { name: 'Reviewer' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N17: should parse author with only email, no name', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <author>
                <email>author@example.com</email>
              </author>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              authors: [{ email: 'author@example.com' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N19: should parse author with only uri, no name', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <author>
                <uri>https://author.example.com</uri>
              </author>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              authors: [{ uri: 'https://author.example.com' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N24: should parse contributor with missing name', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <contributor>
                <email>jane@example.com</email>
                <uri>https://jane.example.com</uri>
              </contributor>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              contributors: [
                {
                  email: 'jane@example.com',
                  uri: 'https://jane.example.com',
                },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('namespace edge cases', () => {
      it('RW-Q01: should parse YouTube feed with yt namespace', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom"
                xmlns:yt="http://www.youtube.com/xml/schemas/2015"
                xmlns:media="http://search.yahoo.com/mrss/">
            <title>YouTube Channel</title>
            <id>urn:uuid:yt-channel</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <yt:channelId>UCxxxxxxxx</yt:channelId>
            <entry>
              <title>Video Title</title>
              <id>urn:uuid:yt-video</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <yt:videoId>dQw4w9WgXcQ</yt:videoId>
              <yt:channelId>UCxxxxxxxx</yt:channelId>
              <media:group>
                <media:title>Video Title</media:title>
                <media:description>Video description</media:description>
                <media:thumbnail url="https://img.youtube.com/thumb.jpg" width="480" height="360"/>
              </media:group>
            </entry>
          </feed>
        `
        const mediaGroup = {
          title: { value: 'Video Title' },
          description: { value: 'Video description' },
          thumbnails: [{ url: 'https://img.youtube.com/thumb.jpg', height: 360, width: 480 }],
        }
        const expected = {
          id: 'urn:uuid:yt-channel',
          title: 'YouTube Channel',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:yt-video',
              title: 'Video Title',
              updated: '2024-01-01T00:00:00Z',
              media: { groups: [mediaGroup], group: mediaGroup },
              yt: { videoId: 'dQw4w9WgXcQ', channelId: 'UCxxxxxxxx' },
            },
          ],
          yt: { channelId: 'UCxxxxxxxx' },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-NS05: should parse feed with media:content on entry', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom"
                xmlns:media="http://search.yahoo.com/mrss/">
            <title>Media Feed</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post with Image</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <media:content url="https://example.com/image.jpg" type="image/jpeg" medium="image"/>
              <media:thumbnail url="https://example.com/thumb.jpg" width="150" height="150"/>
            </entry>
          </feed>
        `
        const expected = {
          id: 'urn:uuid:test',
          title: 'Media Feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:1',
              title: 'Post with Image',
              updated: '2024-01-01T00:00:00Z',
              media: {
                contents: [
                  { url: 'https://example.com/image.jpg', type: 'image/jpeg', medium: 'image' },
                ],
                thumbnails: [{ url: 'https://example.com/thumb.jpg', height: 150, width: 150 }],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-NS01: should handle non-standard prefix for known namespace URI', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom"
                xmlns:dublincore="http://purl.org/dc/elements/1.1/">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <dublincore:creator>Author Name</dublincore:creator>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              dc: {
                creators: ['Author Name'],
                creator: 'Author Name',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-M10: should parse entry with multiple media:content elements', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom"
                xmlns:media="http://search.yahoo.com/mrss/">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <media:content url="https://example.com/video.mp4" type="video/mp4" medium="video"/>
              <media:content url="https://example.com/audio.mp3" type="audio/mpeg" medium="audio"/>
            </entry>
          </feed>
        `
        const expected = {
          id: 'urn:uuid:test',
          title: 'Test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:1',
              title: 'Post',
              updated: '2024-01-01T00:00:00Z',
              media: {
                contents: [
                  { url: 'https://example.com/video.mp4', type: 'video/mp4', medium: 'video' },
                  { url: 'https://example.com/audio.mp3', type: 'audio/mpeg', medium: 'audio' },
                ],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D22: should parse Atom 0.3 entry with mode="escaped" content', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://purl.org/atom/ns#">
            <title>Atom 0.3 Feed</title>
            <id>urn:uuid:test</id>
            <modified>2024-01-01T00:00:00Z</modified>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <modified>2024-01-01T00:00:00Z</modified>
              <content mode="escaped" type="text/html">&lt;p&gt;Hello &lt;b&gt;world&lt;/b&gt;&lt;/p&gt;</content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Atom 0.3 Feed',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: '<p>Hello <b>world</b></p>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('missing and empty elements', () => {
      it('RW-N07: should parse entry with no title', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content>Content without title</content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: 'Content without title',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N01: should parse feed with no entries', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Empty Feed</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </feed>
        `
        const expected = {
          title: 'Empty Feed',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N03: should handle empty summary', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <summary/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N11: should handle whitespace-only title', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>   </title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content>Has content but empty title</content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: 'Has content but empty title',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N15: should throw for empty feed container', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
          </feed>
        `

        expect(() => parse(value)).toThrow()
      })

      it('RW-N21: should parse entry with published but no updated', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <published>2024-01-15T10:30:00Z</published>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              published: '2024-01-15T10:30:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N23: should parse entry with no id', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <content>Some content here</content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              content: 'Some content here',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('date handling', () => {
      it('RW-T02: should preserve published and updated dates as strings', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-06-15T14:30:00+02:00</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <published>2024-06-15T12:00:00Z</published>
              <updated>2024-06-15T14:30:00+02:00</updated>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-06-15T14:30:00+02:00',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              published: '2024-06-15T12:00:00Z',
              updated: '2024-06-15T14:30:00+02:00',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-T12: should parse entry with both published and updated dates', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <published>2024-01-01T00:00:00Z</published>
              <updated>2024-06-15T12:00:00Z</updated>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              published: '2024-01-01T00:00:00Z',
              updated: '2024-06-15T12:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('cdata handling', () => {
      it('RW-C02: should handle CDATA in title', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title><![CDATA[Test & Blog]]></title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </feed>
        `
        const expected = {
          title: 'Test & Blog',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('malformed XML resilience', () => {
      it('RW-E10: should handle BOM at start of feed', () => {
        const value = `\uFEFF<?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>BOM Feed</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </feed>
        `
        const expected = {
          title: 'BOM Feed',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-E12: should handle unescaped ampersand in entry title via CDATA', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title><![CDATA[Tom & Jerry]]></title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Tom & Jerry',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-E06: should decode &nbsp; entity in content', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content>Hello&nbsp;World</content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: 'Hello\u00A0World',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-X01: should partially parse truncated XML without throwing', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
        `

        expect(() => parse(value)).not.toThrow()
      })

      it('RW-E17: should throw on unescaped less-than in content', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content>5 < 10</content>
            </entry>
          </feed>
        `

        expect(() => parse(value)).toThrow()
      })

      it('RW-X08: should strip XML comments from element content', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test<!-- hidden --> Feed</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post<!-- comment --> Title</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test Feed',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post Title',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-X09: should parse entries appearing before feed metadata', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
            </entry>
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-15T00:00:00Z</updated>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-15T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('stop node edge cases', () => {
      it('RW-D12: should preserve HTML tags in CDATA content', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content><![CDATA[<div><img src="test.jpg" /><p>Text with <a href="http://example.com">link</a> and <br/> break</p></div>]]></content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content:
                '<div><img src="test.jpg" /><p>Text with <a href="http://example.com">link</a> and <br/> break</p></div>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D04: should preserve escaped HTML in summary', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <summary>&lt;p&gt;Escaped paragraph&lt;/p&gt;</summary>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              summary: '<p>Escaped paragraph</p>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('partial and unusual structures', () => {
      it('RW-N02: should handle entry with only id and updated', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-A08: should handle generator with uri and version attributes', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <generator uri="https://example.com/gen" version="2.0">MyGenerator</generator>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          generator: {
            text: 'MyGenerator',
            uri: 'https://example.com/gen',
            version: '2.0',
          },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-A07: should handle category with term, scheme, and label', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <category term="tech" scheme="https://example.com/categories" label="Technology"/>
              <category term="programming"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              categories: [
                { term: 'tech', scheme: 'https://example.com/categories', label: 'Technology' },
                { term: 'programming' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-NS11: should handle entry source element', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Aggregator</title>
            <id>urn:uuid:aggregator</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Reposted Article</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <source>
                <title>Original Blog</title>
                <id>urn:uuid:original</id>
                <link href="https://original.example.com" rel="alternate"/>
              </source>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Aggregator',
          id: 'urn:uuid:aggregator',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Reposted Article',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              source: {
                title: 'Original Blog',
                id: 'urn:uuid:original',
                links: [{ href: 'https://original.example.com', rel: 'alternate' }],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-Q10: should not confuse entry title with source title', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Aggregator</title>
            <id>urn:uuid:aggregator</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Article Title</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <source>
                <title>Blog Name</title>
                <id>urn:uuid:blog</id>
              </source>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Aggregator',
          id: 'urn:uuid:aggregator',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Article Title',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              source: {
                title: 'Blog Name',
                id: 'urn:uuid:blog',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-A11: should parse feed with xml:lang attribute (attribute not captured)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-US">
            <title>English Feed</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
            </entry>
          </feed>
        `
        const expected = {
          title: 'English Feed',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-L06: should handle link with no rel attribute defaulting to just href', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <link href="https://example.com/"/>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <link href="https://example.com/post/1"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          links: [{ href: 'https://example.com/' }],
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [{ href: 'https://example.com/post/1' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-Q06: should handle rights element', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <rights>&copy; 2024 Example Corp</rights>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          rights: '\u00A9 2024 Example Corp',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D14: should decode double-escaped entities only once', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>CSS, &amp;lt;pre&amp;gt;, and more</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'CSS, &lt;pre&gt;, and more',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D15: should decode entity-encoded HTML in content', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content type="html">&lt;p&gt;Hello &lt;strong&gt;world&lt;/strong&gt;&lt;/p&gt;</content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: '<p>Hello <strong>world</strong></p>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-D16: should parse content and summary independently regardless of document order', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content type="html">Full article content here</content>
              <summary>Brief summary</summary>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: 'Full article content here',
              summary: 'Brief summary',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-L13: should decode XML entities in link href attribute', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <link href="https://example.com/search?q=test&amp;sort=new" rel="alternate"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [{ href: 'https://example.com/search?q=test&sort=new', rel: 'alternate' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-L15: should omit href from link when it is empty', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <link href="" rel="alternate" type="text/html"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [{ rel: 'alternate', type: 'text/html' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-L16: should capture all links without filtering by rel', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <link rel="self" href="https://example.com/feed/1"/>
              <link rel="alternate" href="https://example.com/post/1" type="text/html"/>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [
                { href: 'https://example.com/feed/1', rel: 'self' },
                { href: 'https://example.com/post/1', rel: 'alternate', type: 'text/html' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N20: should omit self-closing subtitle with type attribute only', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <subtitle type="text"/>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-A12: should omit author when name element is self-closing', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <author><name/></author>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-NS20: should handle xmlns with spaces around equals sign', () => {
        const value = `<feed xmlns = "http://www.w3.org/2005/Atom"><title>Test</title><id>urn:uuid:test</id><updated>2024-01-01T00:00:00Z</updated></feed>`
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-NS21: should preserve HTML5 summary element inside XHTML content without confusing it with Atom summary', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content type="xhtml"><div xmlns="http://www.w3.org/1999/xhtml"><details><summary>Click to expand</summary><p>Details here</p></details></div></content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content:
                '<div xmlns="http://www.w3.org/1999/xhtml"><details><summary>Click to expand</summary><p>Details here</p></details></div>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-NS22: should preserve raw XML inside content with XML media type', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
              <content type="application/mathml+xml"><math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math></content>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-NS23: should parse feed with non-standard a10: prefix for Atom namespace', () => {
        const value = `<a10:feed xmlns:a10="http://www.w3.org/2005/Atom"><a10:title>Test</a10:title><a10:id>urn:uuid:test</a10:id><a10:updated>2024-01-01T00:00:00Z</a10:updated></a10:feed>`
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-T11: should trim whitespace from date values', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
              <id>urn:uuid:1</id>
              <updated> 2024-01-15T10:30:00Z </updated>
            </entry>
          </feed>
        `
        const expected = {
          title: 'Test',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: 'Post',
              id: 'urn:uuid:1',
              updated: '2024-01-15T10:30:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-X16: should parse Atom 0.3 feed with legacy namespace and element names', () => {
        const value = `<feed xmlns="http://purl.org/atom/ns#"><title>Atom 0.3 Feed</title><id>urn:uuid:test</id><modified>2024-01-01T00:00:00Z</modified><tagline>A legacy feed</tagline></feed>`
        const expected = {
          title: 'Atom 0.3 Feed',
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          subtitle: 'A legacy feed',
        }

        expect(parse(value)).toEqual(expected)
      })
    })
  })

  describe('xml comment stripping', () => {
    it('should strip XML comments from element content', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Test<!-- hidden --> Feed</title>
          <id>urn:uuid:test</id>
          <updated>2024-01-01T00:00:00Z</updated>
          <entry>
            <title>Post<!-- comment --> Title</title>
            <id>urn:uuid:1</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </entry>
        </feed>
      `
      const expected = {
        title: 'Test Feed',
        id: 'urn:uuid:test',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: 'Post Title',
            id: 'urn:uuid:1',
            updated: '2024-01-01T00:00:00Z',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })
  })
})
