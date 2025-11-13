import { describe, expect, it } from 'bun:test'
import { detect } from './index.js'

describe('detect', () => {
  it('should detect valid RDF feed with xmlns declaration', () => {
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

  it('should handle case sensitivity correctly', () => {
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

  it('should detect RDF feed without xmlns declaration', () => {
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

  it('should detect RDF feed with multi-line <rdf:RDF> tag', () => {
    const rdfFeed = `
      <?xml version="1.0"?>
      <rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns="http://purl.org/rss/1.0/"
        xmlns:dc="http://purl.org/dc/elements/1.1/"
      >
        <channel rdf:about="http://example.org/">
          <title>Example Feed</title>
        </channel>
      </rdf:RDF>
    `

    expect(detect(rdfFeed)).toBe(true)
  })

  it('should return false for RDF element in CDATA', () => {
    const cdataFeed = `
      <?xml version="1.0"?>
      <root>
        <![CDATA[<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><channel><title>Test</title></channel></rdf:RDF>]]>
      </root>
    `

    expect(detect(cdataFeed)).toBe(false)
  })

  it('should detect self-closing RDF tag', () => {
    const selfClosingFeed = `
      <?xml version="1.0"?>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" />
    `

    expect(detect(selfClosingFeed)).toBe(true)
  })

  it('should detect mixed case RDF elements', () => {
    const mixedCaseFeed = `
      <rdf:RDF>
        <CHANNEL rdf:about="http://example.org/">
          <TITLE>Example Feed</TITLE>
          <Item>
            <Description>Test content</Description>
          </Item>
        </CHANNEL>
      </rdf:RDF>
    `

    expect(detect(mixedCaseFeed)).toBe(true)
  })

  it('should detect minimal RDF feed', () => {
    const minimalFeed = '<rdf:RDF><channel><title>Test</title></channel></rdf:RDF>'

    expect(detect(minimalFeed)).toBe(true)
  })

  it('should return false for RDF in attribute value', () => {
    const rdfInAttribute = `
      <root>
        <element data="&lt;rdf:RDF&gt;&lt;channel&gt;&lt;title&gt;Test&lt;/title&gt;&lt;/channel&gt;&lt;/rdf:RDF&gt;">
          <content>Not a feed</content>
        </element>
      </root>
    `

    expect(detect(rdfInAttribute)).toBe(false)
  })

  it('should return false for RDF with wrong namespace and no RDF elements', () => {
    const wrongNamespace = `
      <rdf:RDF xmlns:rdf="http://example.com/custom">
        <heading>Not RDF</heading>
        <article>Custom content</article>
      </rdf:RDF>
    `

    expect(detect(wrongNamespace)).toBe(false)
  })

  it('should return false for Atom feed', () => {
    const atomFeed = `
      <?xml version="1.0" encoding="utf-8"?>
      <feed xmlns:atom="http://www.w3.org/2005/Atom">
        <title>Example Feed</title>
      </feed>
    `

    expect(detect(atomFeed)).toBe(false)
  })

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

  it('should handle large HTML files without catastrophic backtracking', () => {
    const scriptTag = '<script>function test() { return true; }</script>'
    const largeHtmlLine = `<!DOCTYPE html><html><head>${scriptTag.repeat(100000)}</head><body><h1>Test</h1></body></html>`

    const startTime = Date.now()
    const result = detect(largeHtmlLine)
    const endTime = Date.now()
    // Should complete in less than 100ms (previously took minutes/hours).
    const completeTime = endTime - startTime

    expect(result).toBe(false)
    expect(completeTime).toBeLessThan(100)
  })
})
