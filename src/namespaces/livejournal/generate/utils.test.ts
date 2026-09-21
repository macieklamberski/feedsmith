import { describe, expect, it } from 'bun:test'
import { generateFeed, generateItem } from './utils.js'

describe('generateFeed', () => {
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

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with minimal properties', () => {
    const value = {
      journal: 'example_user',
    }
    const expected = {
      'lj:journal': 'example_user',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle object with only undefined properties', () => {
    const value = {
      journal: undefined,
      journalId: undefined,
      journalType: undefined,
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateFeed(undefined)).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate valid item object with all properties', () => {
    const value = {
      music: 'The Beatles - Hey Jude',
      mood: 'cheerful',
      security: 'public',
      poster: 'johndoe',
      posterId: '12345',
      replyCount: 42,
    }
    const expected = {
      'lj:music': 'The Beatles - Hey Jude',
      'lj:mood': 'cheerful',
      'lj:security': 'public',
      'lj:poster': 'johndoe',
      'lj:posterid': '12345',
      'lj:replycount': 42,
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with minimal properties', () => {
    const value = {
      mood: 'sleepy',
    }
    const expected = {
      'lj:mood': 'sleepy',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate reply count of zero', () => {
    const value = {
      replyCount: 0,
    }
    const expected = {
      'lj:replycount': 0,
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle object with only undefined properties', () => {
    const value = {
      music: undefined,
      mood: undefined,
      security: undefined,
      poster: undefined,
      posterId: undefined,
      replyCount: undefined,
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })
})
