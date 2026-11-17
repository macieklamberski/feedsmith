import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate complete coordinates with all properties', () => {
    const value = {
      latitude: 68.3495046,
      longitude: 18.8304306,
    }
    const expected = {
      'icbm:latitude': 68.3495046,
      'icbm:longitude': 18.8304306,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate negative coordinates', () => {
    const value = {
      latitude: 33.92537,
      longitude: -115.92887,
    }
    const expected = {
      'icbm:latitude': 33.92537,
      'icbm:longitude': -115.92887,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate zero coordinates', () => {
    const value = {
      latitude: 0,
      longitude: 0,
    }
    const expected = {
      'icbm:latitude': 0,
      'icbm:longitude': 0,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate latitude only', () => {
    const value = {
      latitude: 39.0298,
    }
    const expected = {
      'icbm:latitude': 39.0298,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should skip a NaN value', () => {
    const value = {
      latitude: Number.NaN,
      longitude: -77.07929,
    }
    const expected = {
      'icbm:longitude': -77.07929,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateItemOrFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(123)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed([])).toBeUndefined()
    expect(generateItemOrFeed(undefined)).toBeUndefined()
  })
})
