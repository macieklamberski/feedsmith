import { describe, expect, it } from 'bun:test'
import { locales } from './config.js'
import { parse } from './parse.js'

describe('parse', () => {
  it('should parse valid Atom feed', () => {
    const value = `
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Feed</title>
        <id>example-feed</id>
      </feed>
    `
    const expected = {
      format: 'atom' as const,
      feed: {
        title: { value: 'Feed' },
        id: 'example-feed',
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse valid JSON feed', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      home_page_url: 'https://example.com/',
      feed_url: 'https://example.com/feed.json',
      authors: [{ name: 'John Doe', url: 'https://example.com/johndoe' }],
      language: 'en-US',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
          url: 'https://example.com/post/1',
          title: 'First post',
          date_published: '2023-01-01T00:00:00Z',
          language: 'en-US',
        },
      ],
    }
    const expected = {
      format: 'json' as const,
      feed: {
        title: 'My Example Feed',
        home_page_url: 'https://example.com/',
        feed_url: 'https://example.com/feed.json',
        authors: [{ name: 'John Doe', url: 'https://example.com/johndoe' }],
        language: 'en-US',
        items: [
          {
            id: '1',
            content_html: '<p>Hello world</p>',
            url: 'https://example.com/post/1',
            title: 'First post',
            date_published: '2023-01-01T00:00:00Z',
            language: 'en-US',
          },
        ],
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON feed from string', () => {
    const value = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      home_page_url: 'https://example.com/',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
          title: 'First post',
        },
      ],
    })
    const expected = {
      format: 'json' as const,
      feed: {
        title: 'My Example Feed',
        home_page_url: 'https://example.com/',
        items: [
          {
            id: '1',
            content_html: '<p>Hello world</p>',
            title: 'First post',
          },
        ],
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON feed from string with leading whitespace', () => {
    const json = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    })
    const value = `  ${json}`
    const expected = {
      format: 'json' as const,
      feed: {
        title: 'Feed with whitespace',
        items: [{ id: '1', content_text: 'Test' }],
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON feed from string with trailing whitespace', () => {
    const json = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    })
    const value = `${json}  `
    const expected = {
      format: 'json' as const,
      feed: {
        title: 'Feed with whitespace',
        items: [{ id: '1', content_text: 'Test' }],
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON feed from string with whitespace on both ends', () => {
    const json = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    })
    const value = `  ${json}  `
    const expected = {
      format: 'json' as const,
      feed: {
        title: 'Feed with whitespace',
        items: [{ id: '1', content_text: 'Test' }],
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should reject malformed JSON string', () => {
    const value = '{"version":"https://jsonfeed.org/version/1.1","title":"Malformed'

    expect(() => parse(value)).toThrowError(locales.unrecognizedFeedFormat)
  })

  it('should reject JSON array string', () => {
    const value = '[{"version":"https://jsonfeed.org/version/1.1"}]'

    expect(() => parse(value)).toThrowError(locales.unrecognizedFeedFormat)
  })

  it('should parse valid RSS feed', () => {
    const value = `
      <?xml version="1.0"?>
      <rss version="2.0">
        <channel>
          <title>Feed</title>
          <link>https://example.com/feed</link>
          <description>Example Feed</description>
        </channel>
      </rss>
    `
    const expected = {
      format: 'rss' as const,
      feed: {
        title: 'Feed',
        link: 'https://example.com/feed',
        description: 'Example Feed',
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse valid RDF feed', () => {
    const value = `
      <?xml version="1.0"?>
      <rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns="http://purl.org/rss/1.0/"
      >
        <channel rdf:about="http://example.org/rss">
          <title>Example Feed</title>
          <link>http://example.org</link>
        </channel>
        <item rdf:about="http://example.org/item/1">
          <title>Example Item</title>
          <link>http://example.org/item/1</link>
        </item>
      </rdf:RDF>
    `
    const expected = {
      format: 'rdf' as const,
      feed: {
        title: 'Example Feed',
        link: 'http://example.org',
        items: [
          {
            title: 'Example Item',
            link: 'http://example.org/item/1',
            rdf: { about: 'http://example.org/item/1' },
          },
        ],
        rdf: { about: 'http://example.org/rss' },
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should throw error for invalid input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.unrecognizedFeedFormat)
  })

  it('should handle null input', () => {
    expect(() => parse(null)).toThrowError(locales.unrecognizedFeedFormat)
  })

  it('should handle undefined input', () => {
    expect(() => parse(undefined)).toThrowError(locales.unrecognizedFeedFormat)
  })

  it('should handle array input', () => {
    expect(() => parse([])).toThrowError(locales.unrecognizedFeedFormat)
  })

  it('should handle empty object input', () => {
    expect(() => parse({})).toThrowError(locales.unrecognizedFeedFormat)
  })

  it('should handle string input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.unrecognizedFeedFormat)
  })

  it('should handle number input', () => {
    expect(() => parse(123)).toThrowError(locales.unrecognizedFeedFormat)
  })

  describe('leading/trailing garbage', () => {
    it('should parse RSS feed with PHP warning before XML declaration', () => {
      const value = `
        Warning: Undefined variable $post_meta in /var/www/html/wp-content/themes/mytheme/functions.php on line 123
        <?xml version="1.0"?>
        <rss version="2.0">
          <channel>
            <title>Feed</title>
            <link>https://example.com/feed</link>
            <description>Example Feed</description>
          </channel>
        </rss>
      `
      const expected = {
        format: 'rss' as const,
        feed: {
          title: 'Feed',
          link: 'https://example.com/feed',
          description: 'Example Feed',
        },
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should parse RSS feed with multiple PHP errors before RSS tag (no XML declaration)', () => {
      const value = `
        Notice: ob_end_flush(): failed to delete buffer in /var/www/html/wp-admin/includes/misc.php on line 234
        Deprecated: Function get_magic_quotes_gpc() is deprecated in /var/www/html/wp-includes/load.php on line 789

        <rss version="2.0">
          <channel>
            <title>Feed</title>
            <link>https://example.com/feed</link>
            <description>Example Feed</description>
          </channel>
        </rss>
      `
      const expected = {
        format: 'rss' as const,
        feed: {
          title: 'Feed',
          link: 'https://example.com/feed',
          description: 'Example Feed',
        },
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should parse Atom feed with HTML-formatted PHP errors', () => {
      const value = `
        <br />
        <b>Warning</b>:  Undefined variable $test in <b>/home/user/public_html/wp-content/themes/theme/feed-template.php</b> on line <b>42</b><br />

        <?xml version="1.0"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Feed</title>
          <id>example-feed</id>
        </feed>
      `
      const expected = {
        format: 'atom' as const,
        feed: {
          title: { value: 'Feed' },
          id: 'example-feed',
        },
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should parse RDF feed with whitespace and text before XML', () => {
      const value = `

        WordPress database error: [Table 'wp_postmeta' doesn't exist]

        <?xml version="1.0"?>
        <rdf:RDF
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns="http://purl.org/rss/1.0/"
        >
          <channel rdf:about="http://example.org/rss">
            <title>Example Feed</title>
            <link>http://example.org</link>
          </channel>
          <item rdf:about="http://example.org/item/1">
            <title>Example Item</title>
            <link>http://example.org/item/1</link>
          </item>
        </rdf:RDF>
      `
      const expected = {
        format: 'rdf' as const,
        feed: {
          title: 'Example Feed',
          link: 'http://example.org',
          items: [
            {
              title: 'Example Item',
              link: 'http://example.org/item/1',
              rdf: { about: 'http://example.org/item/1' },
            },
          ],
          rdf: { about: 'http://example.org/rss' },
        },
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should parse RSS feed with only whitespace before XML', () => {
      const value = `

        <?xml version="1.0"?>
        <rss version="2.0">
          <channel>
            <title>Feed</title>
            <link>https://example.com/feed</link>
            <description>Example Feed</description>
          </channel>
        </rss>
      `
      const expected = {
        format: 'rss' as const,
        feed: {
          title: 'Feed',
          link: 'https://example.com/feed',
          description: 'Example Feed',
        },
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should parse RSS feed with PHP error after closing tag', () => {
      const value = `
        <?xml version="1.0"?>
        <rss version="2.0">
          <channel>
            <title>Feed</title>
            <link>https://example.com/feed</link>
            <description>Example Feed</description>
          </channel>
        </rss>
        Warning: Cannot modify header information - headers already sent in /var/www/html/wp-includes/pluggable.php on line 1234
      `
      const expected = {
        format: 'rss' as const,
        feed: {
          title: 'Feed',
          link: 'https://example.com/feed',
          description: 'Example Feed',
        },
      }

      expect(parse(value)).toEqual(expected)
    })

    it('should parse Atom feed with whitespace and text after closing tag', () => {
      const value = `
        <?xml version="1.0"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Feed</title>
          <id>example-feed</id>
        </feed>

        Notice: Undefined index: cache_key in /var/www/html/wp-content/plugins/plugin.php on line 56
      `
      const expected = {
        format: 'atom' as const,
        feed: {
          title: { value: 'Feed' },
          id: 'example-feed',
        },
      }

      expect(parse(value)).toEqual(expected)
    })
  })
})
