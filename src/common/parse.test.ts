import { describe, expect, it } from 'bun:test'
import { locales } from './config'
import { parse } from './parse'

describe('parse', () => {
  it('parse valid Atom feed', () => {
    const value = `
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

    expect(parse(value)).toEqual(expected)
  })

  it('parse valid JSON feed', () => {
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
      type: 'json' as const,
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

  it('parse valid RSS feed', () => {
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
      type: 'rss' as const,
      feed: {
        title: 'Feed',
        link: 'https://example.com/feed',
        description: 'Example Feed',
      },
    }

    expect(parse(value)).toEqual(expected)
  })

  it('parse valid RDF feed', () => {
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

    expect(parse(value)).toEqual(expected)
  })

  it('should throw error for invalid input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.unrecognized)
  })

  it('should handle null input', () => {
    expect(() => parse(null)).toThrowError(locales.unrecognized)
  })

  it('should handle undefined input', () => {
    expect(() => parse(undefined)).toThrowError(locales.unrecognized)
  })

  it('should handle array input', () => {
    expect(() => parse([])).toThrowError(locales.unrecognized)
  })

  it('should handle empty object input', () => {
    expect(() => parse({})).toThrowError(locales.unrecognized)
  })

  it('should handle string input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.unrecognized)
  })

  it('should handle number input', () => {
    expect(() => parse(123)).toThrowError(locales.unrecognized)
  })
})
