import { describe, expect, test } from 'bun:test'
import { detect } from './index.js'

describe('detect', () => {
  test('detect valid Atom feed with xmlns declaration', () => {
    const atomFeed = `
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Feed</title>
      </feed>
    `

    expect(detect(atomFeed)).toBe(true)
  })

  test('handle case sensitivity correctly', () => {
    const uppercaseFeed = `
      <?xml version="1.0" encoding="utf-8"?>
      <FEED xmlns="http://www.w3.org/2005/Atom">
        <title>Example Feed</title>
      </FEED>
    `

    expect(detect(uppercaseFeed)).toBe(true)
  })

  test('detect Atom feed without xmlns declaration', () => {
    const atomFeed = `
      <?xml version="1.0"?>
      <feed>
        <title>Feed</title>
      </feed>
    `

    expect(detect(atomFeed)).toBe(true)
  })

  test('detect Atom feed with namespace prefix', () => {
    const atomFeed = `
      <?xml version="1.0" encoding="utf-8"?>
      <atom:feed xmlns:atom="http://www.w3.org/2005/Atom">
        <atom:title>Example Feed</atom:title>
      </atom:feed>
    `

    expect(detect(atomFeed)).toBe(true)
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

  test('return false for RDF feed', () => {
    const rdfFeed = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns="http://purl.org/rss/1.0/">
        <channel>
          <title>RDF Example</title>
        </channel>
      </rdf:RDF>
    `

    expect(detect(rdfFeed)).toBe(false)
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
