import { describe, expect, it } from 'bun:test'
import { retrieveItem } from './utils.js'

describe('retrieveItem', () => {
  const expectedFull = {
    comment: 'https://example.com/post/123/comment',
    commentRss: 'https://example.com/feed/rss/123/comments',
  }

  it('should parse complete item object with all properties (with #text)', () => {
    const value = {
      'wfw:comment': { '#text': 'https://example.com/post/123/comment' },
      'wfw:commentrss': { '#text': 'https://example.com/feed/rss/123/comments' },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object with all properties (without #text)', () => {
    const value = {
      'wfw:comment': 'https://example.com/post/123/comment',
      'wfw:commentrss': 'https://example.com/feed/rss/123/comments',
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object with all properties (with array of values)', () => {
    const value = {
      'wfw:comment': [
        'https://example.com/post/123/comment',
        'https://example.com/post/123/comment2',
      ],
      'wfw:commentrss': [
        'https://example.com/feed/rss/123/comments',
        'https://example.com/feed/rss/123/comments2',
      ],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item with only comment field', () => {
    const value = {
      'wfw:comment': { '#text': 'https://example.com/post/123/comment' },
    }
    const expected = {
      comment: 'https://example.com/post/123/comment',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only commentRss field', () => {
    const value = {
      'wfw:commentrss': { '#text': 'https://example.com/feed/rss/123/comments' },
    }
    const expected = {
      commentRss: 'https://example.com/feed/rss/123/comments',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle WordPress-style comment endpoints', () => {
    const value = {
      'wfw:comment': { '#text': 'https://myblog.wordpress.com/wp-comments-post.php' },
      'wfw:commentrss': { '#text': 'https://myblog.wordpress.com/post/title/feed/' },
    }
    const expected = {
      comment: 'https://myblog.wordpress.com/wp-comments-post.php',
      commentRss: 'https://myblog.wordpress.com/post/title/feed/',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'wfw:comment': { '#text': 123 },
      'wfw:commentrss': { '#text': 'test-url' },
    }
    const expected = {
      comment: '123',
      commentRss: 'test-url',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when no wfw properties exist', () => {
    const value = {
      title: { '#text': 'Not a wfw item' },
      'dc:creator': { '#text': 'John Doe' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })

  it('should handle objects with missing #text property', () => {
    const value = {
      'wfw:comment': {},
      'wfw:commentrss': { '#text': 'https://example.com/feed/rss/123/comments' },
    }
    const expected = {
      commentRss: 'https://example.com/feed/rss/123/comments',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle mixed valid and invalid properties', () => {
    const value = {
      'wfw:comment': { '#text': 'https://example.com/post/123/comment' },
      'wfw:commentrss': { '#text': '' }, // Empty string should be filtered out
      'other:property': { '#text': 'value' },
    }
    const expected = {
      comment: 'https://example.com/post/123/comment',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle blog platform specific implementations', () => {
    const value = {
      'wfw:comment': { '#text': 'https://blogger.com/comment?blogID=123&postID=456' },
      'wfw:commentrss': { '#text': 'https://feeds.feedburner.com/blog/comments/456' },
    }
    const expected = {
      comment: 'https://blogger.com/comment?blogID=123&postID=456',
      commentRss: 'https://feeds.feedburner.com/blog/comments/456',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })
})
