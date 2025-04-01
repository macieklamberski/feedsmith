import { describe, expect, it } from 'bun:test'
import {
  parseAttachment,
  parseAuthor,
  parseFeed,
  parseHub,
  parseItem,
  parseTags,
  retrieveAuthors,
} from './utils.js'

describe('parseTags', () => {
  it('should handle array of strings', () => {
    const value = ['javascript', 'typescript']

    expect(parseTags(value)).toEqual(value)
  })

  it('should handle array of mixed values', () => {
    const value = ['javascript', true, 123, {}, [], null]

    expect(parseTags(value)).toEqual(['javascript', '123'])
  })

  it('should handle object', () => {
    const value = { name: 'javascript' }

    expect(parseTags(value)).toBeUndefined()
  })

  it('should handle non-empty string', () => {
    const value = 'javascript'

    expect(parseTags(value)).toEqual([value])
  })

  it('should handle empty string', () => {
    const value = ''

    expect(parseTags(value)).toBeUndefined()
  })

  it('should handle number', () => {
    const value = 420

    expect(parseTags(value)).toEqual(['420'])
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseTags(value)).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseTags(value)).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseTags(value)).toBeUndefined()
  })
})

describe('parseAuthor', () => {
  it('should handle Author object', () => {
    const value = { name: 'John', url: 'link', avatar: 123 }
    const expected = { name: 'John', url: 'link', avatar: '123' }

    expect(parseAuthor(value)).toEqual(expected)
  })

  it('should handle non-Author object', () => {
    const value = { count: 1 }

    expect(parseAuthor(value)).toBeUndefined()
  })

  it('should handle non-empty string', () => {
    const value = 'Alice'
    const expected = { name: 'Alice' }

    expect(parseAuthor(value)).toEqual(expected)
  })

  it('should handle empty string', () => {
    const value = ''

    expect(parseAuthor(value)).toBeUndefined()
  })

  it('should handle number', () => {
    const value = 420
    const expected = { name: '420' }

    expect(parseAuthor(value)).toEqual(expected)
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseAuthor(value)).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseAuthor(value)).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseAuthor(value)).toBeUndefined()
  })
})

describe('retrieveAuthors', () => {
  it('should handle authors as object', () => {
    const value = {
      authors: { name: 'John' },
      author: undefined,
    }

    expect(retrieveAuthors(value)).toEqual([{ name: 'John' }])
  })

  it('should handle both authors and author ', () => {
    const value = {
      authors: { name: 'John' },
      author: { name: 'Jane' },
    }

    expect(retrieveAuthors(value)).toEqual([{ name: 'John' }])
  })

  it('should handle author when no authors present', () => {
    const value = {
      authors: undefined,
      author: { name: 'Jane' },
    }

    expect(retrieveAuthors(value)).toEqual([{ name: 'Jane' }])
  })
})

describe('parseHub', () => {
  it('should handle Hub object', () => {
    const value = { type: 'pub', url: 33 }
    const expected = { type: 'pub', url: '33' }

    expect(parseHub(value)).toEqual(expected)
  })

  it('should handle non-Hub object', () => {
    const value = { count: 2 }

    expect(parseHub(value)).toBeUndefined()
  })

  it('should handle string', () => {
    const value = 'Alice'

    expect(parseHub(value)).toBeUndefined()
  })

  it('should handle number', () => {
    const value = 420

    expect(parseHub(value)).toBeUndefined()
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseHub(value)).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseHub(value)).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseHub(value)).toBeUndefined()
  })

  it('should handle array', () => {
    const value = ['something']

    expect(parseHub(value)).toBeUndefined()
  })
})

describe('parseAttachment', () => {
  it('should handle attachment object with all valid properties', () => {
    const value = {
      url: 'https://example.com/image.jpg',
      mime_type: 'image/jpeg',
      title: 'Sample Image',
      size_in_bytes: 12345,
      duration_in_seconds: 60,
    }
    const expected = {
      url: 'https://example.com/image.jpg',
      mime_type: 'image/jpeg',
      title: 'Sample Image',
      size_in_bytes: 12345,
      duration_in_seconds: 60,
    }

    expect(parseAttachment(value)).toEqual(expected)
  })

  it('should handle attachment object with only required url property', () => {
    const value = {
      url: 'https://example.com/file.pdf',
    }
    const expected = {
      url: 'https://example.com/file.pdf',
    }

    expect(parseAttachment(value)).toEqual(expected)
  })

  it('should handle attachment object with coercible property values', () => {
    const value = {
      url: 'https://example.com/audio.mp3',
      mime_type: 123,
      title: 456,
      size_in_bytes: '10000',
      duration_in_seconds: '180',
    }
    const expected = {
      url: 'https://example.com/audio.mp3',
      mime_type: '123',
      title: '456',
      size_in_bytes: 10000,
      duration_in_seconds: 180,
    }

    expect(parseAttachment(value)).toEqual(expected)
  })

  it('should handle url as empty string', () => {
    const value = {
      url: '',
      mime_type: 'image/png',
      title: 'Empty URL Image',
    }

    expect(parseAttachment(value)).toEqual(value)
  })

  it('should return undefined if url is not present', () => {
    const value = {
      mime_type: 'video/mp4',
      title: 'Sample Video',
      size_in_bytes: 98765,
      duration_in_seconds: 300,
    }

    expect(parseAttachment(value)).toBeUndefined()
  })

  it('should handle array', () => {
    const value = [
      { url: 'https://example.com/image1.jpg' },
      { url: 'https://example.com/image2.jpg' },
    ]

    expect(parseAttachment(value)).toBeUndefined()
  })

  it('should handle string', () => {
    const value = 'https://example.com/image.jpg'

    expect(parseAttachment(value)).toBeUndefined()
  })

  it('should handle number', () => {
    const value = 420

    expect(parseAttachment(value)).toBeUndefined()
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseAttachment(value)).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseAttachment(value)).toBeUndefined()
  })

  it('should handle undefined', () => {
    const value = undefined

    expect(parseAttachment(value)).toBeUndefined()
  })

  it('should handle object with invalid url', () => {
    const value = {
      url: true,
      mime_type: 'audio/mpeg',
      title: 'Invalid URL Test',
    }

    expect(parseAttachment(value)).toBeUndefined()
  })

  it('should handle object with invalid properties', () => {
    const value = {
      url: 'https://example.com/document.pdf',
      mime_type: true,
      title: {},
      size_in_bytes: 'not-a-number',
      duration_in_seconds: false,
    }
    const expected = {
      url: 'https://example.com/document.pdf',
    }

    expect(parseAttachment(value)).toEqual(expected)
  })
})

describe('parseItem', () => {
  it('should handle a complete valid item object', () => {
    const value = {
      id: 'item-123',
      url: 'https://example.com/article',
      external_url: 'https://external-source.com/article',
      title: 'Test Article',
      content_html: '<p>HTML Content</p>',
      content_text: 'Plain text content',
      summary: 'Article summary',
      image: 'https://example.com/image.jpg',
      banner_image: 'https://example.com/banner.jpg',
      date_published: '2023-05-15T14:30:00Z',
      date_modified: '2023-05-16T10:15:00Z',
      tags: ['test', 'article', 'sample'],
      authors: [
        { name: 'John Doe', url: 'https://example.com/john' },
        { name: 'Jane Smith', url: 'https://example.com/jane' },
      ],
      language: 'en',
      attachments: [
        {
          url: 'https://example.com/attachment.pdf',
          mime_type: 'application/pdf',
          title: 'PDF Document',
          size_in_bytes: 12345,
        },
      ],
    }

    expect(parseItem(value)).toEqual(value)
  })

  it('should handle an item object with only required id property', () => {
    const value = {
      id: 'minimal-item-123',
    }

    expect(parseItem(value)).toEqual(value)
  })

  it('should handle an item with author as authors', () => {
    const value = {
      id: 'minimal-item-123',
      author: { name: 'John Doe' },
    }
    const expected = {
      id: 'minimal-item-123',
      authors: [{ name: 'John Doe' }],
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle coercible properties correctly in coerce mode', () => {
    const value = {
      id: 12345,
      url: 98765,
      title: 45678,
      tags: 'javascript',
      author: 'John Doe',
      attachments: [{ url: 'https://example.com/file.pdf', size_in_bytes: '5000' }],
    }
    const expected = {
      id: '12345',
      url: '98765',
      title: '45678',
      tags: ['javascript'],
      authors: [{ name: 'John Doe' }],
      attachments: [{ url: 'https://example.com/file.pdf', size_in_bytes: 5000 }],
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should return undefined if id is not present', () => {
    const value = {
      url: 'https://example.com/article',
      title: 'Article without ID',
      content_text: 'This article has no ID',
    }

    expect(parseItem(value)).toBeUndefined()
  })

  it('should handle id as empty string', () => {
    const value = {
      id: '',
      url: 'https://example.com/article',
      title: 'Article with empty ID',
    }

    expect(parseItem(value)).toEqual(value)
  })

  it('should handle invalid author and attachments', () => {
    const value = {
      id: 'item-invalid-props',
      author: true,
      attachments: [
        true,
        { not_url: 'missing url field' },
        { url: 'https://valid.com/attachment.pdf' },
      ],
    }
    const expected = {
      id: 'item-invalid-props',
      attachments: [{ url: 'https://valid.com/attachment.pdf' }],
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle array', () => {
    const value = [
      { id: 'item-1', title: 'First Item' },
      { id: 'item-2', title: 'Second Item' },
    ]

    expect(parseItem(value)).toBeUndefined()
  })

  it('should handle string', () => {
    const value = 'item-123'

    expect(parseItem(value)).toBeUndefined()
  })

  it('should handle number', () => {
    const value = 123

    expect(parseItem(value)).toBeUndefined()
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseItem(value)).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseItem(value)).toBeUndefined()
  })

  it('should handle undefined', () => {
    const value = undefined

    expect(parseItem(value)).toBeUndefined()
  })

  it('should handle complex nested authors and attachments', () => {
    const value = {
      id: 'complex-item',
      authors: [
        { name: 'Author 1', url: 'https://example.com/author1' },
        123,
        true,
        { not_a_name: 'Invalid author' },
        { name: 'Author 2' },
      ],
      attachments: [
        { url: 'https://example.com/file1.pdf', mime_type: 'application/pdf' },
        { not_a_url: 'Invalid attachment' },
      ],
    }
    const expected = {
      id: 'complex-item',
      authors: [
        { name: 'Author 1', url: 'https://example.com/author1' },
        { name: '123' },
        { name: 'Author 2' },
      ],
      attachments: [{ url: 'https://example.com/file1.pdf', mime_type: 'application/pdf' }],
    }

    expect(parseItem(value)).toEqual(expected)
  })
})

describe('parseFeed', () => {
  it('should handle a complete valid feed object', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      home_page_url: 'https://example.com/',
      feed_url: 'https://example.com/feed.json',
      description: 'A sample feed with example content',
      user_comment: 'This feed allows you to test the reader',
      next_url: 'https://example.com/feed/page2.json',
      icon: 'https://example.com/icon.png',
      favicon: 'https://example.com/favicon.ico',
      language: 'en-US',
      expired: false,
      hubs: [{ type: 'websub', url: 'https://websub.example.com/' }],
      authors: [
        { name: 'John Doe', url: 'https://example.com/john' },
        { name: 'Jane Smith', url: 'https://example.com/jane' },
      ],
      items: [
        {
          id: 'item-1',
          title: 'First Item',
          content_text: 'Content of first item',
        },
        {
          id: 'item-2',
          title: 'Second Item',
          content_html: '<p>Content of second item</p>',
        },
      ],
    }

    expect(parseFeed(value)).toEqual(value)
  })

  it('should handle a minimal valid feed object with only required properties', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Minimal Feed',
      items: [{ id: 'item-1', content_text: 'Content' }],
    }

    expect(parseFeed(value)).toEqual(value)
  })

  it('should handle coercible properties correctly in coerce mode', () => {
    const value = {
      version: 123,
      title: 456,
      items: [{ id: 789, content_text: 'Content' }],
      expired: 'true',
      author: 'John Doe',
    }
    const expected = {
      version: '123',
      title: '456',
      expired: true,
      authors: [{ name: 'John Doe' }],
      items: [{ id: '789', content_text: 'Content' }],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should return undefined if required properties are missing', () => {
    const missingVersion = {
      title: 'Feed Without Version',
      items: [{ id: 'item-1' }],
    }
    const missingTitle = {
      version: 'https://jsonfeed.org/version/1.1',
      items: [{ id: 'item-1' }],
    }
    const missingItems = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed Without Items',
    }

    expect(parseFeed(missingVersion)).toBeUndefined()
    expect(parseFeed(missingTitle)).toBeUndefined()
    expect(parseFeed(missingItems)).toBeUndefined()
  })

  it('should return undefined if required properties are not defined', () => {
    const emptyVersion = {
      title: 'Feed With Empty Version',
      items: [{ id: 'item-1' }],
    }
    const emptyTitle = {
      version: 'https://jsonfeed.org/version/1.1',
      items: [{ id: 'item-1' }],
    }
    const emptyItems = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed With Empty Items',
    }

    expect(parseFeed(emptyVersion)).toBeUndefined()
    expect(parseFeed(emptyTitle)).toBeUndefined()
    expect(parseFeed(emptyItems)).toBeUndefined()
  })

  it('should return feed object if required properties are defined and empty', () => {
    const value = {
      version: '',
      title: '',
      items: [],
    }

    expect(parseFeed(value)).toEqual(value)
  })

  it('should handle invalid nested properties', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with Invalid Properties',
      items: [{ id: 'item-1', author: true }, { not_an_id: 'missing id' }, { id: 'item-2' }],
      author: { not_a_name: 'John' },
      hubs: [
        true,
        { not_a_type: 'missing type' },
        { type: 'websub', url: 'https://example.com/hub' },
      ],
    }
    const expected = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with Invalid Properties',
      hubs: [{ type: 'websub', url: 'https://example.com/hub' }],
      items: [{ id: 'item-1' }, { id: 'item-2' }],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle array input', () => {
    const value = [
      {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'First Feed',
        items: [],
      },
      {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Second Feed',
        items: [],
      },
    ]

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should handle string input', () => {
    const value = 'not a feed'

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should handle number input', () => {
    const value = 123

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should handle boolean input', () => {
    const value = true

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should handle null input', () => {
    const value = null

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should handle undefined input', () => {
    const value = undefined

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should correctly process complex feed with nested structures', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Complex Feed',
      description: 'Feed with complex nested structures',
      authors: [
        { name: 'Author 1', url: 'https://example.com/author1' },
        { not_a_name: 'Invalid author' },
        { name: 'Author 2' },
      ],
      items: [
        {
          id: 'item-1',
          title: 'Item with attachments',
          attachments: [
            {
              url: 'https://example.com/file1.pdf',
              mime_type: 'application/pdf',
            },
            { not_a_url: 'Invalid attachment' },
            { url: 'https://example.com/file2.jpg', mime_type: 'image/jpeg' },
          ],
          authors: [{ name: 'Item Author 1' }, { name: 'Item Author 2' }],
        },
        {
          id: 'item-2',
          title: 'Item with tags',
          tags: ['tag1', 123, true, 'tag2'],
        },
      ],
    }
    const expected = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Complex Feed',
      description: 'Feed with complex nested structures',
      authors: [{ name: 'Author 1', url: 'https://example.com/author1' }, { name: 'Author 2' }],
      items: [
        {
          id: 'item-1',
          title: 'Item with attachments',
          authors: [{ name: 'Item Author 1' }, { name: 'Item Author 2' }],
          attachments: [
            { url: 'https://example.com/file1.pdf', mime_type: 'application/pdf' },
            { url: 'https://example.com/file2.jpg', mime_type: 'image/jpeg' },
          ],
        },
        {
          id: 'item-2',
          title: 'Item with tags',
          tags: ['tag1', '123', 'tag2'],
        },
      ],
    }

    expect(parseFeed(value)).toEqual(expected)
  })
})
