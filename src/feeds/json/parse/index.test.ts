import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { DetectError, ParseError } from '../../../common/errors.js'
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
    const throwing = () => parse(value)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
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

  it('should skip null items and null authors', () => {
    const value = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'My Example Feed',
      authors: [null, { name: 'John Doe' }],
      items: [null, { id: '1', authors: [null] }],
    }
    const expected = {
      title: 'My Example Feed',
      authors: [{ name: 'John Doe' }],
      items: [{ id: '1' }],
    }

    expect(parse(value)).toEqual(expected)
  })

  it('should throw error for invalid input', () => {
    const throwing = () => parse('not a feed')

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle null input', () => {
    const throwing = () => parse(null)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle undefined input', () => {
    const throwing = () => parse(undefined)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle array input', () => {
    const throwing = () => parse([])

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle empty object input', () => {
    const throwing = () => parse({})

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle empty string input', () => {
    const throwing = () => parse('')

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle whitespace-only string input', () => {
    const throwing = () => parse('   \n  ')

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  it('should handle number input', () => {
    const throwing = () => parse(123)

    expect(throwing).toThrowError(locales.invalidFeedFormat)
  })

  describe('error types', () => {
    it('should throw DetectError for non-feed input', () => {
      const throwing = () => parse({})

      expect(throwing).toThrowError(DetectError)
      expect(throwing).toThrowError(locales.invalidFeedFormat)
    })

    it('should throw ParseError for detected but invalid feed', () => {
      const value = {
        version: 'https://jsonfeed.org/version/1',
      }
      const throwing = () => parse(value)

      expect(throwing).toThrowError(ParseError)
      expect(throwing).toThrowError(locales.invalidFeedFormat)
    })
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

  describe('parseDateFn', () => {
    it('should apply custom parseDateFn to item dates', () => {
      const value = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
        items: [
          {
            id: '1',
            date_published: '2023-01-01T00:00:00Z',
            date_modified: '2023-01-02T00:00:00Z',
          },
        ],
      }
      const expected = {
        title: 'Test',
        items: [
          {
            id: '1',
            date_published: new Date('2023-01-01T00:00:00Z'),
            date_modified: new Date('2023-01-02T00:00:00Z'),
          },
        ],
      }
      expect(parse(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
    })

    it('should propagate error when parseDateFn throws', () => {
      const value = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
        items: [
          {
            id: '1',
            date_published: 'invalid',
          },
        ],
      }
      const parseDateFn = () => {
        throw new Error('Parse failed')
      }
      const throwing = () => parse(value, { parseDateFn })

      expect(throwing).toThrowError('Parse failed')
    })
  })

  // Edge cases and quirks observed in feeds found in the wild.
  describe('real world feeds', () => {
    describe('character encoding', () => {
      it('should decode escaped unicode sequences in text fields (RW-E01)', () => {
        const value = `
          {
            "version": "https://jsonfeed.org/version/1.1",
            "title": "Caf\\u00e9 Culture \\ud83d\\ude80",
            "items": [{ "id": "1", "title": "First \\u2013 Second" }]
          }
        `
        const expected = {
          title: 'Café Culture 🚀',
          items: [{ id: '1', title: 'First – Second' }],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should preserve HTML entities in content_html (RW-C12)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [{ id: '1', content_html: '<p>Tom &amp; Jerry &lt;b&gt;bold&lt;/b&gt;</p>' }],
        }
        const expected = {
          title: 'Blog',
          items: [{ id: '1', content_html: '<p>Tom &amp; Jerry &lt;b&gt;bold&lt;/b&gt;</p>' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('author handling', () => {
      it('should handle v1 singular author object (RW-J01)', () => {
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

      it('should prefer v1.1 authors array over v1 author object (RW-J01)', () => {
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

      it('should handle author on item level (RW-J01)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              authors: [
                {
                  name: 'Alice',
                  url: 'https://alice.example.com',
                  avatar: 'https://alice.example.com/avatar.jpg',
                },
              ],
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              authors: [
                {
                  name: 'Alice',
                  url: 'https://alice.example.com',
                  avatar: 'https://alice.example.com/avatar.jpg',
                },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('content handling', () => {
      it('should parse content_html with raw HTML (RW-J06)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: '1',
              content_html: '<p>Hello <strong>world</strong></p>',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              content_html: '<p>Hello <strong>world</strong></p>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse both content_text and content_html (RW-J06)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello world',
              content_html: '<p>Hello world</p>',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello world',
              content_html: '<p>Hello world</p>',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle item with only content_text (RW-J06)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Plain text content',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Plain text content',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('item links', () => {
      it('should parse external_url alongside url (RW-Q07)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: '1',
              url: 'https://example.com/post',
              external_url: 'https://example.org/source',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              url: 'https://example.com/post',
              external_url: 'https://example.org/source',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('attachments', () => {
      it('should parse attachments with all fields (RW-M08)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Podcast',
          items: [
            {
              id: '1',
              content_text: 'Episode notes',
              attachments: [
                {
                  url: 'https://example.com/episode.mp3',
                  mime_type: 'audio/mpeg',
                  title: 'Episode 1',
                  size_in_bytes: 12345678,
                  duration_in_seconds: 3600,
                },
              ],
            },
          ],
        }
        const expected = {
          title: 'Podcast',
          items: [
            {
              id: '1',
              content_text: 'Episode notes',
              attachments: [
                {
                  url: 'https://example.com/episode.mp3',
                  mime_type: 'audio/mpeg',
                  title: 'Episode 1',
                  size_in_bytes: 12345678,
                  duration_in_seconds: 3600,
                },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse multiple attachments (RW-M08)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Podcast',
          items: [
            {
              id: '1',
              content_text: 'Episode',
              attachments: [
                { url: 'https://example.com/ep.mp3', mime_type: 'audio/mpeg' },
                { url: 'https://example.com/ep.ogg', mime_type: 'audio/ogg' },
              ],
            },
          ],
        }
        const expected = {
          title: 'Podcast',
          items: [
            {
              id: '1',
              content_text: 'Episode',
              attachments: [
                { url: 'https://example.com/ep.mp3', mime_type: 'audio/mpeg' },
                { url: 'https://example.com/ep.ogg', mime_type: 'audio/ogg' },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('tags', () => {
      it('should parse tags as array of strings (RW-J07)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              tags: ['javascript', 'typescript', 'nodejs'],
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              tags: ['javascript', 'typescript', 'nodejs'],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('missing and empty elements', () => {
      it('should ignore unknown custom fields (RW-N13)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          custom_extension: { foo: 'bar' },
          items: [
            {
              id: '1',
              content_text: 'Hello',
              _custom: 'value',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle null values in fields (RW-N04)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          description: null,
          items: [
            {
              id: '1',
              content_text: 'Hello',
              title: null,
              summary: null,
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle empty string values (RW-N05)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          description: '',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              title: '',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle item with numeric id (RW-J03)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: 42,
              content_text: 'Hello',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '42',
              content_text: 'Hello',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('feed metadata', () => {
      it('should parse feed with all metadata fields (RW-Q08)', () => {
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

      it('should parse hubs for WebSub support (RW-Q08)', () => {
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
      it('should drop boolean id (not coerced to string) (RW-J05)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: true,
              content_text: 'Hello',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              content_text: 'Hello',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle numeric zero as id (RW-J04)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: 0,
              content_text: 'Hello',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '0',
              content_text: 'Hello',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle expired as true (RW-J09)', () => {
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
      it('should handle uppercase property names (RW-J08)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          Title: 'Blog',
          DESCRIPTION: 'A test blog',
          items: [
            {
              ID: '1',
              Content_Text: 'Hello',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          description: 'A test blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle mixed case in nested objects (RW-J08)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          Authors: [{ Name: 'Alice', URL: 'https://alice.example.com' }],
          items: [{ id: '1', content_text: 'Hello' }],
        }
        const expected = {
          title: 'Blog',
          authors: [{ name: 'Alice', url: 'https://alice.example.com' }],
          items: [{ id: '1', content_text: 'Hello' }],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('unusual but valid structures', () => {
      it('should handle author as plain string (non-spec but common) (RW-J02)', () => {
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

      it('should handle empty items array (RW-N09)', () => {
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

      it('should handle items with only empty objects (RW-N10)', () => {
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

      it('should handle attachment with no mime_type (RW-A10)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Podcast',
          items: [
            {
              id: '1',
              content_text: 'Episode',
              attachments: [{ url: 'https://example.com/file.mp3' }],
            },
          ],
        }
        const expected = {
          title: 'Podcast',
          items: [
            {
              id: '1',
              content_text: 'Episode',
              attachments: [{ url: 'https://example.com/file.mp3' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle item with date_published and date_modified (RW-T04)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              date_published: '2024-01-15T12:00:00Z',
              date_modified: '2024-01-16T14:30:00+02:00',
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              date_published: '2024-01-15T12:00:00Z',
              date_modified: '2024-01-16T14:30:00+02:00',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle whitespace-only title (RW-N11)', () => {
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

      it('should handle tags with empty strings filtered out (RW-J07)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              tags: ['javascript', '', 'typescript', '   '],
            },
          ],
        }
        const expected = {
          title: 'Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              tags: ['javascript', 'typescript'],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle authors as plain object instead of array (RW-J10)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Test Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              authors: { name: 'John Doe' },
            },
          ],
        }
        const expected = {
          title: 'Test Blog',
          items: [
            {
              id: '1',
              content_text: 'Hello',
              authors: [{ name: 'John Doe' }],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should handle items as single object instead of array', () => {
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
          items: [
            {
              id: '1',
              content_text: 'Solo post',
              url: 'https://example.com/post/1',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should drop author with all empty string fields (RW-N25)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Test',
          items: [
            {
              id: '1',
              content_text: 'Post',
              authors: [{ name: '', url: '', avatar: '' }],
            },
          ],
        }
        const expected = {
          title: 'Test',
          items: [
            {
              id: '1',
              content_text: 'Post',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should parse summary as separate field without content (RW-J12)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Test',
          items: [
            {
              id: '1',
              summary: 'This is a summary',
            },
          ],
        }
        const expected = {
          title: 'Test',
          items: [
            {
              id: '1',
              summary: 'This is a summary',
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })

      it('should coerce string size_in_bytes and duration_in_seconds to numbers (RW-J13)', () => {
        const value = {
          version: 'https://jsonfeed.org/version/1.1',
          title: 'Test',
          items: [
            {
              id: '1',
              content_text: 'Episode',
              attachments: [
                {
                  url: 'https://example.com/episode.mp3',
                  mime_type: 'audio/mpeg',
                  size_in_bytes: '12345678',
                  duration_in_seconds: '3661',
                },
              ],
            },
          ],
        }
        const expected = {
          title: 'Test',
          items: [
            {
              id: '1',
              content_text: 'Episode',
              attachments: [
                {
                  url: 'https://example.com/episode.mp3',
                  mime_type: 'audio/mpeg',
                  size_in_bytes: 12345678,
                  duration_in_seconds: 3661,
                },
              ],
            },
          ],
        }

        expect(parse(value)).toEqual(expected)
      })
    })

    describe('malformed input', () => {
      it('should throw rather than return partial results for truncated JSON (RW-J11)', () => {
        const value = '{"version":"https://jsonfeed.org/version/1.1","title":"Blog","items":[{"id"'
        const throwing = () => parse(value)

        expect(throwing).toThrowError(DetectError)
      })
    })
  })
})
