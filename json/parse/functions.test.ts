import { describe, expect, it } from 'bun:test'
import {
  parseAttachment,
  parseAuthor,
  parseAuthors,
  parseFeed,
  parseHub,
  parseItem,
  parseTags,
} from './functions'

describe('parseTags', () => {
  it('should handle array of strings', () => {
    const value = ['javascript', 'typescript']

    expect(parseTags(value, 'coerce')).toEqual(value)
    expect(parseTags(value, 'skip')).toEqual(value)
  })

  it('should handle array of mixed values', () => {
    const value = ['javascript', true, 123, {}, [], null]

    expect(parseTags(value, 'coerce')).toEqual(['javascript', '123'])
    expect(parseTags(value, 'skip')).toEqual(['javascript'])
  })

  it('should handle object', () => {
    const value = { name: 'javascript' }

    expect(parseTags(value, 'coerce')).toBeUndefined()
    expect(parseTags(value, 'skip')).toBeUndefined()
  })

  it('should handle non-empty string', () => {
    const value = 'javascript'

    expect(parseTags(value, 'coerce')).toEqual([value])
    expect(parseTags(value, 'skip')).toBeUndefined()
  })

  it('should handle empty string', () => {
    const value = ''

    expect(parseTags(value, 'coerce')).toBeUndefined()
    expect(parseTags(value, 'skip')).toBeUndefined()
  })

  it('should handle number', () => {
    const value = 420

    expect(parseTags(value, 'coerce')).toEqual(['420'])
    expect(parseTags(value, 'skip')).toBeUndefined()
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseTags(value, 'coerce')).toBeUndefined()
    expect(parseTags(value, 'skip')).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseTags(value, 'coerce')).toBeUndefined()
    expect(parseTags(value, 'skip')).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseTags(value, 'coerce')).toBeUndefined()
    expect(parseTags(value, 'skip')).toBeUndefined()
  })
})

describe('parseAuthor', () => {
  it('should handle array of strings', () => {
    const value = ['John', 'James']

    expect(parseAuthor(value, 'coerce')).toEqual({ name: 'John' })
    expect(parseAuthor(value, 'skip')).toBeUndefined()
  })

  it('should handle array of mixed values', () => {
    const value = [true, {}, [], null, 'John', 123]

    expect(parseAuthor(value, 'coerce')).toEqual({ name: 'John' })
    expect(parseAuthor(value, 'skip')).toBeUndefined()
  })

  it('should handle array of Author objects', () => {
    const value = [{ name: 'John' }, { name: 'James' }]

    expect(parseAuthor(value, 'coerce')).toEqual({ name: 'John' })
    expect(parseAuthor(value, 'skip')).toBeUndefined()
  })

  it('should handle Author object', () => {
    const value = { name: 'John', url: 'link', avatar: 123 }

    expect(parseAuthor(value, 'coerce')).toEqual({
      name: 'John',
      url: 'link',
      avatar: '123',
    })
    expect(parseAuthor(value, 'skip')).toEqual({
      name: 'John',
      url: 'link',
      avatar: undefined,
    })
  })

  it('should handle non-Author object', () => {
    const value = { count: 1 }

    expect(parseAuthor(value, 'coerce')).toBeUndefined()
    expect(parseAuthor(value, 'skip')).toBeUndefined()
  })

  it('should handle non-empty string', () => {
    const value = 'Alice'

    expect(parseAuthor(value, 'coerce')).toEqual({ name: 'Alice' })
    expect(parseAuthor(value, 'skip')).toBeUndefined()
  })

  it('should handle empty string', () => {
    const value = ''

    expect(parseAuthor(value, 'coerce')).toBeUndefined()
    expect(parseAuthor(value, 'skip')).toBeUndefined()
  })

  it('should handle number', () => {
    const value = 420

    expect(parseAuthor(value, 'coerce')).toEqual({ name: '420' })
    expect(parseAuthor(value, 'skip')).toBeUndefined()
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseAuthor(value, 'coerce')).toBeUndefined()
    expect(parseAuthor(value, 'skip')).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseAuthor(value, 'coerce')).toBeUndefined()
    expect(parseAuthor(value, 'skip')).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseAuthor(value, 'coerce')).toBeUndefined()
    expect(parseAuthor(value, 'skip')).toBeUndefined()
  })
})

describe('parseAuthors', () => {
  it('should handle authors as object', () => {
    const authors = { name: 'John' }
    const author = undefined

    expect(parseAuthors(authors, author, 'coerce')).toEqual([{ name: 'John' }])
    expect(parseAuthors(authors, author, 'skip')).toEqual([{ name: 'John' }])
  })

  it('should handle both authors and author ', () => {
    const authors = { name: 'John' }
    const author = { name: 'Jane' }

    expect(parseAuthors(authors, author, 'coerce')).toEqual([{ name: 'John' }])
    expect(parseAuthors(authors, author, 'skip')).toEqual([{ name: 'John' }])
  })

  it('should handle author when no authors present', () => {
    const authors = undefined
    const author = { name: 'Jane' }

    expect(parseAuthors(authors, author, 'coerce')).toEqual([{ name: 'Jane' }])
    expect(parseAuthors(authors, author, 'skip')).toEqual([{ name: 'Jane' }])
  })
})

describe('parseHub', () => {
  it('should handle array of mixed values', () => {
    const value = [true, {}, [], null, 'John', 123]

    expect(parseHub(value, 'coerce')).toBeUndefined()
    expect(parseHub(value, 'skip')).toBeUndefined()
  })

  it('should handle array of non-Hub objects', () => {
    const value = [{ name: 'John' }, { name: 'James' }]

    expect(parseHub(value, 'coerce')).toBeUndefined()
    expect(parseHub(value, 'skip')).toBeUndefined()
  })

  it('should handle Hub object', () => {
    const value = { type: 'pub', url: 33 }

    expect(parseHub(value, 'coerce')).toEqual({ type: 'pub', url: '33' })
    expect(parseHub(value, 'skip')).toEqual({ type: 'pub', url: undefined })
  })

  it('should handle non-Hub object', () => {
    const value = { count: 2 }

    expect(parseHub(value, 'coerce')).toBeUndefined()
    expect(parseHub(value, 'skip')).toBeUndefined()
  })

  it('should handle string', () => {
    const value = 'Alice'

    expect(parseHub(value, 'coerce')).toBeUndefined()
    expect(parseHub(value, 'skip')).toBeUndefined()
  })

  it('should handle number', () => {
    const value = 420

    expect(parseHub(value, 'coerce')).toBeUndefined()
    expect(parseHub(value, 'skip')).toBeUndefined()
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseHub(value, 'coerce')).toBeUndefined()
    expect(parseHub(value, 'skip')).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseHub(value, 'coerce')).toBeUndefined()
    expect(parseHub(value, 'skip')).toBeUndefined()
  })

  it('should return undefined', () => {
    const value = undefined

    expect(parseHub(value, 'coerce')).toBeUndefined()
    expect(parseHub(value, 'skip')).toBeUndefined()
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

    expect(parseAttachment(value, 'coerce')).toEqual({
      url: 'https://example.com/image.jpg',
      mime_type: 'image/jpeg',
      title: 'Sample Image',
      size_in_bytes: 12345,
      duration_in_seconds: 60,
    })
    expect(parseAttachment(value, 'skip')).toEqual({
      url: 'https://example.com/image.jpg',
      mime_type: 'image/jpeg',
      title: 'Sample Image',
      size_in_bytes: 12345,
      duration_in_seconds: 60,
    })
  })

  it('should handle attachment object with only required url property', () => {
    const value = {
      url: 'https://example.com/file.pdf',
    }

    expect(parseAttachment(value, 'coerce')).toEqual({
      url: 'https://example.com/file.pdf',
    })
    expect(parseAttachment(value, 'skip')).toEqual({
      url: 'https://example.com/file.pdf',
    })
  })

  it('should handle attachment object with coercible property values', () => {
    const value = {
      url: 'https://example.com/audio.mp3',
      mime_type: 123,
      title: 456,
      size_in_bytes: '10000',
      duration_in_seconds: '180',
    }

    expect(parseAttachment(value, 'coerce')).toEqual({
      url: 'https://example.com/audio.mp3',
      mime_type: '123',
      title: '456',
      size_in_bytes: 10000,
      duration_in_seconds: 180,
    })
    expect(parseAttachment(value, 'skip')).toEqual({
      url: 'https://example.com/audio.mp3',
    })
  })

  it('should return undefined if url is not present', () => {
    const value = {
      mime_type: 'video/mp4',
      title: 'Sample Video',
      size_in_bytes: 98765,
      duration_in_seconds: 300,
    }

    expect(parseAttachment(value, 'coerce')).toBeUndefined()
    expect(parseAttachment(value, 'skip')).toBeUndefined()
  })

  it('should return undefined if url is empty string', () => {
    const value = {
      url: '',
      mime_type: 'image/png',
      title: 'Empty URL Image',
    }

    expect(parseAttachment(value, 'coerce')).toBeUndefined()
    expect(parseAttachment(value, 'skip')).toBeUndefined()
  })

  it('should handle array', () => {
    const value = [
      { url: 'https://example.com/image1.jpg' },
      { url: 'https://example.com/image2.jpg' },
    ]

    expect(parseAttachment(value, 'coerce')).toBeUndefined()
    expect(parseAttachment(value, 'skip')).toBeUndefined()
  })

  it('should handle string', () => {
    const value = 'https://example.com/image.jpg'

    expect(parseAttachment(value, 'coerce')).toBeUndefined()
    expect(parseAttachment(value, 'skip')).toBeUndefined()
  })

  it('should handle number', () => {
    const value = 420

    expect(parseAttachment(value, 'coerce')).toBeUndefined()
    expect(parseAttachment(value, 'skip')).toBeUndefined()
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseAttachment(value, 'coerce')).toBeUndefined()
    expect(parseAttachment(value, 'skip')).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseAttachment(value, 'coerce')).toBeUndefined()
    expect(parseAttachment(value, 'skip')).toBeUndefined()
  })

  it('should handle undefined', () => {
    const value = undefined

    expect(parseAttachment(value, 'coerce')).toBeUndefined()
    expect(parseAttachment(value, 'skip')).toBeUndefined()
  })

  it('should handle object with invalid url', () => {
    const value = {
      url: true,
      mime_type: 'audio/mpeg',
      title: 'Invalid URL Test',
    }

    expect(parseAttachment(value, 'coerce')).toBeUndefined()
    expect(parseAttachment(value, 'skip')).toBeUndefined()
  })

  it('should handle object with invalid properties', () => {
    const value = {
      url: 'https://example.com/document.pdf',
      mime_type: true,
      title: {},
      size_in_bytes: 'not-a-number',
      duration_in_seconds: false,
    }

    expect(parseAttachment(value, 'coerce')).toEqual({
      url: 'https://example.com/document.pdf',
    })
    expect(parseAttachment(value, 'skip')).toEqual({
      url: 'https://example.com/document.pdf',
    })
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
      author: { name: 'John Doe', url: 'https://example.com/john' },
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

    expect(parseItem(value, 'coerce')).toEqual(value)
    expect(parseItem(value, 'skip')).toEqual(value)
  })

  it('should handle an item object with only required id property', () => {
    const value = {
      id: 'minimal-item-123',
    }

    expect(parseItem(value, 'coerce')).toEqual(value)
    expect(parseItem(value, 'skip')).toEqual(value)
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

    expect(parseItem(value, 'coerce')).toEqual({
      id: '12345',
      url: '98765',
      title: '45678',
      tags: ['javascript'],
      author: { name: 'John Doe' },
      attachments: [{ url: 'https://example.com/file.pdf', size_in_bytes: 5000 }],
    })
    expect(parseItem(value, 'skip')).toBeUndefined()
  })

  it('should return undefined if id is not present', () => {
    const value = {
      url: 'https://example.com/article',
      title: 'Article without ID',
      content_text: 'This article has no ID',
    }

    expect(parseItem(value, 'coerce')).toBeUndefined()
    expect(parseItem(value, 'skip')).toBeUndefined()
  })

  it('should return undefined if id is empty string', () => {
    const value = {
      id: '',
      url: 'https://example.com/article',
      title: 'Article with empty ID',
    }

    expect(parseItem(value, 'coerce')).toBeUndefined()
    expect(parseItem(value, 'skip')).toBeUndefined()
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

    expect(parseItem(value, 'coerce')).toEqual(expected)
    expect(parseItem(value, 'skip')).toEqual(expected)
  })

  it('should handle array', () => {
    const value = [
      { id: 'item-1', title: 'First Item' },
      { id: 'item-2', title: 'Second Item' },
    ]

    expect(parseItem(value, 'coerce')).toBeUndefined()
    expect(parseItem(value, 'skip')).toBeUndefined()
  })

  it('should handle string', () => {
    const value = 'item-123'

    expect(parseItem(value, 'coerce')).toBeUndefined()
    expect(parseItem(value, 'skip')).toBeUndefined()
  })

  it('should handle number', () => {
    const value = 123

    expect(parseItem(value, 'coerce')).toBeUndefined()
    expect(parseItem(value, 'skip')).toBeUndefined()
  })

  it('should handle boolean', () => {
    const value = true

    expect(parseItem(value, 'coerce')).toBeUndefined()
    expect(parseItem(value, 'skip')).toBeUndefined()
  })

  it('should handle null', () => {
    const value = null

    expect(parseItem(value, 'coerce')).toBeUndefined()
    expect(parseItem(value, 'skip')).toBeUndefined()
  })

  it('should handle undefined', () => {
    const value = undefined

    expect(parseItem(value, 'coerce')).toBeUndefined()
    expect(parseItem(value, 'skip')).toBeUndefined()
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

    expect(parseItem(value, 'coerce')).toEqual({
      id: 'complex-item',
      authors: [
        { name: 'Author 1', url: 'https://example.com/author1' },
        { name: '123' },
        { name: 'Author 2' },
      ],
      attachments: [{ url: 'https://example.com/file1.pdf', mime_type: 'application/pdf' }],
    })
    expect(parseItem(value, 'skip')).toEqual({
      id: 'complex-item',
      authors: [{ name: 'Author 1', url: 'https://example.com/author1' }, { name: 'Author 2' }],
      attachments: [{ url: 'https://example.com/file1.pdf', mime_type: 'application/pdf' }],
    })
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
      author: { name: 'John Doe', url: 'https://example.com/john' },
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

    expect(parseFeed(value, 'coerce')).toEqual(value)
    expect(parseFeed(value, 'skip')).toEqual(value)
  })

  it('should handle a minimal valid feed object with only required properties', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Minimal Feed',
      items: [{ id: 'item-1', content_text: 'Content' }],
    }
    const expected = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Minimal Feed',
      items: [{ id: 'item-1', content_text: 'Content' }],
    }

    expect(parseFeed(value, 'coerce')).toEqual(expected)
    expect(parseFeed(value, 'skip')).toEqual(expected)
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
      author: { name: 'John Doe' },
      items: [{ id: '789', content_text: 'Content' }],
    }

    expect(parseFeed(value, 'coerce')).toEqual(expected)
    expect(parseFeed(value, 'skip')).toBeUndefined()
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

    expect(parseFeed(missingVersion, 'coerce')).toBeUndefined()
    expect(parseFeed(missingVersion, 'skip')).toBeUndefined()

    expect(parseFeed(missingTitle, 'coerce')).toBeUndefined()
    expect(parseFeed(missingTitle, 'skip')).toBeUndefined()

    expect(parseFeed(missingItems, 'coerce')).toBeUndefined()
    expect(parseFeed(missingItems, 'skip')).toBeUndefined()
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

    expect(parseFeed(emptyVersion, 'coerce')).toBeUndefined()
    expect(parseFeed(emptyVersion, 'skip')).toBeUndefined()

    expect(parseFeed(emptyTitle, 'coerce')).toBeUndefined()
    expect(parseFeed(emptyTitle, 'skip')).toBeUndefined()

    expect(parseFeed(emptyItems, 'coerce')).toBeUndefined()
    expect(parseFeed(emptyItems, 'skip')).toBeUndefined()
  })

  it('should return feed object if required properties are defined and empty', () => {
    const value = {
      version: '',
      title: '',
      items: [],
    }

    expect(parseFeed(value, 'coerce')).toEqual(value)
    expect(parseFeed(value, 'skip')).toEqual(value)
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

    expect(parseFeed(value, 'coerce')).toEqual(expected)
    expect(parseFeed(value, 'skip')).toEqual(expected)
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

    expect(parseFeed(value, 'coerce')).toBeUndefined()
    expect(parseFeed(value, 'skip')).toBeUndefined()
  })

  it('should handle string input', () => {
    const value = 'not a feed'

    expect(parseFeed(value, 'coerce')).toBeUndefined()
    expect(parseFeed(value, 'skip')).toBeUndefined()
  })

  it('should handle number input', () => {
    const value = 123

    expect(parseFeed(value, 'coerce')).toBeUndefined()
    expect(parseFeed(value, 'skip')).toBeUndefined()
  })

  it('should handle boolean input', () => {
    const value = true

    expect(parseFeed(value, 'coerce')).toBeUndefined()
    expect(parseFeed(value, 'skip')).toBeUndefined()
  })

  it('should handle null input', () => {
    const value = null

    expect(parseFeed(value, 'coerce')).toBeUndefined()
    expect(parseFeed(value, 'skip')).toBeUndefined()
  })

  it('should handle undefined input', () => {
    const value = undefined

    expect(parseFeed(value, 'coerce')).toBeUndefined()
    expect(parseFeed(value, 'skip')).toBeUndefined()
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

    expect(parseFeed(value, 'coerce')).toEqual({
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
    })
    expect(parseFeed(value, 'skip')).toEqual({
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
          tags: ['tag1', 'tag2'],
        },
      ],
    })
  })
})
