import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate expires', () => {
    const value = {
      expires: new Date('2026-07-02T21:00:00Z'),
    }
    const expected = {
      'fa:expires': '2026-07-02T21:00:00.000Z',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate expires from a string date', () => {
    const value = {
      expires: '2026-07-02T21:00:00Z',
    }
    const expected = {
      'fa:expires': '2026-07-02T21:00:00.000Z',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate max-age', () => {
    const value = {
      maxAge: 10800000,
    }
    const expected = {
      'fa:max-age': 10800000,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate max-age of zero', () => {
    const value = {
      maxAge: 0,
    }
    const expected = {
      'fa:max-age': 0,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate both properties', () => {
    const value = {
      expires: new Date('2026-07-02T21:00:00Z'),
      maxAge: 10800000,
    }
    const expected = {
      'fa:expires': '2026-07-02T21:00:00.000Z',
      'fa:max-age': 10800000,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateItemOrFeed({})).toBeUndefined()
  })

  it('should handle undefined values', () => {
    const value = {
      expires: undefined,
      maxAge: undefined,
    }

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(123)).toBeUndefined()
    expect(generateItemOrFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed([])).toBeUndefined()
  })
})
