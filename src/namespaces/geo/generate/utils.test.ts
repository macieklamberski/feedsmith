import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate complete coordinates with all properties', () => {
    const value = {
      lat: 37.7749,
      long: -122.4194,
      alt: 10.5,
    }
    const expected = {
      'geo:lat': 37.7749,
      'geo:long': -122.4194,
      'geo:alt': 10.5,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate coordinates without altitude', () => {
    const value = {
      lat: 37.8199,
      long: -122.4783,
    }
    const expected = {
      'geo:lat': 37.8199,
      'geo:long': -122.4783,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate integer coordinates', () => {
    const value = {
      lat: 37,
      long: -122,
    }
    const expected = {
      'geo:lat': 37,
      'geo:long': -122,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate zero coordinates', () => {
    const value = {
      lat: 0,
      long: 0,
    }
    const expected = {
      'geo:lat': 0,
      'geo:long': 0,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

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
  })

  it('should handle undefined coordinate values', () => {
    const value = {
      lat: undefined,
      long: -122.4194,
    }
    const expected = {
      'geo:long': -122.4194,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate very precise coordinates', () => {
    const value = {
      lat: 37.77492537,
      long: -122.41941551,
      alt: 10.534582,
    }
    const expected = {
      'geo:lat': 37.77492537,
      'geo:long': -122.41941551,
      'geo:alt': 10.534582,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate boundary latitude values', () => {
    const value = {
      lat: 90,
      long: 0,
    }
    const expected = {
      'geo:lat': 90,
      'geo:long': 0,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate boundary longitude values', () => {
    const value = {
      lat: 0,
      long: 180,
    }
    const expected = {
      'geo:lat': 0,
      'geo:long': 180,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate negative altitude (below sea level)', () => {
    const value = {
      lat: 31.5,
      long: 35.5,
      alt: -430,
    }
    const expected = {
      'geo:lat': 31.5,
      'geo:long': 35.5,
      'geo:alt': -430,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle NaN values', () => {
    const value = {
      lat: NaN,
      long: -122.4194,
    }
    const expected = {
      'geo:long': -122.4194,
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })
})
