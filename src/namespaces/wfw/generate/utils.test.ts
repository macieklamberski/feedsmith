import { describe, expect, it } from 'bun:test'
import { generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate valid item object with all properties', () => {
    const value = {
      comment: 'https://example.com/post/123/comment',
      commentRss: 'https://example.com/feed/rss/123/comments',
    }
    const expected = {
      'wfw:comment': 'https://example.com/post/123/comment',
      'wfw:commentRss': 'https://example.com/feed/rss/123/comments',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item object with only comment', () => {
    const value = {
      comment: 'https://example.com/post/123/comment',
    }
    const expected = {
      'wfw:comment': 'https://example.com/post/123/comment',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item object with only commentRss', () => {
    const value = {
      commentRss: 'https://example.com/feed/rss/123/comments',
    }
    const expected = {
      'wfw:commentRss': 'https://example.com/feed/rss/123/comments',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle WordPress-style URLs', () => {
    const value = {
      comment: 'https://myblog.wordpress.com/wp-comments-post.php',
      commentRss: 'https://myblog.wordpress.com/post/title/feed/',
    }
    const expected = {
      'wfw:comment': 'https://myblog.wordpress.com/wp-comments-post.php',
      'wfw:commentRss': 'https://myblog.wordpress.com/post/title/feed/',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle blog platform specific URLs', () => {
    const value = {
      comment: 'https://blogger.com/comment?blogID=123&postID=456',
      commentRss: 'https://feeds.feedburner.com/blog/comments/456',
    }
    const expected = {
      'wfw:comment': {
        '#cdata': 'https://blogger.com/comment?blogID=123&postID=456',
      },
      'wfw:commentRss': 'https://feeds.feedburner.com/blog/comments/456',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should filter out undefined values', () => {
    const value = {
      comment: 'https://example.com/post/123/comment',
      commentRss: undefined,
    }
    const expected = {
      'wfw:comment': 'https://example.com/post/123/comment',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should filter out empty string values', () => {
    const value = {
      comment: '',
      commentRss: 'https://example.com/feed/rss/123/comments',
    }
    const expected = {
      'wfw:commentRss': 'https://example.com/feed/rss/123/comments',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })

  it('should handle objects with all undefined values', () => {
    const value = {
      comment: undefined,
      commentRss: undefined,
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle complex comment endpoint URLs', () => {
    const value = {
      comment: 'https://api.example.com/v1/posts/123/comments?format=json&method=POST',
      commentRss: 'https://feeds.example.com/posts/123/comments.rss?include=all',
    }
    const expected = {
      'wfw:comment': {
        '#cdata': 'https://api.example.com/v1/posts/123/comments?format=json&method=POST',
      },
      'wfw:commentRss': 'https://feeds.example.com/posts/123/comments.rss?include=all',
    }

    expect(generateItem(value)).toEqual(expected)
  })
})
