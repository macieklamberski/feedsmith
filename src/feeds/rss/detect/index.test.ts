import { describe, expect, it } from 'bun:test'
import { detect } from './index.js'

describe('detect', () => {
  it('should detect valid RSS feed with xmlns declaration', () => {
    const rssFeed = `
      <?xml version="1.0" encoding="utf-8"?>
      <rss version="2.0">
        <channel>
          <title>Example Feed</title>
          <link>http://example.org</link>
          <item>
            <title>Example Item</title>
            <link>http://example.org/item/1</link>
          </item>
        </channel>
      </rss>
    `

    expect(detect(rssFeed)).toBe(true)
  })

  it('should handle case sensitivity correctly', () => {
    const uppercaseFeed = `
      <?xml version="1.0" encoding="utf-8"?>
      <RSS version="2.0">
        <channel>
          <title>Example Feed</title>
          <link>http://example.org</link>
          <ItEm>
            <title>Example Item</title>
            <link>http://example.org/item/1</link>
          </ItEm>
        </channel>
      </RSS>
    `

    expect(detect(uppercaseFeed)).toBe(true)
  })

  it('should detect RSS feed without version attribute', () => {
    const rssFeed = `
      <?xml version="1.0" encoding="utf-8"?>
      <rss>
        <channel>
          <title>Example Feed</title>
          <link>http://example.org</link>
          <item>
            <title>Example Item</title>
            <link>http://example.org/item/1</link>
          </item>
        </channel>
      </rss>
    `

    expect(detect(rssFeed)).toBe(true)
  })

  it('should detect RSS feed with multi-line <rss> tag', () => {
    const rssFeed = `
      <?xml version="1.0"?>
      <rss
        version="2.0"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        xmlns:atom="http://www.w3.org/2005/Atom"
      >
        <channel>
          <title>Example Feed</title>
        </channel>
      </rss>
    `

    expect(detect(rssFeed)).toBe(true)
  })

  it('should return false for RSS element in CDATA', () => {
    const cdataFeed = `
      <?xml version="1.0"?>
      <root>
        <![CDATA[<rss version="2.0"><channel><title>Test</title></channel></rss>]]>
      </root>
    `

    expect(detect(cdataFeed)).toBe(false)
  })

  it('should detect self-closing RSS tag', () => {
    const selfClosingFeed = `
      <?xml version="1.0"?>
      <rss version="2.0" />
    `

    expect(detect(selfClosingFeed)).toBe(true)
  })

  it('should detect mixed case RSS elements', () => {
    const mixedCaseFeed = `
      <rss version="2.0">
        <CHANNEL>
          <TITLE>Example Feed</TITLE>
          <Item>
            <Description>Test content</Description>
          </Item>
        </CHANNEL>
      </rss>
    `

    expect(detect(mixedCaseFeed)).toBe(true)
  })

  it('should detect minimal RSS feed', () => {
    const minimalFeed = '<rss><channel><title>Test</title></channel></rss>'

    expect(detect(minimalFeed)).toBe(true)
  })

  it('should return false for RSS in attribute value', () => {
    const rssInAttribute = `
      <root>
        <element data="&lt;rss version=&quot;2.0&quot;&gt;&lt;channel&gt;&lt;title&gt;Test&lt;/title&gt;&lt;/channel&gt;&lt;/rss&gt;">
          <content>Not a feed</content>
        </element>
      </root>
    `

    expect(detect(rssInAttribute)).toBe(false)
  })

  it('should return false for RSS with no version and no RSS elements', () => {
    const invalidRss = `
      <rss>
        <heading>Not RSS</heading>
        <article>Custom content</article>
      </rss>
    `

    expect(detect(invalidRss)).toBe(false)
  })

  it('should detect RSS with various version formats', () => {
    const versions = [
      '<rss version="2.0">',
      "<rss version='0.91'>",
      '<rss version ="1.0">',
      '<rss version= "2.0" >',
    ]

    for (const version of versions) {
      const feed = `${version}<channel><title>Test</title></channel></rss>`
      expect(detect(feed)).toBe(true)
    }
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
