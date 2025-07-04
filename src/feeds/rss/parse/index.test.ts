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
    const input = `
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
    const result = parse(input)

    expect(result).toEqual(expectation)
  })

  it('should throw error for invalid input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.invalid)
  })

  it('should handle null input', () => {
    expect(() => parse(null)).toThrowError(locales.invalid)
  })

  it('should handle undefined input', () => {
    expect(() => parse(undefined)).toThrowError(locales.invalid)
  })

  it('should handle array input', () => {
    expect(() => parse([])).toThrowError(locales.invalid)
  })

  it('should handle empty object input', () => {
    expect(() => parse({})).toThrowError(locales.invalid)
  })

  it('should handle string input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.invalid)
  })

  it('should handle number input', () => {
    expect(() => parse(123)).toThrowError(locales.invalid)
  })

  describe('namespace normalization integration', () => {
    it('should handle feeds with no namespaces', () => {
      const input = `
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
      const result = parse(input)

      expect(result).toEqual(expected)
    })

    it('should normalize custom prefixes to standard prefixes', () => {
      const input = `
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
              creator: 'John Doe',
            },
          },
        ],
      }
      const result = parse(input)

      expect(result).toEqual(expected)
    })

    it('should handle namespace declarations in nested elements', () => {
      const input = `
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
      const result = parse(input)

      expect(result).toEqual(expected)
    })

    it('should handle mixed case with namespace logic', () => {
      const input = `
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
              creator: 'John Doe',
            },
          },
        ],
      }
      const result = parse(input)

      expect(result).toEqual(expected)
    })

    it('should handle self-closing elements with namespace declarations', () => {
      const input = `
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
      const result = parse(input)

      expect(result).toEqual(expected)
    })
  })
})
