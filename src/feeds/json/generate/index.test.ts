import { describe, expect, it } from 'bun:test'
import { generate } from './index.js'

describe('generate', () => {
  it('should generate valid JSON Feed v1.1', () => {
    const value = {
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
          date_published: new Date('2019-03-07T00:00:00+01:00'),
          language: 'en-US',
        },
      ],
    }
    const expected = {
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
          date_published: '2019-03-06T23:00:00.000Z',
          language: 'en-US',
        },
      ],
    }

    expect(generate(value)).toEqual(expected)
  })
})

describe('leniency', () => {
  it('should accept feeds with string dates', () => {
    const value = {
      title: 'Test Feed',
      date_published: '2023-01-01T00:00:00.000Z',
      items: [
        {
          id: '1',
          title: 'Test Item',
          date_published: '2023-01-02T00:00:00.000Z',
        },
      ],
    }
    const expected = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Test Feed',
      date_published: '2023-01-01T00:00:00.000Z',
      items: [
        {
          id: '1',
          title: 'Test Item',
          date_published: '2023-01-02T00:00:00.000Z',
        },
      ],
    }

    expect(generate(value)).toEqual(expected)
  })

  it('should preserve invalid date strings', () => {
    const value = {
      title: 'Test Feed',
      date_published: 'not-a-valid-date',
      items: [],
    }
    const expected = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Test Feed',
      date_published: 'not-a-valid-date',
    }

    expect(generate(value)).toEqual(expected)
  })
})
