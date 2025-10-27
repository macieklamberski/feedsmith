import { describe, expect, it } from 'bun:test'
import { locales, namespaceUris } from '../../../common/config.js'
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
    const value = `
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

    expect(parse(value)).toEqual(expectation)
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
      <rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns="http://purl.org/rss/1.0/"
        xmlns:a10="http://www.w3.org/2005/Atom"
      >
        <channel rdf:about="http://example.com">
          <title>Test Feed</title>
          <link>http://example.com</link>
          <description>Test feed description</description>
          <a10:link href="https://example.com/feed" rel="self" />
        </channel>
        <item rdf:about="http://example.com/item1">
          <title>Test Item</title>
          <link>http://example.com/item1</link>
          <description>Test item description</description>
          <a10:link href="https://example.com/item1" rel="alternate" />
        </item>
      </rdf:RDF>
    `
    const expected = {
      title: 'Test Feed',
      link: 'http://example.com',
      description: 'Test feed description',
      atom: {
        links: [{ href: 'https://example.com/feed', rel: 'self' }],
      },
      items: [
        {
          title: 'Test Item',
          link: 'http://example.com/item1',
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
    it('should handle RDF 1.0 feeds with no additional namespaces', () => {
      const value = `
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

      expect(parse(value)).toEqual(expected)
    })

    it('should handle rdf root element without namespace prefix nor definition', () => {
      const value = `
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

      expect(parse(value)).toEqual(expected)
    })

    it('should handle RDF 0.9 with non-prefixed root element', () => {
      const value = `
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

      expect(parse(value)).toEqual(expected)
    })

    it('should handle RDF 0.9 with default namespace', () => {
      const value = `
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

      expect(parse(value)).toEqual(expected)
    })

    it('should normalize custom prefixes to standard prefixes in RDF 1.0', () => {
      const value = `
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
              creators: ['John Doe'],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle namespace declarations in nested elements in RDF 0.9', () => {
      const value = `
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
              creators: ['John Doe'],
              date: '2023-01-01',
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

    it('should handle mixed case with namespace logic in RDF 1.0', () => {
      const value = `
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
              creators: ['John Doe'],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle self-closing elements with namespace declarations in RDF 1.0', () => {
      const value = `
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

      expect(parse(value)).toEqual(expected)
    })

    it('should handle namespace URIs with leading/trailing whitespace', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf:RDF
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns="http://purl.org/rss/1.0/"
          xmlns:dc="  http://purl.org/dc/elements/1.1/  "
          xmlns:sy=" http://purl.org/rss/1.0/modules/syndication/ "
          xmlns:slash="	http://purl.org/rss/1.0/modules/slash/	"
        >
          <channel rdf:about="http://example.com">
            <title>RDF Feed</title>
            <link>http://example.com</link>
            <description>RDF Feed Description</description>
            <dc:creator>Feed Author</dc:creator>
            <sy:updatePeriod>hourly</sy:updatePeriod>
          </channel>
          <item rdf:about="http://example.com/item1">
            <title>Item Title</title>
            <link>http://example.com/item1</link>
            <description>Item Description</description>
            <dc:creator>John Doe</dc:creator>
            <dc:date>2023-01-01</dc:date>
            <slash:comments>42</slash:comments>
          </item>
        </rdf:RDF>
      `
      const expected = {
        title: 'RDF Feed',
        link: 'http://example.com',
        description: 'RDF Feed Description',
        dc: {
          creator: 'Feed Author',
          creators: ['Feed Author'],
        },
        sy: {
          updatePeriod: 'hourly',
        },
        items: [
          {
            title: 'Item Title',
            link: 'http://example.com/item1',
            description: 'Item Description',
            dc: {
              creator: 'John Doe',
              creators: ['John Doe'],
              date: '2023-01-01',
              dates: ['2023-01-01'],
            },
            slash: {
              comments: 42,
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle malformed namespace declarations in RDF feeds', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf:RDF
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns="http://purl.org/rss/1.0/"
          xmlns:123="http://example.com/invalid"
          xmlns:dc=""
        >
          <channel rdf:about="http://example.com">
            <title>RDF Feed</title>
            <link>http://example.com</link>
            <description>Feed with malformed namespaces</description>
          </channel>
          <item rdf:about="http://example.com/item1">
            <title>Item Title</title>
            <dc:creator>Should not normalize (empty URI)</dc:creator>
            <123:field>Invalid prefix</123:field>
          </item>
        </rdf:RDF>
      `
      const expected = {
        title: 'RDF Feed',
        link: 'http://example.com',
        description: 'Feed with malformed namespaces',
        items: [
          {
            title: 'Item Title',
            dc: {
              creator: 'Should not normalize (empty URI)',
              creators: ['Should not normalize (empty URI)'],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle RDF with wrong primary namespace', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss:RDF
          xmlns:rss="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns="http://example.com/not-rss"
        >
          <channel rss:about="http://example.com">
            <title>RDF with wrong namespace</title>
            <link>http://example.com</link>
          </channel>
          <item rss:about="http://example.com/item1">
            <title>Item Title</title>
          </item>
        </rss:RDF>
      `
      const expected = {
        title: 'RDF with wrong namespace',
        link: 'http://example.com',
        items: [
          {
            title: 'Item Title',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle missing required RDF elements', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf:RDF
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns="http://purl.org/rss/1.0/"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
        >
          <channel rdf:about="">
            <!-- Missing required elements -->
            <dc:creator>Channel Author</dc:creator>
          </channel>
          <item>
            <!-- Missing rdf:about attribute -->
            <title>Item without about</title>
            <dc:creator>Item Author</dc:creator>
          </item>
        </rdf:RDF>
      `
      const expected = {
        dc: {
          creator: 'Channel Author',
          creators: ['Channel Author'],
        },
        items: [
          {
            title: 'Item without about',
            dc: {
              creator: 'Item Author',
              creators: ['Item Author'],
            },
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should handle namespace conflicts between RDF versions', () => {
      const value = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
          <channel
            rdf:about="http://example.com"
            xmlns="http://channel.netscape.com/rdf/simple/0.9/"
          >
            <title>RDF 0.9 Channel</title>
            <link>http://example.com</link>
          </channel>
          <item
            rdf:about="http://example.com/item1"
            xmlns="http://purl.org/rss/1.0/"
          >
            <title>RDF 1.0 Item</title>
            <link>http://example.com/item1</link>
          </item>
        </rdf:RDF>
      `
      const expected = {
        title: 'RDF 0.9 Channel',
        link: 'http://example.com',
        items: [
          {
            title: 'RDF 1.0 Item',
            link: 'http://example.com/item1',
          },
        ],
      }

      expect(parse(value)).toEqual(expected)
    })

    describe('non-standard namespace URIs', () => {
      it('should work with HTTPS variant and custom prefix', () => {
        const value = `
          <?xml version="1.0" encoding="UTF-8"?>
          <rdf:RDF
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns="http://purl.org/rss/1.0/"
            xmlns:dublincore="https://purl.org/dc/elements/1.1/"
          >
            <channel rdf:about="http://example.com">
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
            </channel>
            <item rdf:about="http://example.com/item1">
              <title>Item</title>
              <dublincore:creator>John</dublincore:creator>
            </item>
          </rdf:RDF>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
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
          <rdf:RDF
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns="http://purl.org/rss/1.0/"
            xmlns:dublincore="http://purl.org/dc/elements/1.1"
          >
            <channel rdf:about="http://example.com">
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
            </channel>
            <item rdf:about="http://example.com/item1">
              <title>Item</title>
              <dublincore:creator>John</dublincore:creator>
            </item>
          </rdf:RDF>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
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
          <rdf:RDF
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns="http://purl.org/rss/1.0/"
            xmlns:dublincore="HTTP://PURL.ORG/DC/ELEMENTS/1.1/"
          >
            <channel rdf:about="http://example.com">
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
            </channel>
            <item rdf:about="http://example.com/item1">
              <title>Item</title>
              <dublincore:creator>John</dublincore:creator>
            </item>
          </rdf:RDF>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
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
          <rdf:RDF
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns="http://purl.org/rss/1.0/"
            xmlns:dublincore="Http://Purl.Org/Dc/Elements/1.1/"
          >
            <channel rdf:about="http://example.com">
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
            </channel>
            <item rdf:about="http://example.com/item1">
              <title>Item</title>
              <dublincore:creator>John</dublincore:creator>
            </item>
          </rdf:RDF>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
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
          <rdf:RDF
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns="http://purl.org/rss/1.0/"
            xmlns:dublincore="HTTPS://PURL.ORG/DC/ELEMENTS/1.1/"
          >
            <channel rdf:about="http://example.com">
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
            </channel>
            <item rdf:about="http://example.com/item1">
              <title>Item</title>
              <dublincore:creator>John</dublincore:creator>
            </item>
          </rdf:RDF>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
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
          <rdf:RDF
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns="http://purl.org/rss/1.0/"
            xmlns:dublincore="  http://purl.org/dc/elements/1.1/ "
          >
            <channel rdf:about="http://example.com">
              <title>Test</title>
              <link>http://example.com</link>
              <description>Test</description>
            </channel>
            <item rdf:about="http://example.com/item1">
              <title>Item</title>
              <dublincore:creator>John</dublincore:creator>
            </item>
          </rdf:RDF>
        `
        const expected = {
          title: 'Test',
          link: 'http://example.com',
          description: 'Test',
          items: [
            {
              title: 'Item',
              dc: {
                creator: 'John',
              },
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('RDF namespace URI variants', () => {
      const expected = {
        title: 'Test Feed',
        link: 'http://example.com',
        description: 'Test Description',
        items: [
          {
            title: 'Test Item',
            link: 'http://example.com/item1',
          },
        ],
      }

      for (const uri of namespaceUris.rdf) {
        it(`should parse RDF feed with namespace URI: ${uri}`, () => {
          const value = `
            <?xml version="1.0" encoding="UTF-8"?>
            <rdf:RDF
              xmlns:rdf="${uri}"
              xmlns="http://purl.org/rss/1.0/"
            >
              <channel rdf:about="http://example.com">
                <title>Test Feed</title>
                <link>http://example.com</link>
                <description>Test Description</description>
              </channel>
              <item rdf:about="http://example.com/item1">
                <title>Test Item</title>
                <link>http://example.com/item1</link>
              </item>
            </rdf:RDF>
          `

          expect(parse(value)).toEqual(expected)
        })
      }
    })
  })
})
