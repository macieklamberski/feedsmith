import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { DetectError, ParseError } from '../../../common/errors.js'
import { parse } from './index.js'

describe('parse', () => {
  it('should parse valid JSON Feed v1', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      home_page_url: 'https://example.com/',
      feed_url: 'https://example.com/feed.json',
      author: {
        name: 'John Doe',
        url: 'https://example.com/johndoe',
      },
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
          url: 'https://example.com/post/1',
          title: 'First post',
          date_published: '2023-01-01T00:00:00Z',
        },
      ],
      custom_field: 'custom value',
    }
    const expected = {
      title: 'My Example Feed',
      home_page_url: 'https://example.com/',
      feed_url: 'https://example.com/feed.json',
      authors: [
        {
          name: 'John Doe',
          url: 'https://example.com/johndoe',
        },
      ],
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
          url: 'https://example.com/post/1',
          title: 'First post',
          date_published: '2023-01-01T00:00:00Z',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse valid JSON Feed v1.1', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      home_page_url: 'https://example.com/',
      feed_url: 'https://example.com/feed.json',
      authors: [
        {
          name: 'John Doe',
          url: 'https://example.com/johndoe',
        },
      ],
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
      custom_field: 'custom value',
    }
    const expected = {
      title: 'My Example Feed',
      home_page_url: 'https://example.com/',
      feed_url: 'https://example.com/feed.json',
      language: 'en-US',
      authors: [
        {
          name: 'John Doe',
          url: 'https://example.com/johndoe',
        },
      ],
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

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON Feed from string', () => {
    const value = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
        },
      ],
    })
    const expected = {
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON Feed from string with leading whitespace', () => {
    const json = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    })
    const value = `  ${json}`
    const expected = {
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON Feed from string with trailing whitespace', () => {
    const json = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    })
    const value = `${json}  `
    const expected = {
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON Feed from string with whitespace on both ends', () => {
    const json = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    })
    const value = `  ${json}  `
    const expected = {
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle malformed JSON string', () => {
    const value = '{"version":"https://jsonfeed.org/version/1.1","title":"Malformed'
    const throwing = () => parse(value)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should parse feed with invalid URLs', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      home_page_url: 'invalid-url',
      items: [{ id: '1', content_html: '<p>Hello world</p>' }],
    }
    const expected = {
      title: 'My Example Feed',
      home_page_url: 'invalid-url',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle missing optional fields', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      items: [{ id: '1', content_html: '<p>Hello world</p>' }],
    }
    const expected = {
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle case insensitive fields', () => {
    const value = {
      vErsIOn: 'https://jsonfeed.org/version/1',
      TITLE: 'My Example Feed',
      items: [{ id: '1', content_HTML: '<p>Hello world</p>' }],
    }
    const expected = {
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should throw error for invalid input', () => {
    const throwing = () => parse('not a feed')

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle null input', () => {
    const throwing = () => parse(null)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle undefined input', () => {
    const throwing = () => parse(undefined)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle array input', () => {
    const throwing = () => parse([])

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle empty object input', () => {
    const throwing = () => parse({})

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle empty string input', () => {
    const throwing = () => parse('')

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle whitespace-only string input', () => {
    const throwing = () => parse('   \n  ')

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle number input', () => {
    const throwing = () => parse(123)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  describe('error types', () => {
    it('should throw DetectError for non-feed input', () => {
      const throwing = () => parse({})

      expect(throwing).toThrowError(DetectError)
      expect(throwing).toThrowError(locales.invalidFeedFormat)
    })

    it('should throw ParseError for detected but invalid feed', () => {
      const value = {
        version: 'https://jsonfeed.org/version/1',
      }
      const throwing = () => parse(value)

      expect(throwing).toThrowError(ParseError)
      expect(throwing).toThrowError(locales.invalidFeedFormat)
    })
  })

  describe('with maxItems option', () => {
    const commonValue = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Test Feed',
      items: [
        {
          id: '1',
          content_text: 'Item 1',
        },
        {
          id: '2',
          content_text: 'Item 2',
        },
        {
          id: '3',
          content_text: 'Item 3',
        },
      ],
    }

    it('should limit items to specified number', () => {
      const expected = {
        title: 'Test Feed',
        items: [
          {
            id: '1',
            content_text: 'Item 1',
          },
          {
            id: '2',
            content_text: 'Item 2',
          },
        ],
      }

      expect(parse(commonValue, { maxItems: 2 })).toEqual(expected)
    })

    it('should skip all items when maxItems is 0', () => {
      const expected = {
        title: 'Test Feed',
      }

      expect(parse(commonValue, { maxItems: 0 })).toEqual(expected)
    })

    it('should return all items when maxItems is undefined', () => {
      const expected = {
        title: 'Test Feed',
        items: [
          {
            id: '1',
            content_text: 'Item 1',
          },
          {
            id: '2',
            content_text: 'Item 2',
          },
          {
            id: '3',
            content_text: 'Item 3',
          },
        ],
      }

      expect(parse(commonValue, { maxItems: undefined })).toEqual(expected)
    })
  })

  describe('parseDateFn', () => {
    it('should apply custom parseDateFn to item dates', () => {
      const value = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
        items: [
          {
            id: '1',
            date_published: '2023-01-01T00:00:00Z',
            date_modified: '2023-01-02T00:00:00Z',
          },
        ],
      }
      const expected = {
        title: 'Test',
        items: [
          {
            id: '1',
            date_published: new Date('2023-01-01T00:00:00Z'),
            date_modified: new Date('2023-01-02T00:00:00Z'),
          },
        ],
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should propagate error when parseDateFn throws', () => {
      const value = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
        items: [
          {
            id: '1',
            date_published: 'invalid',
          },
        ],
      }
      const parseDateFn = () => {
        throw new Error('Parse failed')
      }
      const throwing = () => parse(value, { parseDateFn })

      expect(throwing).toThrowError('Parse failed')
    })
  })

  describe.todo('real-world feeds', () => {
    it.todo('should parse JSON Feed string prefixed with a BOM', () => {
      // A UTF-8 byte order mark before the opening brace is common in real exports. Expected:
      // the BOM is ignored and the feed parses normally.
    })

    it.todo('should parse JSON Feed with escaped unicode sequences in text fields', () => {
      // Titles and content with \u-escaped characters (emoji, accented letters) should decode to
      // the actual characters.
    })

    it.todo('should parse JSON Feed with HTML entities preserved in content_html', () => {
      // Entities like &amp; and &lt; inside content_html are part of the HTML payload and must be
      // passed through unchanged, not decoded.
    })
  })
})
