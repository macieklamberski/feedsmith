import { describe, expect, it } from 'bun:test'
import { detect } from './detect.js'

describe('detect', () => {
  it('should detect RSS feed', () => {
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
    const expected = 'rss'

    expect(detect(value)).toBe(expected)
  })

  it('should detect Atom feed', () => {
    const value = `
      <?xml version="1.0"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Feed</title>
        <id>example-feed</id>
      </feed>
    `
    const expected = 'atom'

    expect(detect(value)).toBe(expected)
  })

  it('should detect RDF feed', () => {
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
      </rdf:RDF>
    `
    const expected = 'rdf'

    expect(detect(value)).toBe(expected)
  })

  it('should detect JSON feed from object', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      items: [],
    }
    const expected = 'json'

    expect(detect(value)).toBe(expected)
  })

  it('should detect JSON feed from string', () => {
    const value = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      items: [],
    })
    const expected = 'json'

    expect(detect(value)).toBe(expected)
  })

  it('should detect JSON feed from string when its content carries RSS markup', () => {
    const value = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: 'Example: <rss version="2.0"><channel><title>Other</title></channel></rss>',
        },
      ],
    })
    const expected = 'json'

    expect(detect(value)).toBe(expected)
  })

  it('should return undefined for HTML page', () => {
    const value = '<html><head><title>Example</title></head><body></body></html>'

    expect(detect(value)).toBeUndefined()
  })

  it('should return undefined for JSON that is not a feed', () => {
    const value = JSON.stringify({ name: 'Example' })

    expect(detect(value)).toBeUndefined()
  })

  it('should return undefined for malformed JSON string', () => {
    const value = '{ "version": "https://jsonfeed.org/version/1.1", '

    expect(detect(value)).toBeUndefined()
  })

  it('should return undefined for empty string', () => {
    expect(detect('')).toBeUndefined()
  })

  it('should return undefined for non-string and non-object inputs', () => {
    expect(detect(null)).toBeUndefined()
    expect(detect(undefined)).toBeUndefined()
    expect(detect(123)).toBeUndefined()
    expect(detect([])).toBeUndefined()
  })
})
