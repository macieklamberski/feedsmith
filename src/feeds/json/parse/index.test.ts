import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { parse } from './index.js'

describe('parse', () => {
  it('should parse valid JSON Feed v1', () => {
    const value = {
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
    const expected = {
      title: 'My Example Feed',
      home_page_url: 'https://example.com/',
      feed_url: 'https://example.com/feed.json',
      authors: [
        {
          name: 'John Doe',
          url: 'https://example.com/johndoe',
        },
      ],
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

    expect(parse(value)).toEqual(expected)
  })

  it('should parse valid JSON Feed v1.1', () => {
    const value = {
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
    const expected = {
      title: 'My Example Feed',
      home_page_url: 'https://example.com/',
      feed_url: 'https://example.com/feed.json',
      language: 'en-US',
      authors: [
        {
          name: 'John Doe',
          url: 'https://example.com/johndoe',
        },
      ],
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

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON Feed from string', () => {
    const value = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
        },
      ],
    })
    const expected = {
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON Feed from string with leading whitespace', () => {
    const json = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    })
    const value = `  ${json}`
    const expected = {
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON Feed from string with trailing whitespace', () => {
    const json = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    })
    const value = `${json}  `
    const expected = {
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should parse JSON Feed from string with whitespace on both ends', () => {
    const json = JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    })
    const value = `  ${json}  `
    const expected = {
      title: 'Feed with whitespace',
      items: [{ id: '1', content_text: 'Test' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle malformed JSON string', () => {
    const value = '{"version":"https://jsonfeed.org/version/1.1","title":"Malformed'

    expect(() => parse(value)).toThrowError(locales.invalidFeedFormat)
  })

  it('should parse feed with invalid URLs', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      home_page_url: 'invalid-url',
      items: [{ id: '1', content_html: '<p>Hello world</p>' }],
    }
    const expected = {
      title: 'My Example Feed',
      home_page_url: 'invalid-url',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle missing optional fields', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1',
      title: 'My Example Feed',
      items: [{ id: '1', content_html: '<p>Hello world</p>' }],
    }
    const expected = {
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should handle case insensitive fields', () => {
    const value = {
      vErsIOn: 'https://jsonfeed.org/version/1',
      TITLE: 'My Example Feed',
      items: [{ id: '1', content_HTML: '<p>Hello world</p>' }],
    }
    const expected = {
      title: 'My Example Feed',
      items: [
        {
          id: '1',
          content_html: '<p>Hello world</p>',
        },
      ],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should throw error for invalid input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle null input', () => {
    expect(() => parse(null)).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle undefined input', () => {
    expect(() => parse(undefined)).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle array input', () => {
    expect(() => parse([])).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle empty object input', () => {
    expect(() => parse({})).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle string input', () => {
    expect(() => parse('not a feed')).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle number input', () => {
    expect(() => parse(123)).toThrowError(locales.invalidFeedFormat)
  })

  describe('with maxItems option', () => {
    const commonValue = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Test Feed',
      items: [
        {
          id: '1',
          content_text: 'Item 1',
        },
        {
          id: '2',
          content_text: 'Item 2',
        },
        {
          id: '3',
          content_text: 'Item 3',
        },
      ],
    }

    it('should limit items to specified number', () => {
      const expected = {
        title: 'Test Feed',
        items: [
          {
            id: '1',
            content_text: 'Item 1',
          },
          {
            id: '2',
            content_text: 'Item 2',
          },
        ],
      }

      expect(parse(commonValue, { maxItems: 2 })).toEqual(expected)
    })

    it('should skip all items when maxItems is 0', () => {
      const expected = {
        title: 'Test Feed',
      }

      expect(parse(commonValue, { maxItems: 0 })).toEqual(expected)
    })

    it('should return all items when maxItems is undefined', () => {
      const expected = {
        title: 'Test Feed',
        items: [
          {
            id: '1',
            content_text: 'Item 1',
          },
          {
            id: '2',
            content_text: 'Item 2',
          },
          {
            id: '3',
            content_text: 'Item 3',
          },
        ],
      }

      expect(parse(commonValue, { maxItems: undefined })).toEqual(expected)
    })
  })

  // Catalogue: plans/real_world_test_suite.md
  describe('real world feeds', () => {
    describe('author handling', () => {
      it('RW-J01: should handle v1 singular author object', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1',
          title: 'Blog',
          author: { name: 'John Doe', url: 'https://example.com' },
          items: [{ id: '1', content_text: 'Hello' }],
        }
        const expected = {
          title: 'Blog',
          authors: [{ name: 'John Doe', url: 'https://example.com' }],
          items: [{ id: '1', content_text: 'Hello' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J01: should prefer v1.1 authors array over v1 author object', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          authors: [{ name: 'Alice' }, { name: 'Bob' }],
          author: { name: 'Ignored' },
          items: [{ id: '1', content_text: 'Hello' }],
        }
        const expected = {
          title: 'Blog',
          authors: [{ name: 'Alice' }, { name: 'Bob' }],
          items: [{ id: '1', content_text: 'Hello' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J01: should handle author on item level', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
            authors: [{
              name: 'Alice',
              url: 'https://alice.example.com',
              avatar: 'https://alice.example.com/avatar.jpg',
            }],
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
            authors: [{
              name: 'Alice',
              url: 'https://alice.example.com',
              avatar: 'https://alice.example.com/avatar.jpg',
            }],
          }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('content handling', () => {
      it('RW-J06: should parse content_html with raw HTML', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{
            id: '1',
            content_html: '<p>Hello <strong>world</strong></p>',
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_html: '<p>Hello <strong>world</strong></p>',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J06: should parse both content_text and content_html', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello world',
            content_html: '<p>Hello world</p>',
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello world',
            content_html: '<p>Hello world</p>',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J06: should handle item with only content_text', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Plain text content',
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Plain text content',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('attachments', () => {
      it('RW-M08: should parse attachments with all fields', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Podcast',
          items: [{
            id: '1',
            content_text: 'Episode notes',
            attachments: [{
              url: 'https://example.com/episode.mp3',
              mime_type: 'audio/mpeg',
              title: 'Episode 1',
              size_in_bytes: 12345678,
              duration_in_seconds: 3600,
            }],
          }],
        }
        const expected = {
          title: 'Podcast',
          items: [{
            id: '1',
            content_text: 'Episode notes',
            attachments: [{
              url: 'https://example.com/episode.mp3',
              mime_type: 'audio/mpeg',
              title: 'Episode 1',
              size_in_bytes: 12345678,
              duration_in_seconds: 3600,
            }],
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-M08: should parse multiple attachments', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Podcast',
          items: [{
            id: '1',
            content_text: 'Episode',
            attachments: [
              { url: 'https://example.com/ep.mp3', mime_type: 'audio/mpeg' },
              { url: 'https://example.com/ep.ogg', mime_type: 'audio/ogg' },
            ],
          }],
        }
        const expected = {
          title: 'Podcast',
          items: [{
            id: '1',
            content_text: 'Episode',
            attachments: [
              { url: 'https://example.com/ep.mp3', mime_type: 'audio/mpeg' },
              { url: 'https://example.com/ep.ogg', mime_type: 'audio/ogg' },
            ],
          }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('tags', () => {
      it('RW-J07: should parse tags as array of strings', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
            tags: ['javascript', 'typescript', 'nodejs'],
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
            tags: ['javascript', 'typescript', 'nodejs'],
          }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('missing and empty elements', () => {
      it('RW-N13: should ignore unknown custom fields', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          custom_extension: { foo: 'bar' },
          items: [{
            id: '1',
            content_text: 'Hello',
            _custom: 'value',
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N04: should handle null values in fields', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          description: null,
          items: [{
            id: '1',
            content_text: 'Hello',
            title: null,
            summary: null,
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N05: should handle empty string values', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          description: '',
          items: [{
            id: '1',
            content_text: 'Hello',
            title: '',
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J03: should handle item with numeric id', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{
            id: 42,
            content_text: 'Hello',
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '42',
            content_text: 'Hello',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('feed metadata', () => {
      it('RW-Q08: should parse feed with all metadata fields', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'My Blog',
          home_page_url: 'https://example.com',
          feed_url: 'https://example.com/feed.json',
          description: 'A blog about stuff',
          icon: 'https://example.com/icon.png',
          favicon: 'https://example.com/favicon.ico',
          language: 'en-US',
          expired: false,
          items: [{ id: '1', content_text: 'Hello' }],
        }
        const expected = {
          title: 'My Blog',
          home_page_url: 'https://example.com',
          feed_url: 'https://example.com/feed.json',
          description: 'A blog about stuff',
          icon: 'https://example.com/icon.png',
          favicon: 'https://example.com/favicon.ico',
          language: 'en-US',
          expired: false,
          items: [{ id: '1', content_text: 'Hello' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-Q08: should parse hubs for WebSub support', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          hubs: [{ type: 'WebSub', url: 'https://hub.example.com' }],
          items: [{ id: '1', content_text: 'Hello' }],
        }
        const expected = {
          title: 'Blog',
          hubs: [{ type: 'WebSub', url: 'https://hub.example.com' }],
          items: [{ id: '1', content_text: 'Hello' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('type coercion edge cases', () => {
      it('RW-J05: should drop boolean id (not coerced to string)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{
            id: true,
            content_text: 'Hello',
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            content_text: 'Hello',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J04: should handle numeric zero as id', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{
            id: 0,
            content_text: 'Hello',
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '0',
            content_text: 'Hello',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J09: should handle expired as true', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Archived Blog',
          expired: true,
          items: [{ id: '1', content_text: 'Old post' }],
        }
        const expected = {
          title: 'Archived Blog',
          expired: true,
          items: [{ id: '1', content_text: 'Old post' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('case insensitivity', () => {
      it('RW-J08: should handle uppercase property names', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          Title: 'Blog',
          DESCRIPTION: 'A test blog',
          items: [{
            ID: '1',
            Content_Text: 'Hello',
          }],
        }
        const expected = {
          title: 'Blog',
          description: 'A test blog',
          items: [{
            id: '1',
            content_text: 'Hello',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J08: should handle mixed case in nested objects', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          Authors: [{ Name: 'Alice', URL: 'https://alice.com' }],
          items: [{ id: '1', content_text: 'Hello' }],
        }
        const expected = {
          title: 'Blog',
          authors: [{ name: 'Alice', url: 'https://alice.com' }],
          items: [{ id: '1', content_text: 'Hello' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('unusual but valid structures', () => {
      it('RW-J02: should handle author as plain string (non-spec but common)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1',
          title: 'Blog',
          author: 'John Doe',
          items: [{ id: '1', content_text: 'Hello' }],
        }
        const expected = {
          title: 'Blog',
          authors: [{ name: 'John Doe' }],
          items: [{ id: '1', content_text: 'Hello' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N09: should handle empty items array', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Empty Blog',
          items: [],
        }
        const expected = {
          title: 'Empty Blog',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N10: should handle items with only empty objects', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{}],
        }
        const expected = {
          title: 'Blog',
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-A10: should handle attachment with no mime_type', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Podcast',
          items: [{
            id: '1',
            content_text: 'Episode',
            attachments: [{ url: 'https://example.com/file.mp3' }],
          }],
        }
        const expected = {
          title: 'Podcast',
          items: [{
            id: '1',
            content_text: 'Episode',
            attachments: [{ url: 'https://example.com/file.mp3' }],
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-T04: should handle item with date_published and date_modified', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
            date_published: '2024-01-15T12:00:00Z',
            date_modified: '2024-01-16T14:30:00+02:00',
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
            date_published: '2024-01-15T12:00:00Z',
            date_modified: '2024-01-16T14:30:00+02:00',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N11: should handle whitespace-only title', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: '   ',
          items: [{ id: '1', content_text: 'Hello' }],
        }
        const expected = {
          items: [{ id: '1', content_text: 'Hello' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J07: should handle tags with empty strings filtered out', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
            tags: ['javascript', '', 'typescript', '   '],
          }],
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
            tags: ['javascript', 'typescript'],
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J10: should handle authors as plain object instead of array', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Test Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
            authors: { name: 'John Doe' },
          }],
        }
        const expected = {
          title: 'Test Blog',
          items: [{
            id: '1',
            content_text: 'Hello',
            authors: [{ name: 'John Doe' }],
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J11: should handle items as single object instead of array', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: {
            id: '1',
            content_text: 'Solo post',
            url: 'https://example.com/post/1',
          },
        }
        const expected = {
          title: 'Blog',
          items: [{
            id: '1',
            content_text: 'Solo post',
            url: 'https://example.com/post/1',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-N25: should drop author with all empty string fields', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Test',
          items: [{
            id: '1',
            content_text: 'Post',
            authors: [{ name: '', url: '', avatar: '' }],
          }],
        }
        const expected = {
          title: 'Test',
          items: [{
            id: '1',
            content_text: 'Post',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J12: should parse summary as separate field without content', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Test',
          items: [{
            id: '1',
            summary: 'This is a summary',
          }],
        }
        const expected = {
          title: 'Test',
          items: [{
            id: '1',
            summary: 'This is a summary',
          }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('RW-J13: should coerce string size_in_bytes and duration_in_seconds to numbers', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Test',
          items: [{
            id: '1',
            content_text: 'Episode',
            attachments: [{
              url: 'https://example.com/episode.mp3',
              mime_type: 'audio/mpeg',
              size_in_bytes: '12345678',
              duration_in_seconds: '3661',
            }],
          }],
        }
        const expected = {
          title: 'Test',
          items: [{
            id: '1',
            content_text: 'Episode',
            attachments: [{
              url: 'https://example.com/episode.mp3',
              mime_type: 'audio/mpeg',
              size_in_bytes: 12345678,
              duration_in_seconds: 3661,
            }],
          }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })
  })
})
