import { describe, expect, test } from 'bun:test'
import { parse } from './parse'

describe('parse', () => {
  test('parse valid Atom feed', () => {
    const atomFeed = `
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Feed</title>
        <id>example-feed</id>
      </feed>
    `
    const expected = {
      type: 'atom' as const,
      feed: {
        title: 'Feed',
        id: 'example-feed',
      },
    }

    expect(parse(atomFeed)).toEqual(expected)
  })

  test('parse valid JSON feed', () => {
    const jsonFeed = {
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
      type: 'json' as const,
      feed: jsonFeed,
    }

    expect(parse(jsonFeed)).toEqual(expected)
  })

  test('parse valid RSS feed', () => {
    const rssFeed = `
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
      type: 'rss' as const,
      feed: {
        title: 'Feed',
        link: 'https://example.com/feed',
        description: 'Example Feed',
      },
    }

    expect(parse(rssFeed)).toEqual(expected)
  })

  test('parse valid RDF feed', () => {
    const rdfFeed = `
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
      type: 'rdf' as const,
      feed: {
        title: 'Example Feed',
        link: 'http://example.org',
        items: [
          {
            title: 'Example Item',
            link: 'http://example.org/item/1',
          },
        ],
      },
    }

    expect(parse(rdfFeed)).toEqual(expected)
  })

  test('should return undefined for non-feed input', () => {
    expect(parse('not an object')).toBeUndefined()
    expect(parse(undefined)).toBeUndefined()
    expect(parse(null)).toBeUndefined()
    expect(parse([])).toBeUndefined()
  })
})
