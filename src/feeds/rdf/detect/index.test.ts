import { describe, expect, test } from 'bun:test'
import { detect } from './index.js'

describe('detect', () => {
  test('detect valid RDF feed with xmlns declaration', () => {
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

    expect(detect(rdfFeed)).toBe(true)
  })

  test('handle case sensitivity correctly', () => {
    const uppercaseFeed = `
      <?xml version="1.0"?>
        <RDF:RDF
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns="http://purl.org/rss/1.0/"
        >
          <CHANNEL rdf:about="http://example.org/rss">
            <title>Example Feed</title>
            <link>http://example.org</link>
          </CHANNEL>
          <iTeM rdf:about="http://example.org/item/1">
            <title>Example Item</title>
            <link>http://example.org/item/1</link>
          </iTeM>
        </RDF:RDF>
    `

    expect(detect(uppercaseFeed)).toBe(true)
  })

  test('detect RDF feed without xmlns declaration', () => {
    const rdfFeed = `
      <?xml version="1.0"?>
        <rdf:RDF>
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

    expect(detect(rdfFeed)).toBe(true)
  })

  test('return false for Atom feed', () => {
    const atomFeed = `
      <?xml version="1.0" encoding="utf-8"?>
      <feed xmlns:atom="http://www.w3.org/2005/Atom">
        <title>Example Feed</title>
      </feed>
    `

    expect(detect(atomFeed)).toBe(false)
  })

  test('return false for RSS feed', () => {
    const rssFeed = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>RSS Title</title>
        </channel>
      </rss>
    `

    expect(detect(rssFeed)).toBe(false)
  })

  test('return false for JSON feed', () => {
    const jsonFeed = `
      {
        "version": "https://jsonfeed.org/version/1.1",
        "title": "Example Feed",
      }
    `

    expect(detect(jsonFeed)).toBe(false)
  })

  test('return false for plain HTML', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Example Page</title>
        </head>
        <body>
          <h1>Hello World</h1>
          <p>This is not a feed.</p>
        </body>
      </html>
    `

    expect(detect(html)).toBe(false)
  })

  test('return false for empty string or non-string value', () => {
    expect(detect('')).toBe(false)
    expect(detect(undefined)).toEqual(false)
    expect(detect(null)).toEqual(false)
    expect(detect([])).toEqual(false)
    expect(detect({})).toEqual(false)
  })
})
