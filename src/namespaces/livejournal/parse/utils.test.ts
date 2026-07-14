import { describe, expect, it } from 'bun:test'
import { retrieveItem } from './utils.js'

describe('retrieveItem', () => {
  const expectedFull = {
    music: 'The Beatles - Hey Jude',
    mood: 'cheerful',
    security: 'public',
    poster: 'johndoe',
    posterId: '12345',
    journal: 'example_community',
    journalId: '67890',
    journalType: 'C',
    replyCount: 42,
  }

  it('should parse complete livejournal item (with #text)', () => {
    const value = {
      'lj:music': { '#text': 'The Beatles - Hey Jude' },
      'lj:mood': { '#text': 'cheerful' },
      'lj:security': { '#text': 'public' },
      'lj:poster': { '#text': 'johndoe' },
      'lj:posterid': { '#text': '12345' },
      'lj:journal': { '#text': 'example_community' },
      'lj:journalid': { '#text': '67890' },
      'lj:journaltype': { '#text': 'C' },
      'lj:replycount': { '#text': '42' },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete livejournal item (without #text)', () => {
    const value = {
      'lj:music': 'The Beatles - Hey Jude',
      'lj:mood': 'cheerful',
      'lj:security': 'public',
      'lj:poster': 'johndoe',
      'lj:posterid': '12345',
      'lj:journal': 'example_community',
      'lj:journalid': '67890',
      'lj:journaltype': 'C',
      'lj:replycount': '42',
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete livejournal item (with array of values)', () => {
    const value = {
      'lj:music': ['The Beatles - Hey Jude', 'Queen - Bohemian Rhapsody'],
      'lj:mood': ['cheerful', 'excited'],
      'lj:security': ['public', 'private'],
      'lj:poster': ['johndoe', 'janedoe'],
      'lj:posterid': ['12345', '54321'],
      'lj:journal': ['example_community', 'another_community'],
      'lj:journalid': ['67890', '9876'],
      'lj:journaltype': ['C', 'P'],
      'lj:replycount': ['42', '7'],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should read the hyphenated reply-count spelling', () => {
    const value = {
      'lj:reply-count': { '#text': '17' },
    }
    const expected = {
      replyCount: 17,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should prefer the unhyphenated replycount over reply-count', () => {
    const value = {
      'lj:replycount': { '#text': '42' },
      'lj:reply-count': { '#text': '17' },
    }
    const expected = {
      replyCount: 42,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only mood field', () => {
    const value = {
      'lj:mood': { '#text': 'contemplative' },
    }
    const expected = {
      mood: 'contemplative',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only music field', () => {
    const value = {
      'lj:music': { '#text': 'silence' },
    }
    const expected = {
      music: 'silence',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only security field', () => {
    const value = {
      'lj:security': { '#text': 'usemask' },
    }
    const expected = {
      security: 'usemask',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'lj:mood': { '#text': 123 },
      'lj:replycount': { '#text': 'not-a-number' },
    }
    const expected = {
      mood: '123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined if no livejournal properties exist', () => {
    const value = {
      title: { '#text': 'Not a livejournal item' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})
