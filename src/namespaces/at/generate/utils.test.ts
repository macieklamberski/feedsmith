import { describe, expect, it } from 'bun:test'
import { generateDeletedEntry, generateFeed, generateLink, generatePerson } from './utils.js'

describe('generatePerson', () => {
  it('should generate person with all properties', () => {
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

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should generate person with only name', () => {
    const value = {
      name: 'John Doe',
    }
    const expected = {
      name: 'John Doe',
    }

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should handle undefined input', () => {
    expect(generatePerson(undefined)).toBeUndefined()
  })
})

describe('generateLink', () => {
  it('should generate link with all properties', () => {
    const value = {
      href: 'https://example.com/entries/1',
      rel: 'alternate',
      type: 'text/html',
      hreflang: 'en',
      title: 'Removed entry',
      length: 1024,
    }
    const expected = {
      '@href': 'https://example.com/entries/1',
      '@rel': 'alternate',
      '@type': 'text/html',
      '@hreflang': 'en',
      '@title': 'Removed entry',
      '@length': 1024,
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should generate link with only href', () => {
    const value = {
      href: 'https://example.com/entries/1',
    }
    const expected = {
      '@href': 'https://example.com/entries/1',
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should handle undefined input', () => {
    expect(generateLink(undefined)).toBeUndefined()
  })
})

describe('generateDeletedEntry', () => {
  it('should generate deleted-entry with all properties', () => {
    const value = {
      ref: 'tag:example.org,2005:/entries/2',
      when: new Date('2005-11-29T12:11:12Z'),
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
    const expected = {
      '@ref': 'tag:example.org,2005:/entries/2',
      '@when': '2005-11-29T12:11:12.000Z',
      'at:by': {
        name: 'John Doe',
        email: 'jdoe@example.com',
      },
      'at:comment': 'Removed due to copyright claim.',
      link: [
        {
          '@href': 'https://example.com/entries/2',
        },
      ],
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
          comment: 'Spam.',
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
          'at:comment': 'Spam.',
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
