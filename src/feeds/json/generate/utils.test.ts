import { describe, expect, it } from 'bun:test'
import { generateFeed, generateItem } from './utils.js'

describe('generateItem', () => {
  it('should convert dates in an item to RFC 3339 format', () => {
    const value = {
      id: '1',
      title: 'Test Item',
      date_published: new Date('2023-05-17T15:00:00Z'),
      date_modified: new Date('2023-05-18T16:30:00Z'),
      content_text: 'Test content',
    }
    const expected = {
      id: '1',
      title: 'Test Item',
      date_published: '2023-05-17T15:00:00.000Z',
      date_modified: '2023-05-18T16:30:00.000Z',
      content_text: 'Test content',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle item without dates', () => {
    const value = {
      id: '1',
      title: 'Test Item',
      content_text: 'Test content',
    }
    const expected = {
      id: '1',
      title: 'Test Item',
      content_text: 'Test content',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should omit undefined properties from the item', () => {
    const value = {
      id: '1',
      title: 'Test Item',
      content_text: undefined,
      summary: undefined,
      authors: [],
      tags: ['test'],
      content_html: '<p>HTML content</p>',
    }
    const expected = {
      id: '1',
      title: 'Test Item',
      authors: [],
      tags: ['test'],
      content_html: '<p>HTML content</p>',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle item with all properties defined', () => {
    const value = {
      id: '1',
      url: 'https://example.com/item/1',
      external_url: 'https://external.com/item/1',
      title: 'Test Item',
      content_html: '<p>HTML content</p>',
      content_text: 'Plain text content',
      summary: 'Item summary',
      image: 'https://example.com/image.jpg',
      banner_image: 'https://example.com/banner.jpg',
      date_published: new Date('2023-05-17T15:00:00Z'),
      date_modified: new Date('2023-05-18T15:00:00Z'),
      tags: ['test', 'example'],
      authors: [{ name: 'John Doe', url: 'https://example.com/john' }],
      language: 'en-US',
      attachments: [{ url: 'https://example.com/attachment.pdf', mime_type: 'application/pdf' }],
    }
    const expected = {
      id: '1',
      url: 'https://example.com/item/1',
      external_url: 'https://external.com/item/1',
      title: 'Test Item',
      content_html: '<p>HTML content</p>',
      content_text: 'Plain text content',
      summary: 'Item summary',
      image: 'https://example.com/image.jpg',
      banner_image: 'https://example.com/banner.jpg',
      date_published: '2023-05-17T15:00:00.000Z',
      date_modified: '2023-05-18T15:00:00.000Z',
      tags: ['test', 'example'],
      authors: [{ name: 'John Doe', url: 'https://example.com/john' }],
      language: 'en-US',
      attachments: [{ url: 'https://example.com/attachment.pdf', mime_type: 'application/pdf' }],
    }

    expect(generateItem(value)).toEqual(expected)
  })
})

describe('generateFeed', () => {
  it('should set version to 1.1 and process items', () => {
    const value = {
      title: 'Test Feed',
      home_page_url: 'https://example.com',
      items: [
        {
          id: '1',
          title: 'Item 1',
          date_published: new Date('2023-05-17T15:00:00Z'),
          content_html: '<p>Item 1 content</p>',
        },
        {
          id: '2',
          title: 'Item 2',
          content_text: 'Item 2 content',
        },
      ],
    }
    const expected = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Test Feed',
      home_page_url: 'https://example.com',
      items: [
        {
          id: '1',
          title: 'Item 1',
          date_published: '2023-05-17T15:00:00.000Z',
          content_html: '<p>Item 1 content</p>',
        },
        {
          id: '2',
          title: 'Item 2',
          content_text: 'Item 2 content',
        },
      ],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle a complex feed with multiple items and properties', () => {
    const value = {
      title: 'Complex Test Feed',
      description: 'A complex test feed with multiple items',
      home_page_url: 'https://example.com',
      feed_url: 'https://example.com/feed.json',
      authors: [
        { name: 'John Doe', url: 'https://example.com/john' },
        { name: 'Jane Smith', url: 'https://example.com/jane' },
      ],
      language: 'en-US',
      favicon: 'https://example.com/favicon.ico',
      icon: 'https://example.com/icon.png',
      items: [
        {
          id: '1',
          title: 'Item 1',
          content_html: '<p>Item 1 content</p>',
          date_published: new Date('2023-05-17T15:00:00Z'),
          authors: [{ name: 'John Doe' }],
          tags: ['tag1', 'tag2'],
        },
        {
          id: '2',
          title: 'Item 2',
          content_text: 'Item 2 content',
          date_published: new Date('2023-05-18T16:30:00Z'),
          authors: [{ name: 'Jane Smith' }],
        },
      ],
    }
    const expected = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Complex Test Feed',
      description: 'A complex test feed with multiple items',
      home_page_url: 'https://example.com',
      feed_url: 'https://example.com/feed.json',
      authors: [
        { name: 'John Doe', url: 'https://example.com/john' },
        { name: 'Jane Smith', url: 'https://example.com/jane' },
      ],
      language: 'en-US',
      favicon: 'https://example.com/favicon.ico',
      icon: 'https://example.com/icon.png',
      items: [
        {
          id: '1',
          title: 'Item 1',
          content_html: '<p>Item 1 content</p>',
          date_published: '2023-05-17T15:00:00.000Z',
          authors: [{ name: 'John Doe' }],
          tags: ['tag1', 'tag2'],
        },
        {
          id: '2',
          title: 'Item 2',
          content_text: 'Item 2 content',
          date_published: '2023-05-18T16:30:00.000Z',
          authors: [{ name: 'Jane Smith' }],
        },
      ],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle an empty items array', () => {
    const value = {
      title: 'Empty Feed',
      items: [],
    }
    const expected = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Empty Feed',
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
