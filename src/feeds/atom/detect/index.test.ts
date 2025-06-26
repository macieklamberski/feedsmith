import { describe, expect, it } from 'bun:test'
import { detect } from './index.js'

describe('detect', () => {
  it('should detect valid Atom feed with xmlns declaration', () => {
    const atomFeed = `
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Feed</title>
      </feed>
    `

    expect(detect(atomFeed)).toBe(true)
  })

  it('should handle case sensitivity correctly', () => {
    const uppercaseFeed = `
      <?xml version="1.0" encoding="utf-8"?>
      <FEED xmlns="http://www.w3.org/2005/Atom">
        <title>Example Feed</title>
      </FEED>
    `

    expect(detect(uppercaseFeed)).toBe(true)
  })

  it('should detect Atom feed with multi-line <feed> tag', () => {
    const atomFeed = `
      <?xml version="1.0"?>
      <feed
        xmlns="http://www.w3.org/2005/Atom"
        xmlns:thr="http://purl.org/syndication/thread/1.0"
        xml:lang="en-US"
      >
        <title>Feed</title>
      </feed>
    `

    expect(detect(atomFeed)).toBe(true)
  })

  it('should detect Atom feed without xmlns declaration', () => {
    const atomFeed = `
      <?xml version="1.0"?>
      <feed>
        <title>Feed</title>
      </feed>
    `

    expect(detect(atomFeed)).toBe(true)
  })

  it('should detect Atom feed with namespace prefix', () => {
    const atomFeed = `
      <?xml version="1.0" encoding="utf-8"?>
      <atom:feed xmlns:atom="http://www.w3.org/2005/Atom">
        <atom:title>Example Feed</atom:title>
      </atom:feed>
    `

    expect(detect(atomFeed)).toBe(true)
  })

  it('should return false for feed element in CDATA', () => {
    const cdataFeed = `
      <?xml version="1.0"?>
      <root>
        <![CDATA[<feed xmlns="http://www.w3.org/2005/Atom"><title>Test</title></feed>]]>
      </root>
    `

    expect(detect(cdataFeed)).toBe(false)
  })

  it('should detect self-closing feed tag', () => {
    const selfClosingFeed = `
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom" />
    `

    expect(detect(selfClosingFeed)).toBe(true)
  })

  it('should detect mixed case ATOM elements', () => {
    const mixedCaseFeed = `
      <feed>
        <TITLE>Example Feed</TITLE>
        <Entry>
          <Summary>Test content</Summary>
        </Entry>
      </feed>
    `

    expect(detect(mixedCaseFeed)).toBe(true)
  })

  it('should detect minimal ATOM feed', () => {
    const minimalFeed = '<feed><title>Test</title></feed>'

    expect(detect(minimalFeed)).toBe(true)
  })

  it('should return false for feed in attribute value', () => {
    const feedInAttribute = `
      <root>
        <element data="&lt;feed&gt;&lt;title&gt;Test&lt;/title&gt;&lt;/feed&gt;">
          <content>Not a feed</content>
        </element>
      </root>
    `

    expect(detect(feedInAttribute)).toBe(false)
  })

  it('should return false for feed with wrong namespace and no ATOM elements', () => {
    const wrongNamespace = `
      <feed xmlns="http://example.com/custom">
        <heading>Not ATOM</heading>
        <item>Custom content</item>
      </feed>
    `

    expect(detect(wrongNamespace)).toBe(false)
  })

  // it('return false for feed element in XML comments', () => {
  //   const commentedFeed = `
  //     <?xml version="1.0"?>
  //     <root>
  //       <!-- <feed xmlns="http://www.w3.org/2005/Atom"><title>Test</title></feed> -->
  //       <content>Not a feed</content>
  //     </root>
  //   `

  //   expect(detect(commentedFeed)).toBe(false)
  // })

  it('should return false for RSS feed', () => {
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

  it('should return false for RDF feed', () => {
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

  it('should return false for JSON feed', () => {
    const jsonFeed = `
      {
        "version": "https://jsonfeed.org/version/1.1",
        "title": "Example Feed",
      }
    `

    expect(detect(jsonFeed)).toBe(false)
  })

  it('should return false for plain HTML', () => {
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

  it('should return false for empty string or non-string value', () => {
    expect(detect('')).toBe(false)
    expect(detect(undefined)).toBe(false)
    expect(detect(null)).toBe(false)
    expect(detect([])).toBe(false)
    expect(detect({})).toBe(false)
  })
})
