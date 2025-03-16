import { describe, expect, it } from 'bun:test'
import type { ZodError } from 'zod'
import { validate } from './index'

const hasError = (error: ZodError | undefined, path: string) => {
  return error?.issues.some((issue) => issue.path.join('.') === path)
}

describe('validate', () => {
  it('should validate a correct JSON Feed v1', () => {
    const validFeed = {
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
    }
    const result = validate(validFeed)

    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should validate a correct JSON Feed v1.1', () => {
    const validFeed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      home_page_url: 'https://example.com/',
      feed_url: 'https://example.com/feed.json',
      authors: [{ name: 'John Doe', url: 'https://example.com/johndoe' }],
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
    }
    const result = validate(validFeed)

    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should reject feed without required title', () => {
    const invalidFeed = {
      version: 'https://jsonfeed.org/version/1',
      items: [{ id: '1', content_html: '<p>Hello world</p>' }],
    }
    const result = validate(invalidFeed)

    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
    expect(hasError(result.error, 'title')).toBe(true)
  })

  it('should reject feed with invalid URLs', () => {
    const invalidFeed = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      home_page_url: 'invalid-url',
      feed_url: 'https://example.com/feed.json',
      items: [{ id: '1', content_html: '<p>Hello world</p>', url: 'also-invalid-url' }],
    }
    const result = validate(invalidFeed)

    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
    expect(hasError(result.error, 'home_page_url')).toBe(true)
    expect(hasError(result.error, 'items.0.url')).toBe(true)
  })

  it('should reject feed with invalid version', () => {
    const invalidFeed = {
      version: 'invalid-version',
      title: 'My Example Feed',
      items: [{ id: '1', content_html: '<p>Hello world</p>' }],
    }
    const result = validate(invalidFeed)

    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
    expect(hasError(result.error, 'version')).toBe(true)
  })

  it('should reject feed with invalid item structure', () => {
    const invalidFeed = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      items: [{ content_html: '<p>Hello world</p>' }],
    }
    const result = validate(invalidFeed)

    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
    expect(hasError(result.error, 'items.0.id')).toBe(true)
  })

  it('should reject feed with item not having one of content_* set', () => {
    const invalidFeed = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      items: [{ id: '1' }],
    }
    const result = validate(invalidFeed)

    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
    expect(hasError(result.error, 'items.0.content_text')).toBe(true)
  })

  it('should validate feed with attachments', () => {
    const validFeed = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
          attachments: [
            {
              url: 'https://example.com/attachment.mp3',
              mime_type: 'audio/mpeg',
              size_in_bytes: 1234567,
              duration_in_seconds: 300,
            },
          ],
        },
      ],
    }
    const result = validate(validFeed)

    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should reject feed with invalid attachments', () => {
    const invalidFeed = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
          attachments: [
            {
              url: 'invalid-url',
              mime_type: 'audio/mpeg',
              size_in_bytes: 'not-a-number',
            },
          ],
        },
      ],
    }
    const result = validate(invalidFeed)

    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
    expect(hasError(result.error, 'items.0.attachments.0.url')).toBe(true)
    expect(hasError(result.error, 'items.0.attachments.0.size_in_bytes')).toBe(true)
  })

  it('should validate feed with hubs', () => {
    const validFeed = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      hubs: [{ type: 'WebSub', url: 'https://example.com/websub' }],
      items: [{ id: '1', content_html: '<p>Hello world</p>' }],
    }
    const result = validate(validFeed)

    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })
})
