import { describe, expect, it } from 'bun:test'
import { generateAtomEntry, generateAtomFeed, generateRssFeed, generateRssItem } from './utils.js'

describe('generateRssFeed', () => {
  it('should generate valid feed object with all properties', () => {
    const value = {
      journal: 'example_community',
      journalId: '67890',
      journalType: 'community',
    }
    const expected = {
      'lj:journal': 'example_community',
      'lj:journalid': '67890',
      'lj:journaltype': 'community',
    }

    expect(generateRssFeed(value)).toEqual(expected)
  })

  it('should generate feed with minimal properties', () => {
    const value = {
      journal: 'example_user',
    }
    const expected = {
      'lj:journal': 'example_user',
    }

    expect(generateRssFeed(value)).toEqual(expected)
  })

  it('should handle object with only undefined properties', () => {
    const value = {
      journal: undefined,
      journalId: undefined,
      journalType: undefined,
    }

    expect(generateRssFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateRssFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateRssFeed(undefined)).toBeUndefined()
  })
})

describe('generateRssItem', () => {
  it('should generate valid item object with all properties', () => {
    const value = {
      music: 'The Beatles - Hey Jude',
      mood: 'cheerful',
      security: 'public',
      poster: 'johndoe',
      posterId: '12345',
      posterUrl: 'https://johndoe.example.com',
      posterUserpic: 'https://userpic.example.com/12345',
      replyCount: 42,
    }
    const expected = {
      'lj:music': 'The Beatles - Hey Jude',
      'lj:mood': 'cheerful',
      'lj:security': 'public',
      'lj:poster': 'johndoe',
      'lj:posterid': '12345',
      'lj:posterurl': 'https://johndoe.example.com',
      'lj:posteruserpic': 'https://userpic.example.com/12345',
      'lj:replycount': 42,
    }

    expect(generateRssItem(value)).toEqual(expected)
  })

  it('should generate item with minimal properties', () => {
    const value = {
      mood: 'sleepy',
    }
    const expected = {
      'lj:mood': 'sleepy',
    }

    expect(generateRssItem(value)).toEqual(expected)
  })

  it('should generate reply count of zero', () => {
    const value = {
      replyCount: 0,
    }
    const expected = {
      'lj:replycount': 0,
    }

    expect(generateRssItem(value)).toEqual(expected)
  })

  it('should handle object with only undefined properties', () => {
    const value = {
      music: undefined,
      mood: undefined,
      security: undefined,
      poster: undefined,
      posterId: undefined,
      posterUrl: undefined,
      posterUserpic: undefined,
      replyCount: undefined,
    }

    expect(generateRssItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateRssItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateRssItem(undefined)).toBeUndefined()
  })
})

describe('generateAtomFeed', () => {
  it('should generate journal attributes with all properties', () => {
    const value = {
      journal: 'example_community',
      journalId: '67890',
      journalType: 'community',
    }
    const expected = {
      'lj:journal': {
        '@userid': '67890',
        '@username': 'example_community',
        '@type': 'community',
      },
    }

    expect(generateAtomFeed(value)).toEqual(expected)
  })

  it('should generate journal attributes with minimal properties', () => {
    const value = {
      journal: 'example_user',
    }
    const expected = {
      'lj:journal': {
        '@username': 'example_user',
      },
    }

    expect(generateAtomFeed(value)).toEqual(expected)
  })

  it('should handle object with only undefined properties', () => {
    const value = {
      journal: undefined,
      journalId: undefined,
      journalType: undefined,
    }

    expect(generateAtomFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateAtomFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateAtomFeed(undefined)).toBeUndefined()
  })
})

describe('generateAtomEntry', () => {
  it('should generate poster attributes and text elements with all properties', () => {
    const value = {
      music: 'The Beatles - Hey Jude',
      mood: 'cheerful',
      security: 'public',
      poster: 'johndoe',
      posterId: '12345',
      posterUrl: 'https://johndoe.example.com',
      posterUserpic: 'https://userpic.example.com/12345',
      replyCount: 42,
    }
    const expected = {
      'lj:poster': {
        '@user': 'johndoe',
        '@userid': '12345',
      },
      'lj:music': 'The Beatles - Hey Jude',
      'lj:mood': 'cheerful',
      'lj:security': 'public',
      'lj:posterurl': 'https://johndoe.example.com',
      'lj:posteruserpic': 'https://userpic.example.com/12345',
      'lj:replycount': 42,
    }

    expect(generateAtomEntry(value)).toEqual(expected)
  })

  it('should generate poster attributes with minimal properties', () => {
    const value = {
      poster: 'johndoe',
    }
    const expected = {
      'lj:poster': {
        '@user': 'johndoe',
      },
    }

    expect(generateAtomEntry(value)).toEqual(expected)
  })

  it('should omit lj:poster when neither poster field is set', () => {
    const value = {
      mood: 'sleepy',
    }
    const expected = {
      'lj:mood': 'sleepy',
    }

    expect(generateAtomEntry(value)).toEqual(expected)
  })

  it('should handle object with only undefined properties', () => {
    const value = {
      music: undefined,
      mood: undefined,
      security: undefined,
      poster: undefined,
      posterId: undefined,
      posterUrl: undefined,
      posterUserpic: undefined,
      replyCount: undefined,
    }

    expect(generateAtomEntry(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateAtomEntry(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateAtomEntry(undefined)).toBeUndefined()
  })
})
