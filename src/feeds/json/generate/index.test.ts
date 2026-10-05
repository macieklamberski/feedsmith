import { describe, expect, it } from 'bun:test'
import { locales } from '../../../common/config.js'
import { GenerateError } from '../../../common/errors.js'
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

  it.todo('should correctly generate JSON Feed reference fixtures', () => {
    // Add references/*.json fixture pairs (like the Atom and RSS reference suites) and compare
    // the generate output against them wholesale.
  })

  describe('strict mode', () => {
    it('should require title and items in strict mode', () => {
      const value = { title: 'Test' }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
      }

      // @ts-expect-error: This is for testing purposes.
      expect(generate(value, { strict: true })).toEqual(expected)
    })

    it('should accept feed with all required fields in strict mode', () => {
      const value = { title: 'Test', items: [] }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
      }

      expect(generate(value, { strict: true })).toEqual(expected)
    })

    it('should require item id in strict mode', () => {
      const value = { title: 'Test', items: [{ content_text: 'Hello' }] }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
        items: [{ content_text: 'Hello' }],
      }

      // @ts-expect-error: This is for testing purposes.
      expect(generate(value, { strict: true })).toEqual(expected)
    })

    it('should accept items with content_html in strict mode', () => {
      const value = { title: 'Test', items: [{ id: '1', content_html: '<p>Hello</p>' }] }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
        items: [{ id: '1', content_html: '<p>Hello</p>' }],
      }

      expect(generate(value, { strict: true })).toEqual(expected)
    })

    it('should accept items with content_text in strict mode', () => {
      const value = { title: 'Test', items: [{ id: '1', content_text: 'Hello' }] }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
        items: [{ id: '1', content_text: 'Hello' }],
      }

      expect(generate(value, { strict: true })).toEqual(expected)
    })

    it('should accept items with both content fields in strict mode', () => {
      const value = {
        title: 'Test',
        items: [{ id: '1', content_html: '<p>Hello</p>', content_text: 'Hello' }],
      }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
        items: [{ id: '1', content_html: '<p>Hello</p>', content_text: 'Hello' }],
      }

      expect(generate(value, { strict: true })).toEqual(expected)
    })

    it('should require nested type fields in strict mode', () => {
      const value = {
        title: 'Test',
        items: [
          {
            id: '1',
            content_html: '<p>Hello</p>',
            attachments: [{ url: 'https://example.com/file.mp3' }],
          },
        ],
      }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
        items: [
          {
            id: '1',
            content_html: '<p>Hello</p>',
            attachments: [{ url: 'https://example.com/file.mp3' }],
          },
        ],
      }

      // @ts-expect-error: This is for testing purposes.
      expect(generate(value, { strict: true })).toEqual(expected)
    })

    it('should accept nested types with all required fields in strict mode', () => {
      const value = {
        title: 'Test',
        items: [
          {
            id: '1',
            content_html: '<p>Hello</p>',
            attachments: [{ url: 'https://example.com/file.mp3', mime_type: 'audio/mpeg' }],
          },
        ],
        hubs: [{ type: 'websub', url: 'https://example.com/hub' }],
      }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
        items: [
          {
            id: '1',
            content_html: '<p>Hello</p>',
            attachments: [{ url: 'https://example.com/file.mp3', mime_type: 'audio/mpeg' }],
          },
        ],
        hubs: [{ type: 'websub', url: 'https://example.com/hub' }],
      }

      expect(generate(value, { strict: true })).toEqual(expected)
    })

    it('should accept partial feed in lenient mode', () => {
      const value = { title: 'Test' }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test',
      }

      expect(generate(value)).toEqual(expected)
    })

    it.todo('should produce identical output in strict and lenient modes', () => {
      // The strict option only changes compile-time types. Assert that
      // generate(value, { strict: true }) and generate(value) return identical objects for a
      // corpus of valid feeds.
    })
  })

  describe('error types', () => {
    it('should throw GenerateError for invalid input', () => {
      const throwing = () => generate({})

      expect(throwing).toThrowError(GenerateError)
      expect(throwing).toThrowError(locales.invalidInputJson)
    })
  })

  describe('edge cases', () => {
    it('should accept partial feeds', () => {
      const value = {
        title: 'Test Feed',
      }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test Feed',
      }

      expect(generate(value)).toEqual(expected)
    })

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

    it('should omit invalid Date objects from items', () => {
      const value = {
        title: 'Test Feed',
        items: [
          {
            id: '1',
            title: 'Test Item',
            date_published: new Date('invalid-date'),
          },
        ],
      }
      const expected = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Test Feed',
        items: [
          {
            id: '1',
            title: 'Test Item',
          },
        ],
      }

      expect(generate(value)).toEqual(expected)
    })
  })
})
