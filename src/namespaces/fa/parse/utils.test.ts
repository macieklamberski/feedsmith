import { describe, expect, it } from 'bun:test'
import { retrieveItemOrFeed } from './utils.js'

describe('retrieveItemOrFeed', () => {
  it('should parse expires', () => {
    const value = {
      'fa:expires': '2026-07-02T21:00:00+00:00',
    }
    const expected = {
      expires: '2026-07-02T21:00:00+00:00',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse max-age', () => {
    const value = {
      'fa:max-age': '10800000',
    }
    const expected = {
      maxAge: 10800000,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse both elements', () => {
    const value = {
      'fa:expires': '2026-07-02T21:00:00+00:00',
      'fa:max-age': '10800000',
    }
    const expected = {
      expires: '2026-07-02T21:00:00+00:00',
      maxAge: 10800000,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse max-age of zero', () => {
    const value = {
      'fa:max-age': '0',
    }
    const expected = {
      maxAge: 0,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'fa:max-age': { '#text': '<![CDATA[10800000]]>' },
    }
    const expected = {
      maxAge: 10800000,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should trim whitespace around max-age', () => {
    const value = {
      'fa:max-age': '  10800000  ',
    }
    const expected = {
      maxAge: 10800000,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse expires with custom parseDateFn', () => {
    const value = {
      'fa:expires': '2026-07-02T21:00:00+00:00',
    }
    const expected = {
      expires: new Date('2026-07-02T21:00:00+00:00'),
    }

    expect(retrieveItemOrFeed(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
  })

  it('should take the first of repeated elements', () => {
    const value = {
      'fa:max-age': ['10800000', '3600000'],
    }
    const expected = {
      maxAge: 10800000,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should ignore non-numeric max-age', () => {
    const value = {
      'fa:max-age': 'three hours',
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should handle empty strings', () => {
    const value = {
      'fa:expires': '',
      'fa:max-age': '',
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'fa:expires': '   ',
      'fa:max-age': '   ',
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItemOrFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed('string')).toBeUndefined()
    expect(retrieveItemOrFeed(123)).toBeUndefined()
    expect(retrieveItemOrFeed([])).toBeUndefined()
  })
})
