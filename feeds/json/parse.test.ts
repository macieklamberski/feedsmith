import { describe, expect, it } from 'bun:test'
import { parse } from './parse'
import type { ParsedFeed } from './types'

describe('parse', () => {
  const validFeedV1 = {
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
  const validFeedV11 = {
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
  const feedWithInvalidLinks = {
    version: 'https://jsonfeed.org/version/1',
    title: 'My Example Feed',
    home_page_url: 'invalid-url',
    items: [{ id: '1', content_html: '<p>Hello world</p>' }],
  }
  const minimalFeed = {
    version: 'https://jsonfeed.org/version/1',
    title: 'My Example Feed',
    items: [{ id: '1', content_html: '<p>Hello world</p>' }],
  }

  for (const level of ['skip', 'coerce'] as const) {
    describe(level, () => {
      it('should parse valid JSON Feed v1', () => {
        const result = parse(validFeedV1, { level })

        expect(result).toBeDefined()
        expect(result?.version).toBe('https://jsonfeed.org/version/1')
        expect(result?.title).toBe('My Example Feed')
        expect(result?.authors).toHaveLength(1)
        expect(result?.authors?.[0].name).toBe('John Doe')
        expect(result?.items).toHaveLength(1)
        expect(result?.items?.[0].id).toBe('1')
        expect(result?.items?.[0].content_html).toBe('<p>Hello world</p>')
      })

      it('should parse valid JSON Feed v1.1', () => {
        const result = parse(validFeedV11, { level })

        expect(result).toBeDefined()
        expect(result?.version).toBe('https://jsonfeed.org/version/1.1')
        expect(result?.title).toBe('My Example Feed')
        expect(result?.items).toHaveLength(1)
        expect(result?.language).toBe('en-US')
        expect(result?.authors).toHaveLength(1)
        expect(result?.authors?.[0].name).toBe('John Doe')
        expect(result?.items).toHaveLength(1)
        expect(result?.items?.[0].id).toBe('1')
        expect(result?.items?.[0].content_html).toBe('<p>Hello world</p>')
      })

      it('should not include unregistered custom fields', () => {
        const result = parse(validFeedV1, { level })

        // biome-ignore lint/suspicious/noExplicitAny: It's for testing purposes.
        expect((result as any).custom_field).toBeUndefined()
      })

      it('should parse feed with invalid URLs', () => {
        const result = parse(feedWithInvalidLinks, { level })

        expect(result?.home_page_url).toBe('invalid-url')
      })

      it('should handle missing optional fields', () => {
        const result = parse(minimalFeed, { level })

        expect(result).toBeDefined()
        expect(result?.version).toBe('https://jsonfeed.org/version/1')
        expect(result?.title).toBe('My Example Feed')
        expect(result?.home_page_url).toBeUndefined()
        expect(result?.feed_url).toBeUndefined()
        expect((result as ParsedFeed).authors).toBeUndefined()
      })
    })

    describe(level, () => {
      it('should handle null input', () => {
        expect(parse(null, { level })).toBeUndefined()
      })

      it('should handle undefined input', () => {
        expect(parse(undefined, { level })).toBeUndefined()
      })

      it('should handle array input', () => {
        expect(parse([], { level })).toBeUndefined()
      })

      it('should handle empty object input', () => {
        expect(parse({}, { level })).toBeUndefined()
      })

      it('should handle string input', () => {
        expect(parse('not a feed', { level })).toBeUndefined()
      })

      it('should handle number input', () => {
        expect(parse(123, { level })).toBeUndefined()
      })
    })
  }

  describe('strict', () => {
    it('should handle null input', () => {
      expect(() => parse(null, { level: 'strict' })).toThrow()
    })

    it('should handle undefined input', () => {
      expect(() => parse(undefined, { level: 'strict' })).toThrow()
    })

    it('should handle array input', () => {
      expect(() => parse([], { level: 'strict' })).toThrow()
    })

    it('should handle empty object input', () => {
      expect(() => parse({}, { level: 'strict' })).not.toThrow()
    })

    it('should handle string input', () => {
      expect(() => parse('not a feed', { level: 'strict' })).toThrow()
    })

    it('should handle number input', () => {
      expect(() => parse(123, { level: 'strict' })).toThrow()
    })
  })
})
