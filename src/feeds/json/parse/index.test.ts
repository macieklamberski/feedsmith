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
})
