import { describe, expect, it } from 'bun:test'
import { parseDeletedEntry, parseLink, parsePerson, retrieveFeed } from './utils.js'

describe('parsePerson', () => {
  it('should parse complete person object', () => {
    const value = {
      name: 'John Doe',
      uri: 'https://example.com/john',
      email: 'jdoe@example.com',
    }
    const expected = {
      name: 'John Doe',
      uri: 'https://example.com/john',
      email: 'jdoe@example.com',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should parse person with only name', () => {
    const value = {
      name: 'John Doe',
    }
    const expected = {
      name: 'John Doe',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should handle text nodes', () => {
    const value = {
      name: { '#text': 'John Doe' },
      email: { '#text': 'jdoe@example.com' },
    }
    const expected = {
      name: 'John Doe',
      email: 'jdoe@example.com',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parsePerson(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parsePerson('not an object')).toBeUndefined()
    expect(parsePerson(undefined)).toBeUndefined()
    expect(parsePerson(null)).toBeUndefined()
    expect(parsePerson([])).toBeUndefined()
  })
})

describe('parseLink', () => {
  it('should parse complete link object', () => {
    const value = {
      '@href': 'https://example.com/entries/1',
      '@rel': 'alternate',
      '@type': 'text/html',
      '@hreflang': 'en',
      '@title': 'Removed entry',
      '@length': 1024,
    }
    const expected = {
      href: 'https://example.com/entries/1',
      rel: 'alternate',
      type: 'text/html',
      hreflang: 'en',
      title: 'Removed entry',
      length: 1024,
    }

    expect(parseLink(value)).toEqual(expected)
  })

  it('should parse link with only href', () => {
    const value = {
      '@href': 'https://example.com/entries/1',
    }
    const expected = {
      href: 'https://example.com/entries/1',
    }

    expect(parseLink(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@href': 'https://example.com/entries/1',
      '@length': '1024',
    }
    const expected = {
      href: 'https://example.com/entries/1',
      length: 1024,
    }

    expect(parseLink(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseLink(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseLink('not an object')).toBeUndefined()
    expect(parseLink(undefined)).toBeUndefined()
    expect(parseLink(null)).toBeUndefined()
    expect(parseLink([])).toBeUndefined()
  })
})

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
      comment: 'Removed due to copyright claim.',
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

  it('should handle HTML entities in comment', () => {
    const value = {
      '@ref': 'tag:example.org,2005:/entries/2',
      'at:comment': { '#text': 'Removed &amp; archived' },
    }
    const expected = {
      ref: 'tag:example.org,2005:/entries/2',
      comment: 'Removed & archived',
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
      comment: 'Removed',
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
          comment: 'Spam.',
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
