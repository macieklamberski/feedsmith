import { describe, expect, it } from 'bun:test'
import { locales, namespaceUris } from '../../../common/config.js'
import { DetectError, MalformedError, ParseError } from '../../../common/errors.js'
import type { AtomFeed } from '../common/types.js'
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

      expect(parse(input)).toEqual(expected)
    })
  }

  it('should correctly parse Atom 1.0 feed with mixed case tags', () => {
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
      title: { value: 'Mixed Case Atom Feed' },
      subtitle: { value: 'A test feed with mixed case tags' },
      id: 'urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6',
      updated: '2024-01-10T12:00:00Z',
      links: [
        { href: 'https://example.com/', rel: 'alternate' },
        { href: 'https://example.com/atom.xml', rel: 'self' },
      ],
      rights: { value: 'Copyright 2024, Example Corp' },
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
          title: { value: 'First Entry' },
          id: 'urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a',
          links: [{ href: 'https://example.com/entry1', rel: 'alternate' }],
          published: '2024-01-01T12:00:00Z',
          updated: '2024-01-02T09:30:00Z',
          authors: [{ name: 'John Doe' }],
          content: {
            type: 'html',
            value: '<p>This is the first entry in a mixed case Atom feed.</p>',
          },
          summary: { value: 'Summary of the first entry' },
          categories: [{ term: 'samples', label: 'Samples' }],
        },
        {
          title: { value: 'Second Entry' },
          id: 'urn:uuid:1225c695-cfb8-4ebb-bbbb-80da344efa6a',
          links: [{ href: 'https://example.com/entry2', rel: 'alternate' }],
          published: '2024-01-03T14:30:00Z',
          updated: '2024-01-03T15:45:00Z',
          authors: [{ name: 'Jane Smith' }],
          content: { type: 'text', value: 'This is the second entry in a mixed case Atom feed.' },
          summary: { value: 'Summary of the second entry' },
          categories: [{ term: 'docs', label: 'Documentation' }],
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle alternating case entries', () => {
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
      title: { value: 'Test Feed' },
      id: 'urn:uuid:test-feed',
      updated: '2024-01-10T12:00:00Z',
      entries: [
        {
          title: { value: 'First' },
          id: 'urn:uuid:1',
          updated: '2024-01-01T12:00:00Z',
        },
        {
          title: { value: 'Second' },
          id: 'urn:uuid:2',
          updated: '2024-01-02T12:00:00Z',
        },
        {
          title: { value: 'Third' },
          id: 'urn:uuid:3',
          updated: '2024-01-03T12:00:00Z',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should correctly parse namespaced Atom feed', () => {
    const value = `
      <?xml version="1.0" encoding="utf-8"?>
      <atom:feed atom:xmlns="http://www.w3.org/2005/Atom">
        <atom:title>Example Feed</atom:title>
        <atom:id>example-feed</atom:id>
        <atom:entry>
          <atom:title>Example Entry</atom:title>
          <atom:id>example-entry</atom:id>
        </atom:entry>
      </atom:feed>
    `
    const expected = {
      id: 'example-feed',
      title: { value: 'Example Feed' },
      entries: [
        {
          id: 'example-entry',
          title: { value: 'Example Entry' },
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse an xhtml title in a fully prefixed Atom feed', () => {
    const value = `
      <?xml version="1.0" encoding="utf-8"?>
      <atom:feed xmlns:atom="http://www.w3.org/2005/Atom">
        <atom:id>example-feed</atom:id>
        <atom:title type="xhtml"><div xmlns="http://www.w3.org/1999/xhtml"><p>a &lt; b</p></div></atom:title>
      </atom:feed>
    `
    const expected = {
      id: 'example-feed',
      title: {
        value: '<p>a &lt; b</p>',
        type: 'xhtml',
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse xhtml text constructs inside at:deleted-entry', () => {
    const value = `
      <?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom" xmlns:at="http://purl.org/atompub/tombstones/1.0">
        <id>example-feed</id>
        <at:deleted-entry ref="tag:example.org,2005:/entries/2" when="2005-11-29T12:11:12Z">
          <at:comment type="xhtml"><div xmlns="http://www.w3.org/1999/xhtml"><p>Removed <b>spam</b></p></div></at:comment>
          <source>
            <id>tag:example.org,2005:/feed</id>
            <title type="xhtml"><div xmlns="http://www.w3.org/1999/xhtml">Source <em>feed</em></div></title>
          </source>
        </at:deleted-entry>
      </feed>
    `
    const expected = {
      id: 'example-feed',
      at: {
        deletedEntries: [
          {
            ref: 'tag:example.org,2005:/entries/2',
            when: '2005-11-29T12:11:12Z',
            comment: {
              value: '<p>Removed <b>spam</b></p>',
              type: 'xhtml',
            },
            source: {
              id: 'tag:example.org,2005:/feed',
              title: {
                value: 'Source <em>feed</em>',
                type: 'xhtml',
              },
            },
          },
        ],
      },
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
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Test</title
        </feed>
      `
      const throwing = () => parse(value)

      expect(throwing).toThrowError(MalformedError)
      expect(throwing).toThrowError(locales.invalidFeedFormat)
    })

    it('should throw ParseError for valid XML with invalid structure', () => {
      const value = '<feed xmlns="http://www.w3.org/2005/Atom"></feed>'
      const throwing = () => parse(value)

      expect(throwing).toThrowError(ParseError)
      expect(throwing).toThrowError(locales.invalidFeedFormat)
    })
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
      title: { value: 'YouTube Channel Feed' },
      id: 'yt:channel:UCuAXFkgsw1L7xaCfnd5JJOw',
      updated: '2024-01-10T12:00:00Z',
      yt: {
        channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
      },
      entries: [
        {
          id: 'yt:video:dQw4w9WgXcQ',
          title: { value: 'Example YouTube Video' },
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
      title: { value: 'YouTube Playlist Feed' },
      id: 'yt:playlist:PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
      updated: '2024-01-10T12:00:00Z',
      yt: {
        playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
      },
      entries: [
        {
          id: 'yt:video:OTYFJaT-Glk',
          title: { value: 'Video in Playlist' },
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
        title: { value: 'Simple Feed' },
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Simple Entry' },
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
        title: { value: 'Test Feed' },
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Test Entry' },
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
        title: { value: 'Test Feed' },
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Test Entry' },
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
        title: { value: 'Atom Feed' },
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Entry Title' },
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
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
        title: { value: 'Atom Feed' },
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Entry Title' },
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
            dc: {
              creators: ['John Doe'],
              dates: ['2023-01-01'],
            },
          },
          {
            title: { value: 'Entry Without Namespace' },
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
        title: { value: 'Feed Title' },
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Entry Title' },
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
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
        title: { value: 'Atom Feed' },
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Entry 1' },
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
            title: { value: 'Entry 2' },
            id: 'urn:uuid:abcdef',
            updated: '2024-01-01T00:00:00Z',
            summary: { value: 'No media namespace here' },
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
        title: { value: 'Atom Feed' },
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Entry Title' },
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
            dc: {
              creators: ['John Doe'],
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
        title: { value: 'Atom Feed' },
        id: 'urn:uuid:12345',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Entry Title' },
            id: 'urn:uuid:67890',
            updated: '2024-01-01T00:00:00Z',
            dc: {
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
        title: { value: 'Atom Feed with Custom Default NS' },
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
        title: { value: 'Incomplete Feed' },
        entries: [
          {
            title: { value: 'Incomplete Entry' },
            dc: {
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
        title: { value: 'Feed Title' },
        id: 'urn:uuid:feed',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Entry with different default namespace' },
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
      const expected: AtomFeed.Feed<string> = {
        title: { value: 'Feed with GooglePlay' },
        id: 'urn:uuid:feed-id',
        updated: '2024-01-01T00:00:00Z',
        googleplay: {
          author: 'Podcast Creator',
          explicit: false,
        },
        entries: [
          {
            title: { value: 'Episode with GooglePlay' },
            id: 'urn:uuid:entry-id',
            updated: '2024-01-01T00:00:00Z',
            googleplay: {
              author: 'Episode Author',
              explicit: 'clean',
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
          title: { value: 'Test' },
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Entry' },
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          title: { value: 'Test' },
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Entry' },
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          title: { value: 'Test' },
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Entry' },
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          title: { value: 'Test' },
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Entry' },
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          title: { value: 'Test' },
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Entry' },
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          title: { value: 'Test' },
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Entry' },
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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
          title: { value: 'Test' },
          id: 'urn:uuid:feed',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Entry' },
              id: 'urn:uuid:entry',
              updated: '2024-01-01T00:00:00Z',
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

    describe('Atom namespace URI variants', () => {
      const expected = {
        title: { value: 'Test Feed' },
        id: 'urn:uuid:feed-id',
        updated: '2024-01-01T00:00:00Z',
        entries: [
          {
            title: { value: 'Test Entry' },
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
          title: { value: 'Test Feed' },
          id: 'urn:uuid:feed-id',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Entry 1' },
              id: 'urn:uuid:entry-1',
              updated: '2024-01-01T00:00:00Z',
            },
            {
              title: { value: 'Entry 2' },
              id: 'urn:uuid:entry-2',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(commonValue, { maxItems: 2 })).toEqual(expected)
      })

      it('should skip all entries when maxItems is 0', () => {
        const expected = {
          title: { value: 'Test Feed' },
          id: 'urn:uuid:feed-id',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(commonValue, { maxItems: 0 })).toEqual(expected)
      })

      it('should return all entries when maxItems is undefined', () => {
        const expected = {
          title: { value: 'Test Feed' },
          id: 'urn:uuid:feed-id',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Entry 1' },
              id: 'urn:uuid:entry-1',
              updated: '2024-01-01T00:00:00Z',
            },
            {
              title: { value: 'Entry 2' },
              id: 'urn:uuid:entry-2',
              updated: '2024-01-01T00:00:00Z',
            },
            {
              title: { value: 'Entry 3' },
              id: 'urn:uuid:entry-3',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(commonValue, { maxItems: undefined })).toEqual(expected)
      })
    })
  })

  describe('parseDateFn', () => {
    it('should apply custom parseDateFn to feed and entry dates', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Test</title>
          <id>urn:uuid:feed</id>
          <updated>2024-01-10T12:00:00Z</updated>
          <entry>
            <title>Entry</title>
            <id>urn:uuid:entry</id>
            <published>2024-01-01T12:00:00Z</published>
            <updated>2024-01-02T09:30:00Z</updated>
          </entry>
        </feed>
      `
      const expected = {
        title: { value: 'Test' },
        id: 'urn:uuid:feed',
        updated: new Date('2024-01-10T12:00:00Z'),
        entries: [
          {
            title: { value: 'Entry' },
            id: 'urn:uuid:entry',
            published: new Date('2024-01-01T12:00:00Z'),
            updated: new Date('2024-01-02T09:30:00Z'),
          },
        ],
      }

      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should apply custom parseDateFn to dc namespace dates', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
          <title>Test</title>
          <id>urn:uuid:feed</id>
          <updated>2024-01-10T12:00:00Z</updated>
          <entry>
            <title>Entry</title>
            <id>urn:uuid:entry</id>
            <updated>2024-01-02T09:30:00Z</updated>
            <dc:date>2024-01-01T12:00:00Z</dc:date>
          </entry>
        </feed>
      `
      const expected = {
        title: { value: 'Test' },
        id: 'urn:uuid:feed',
        updated: new Date('2024-01-10T12:00:00Z'),
        entries: [
          {
            title: { value: 'Entry' },
            id: 'urn:uuid:entry',
            updated: new Date('2024-01-02T09:30:00Z'),
            dc: {
              dates: [new Date('2024-01-01T12:00:00Z')],
            },
          },
        ],
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should apply custom parseDateFn to thr link dates', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom" xmlns:thr="http://purl.org/syndication/thread/1.0">
          <title>Test</title>
          <id>urn:uuid:feed</id>
          <updated>2024-01-10T12:00:00Z</updated>
          <entry>
            <title>Entry</title>
            <id>urn:uuid:entry</id>
            <updated>2024-01-02T09:30:00Z</updated>
            <link href="https://example.com/comments" rel="replies" thr:count="5" thr:updated="2024-01-05T12:00:00Z" />
          </entry>
        </feed>
      `
      const expected = {
        title: { value: 'Test' },
        id: 'urn:uuid:feed',
        updated: new Date('2024-01-10T12:00:00Z'),
        entries: [
          {
            title: { value: 'Entry' },
            id: 'urn:uuid:entry',
            updated: new Date('2024-01-02T09:30:00Z'),
            links: [
              {
                href: 'https://example.com/comments',
                rel: 'replies',
                thr: {
                  count: 5,
                  updated: new Date('2024-01-05T12:00:00Z'),
                },
              },
            ],
          },
        ],
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should apply custom parseDateFn to app namespace dates', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
          <title>Test</title>
          <id>urn:uuid:feed</id>
          <updated>2024-01-10T12:00:00Z</updated>
          <entry>
            <title>Entry</title>
            <id>urn:uuid:entry</id>
            <updated>2024-01-02T09:30:00Z</updated>
            <app:edited>2024-01-03T15:00:00Z</app:edited>
          </entry>
        </feed>
      `
      const expected = {
        title: { value: 'Test' },
        id: 'urn:uuid:feed',
        updated: new Date('2024-01-10T12:00:00Z'),
        entries: [
          {
            title: { value: 'Entry' },
            id: 'urn:uuid:entry',
            updated: new Date('2024-01-02T09:30:00Z'),
            app: {
              edited: new Date('2024-01-03T15:00:00Z'),
            },
          },
        ],
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should propagate error when parseDateFn throws', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Test</title>
          <id>urn:uuid:feed</id>
          <updated>invalid</updated>
        </feed>
      `
      const parseDateFn = () => {
        throw new Error('Parse failed')
      }
      const throwing = () => parse(value, { parseDateFn })

      expect(throwing).toThrowError('Parse failed')
    })
  })

  // Edge cases and quirks observed in feeds found in the wild.
  describe('real world feeds', () => {
    describe('character encoding', () => {
      it('should decode HTML numeric character references in entry title (RW-E01)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Caf\u00e9 Culture' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode named HTML entities in summary (RW-E03)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              summary: { value: 'First \u2013 Second' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should single-decode double-encoded entities (RW-E04)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Salt &amp;amp; Pepper</title>
              <id>urn:uuid:1</id>
              <updated>2024-01-01T00:00:00Z</updated>
            </entry>
          </feed>
        `
        const expected = {
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Salt &amp; Pepper' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('content handling', () => {
      it('should parse entry content with HTML in CDATA (RW-D12)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: { value: '<p>Full <strong>HTML</strong> content</p>' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse entry with both summary and content (RW-D05)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              summary: { value: 'A brief summary' },
              content: { value: 'Full content here' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle empty content element (RW-D11)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should extract raw content from type="xhtml" with div wrapper (RW-D07)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: {
                type: 'xhtml',
                value: '<p>Hello <em>world</em></p>',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should capture the src and type of external content (RW-D13)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              content: {
                src: 'https://example.com/content.html',
                type: 'text/html',
              },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve raw XHTML content with nested div (RW-D17)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: {
                type: 'xhtml',
                value: '<div class="article"><p>Text</p></div>',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse content with non-text MIME type as plain text (RW-D19)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: { type: 'image/png', value: 'iVBORw0KGgo=' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode entity-encoded markup in type="text" title (RW-D20)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title type="text">&lt;b&gt;Weekly Digest&lt;/b&gt;</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </feed>
        `
        const expected = {
          title: { type: 'text', value: '<b>Weekly Digest</b>' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve raw XHTML content without div wrapper (RW-D21)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: { type: 'xhtml', value: '<p>No wrapper</p>' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('link handling', () => {
      it('should parse multiple link elements with different rel values (RW-L04)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          links: [
            { href: 'https://example.com/', rel: 'alternate' },
            { href: 'https://example.com/feed.xml', rel: 'self', type: 'application/atom+xml' },
          ],
          entries: [
            {
              title: { value: 'Post' },
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

      it('should parse link with hreflang attribute (RW-L05)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
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

      it('should preserve relative URLs in links (RW-L01)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [{ href: '/blog/post-1', rel: 'alternate' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle link with no href attribute (RW-L11)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          links: [{ rel: 'alternate', type: 'text/html' }],
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [{ rel: 'alternate' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse link rel="replies" after rel="alternate" (RW-L18)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
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

      it('should fall back to text content as href when link has no href attribute (RW-L19)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
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
      it('should parse multiple authors on entry (RW-M03)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Co-authored Post' },
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

      it('should parse feed-level author (RW-M03)', () => {
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
          title: { value: 'Test' },
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

      it('should parse contributor elements (RW-M03)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              authors: [{ name: 'Main Author' }],
              contributors: [{ name: 'Editor' }, { name: 'Reviewer' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse author with only email, no name (RW-N17)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              authors: [{ email: 'author@example.com' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse author with only uri, no name (RW-N19)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              authors: [{ uri: 'https://author.example.com' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse contributor with missing name (RW-N24)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
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
      it('should parse YouTube feed with yt namespace (RW-Q01)', () => {
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
              <yt:videoId>a1b2c3d4e5f</yt:videoId>
              <yt:channelId>UCxxxxxxxx</yt:channelId>
              <media:group>
                <media:title>Video Title</media:title>
                <media:description>Video description</media:description>
                <media:thumbnail url="https://example.com/thumbnail.jpg" width="480" height="360"/>
              </media:group>
            </entry>
          </feed>
        `
        const mediaGroup = {
          title: { value: 'Video Title' },
          description: { value: 'Video description' },
          thumbnails: [{ url: 'https://example.com/thumbnail.jpg', height: 360, width: 480 }],
        }
        const expected = {
          id: 'urn:uuid:yt-channel',
          title: { value: 'YouTube Channel' },
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:yt-video',
              title: { value: 'Video Title' },
              updated: '2024-01-01T00:00:00Z',
              media: { groups: [mediaGroup] },
              yt: { videoId: 'a1b2c3d4e5f', channelId: 'UCxxxxxxxx' },
            },
          ],
          yt: { channelId: 'UCxxxxxxxx' },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse feed with media:content on entry (RW-NS05)', () => {
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
          title: { value: 'Media Feed' },
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:1',
              title: { value: 'Post with Image' },
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

      it('should handle non-standard prefix for known namespace URI (RW-NS01)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              dc: {
                creators: ['Author Name'],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse entry with multiple media:content elements (RW-M10)', () => {
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
          title: { value: 'Test' },
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:1',
              title: { value: 'Post' },
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

      it('should parse Atom 0.3 entry with mode="escaped" content (RW-D22)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://purl.org/atom/ns#">
            <title>Legacy Feed</title>
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
          title: { value: 'Legacy Feed' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: { type: 'text/html', value: '<p>Hello <b>world</b></p>' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('missing and empty elements', () => {
      it('should parse entry with no title (RW-N07)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: { value: 'Content without title' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse feed with no entries (RW-N01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Empty Feed</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </feed>
        `
        const expected = {
          title: { value: 'Empty Feed' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle empty summary (RW-N03)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle whitespace-only title (RW-N11)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: { value: 'Has content but empty title' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should throw for empty feed container (RW-N15)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
          </feed>
        `

        expect(() => parse(value)).toThrow()
      })

      it('should parse entry with published but no updated (RW-N21)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              published: '2024-01-15T10:30:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse entry with no id (RW-N23)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              content: { value: 'Some content here' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('date handling', () => {
      it('should preserve published and updated dates as strings (RW-T02)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-06-15T14:30:00+02:00',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              published: '2024-06-15T12:00:00Z',
              updated: '2024-06-15T14:30:00+02:00',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse entry with both published and updated dates (RW-T12)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
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
      it('should handle CDATA in title (RW-C02)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title><![CDATA[Test & Blog]]></title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </feed>
        `
        const expected = {
          title: { value: 'Test & Blog' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('malformed XML resilience', () => {
      it('should handle BOM at start of feed (RW-E10)', () => {
        const value = `\uFEFF<?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>BOM Feed</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
          </feed>
        `
        const expected = {
          title: { value: 'BOM Feed' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle unescaped ampersand in entry title via CDATA (RW-E12)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Tom & Jerry' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode &nbsp; entity in content (RW-E06)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: { value: 'Hello\u00A0World' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse XML truncated after a closed element (RW-X01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Test</title>
            <id>urn:uuid:test</id>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <title>Post</title>
        `
        const expected = {
          id: 'urn:uuid:test',
          title: { value: 'Test' },
          updated: '2024-01-01T00:00:00Z',
          entries: [{ title: { value: 'Post' } }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should throw on XML truncated inside an element (RW-X01)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns="http://www.w3.org/2005/Atom">
            <title>Incomplete
        `
        const throwing = () => parse(value)

        expect(throwing).toThrowError(MalformedError)
      })

      it('should parse feed with DOCTYPE declaration (RW-X04)', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <!DOCTYPE feed SYSTEM "https://example.com/atom.dtd">
          <feed xmlns="http://www.w3.org/2005/Atom">
            <id>urn:uuid:test</id>
            <title>Test</title>
            <updated>2024-01-01T00:00:00Z</updated>
            <entry>
              <id>urn:uuid:post</id>
              <title>Post</title>
              <updated>2024-01-01T00:00:00Z</updated>
            </entry>
          </feed>
        `
        const expected = {
          id: 'urn:uuid:test',
          title: { value: 'Test' },
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              id: 'urn:uuid:post',
              title: { value: 'Post' },
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should throw on unescaped less-than in content (RW-E17)', () => {
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

      it('should strip XML comments from element content (RW-X08)', () => {
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
          title: { value: 'Test Feed' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post Title' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse entries appearing before feed metadata (RW-X09)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-15T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('stop node edge cases', () => {
      it('should preserve HTML tags in CDATA content (RW-D12)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: {
                value:
                  '<div><img src="test.jpg" /><p>Text with <a href="http://example.com">link</a> and <br/> break</p></div>',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve escaped HTML in summary (RW-D04)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              summary: { value: '<p>Escaped paragraph</p>' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('partial and unusual structures', () => {
      it('should handle entry with only id and updated (RW-N02)', () => {
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
          title: { value: 'Test' },
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

      it('should handle generator with uri and version attributes (RW-A08)', () => {
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
          title: { value: 'Test' },
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

      it('should handle category with term, scheme, and label (RW-A07)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
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

      it('should handle entry source element (RW-NS11)', () => {
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
          title: { value: 'Aggregator' },
          id: 'urn:uuid:aggregator',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Reposted Article' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              source: {
                title: { value: 'Original Blog' },
                id: 'urn:uuid:original',
                links: [{ href: 'https://original.example.com', rel: 'alternate' }],
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should not confuse entry title with source title (RW-Q10)', () => {
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
          title: { value: 'Aggregator' },
          id: 'urn:uuid:aggregator',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Article Title' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              source: {
                title: { value: 'Blog Name' },
                id: 'urn:uuid:blog',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse feed with xml:lang attribute (RW-A11)', () => {
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
          title: { value: 'English Feed' },
          xml: { lang: 'en-US' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle link with no rel attribute defaulting to just href (RW-L06)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          links: [{ href: 'https://example.com/' }],
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [{ href: 'https://example.com/post/1' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle rights element (RW-Q06)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          rights: { value: '\u00A9 2024 Example Corp' },
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode double-escaped entities only once (RW-D14)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'CSS, &lt;pre&gt;, and more' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode entity-encoded HTML in content (RW-D15)', () => {
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
              <content type="html">&lt;p&gt;Release &lt;strong&gt;notes&lt;/strong&gt;&lt;/p&gt;</content>
            </entry>
          </feed>
        `
        const expected = {
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: { type: 'html', value: '<p>Release <strong>notes</strong></p>' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse content and summary independently regardless of document order (RW-D16)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: { type: 'html', value: 'Full article content here' },
              summary: { value: 'Brief summary' },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should decode XML entities in link href attribute (RW-L13)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [{ href: 'https://example.com/search?q=test&sort=new', rel: 'alternate' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should omit href from link when it is empty (RW-L15)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              links: [{ rel: 'alternate', type: 'text/html' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should capture all links without filtering by rel (RW-L16)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
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

      it('should omit self-closing subtitle with type attribute only (RW-N20)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should omit author when name element is self-closing (RW-A12)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle xmlns with spaces around equals sign (RW-NS20)', () => {
        const value = `<feed xmlns = "http://www.w3.org/2005/Atom"><title>Test</title><id>urn:uuid:test</id><updated>2024-01-01T00:00:00Z</updated></feed>`
        const expected = {
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve HTML5 summary element inside XHTML content without confusing it with Atom summary (RW-NS21)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: {
                type: 'xhtml',
                value: '<details><summary>Click to expand</summary><p>Details here</p></details>',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve raw XML inside content with XML media type (RW-NS22)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-01T00:00:00Z',
              content: {
                type: 'application/mathml+xml',
                value: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse feed with non-standard a10: prefix for Atom namespace (RW-NS23)', () => {
        const value = `<a10:feed xmlns:a10="http://www.w3.org/2005/Atom"><a10:title>Test</a10:title><a10:id>urn:uuid:test</a10:id><a10:updated>2024-01-01T00:00:00Z</a10:updated></a10:feed>`
        const expected = {
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should trim whitespace from date values (RW-T11)', () => {
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
          title: { value: 'Test' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          entries: [
            {
              title: { value: 'Post' },
              id: 'urn:uuid:1',
              updated: '2024-01-15T10:30:00Z',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse Atom 0.3 feed with legacy namespace and element names (RW-X16)', () => {
        const value = `<feed xmlns="http://purl.org/atom/ns#"><title>Legacy Feed</title><id>urn:uuid:test</id><modified>2024-01-01T00:00:00Z</modified><tagline>A legacy feed</tagline></feed>`
        const expected = {
          title: { value: 'Legacy Feed' },
          id: 'urn:uuid:test',
          updated: '2024-01-01T00:00:00Z',
          subtitle: { value: 'A legacy feed' },
        }

        expect(parse(value)).toEqual(expected)
      })
    })
  })
})
