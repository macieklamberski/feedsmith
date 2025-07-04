import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { parse } from './index.js'

describe('parse', () => {
  const versions = {
    '09': '0.9',
    '10': '1.0',
    ns: 'with namespaces',
  }

  for (const [key, label] of Object.entries(versions)) {
    it(`should correctly parse RDF ${label}`, async () => {
      const reference = `${import.meta.dir}/../references/rdf-${key}`
      const input = await Bun.file(`${reference}.xml`).text()
      const expectation = await Bun.file(`${reference}.json`).json()
      const result = parse(input)

      expect(result).toEqual(expectation)
    })
  }

  it('should correctly parse RDF with mixed case tags', async () => {
    const input = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <?xml version="1.0"?>
      <RDF:rdf
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns="http://channel.netscape.com/rdf/simple/0.9/"
      >
        <CHANNEL>
          <title>Mozilla Dot Org</title>
          <LINK>http://www.mozilla.org</LINK>
          <description>the Mozilla Organization web site</description>
        </CHANNEL>
        <ItEM RDF:aBOUT="http://example.org/item1">
          <TITle>New Status Updates</TITle>
          <link>http://www.mozilla.org/status/</link>
        </ItEM>
      </RDF:rdf>
    `
    const expectation = {
      title: 'Mozilla Dot Org',
      link: 'http://www.mozilla.org',
      description: 'the Mozilla Organization web site',
      items: [{ title: 'New Status Updates', link: 'http://www.mozilla.org/status/' }],
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
    it('should handle RDF 1.0 feeds with no additional namespaces', () => {
      const input = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/">
          <channel rdf:about="http://example.com">
            <title>Simple Feed</title>
            <link>http://example.com</link>
            <description>Simple Description</description>
          </channel>
          <item rdf:about="http://example.com/item1">
            <title>Simple Item</title>
            <link>http://example.com/item1</link>
            <description>Simple Item Description</description>
          </item>
        </rdf:RDF>
      `
      const expected = {
        title: 'Simple Feed',
        link: 'http://example.com',
        description: 'Simple Description',
        items: [
          {
            title: 'Simple Item',
            link: 'http://example.com/item1',
            description: 'Simple Item Description',
          },
        ],
      }
      const result = parse(input)

      expect(result).toEqual(expected)
    })

    it('should handle rdf root element without namespace prefix nor definition', () => {
      const input = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf>
          <channel>
            <title>RDF Feed</title>
            <link>http://example.com</link>
            <description>RDF Feed Description</description>
          </channel>
          <item about="http://example.com/item1">
            <title>Item Title</title>
            <link>http://example.com/item1</link>
            <description>Item Description</description>
          </item>
        </rdf>
      `
      const expected = {
        title: 'RDF Feed',
        link: 'http://example.com',
        description: 'RDF Feed Description',
        items: [
          {
            title: 'Item Title',
            link: 'http://example.com/item1',
            description: 'Item Description',
          },
        ],
      }
      const result = parse(input)

      expect(result).toEqual(expected)
    })

    it('should handle RDF 0.9 with non-prefixed root element', () => {
      const input = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf xmlns="http://channel.netscape.com/rdf/simple/0.9/">
          <channel>
            <title>RDF 0.9 Feed</title>
            <link>http://example.com</link>
            <description>RDF 0.9 Feed Description</description>
          </channel>
          <item about="http://example.com/item1">
            <title>Item Title</title>
            <link>http://example.com/item1</link>
            <description>Item Description</description>
          </item>
        </rdf>
      `
      const expected = {
        title: 'RDF 0.9 Feed',
        link: 'http://example.com',
        description: 'RDF 0.9 Feed Description',
        items: [
          {
            title: 'Item Title',
            link: 'http://example.com/item1',
            description: 'Item Description',
          },
        ],
      }
      const result = parse(input)

      expect(result).toEqual(expected)
    })

    it('should handle RDF 0.9 with default namespace', () => {
      const input = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://channel.netscape.com/rdf/simple/0.9/">
          <channel>
            <title>RDF 0.9 Feed</title>
            <link>http://example.com</link>
            <description>RDF 0.9 Description</description>
          </channel>
          <item rdf:about="http://example.com/item1">
            <title>RDF 0.9 Item</title>
            <link>http://example.com/item1</link>
            <description>RDF 0.9 Item Description</description>
          </item>
        </rdf:RDF>
      `
      const expected = {
        title: 'RDF 0.9 Feed',
        link: 'http://example.com',
        description: 'RDF 0.9 Description',
        items: [
          {
            title: 'RDF 0.9 Item',
            link: 'http://example.com/item1',
            description: 'RDF 0.9 Item Description',
          },
        ],
      }
      const result = parse(input)

      expect(result).toEqual(expected)
    })

    it('should normalize custom prefixes to standard prefixes in RDF 1.0', () => {
      const input = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:custom="http://purl.org/dc/elements/1.1/">
          <channel rdf:about="http://example.com">
            <title>RDF 1.0 Feed</title>
            <link>http://example.com</link>
            <description>RDF 1.0 Feed Description</description>
          </channel>
          <item rdf:about="http://example.com/item1">
            <title>Item Title</title>
            <link>http://example.com/item1</link>
            <description>Item Description</description>
            <custom:creator>John Doe</custom:creator>
          </item>
        </rdf:RDF>
      `
      const expected = {
        title: 'RDF 1.0 Feed',
        link: 'http://example.com',
        description: 'RDF 1.0 Feed Description',
        items: [
          {
            title: 'Item Title',
            link: 'http://example.com/item1',
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

    it('should handle namespace declarations in nested elements in RDF 0.9', () => {
      const input = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://channel.netscape.com/rdf/simple/0.9/">
          <channel>
            <title>RDF 0.9 Feed</title>
            <link>http://example.com</link>
            <description>RDF 0.9 Feed Description</description>
          </channel>
          <item rdf:about="http://example.com/item1" xmlns:dc="http://purl.org/dc/elements/1.1/">
            <title>Item Title</title>
            <link>http://example.com/item1</link>
            <description>Item Description</description>
            <dc:creator>John Doe</dc:creator>
            <dc:date>2023-01-01</dc:date>
          </item>
          <item rdf:about="http://example.com/item2">
            <title>Item Without Namespace</title>
            <link>http://example.com/item2</link>
            <description>Item Description</description>
          </item>
        </rdf:RDF>
      `
      const expected = {
        title: 'RDF 0.9 Feed',
        link: 'http://example.com',
        description: 'RDF 0.9 Feed Description',
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

    it('should handle mixed case with namespace logic in RDF 1.0', () => {
      const input = `
        <?xml version="1.0" encoding="UTF-8"?>
        <RDF:RDF xmlns:RDF="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:DC="http://purl.org/dc/elements/1.1/">
          <CHANNEL>
            <TITLE>Feed Title</TITLE>
            <LINK>http://example.com</LINK>
            <DESCRIPTION>Feed Description</DESCRIPTION>
          </CHANNEL>
          <ITEM RDF:about="http://example.com/item1">
            <TITLE>Item Title</TITLE>
            <LINK>http://example.com/item1</LINK>
            <DESCRIPTION>Item Description</DESCRIPTION>
            <DC:Creator>John Doe</DC:Creator>
          </ITEM>
        </RDF:RDF>
      `
      const expected = {
        title: 'Feed Title',
        link: 'http://example.com',
        description: 'Feed Description',
        items: [
          {
            title: 'Item Title',
            link: 'http://example.com/item1',
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

    it('should handle self-closing elements with namespace declarations in RDF 1.0', () => {
      const input = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/">
          <channel>
            <title>RDF Feed</title>
            <link>http://example.com</link>
            <description>RDF Feed Description</description>
          </channel>
          <item rdf:about="http://example.com/item1">
            <title>Item 1</title>
            <link>http://example.com/item1</link>
            <description>Item Description</description>
            <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="http://example.com/thumb.jpg"/>
          </item>
          <item rdf:about="http://example.com/item2">
            <title>Item 2</title>
            <link>http://example.com/item2</link>
            <description>No media namespace here</description>
          </item>
        </rdf:RDF>
      `
      const expected = {
        title: 'RDF Feed',
        link: 'http://example.com',
        description: 'RDF Feed Description',
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
