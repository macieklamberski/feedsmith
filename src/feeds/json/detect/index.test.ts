import { describe, expect, test } from 'bun:test'
import { detect } from './index.js'

describe('detect', () => {
  test('detect valid JSON Feed with version 1.1', () => {
    const jsonFeed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Example Feed',
      home_page_url: 'https://example.org/',
      feed_url: 'https://example.org/feed.json',
      items: [
        {
          id: '1',
          content_text: 'Hello, world!',
          url: 'https://example.org/1',
        },
      ],
    }

    expect(detect(jsonFeed)).toBe(true)
  })

  test('detect valid JSON Feed with version 1.0', () => {
    const jsonFeed = {
      version: 'https://jsonfeed.org/version/1',
      title: 'Example Feed',
      items: [],
    }

    expect(detect(jsonFeed)).toBe(true)
  })

  test('detect JSON Feed without version but with typical structure', () => {
    const jsonFeed = {
      title: 'Example Feed',
      home_page_url: 'https://example.org/',
      items: [
        {
          id: '1',
          content_text: 'Hello, world!',
        },
      ],
    }

    expect(detect(jsonFeed)).toBe(true)
  })

  test('detect JSON Feed without version but with feed_url', () => {
    const jsonFeed = {
      title: 'Example Feed',
      feed_url: 'https://example.org/feed.json',
      description: 'An example feed',
    }

    expect(detect(jsonFeed)).toBe(true)
  })

  test('detect JSON Feed with authors property', () => {
    const jsonFeed = {
      title: 'Example Feed',
      authors: [
        {
          name: 'John Doe',
          url: 'https://johndoe.example/',
        },
      ],
    }

    expect(detect(jsonFeed)).toBe(true)
  })

  test('return false for object with only title', () => {
    const notFeed = {
      title: 'Just a title',
    }

    expect(detect(notFeed)).toBe(false)
  })

  test('return false for object with wrong version', () => {
    const wrongVersion = {
      version: '2.0',
      title: 'Example Feed',
      items: [],
    }

    expect(detect(wrongVersion)).toBe(false)
  })

  test('return false for RSS-like object', () => {
    const rssLike = {
      channel: {
        title: 'RSS Title',
        link: 'https://example.org',
      },
    }

    expect(detect(rssLike)).toBe(false)
  })

  test('return false for generic object', () => {
    const genericObj = {
      name: 'John',
      age: 30,
      city: 'New York',
    }

    expect(detect(genericObj)).toBe(false)
  })

  test('return false for empty object', () => {
    expect(detect({})).toBe(false)
  })

  test('return false for non-object values', () => {
    expect(detect('')).toBe(false)
    expect(detect(undefined)).toBe(false)
    expect(detect(null)).toBe(false)
    expect(detect([])).toBe(false)
    expect(detect(123)).toBe(false)
    expect(detect('{"title": "Not parsed"}')).toBe(false)
  })

  test('return false for array (even if it looks like items)', () => {
    const itemsArray = [
      {
        id: '1',
        content_text: 'Hello, world!',
      },
    ]

    expect(detect(itemsArray)).toBe(false)
  })
})
