import { describe, expect, it } from 'bun:test'
import {
  createCaseInsensitiveGetter,
  parseAttachment,
  parseAuthor,
  parseFeed,
  parseHub,
  parseItem,
  retrieveAuthors,
} from './utils.js'

describe('createCaseInsensitiveGetter', () => {
  it('should retrieve value using case-insensitive key lookup', () => {
    const value = {
      Title: 'Example Title',
      AUTHOR: 'John Doe',
      content: 'Some content here',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('title')).toEqual('Example Title')
    expect(get('author')).toEqual('John Doe')
    expect(get('CONTENT')).toEqual('Some content here')
  })

  it('should preserve the original value types', () => {
    const value = {
      Number: 42,
      Boolean: true,
      Object: { key: 'value' },
      Array: [1, 2, 3],
      Null: null,
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('number')).toBe(42)
    expect(get('boolean')).toBe(true)
    expect(get('object')).toEqual({ key: 'value' })
    expect(get('array')).toEqual([1, 2, 3])
    expect(get('null')).toBeNull()
  })

  it('should handle keys that differ only in case', () => {
    const value = {
      key: 'lowercase value',
      KEY: 'uppercase value',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('key')).toEqual('lowercase value')
    expect(get('KEY')).toEqual('uppercase value')
  })

  it('should handle non-string key lookups by coercing to string', () => {
    const value = {
      '123': 'numeric key',
      true: 'boolean key',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('123')).toEqual('numeric key')
    expect(get('TRUE')).toEqual('boolean key')
  })

  it('should handle special characters in keys', () => {
    const value = {
      'Special-Key': 'with dash',
      Special_Key: 'with underscore',
      'Special.Key': 'with dot',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('special-key')).toEqual('with dash')
    expect(get('SPECIAL_KEY')).toEqual('with underscore')
    expect(get('special.key')).toEqual('with dot')
  })

  it('should handle Unicode characters correctly', () => {
    const value = {
      CaféItem: 'coffee',
      RÉSUMÉ: 'document',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('caféitem')).toEqual('coffee')
    expect(get('résumé')).toEqual('document')
  })

  it('should handle multiple lookups on the same getter', () => {
    const value = {
      First: 'first value',
      Second: 'second value',
      Third: 'third value',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('first')).toEqual('first value')
    expect(get('SECOND')).toEqual('second value')
    expect(get('THiRd')).toEqual('third value')
  })

  it('should handle undefined values in the object', () => {
    const value = {
      DefinedKey: 'defined value',
      UndefinedKey: undefined,
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('definedkey')).toEqual('defined value')
    expect(get('undefinedkey')).toBeUndefined()
    // Make sure we can distinguish between non-existent keys and keys with undefined values.
    expect('UndefinedKey' in value).toBe(true)
  })

  it('should return undefined for non-existent keys', () => {
    const value = {
      ExistingKey: 'value',
    }
    const get = createCaseInsensitiveGetter(value)

    expect(get('nonexistentkey')).toBeUndefined()
  })

  it('should handle empty objects', () => {
    const value = {}
    const get = createCaseInsensitiveGetter(value)

    expect(get('anykey')).toBeUndefined()
  })
})

describe('parseAuthor', () => {
  const expectedFull = { name: 'John', url: 'link', avatar: '123' }

  it('should handle Author object (with singular value)', () => {
    const value = {
      name: 'John',
      url: 'link',
      avatar: 123,
    }

    expect(parseAuthor(value)).toEqual(expectedFull)
  })

  it('should handle Author object (with array of values)', () => {
    const value = {
      name: ['John', 'Jane'],
      url: ['link', 'alternate-link'],
      avatar: [123, 456],
    }

    expect(parseAuthor(value)).toEqual(expectedFull)
  })

  it('should handle Author object with only one of required fields', () => {
    const nameOnly = { name: 'John' }
    const urlOnly = { url: 'link' }
    const avatarOnly = { avatar: 'http://example.com/avatar.jpg' }

    expect(parseAuthor(nameOnly)).toEqual(nameOnly)
    expect(parseAuthor(urlOnly)).toEqual(urlOnly)
    expect(parseAuthor(avatarOnly)).toEqual(avatarOnly)
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

describe('parseAttachment', () => {
  const expectedFull = {
    url: 'https://example.com/image.jpg',
    mime_type: 'image/jpeg',
    title: 'Sample Image',
    size_in_bytes: 12345,
    duration_in_seconds: 60,
  }

  it('should handle attachment object with all valid properties (with singular value)', () => {
    const value = {
      url: 'https://example.com/image.jpg',
      mime_type: 'image/jpeg',
      title: 'Sample Image',
      size_in_bytes: 12345,
      duration_in_seconds: 60,
    }

    expect(parseAttachment(value)).toEqual(expectedFull)
  })

  it('should handle attachment object with all valid properties (with array of values)', () => {
    const value = {
      url: ['https://example.com/image.jpg', 'https://example.com/alternate-image.jpg'],
      mime_type: ['image/jpeg', 'image/png'],
      title: ['Sample Image', 'Alternative Sample Image'],
      size_in_bytes: [12345, 67890],
      duration_in_seconds: [60, 120],
    }

    expect(parseAttachment(value)).toEqual(expectedFull)
  })

  it('should handle attachment object with only required url property', () => {
    const value = {
      url: 'https://example.com/file.pdf',
      mime_type: 'application/pdf',
    }
    const expected = {
      url: 'https://example.com/file.pdf',
      mime_type: 'application/pdf',
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

  it('should handle partial objects (missing url)', () => {
    const value = {
      mime_type: 'video/mp4',
      title: 'Sample Video',
      size_in_bytes: 98765,
      duration_in_seconds: 300,
    }
    const expected = {
      mime_type: 'video/mp4',
      title: 'Sample Video',
      size_in_bytes: 98765,
      duration_in_seconds: 300,
    }

    expect(parseAttachment(value)).toEqual(expected)
  })

  it('should handle partial objects (missing mime_type)', () => {
    const value = {
      url: 'http://example.com/video.mp4',
      title: 'Sample Video',
      size_in_bytes: 98765,
      duration_in_seconds: 300,
    }
    const expected = {
      url: 'http://example.com/video.mp4',
      title: 'Sample Video',
      size_in_bytes: 98765,
      duration_in_seconds: 300,
    }

    expect(parseAttachment(value)).toEqual(expected)
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

  it('should handle partial objects (invalid url)', () => {
    const value = {
      url: true,
      mime_type: 'audio/mpeg',
      title: 'Invalid URL Test',
    }
    const expected = {
      mime_type: 'audio/mpeg',
      title: 'Invalid URL Test',
    }

    expect(parseAttachment(value)).toEqual(expected)
  })

  it('should handle object with invalid properties', () => {
    const value = {
      url: 'https://example.com/document.pdf',
      mime_type: 'application/pdf',
      title: {},
      size_in_bytes: 'not-a-number',
      duration_in_seconds: false,
    }
    const expected = {
      url: 'https://example.com/document.pdf',
      mime_type: 'application/pdf',
    }

    expect(parseAttachment(value)).toEqual(expected)
  })
})

describe('parseItem', () => {
  const expectedFull = {
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

  it('should handle a complete valid item object (with singular value)', () => {
    const value = expectedFull

    expect(parseItem(value)).toEqual(expectedFull)
  })

  it('should handle a complete valid item object (with array of values)', () => {
    const value = {
      id: ['item-123', 'item-456'],
      url: ['https://example.com/article', 'https://example.com/alternate-article'],
      external_url: [
        'https://external-source.com/article',
        'https://external-source.com/alternate-article',
      ],
      title: ['Test Article', 'Alternative Test Article'],
      content_html: ['<p>HTML Content</p>', '<p>Alternative HTML Content</p>'],
      content_text: ['Plain text content', 'Alternative plain text content'],
      summary: ['Article summary', 'Extended article summary'],
      image: ['https://example.com/image.jpg', 'https://example.com/alternate-image.jpg'],
      banner_image: ['https://example.com/banner.jpg', 'https://example.com/alternate-banner.jpg'],
      date_published: ['2023-05-15T14:30:00Z', '2023-05-20T09:45:00Z'],
      date_modified: ['2023-05-16T10:15:00Z', '2023-05-21T11:30:00Z'],
      tags: ['test', 'article', 'sample'],
      authors: [
        { name: 'John Doe', url: 'https://example.com/john' },
        { name: 'Jane Smith', url: 'https://example.com/jane' },
      ],
      language: ['en', 'de'],
      attachments: [
        {
          url: 'https://example.com/attachment.pdf',
          mime_type: 'application/pdf',
          title: 'PDF Document',
          size_in_bytes: 12345,
        },
      ],
    }

    expect(parseItem(value)).toEqual(expectedFull)
  })

  it('should handle an item object with only required fields property', () => {
    const withHtmlContent = {
      id: 'minimal-item-123',
      content_html: '<p>Minimal HTML Content</p>',
    }
    const withTextContent = {
      id: 'minimal-item-123',
      content_text: 'Minimal text content',
    }

    expect(parseItem(withHtmlContent)).toEqual(withHtmlContent)
    expect(parseItem(withTextContent)).toEqual(withTextContent)
  })

  it('should handle an item with author as authors', () => {
    const value = {
      id: 'minimal-item-123',
      author: { name: 'John Doe' },
      content_text: 'Minimal text content',
    }
    const expected = {
      id: 'minimal-item-123',
      authors: [{ name: 'John Doe' }],
      content_text: 'Minimal text content',
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
      content_text: 'Minimal text content',
      attachments: [
        {
          url: 'https://example.com/file.pdf',
          mime_type: 'application/pdf',
          size_in_bytes: '5000',
        },
      ],
    }
    const expected = {
      id: '12345',
      url: '98765',
      title: '45678',
      tags: ['javascript'],
      authors: [{ name: 'John Doe' }],
      content_text: 'Minimal text content',
      attachments: [
        {
          url: 'https://example.com/file.pdf',
          mime_type: 'application/pdf',
          size_in_bytes: 5000,
        },
      ],
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle partial objects (missing id)', () => {
    const value = {
      url: 'https://example.com/article',
      title: 'Article without ID',
      content_text: 'This article has no ID',
    }
    const expected = {
      url: 'https://example.com/article',
      title: 'Article without ID',
      content_text: 'This article has no ID',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle partial objects (missing content)', () => {
    const value = {
      id: 'test-item-123',
    }
    const expected = {
      id: 'test-item-123',
    }

    expect(parseItem(value)).toEqual(expected)
  })

  it('should handle id as empty string', () => {
    const value = {
      id: '',
      content_text: 'Minimal text content',
      url: 'https://example.com/article',
      title: 'Article with empty ID',
    }

    expect(parseItem(value)).toEqual(value)
  })

  it('should handle invalid author and attachments', () => {
    const value = {
      id: 'item-invalid-props',
      content_text: 'Minimal text content',
      author: true,
      attachments: [
        true,
        { not_url: 'missing url field' },
        { url: 'https://valid.com/attachment.pdf', mime_type: 'application/pdf' },
      ],
    }
    const expected = {
      id: 'item-invalid-props',
      content_text: 'Minimal text content',
      attachments: [{ url: 'https://valid.com/attachment.pdf', mime_type: 'application/pdf' }],
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
      content_text: 'Minimal text content',
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
      content_text: 'Minimal text content',
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

describe('parseHub', () => {
  const expectedFull = {
    type: 'pub',
    url: '33',
  }

  it('should handle Hub object (with singular value)', () => {
    const value = {
      type: 'pub',
      url: 33,
    }

    expect(parseHub(value)).toEqual(expectedFull)
  })

  it('should handle Hub object (with array of values)', () => {
    const value = {
      type: ['pub', 'sub'],
      url: [33, '44'],
    }

    expect(parseHub(value)).toEqual(expectedFull)
  })

  it('should handle partial objects', () => {
    const noUrl = { type: 'pub' }
    const noType = { url: 'some-url' }

    const expectedNoUrl = { type: 'pub' }
    const expectedNoType = { url: 'some-url' }

    expect(parseHub(noUrl)).toEqual(expectedNoUrl)
    expect(parseHub(noType)).toEqual(expectedNoType)
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

describe('parseFeed', () => {
  const expectedFull = {
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

  it('should handle a complete valid feed object (with singular value)', () => {
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

    expect(parseFeed(value)).toEqual(expectedFull)
  })

  it('should handle a complete valid feed object (with array of values)', () => {
    const value = {
      version: ['https://jsonfeed.org/version/1.1', 'https://jsonfeed.org/version/1.0'],
      title: ['My Example Feed', 'My Alternative Example Feed'],
      home_page_url: ['https://example.com/', 'https://example.com/home/'],
      feed_url: ['https://example.com/feed.json', 'https://example.com/alternate-feed.json'],
      description: [
        'A sample feed with example content',
        'An alternative sample feed with different content',
      ],
      user_comment: [
        'This feed allows you to test the reader',
        'This is an alternative feed for testing purposes',
      ],
      next_url: [
        'https://example.com/feed/page2.json',
        'https://example.com/feed/alternate-page2.json',
      ],
      icon: ['https://example.com/icon.png', 'https://example.com/alternate-icon.png'],
      favicon: ['https://example.com/favicon.ico', 'https://example.com/alternate-favicon.ico'],
      language: ['en-US', 'fr-FR'],
      expired: [false, true],
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

    expect(parseFeed(value)).toEqual(expectedFull)
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
      title: '456',
      expired: true,
      authors: [{ name: 'John Doe' }],
      items: [{ id: '789', content_text: 'Content' }],
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle partial objects', () => {
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

    const expectedMissingVersion = {
      title: 'Feed Without Version',
      items: [{ id: 'item-1' }],
    }
    const expectedMissingTitle = {
      items: [{ id: 'item-1' }],
    }
    const expectedMissingItems = {
      title: 'Feed Without Items',
    }

    expect(parseFeed(missingVersion)).toEqual(expectedMissingVersion)
    expect(parseFeed(missingTitle)).toEqual(expectedMissingTitle)
    expect(parseFeed(missingItems)).toEqual(expectedMissingItems)
  })

  it('should handle invalid nested properties', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with Invalid Properties',
      items: [
        { id: 'item-1', author: true, content_text: 'Minimal text content' },
        { not_an_id: 'missing id' },
        { id: 'item-2', content_text: 'Minimal text content' },
      ],
      author: { not_a_name: 'John' },
      hubs: [
        true,
        { not_a_type: 'missing type' },
        { type: 'websub', url: 'https://example.com/hub' },
      ],
    }
    const expected = {
      title: 'Feed with Invalid Properties',
      hubs: [{ type: 'websub', url: 'https://example.com/hub' }],
      items: [
        { id: 'item-1', content_text: 'Minimal text content' },
        { id: 'item-2', content_text: 'Minimal text content' },
      ],
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
          content_text: 'Minimal text content',
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
          content_text: 'Minimal text content',
          title: 'Item with tags',
          tags: ['tag1', 123, true, 'tag2'],
        },
      ],
    }
    const expected = {
      title: 'Complex Feed',
      description: 'Feed with complex nested structures',
      authors: [{ name: 'Author 1', url: 'https://example.com/author1' }, { name: 'Author 2' }],
      items: [
        {
          id: 'item-1',
          content_text: 'Minimal text content',
          title: 'Item with attachments',
          authors: [{ name: 'Item Author 1' }, { name: 'Item Author 2' }],
          attachments: [
            { url: 'https://example.com/file1.pdf', mime_type: 'application/pdf' },
            { url: 'https://example.com/file2.jpg', mime_type: 'image/jpeg' },
          ],
        },
        {
          id: 'item-2',
          content_text: 'Minimal text content',
          title: 'Item with tags',
          tags: ['tag1', '123', 'tag2'],
        },
      ],
    }

    expect(parseFeed(value)).toEqual(expected)
  })
})
