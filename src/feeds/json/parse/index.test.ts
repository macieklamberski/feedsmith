import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
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

    expect(() => parse(value)).toThrowError(locales.invalidFeedFormat)
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
    expect(() => parse('not a feed')).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle null input', () => {
    expect(() => parse(null)).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle undefined input', () => {
    expect(() => parse(undefined)).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle array input', () => {
    expect(() => parse([])).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle empty object input', () => {
    expect(() => parse({})).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle string input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle number input', () => {
    expect(() => parse(123)).toThrowError(locales.invalidFeedFormat)
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
})

describe('Integration: parse and generate with extraFields', () => {
  it('should preserve extra fields through full cycle', () => {
    const original = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Test Feed',
      _podcast: {
        locked: true,
        explicit: false,
      },
      items: [
        {
          id: '1',
          content_text: 'Episode 1',
          _microblog: {
            thumbnail_url: 'https://example.com/thumb.jpg',
          },
        },
      ],
    }
    const expected = {
      title: 'Test Feed',
      _podcast: {
        locked: true,
        explicit: false,
      },
      items: [
        {
          id: '1',
          content_text: 'Episode 1',
          _microblog: {
            thumbnail_url: 'https://example.com/thumb.jpg',
          },
        },
      ],
    }

    expect(parse(original, { extraFields: ['_podcast', '_microblog'] })).toEqual(expected)
  })

  it('should work with real-world Micro.blog feed example', () => {
    const feedData = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Microblog',
      home_page_url: 'https://example.micro.blog/',
      feed_url: 'https://example.micro.blog/feed.json',
      items: [
        {
          id: 'post-1',
          content_html: '<p>This is a post with a custom thumbnail.</p>',
          url: 'https://example.micro.blog/2023/01/01/post.html',
          date_published: '2023-01-01T12:00:00Z',
          _microblog: {
            thumbnail_url: 'https://example.com/thumb.jpg',
            crosspost: ['https://twitter.com/user/status/123'],
          },
        },
      ],
    }
    const expected = {
      title: 'My Microblog',
      home_page_url: 'https://example.micro.blog/',
      feed_url: 'https://example.micro.blog/feed.json',
      items: [
        {
          id: 'post-1',
          content_html: '<p>This is a post with a custom thumbnail.</p>',
          url: 'https://example.micro.blog/2023/01/01/post.html',
          date_published: '2023-01-01T12:00:00Z',
          _microblog: {
            thumbnail_url: 'https://example.com/thumb.jpg',
            crosspost: ['https://twitter.com/user/status/123'],
          },
        },
      ],
    }

    expect(parse(feedData, { extraFields: ['_microblog'] })).toEqual(expected)
  })

  it('should work with podcast namespace extension', () => {
    const feedData = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Podcast',
      _podcast: {
        locked: true,
        explicit: false,
      },
      items: [
        {
          id: 'episode-1',
          content_text: 'Episode description',
          _podcast: {
            episode_number: 1,
            season_number: 1,
            episode_type: 'full',
          },
        },
      ],
    }
    const expected = {
      title: 'My Podcast',
      _podcast: {
        locked: true,
        explicit: false,
      },
      items: [
        {
          id: 'episode-1',
          content_text: 'Episode description',
          _podcast: {
            episode_number: 1,
            season_number: 1,
            episode_type: 'full',
          },
        },
      ],
    }

    expect(parse(feedData, { extraFields: ['_podcast'] })).toEqual(expected)
  })
})
