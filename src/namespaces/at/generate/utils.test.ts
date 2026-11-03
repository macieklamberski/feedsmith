import { describe, expect, it } from 'bun:test'
import { generateDeletedEntry, generateFeed } from './utils.js'

describe('generateDeletedEntry', () => {
  it('should generate deleted-entry with all properties', () => {
    const value = {
      ref: 'tag:example.org,2005:/entries/2',
      when: new Date('2005-11-29T12:11:12Z'),
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
    const expected = {
      '@ref': 'tag:example.org,2005:/entries/2',
      '@when': '2005-11-29T12:11:12.000Z',
      'at:by': {
        name: 'John Doe',
        email: 'jdoe@example.com',
      },
      'at:comment': {
        '#text': 'Removed due to copyright claim.',
      },
      link: [
        {
          '@href': 'https://example.com/entries/2',
        },
      ],
    }

    expect(generateDeletedEntry(value)).toEqual(expected)
  })

  it('should generate source', () => {
    const value = {
      ref: 'tag:example.org,2005:/entries/2',
      when: new Date('2005-11-29T12:11:12Z'),
      source: {
        id: 'tag:example.org,2005:/feed',
        title: { value: 'Example Feed' },
        updated: new Date('2005-11-29T12:00:00Z'),
        links: [
          {
            href: 'https://example.org/feed',
            rel: 'self',
          },
        ],
      },
    }
    const expected = {
      '@ref': 'tag:example.org,2005:/entries/2',
      '@when': '2005-11-29T12:11:12.000Z',
      source: {
        id: 'tag:example.org,2005:/feed',
        link: [
          {
            '@href': 'https://example.org/feed',
            '@rel': 'self',
          },
        ],
        title: {
          '#text': 'Example Feed',
        },
        updated: '2005-11-29T12:00:00.000Z',
      },
    }

    expect(generateDeletedEntry(value)).toEqual(expected)
  })

  it('should generate comment with type', () => {
    const value = {
      ref: 'tag:example.org,2005:/entries/2',
      comment: {
        value: 'Removed <b>spam</b>',
        type: 'html',
      },
    }
    const expected = {
      '@ref': 'tag:example.org,2005:/entries/2',
      'at:comment': {
        '#cdata': 'Removed <b>spam</b>',
        '@type': 'html',
      },
    }

    expect(generateDeletedEntry(value)).toEqual(expected)
  })

  it('should generate deleted-entry with only ref and when', () => {
    const value = {
      ref: 'tag:example.org,2005:/entries/2',
      when: new Date('2005-11-29T12:11:12Z'),
    }
    const expected = {
      '@ref': 'tag:example.org,2005:/entries/2',
      '@when': '2005-11-29T12:11:12.000Z',
    }

    expect(generateDeletedEntry(value)).toEqual(expected)
  })

  it('should handle undefined input', () => {
    expect(generateDeletedEntry(undefined)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with deleted-entries', () => {
    const value = {
      deletedEntries: [
        {
          ref: 'tag:example.org,2005:/entries/2',
          when: new Date('2005-11-29T12:11:12Z'),
        },
        {
          ref: 'tag:example.org,2005:/entries/3',
          comment: {
            value: 'Spam.',
          },
        },
      ],
    }
    const expected = {
      'at:deleted-entry': [
        {
          '@ref': 'tag:example.org,2005:/entries/2',
          '@when': '2005-11-29T12:11:12.000Z',
        },
        {
          '@ref': 'tag:example.org,2005:/entries/3',
          'at:comment': {
            '#text': 'Spam.',
          },
        },
      ],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should filter out invalid deleted-entries', () => {
    const value = {
      deletedEntries: [
        {
          ref: 'tag:example.org,2005:/entries/2',
        },
        {},
      ],
    }
    const expected = {
      'at:deleted-entry': [
        {
          '@ref': 'tag:example.org,2005:/entries/2',
        },
      ],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle undefined input', () => {
    expect(generateFeed(undefined)).toBeUndefined()
  })
})
