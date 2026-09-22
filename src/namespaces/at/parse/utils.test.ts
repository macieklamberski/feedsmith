import { describe, expect, it } from 'bun:test'
import { parseDeletedEntry, retrieveFeed } from './utils.js'

describe('parseDeletedEntry', () => {
  it('should parse complete deleted-entry with all properties', () => {
    const value = {
      '@ref': 'tag:example.org,2005:/entries/2',
      '@when': '2005-11-29T12:11:12Z',
      'at:by': {
        name: 'John Doe',
        email: 'jdoe@example.com',
      },
      'at:comment': 'Removed due to copyright claim.',
      link: {
        '@href': 'https://example.com/entries/2',
      },
    }
    const expected = {
      ref: 'tag:example.org,2005:/entries/2',
      when: '2005-11-29T12:11:12Z',
      by: {
        name: 'John Doe',
        email: 'jdoe@example.com',
      },
      comment: {
        value: 'Removed due to copyright claim.',
      },
      links: [
        {
          href: 'https://example.com/entries/2',
        },
      ],
    }

    expect(parseDeletedEntry(value)).toEqual(expected)
  })

  it('should parse deleted-entry with only ref and when', () => {
    const value = {
      '@ref': 'tag:example.org,2005:/entries/2',
      '@when': '2005-11-29T12:11:12Z',
    }
    const expected = {
      ref: 'tag:example.org,2005:/entries/2',
      when: '2005-11-29T12:11:12Z',
    }

    expect(parseDeletedEntry(value)).toEqual(expected)
  })

  it('should parse multiple links', () => {
    const value = {
      '@ref': 'tag:example.org,2005:/entries/2',
      link: [
        { '@href': 'https://example.com/entries/2' },
        { '@href': 'https://example.com/entries/2/mirror', '@rel': 'alternate' },
      ],
    }
    const expected = {
      ref: 'tag:example.org,2005:/entries/2',
      links: [
        { href: 'https://example.com/entries/2' },
        { href: 'https://example.com/entries/2/mirror', rel: 'alternate' },
      ],
    }

    expect(parseDeletedEntry(value)).toEqual(expected)
  })

  it('should parse source', () => {
    const value = {
      '@ref': 'tag:example.org,2005:/entries/2',
      '@when': '2005-11-29T12:11:12Z',
      source: {
        id: 'tag:example.org,2005:/feed',
        title: 'Example Feed',
        updated: '2005-11-29T12:00:00Z',
        link: {
          '@href': 'https://example.org/feed',
          '@rel': 'self',
        },
      },
    }
    const expected = {
      ref: 'tag:example.org,2005:/entries/2',
      when: '2005-11-29T12:11:12Z',
      source: {
        id: 'tag:example.org,2005:/feed',
        title: { value: 'Example Feed' },
        updated: '2005-11-29T12:00:00Z',
        links: [
          {
            href: 'https://example.org/feed',
            rel: 'self',
          },
        ],
      },
    }

    expect(parseDeletedEntry(value)).toEqual(expected)
  })

  it('should parse comment with type', () => {
    const value = {
      '@ref': 'tag:example.org,2005:/entries/2',
      'at:comment': {
        '#text': 'Removed &lt;b&gt;spam&lt;/b&gt;',
        '@type': 'html',
      },
    }
    const expected = {
      ref: 'tag:example.org,2005:/entries/2',
      comment: {
        value: 'Removed <b>spam</b>',
        type: 'html',
      },
    }

    expect(parseDeletedEntry(value)).toEqual(expected)
  })

  it('should handle HTML entities in comment', () => {
    const value = {
      '@ref': 'tag:example.org,2005:/entries/2',
      'at:comment': { '#text': 'Removed &amp; archived' },
    }
    const expected = {
      ref: 'tag:example.org,2005:/entries/2',
      comment: {
        value: 'Removed & archived',
      },
    }

    expect(parseDeletedEntry(value)).toEqual(expected)
  })

  it('should handle CDATA sections in comment', () => {
    const value = {
      '@ref': 'tag:example.org,2005:/entries/2',
      'at:comment': { '#text': '<![CDATA[Removed]]>' },
    }
    const expected = {
      ref: 'tag:example.org,2005:/entries/2',
      comment: {
        value: 'Removed',
      },
    }

    expect(parseDeletedEntry(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseDeletedEntry(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseDeletedEntry('not an object')).toBeUndefined()
    expect(parseDeletedEntry(undefined)).toBeUndefined()
    expect(parseDeletedEntry(null)).toBeUndefined()
    expect(parseDeletedEntry([])).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse feed with a single deleted-entry', () => {
    const value = {
      'at:deleted-entry': {
        '@ref': 'tag:example.org,2005:/entries/2',
        '@when': '2005-11-29T12:11:12Z',
      },
    }
    const expected = {
      deletedEntries: [
        {
          ref: 'tag:example.org,2005:/entries/2',
          when: '2005-11-29T12:11:12Z',
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with multiple deleted-entries', () => {
    const value = {
      'at:deleted-entry': [
        {
          '@ref': 'tag:example.org,2005:/entries/2',
          '@when': '2005-11-29T12:11:12Z',
        },
        {
          '@ref': 'tag:example.org,2005:/entries/3',
          'at:comment': 'Spam.',
        },
      ],
    }
    const expected = {
      deletedEntries: [
        {
          ref: 'tag:example.org,2005:/entries/2',
          when: '2005-11-29T12:11:12Z',
        },
        {
          ref: 'tag:example.org,2005:/entries/3',
          comment: {
            value: 'Spam.',
          },
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(retrieveFeed('not an object')).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })
})
