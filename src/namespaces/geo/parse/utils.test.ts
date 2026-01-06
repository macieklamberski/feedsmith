import { describe, expect, it } from 'bun:test'
import { retrieveItemOrFeed } from './utils.js'

describe('retrieveItemOrFeed', () => {
  it('should parse complete coordinates with all properties', () => {
    const value = {
      'geo:lat': '37.7749',
      'geo:long': '-122.4194',
      'geo:alt': '10.5',
    }
    const expected = {
      lat: 37.7749,
      long: -122.4194,
      alt: 10.5,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse coordinates without altitude', () => {
    const value = {
      'geo:lat': '37.8199',
      'geo:long': '-122.4783',
    }
    const expected = {
      lat: 37.8199,
      long: -122.4783,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle integer coordinates', () => {
    const value = {
      'geo:lat': '37',
      'geo:long': '-122',
    }
    const expected = {
      lat: 37,
      long: -122,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle zero coordinates', () => {
    const value = {
      'geo:lat': '0',
      'geo:long': '0',
    }
    const expected = {
      lat: 0,
      long: 0,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle negative coordinates', () => {
    const value = {
      'geo:lat': '-33.8688',
      'geo:long': '151.2093',
    }
    const expected = {
      lat: -33.8688,
      long: 151.2093,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse latitude only', () => {
    const value = {
      'geo:lat': '40.7128',
    }
    const expected = {
      lat: 40.7128,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'geo:lat': '',
      'geo:long': '-122.4194',
    }
    const expected = {
      long: -122.4194,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'geo:lat': '   ',
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should handle invalid number strings', () => {
    const value = {
      'geo:lat': 'not a number',
      'geo:long': '-122.4194',
    }
    const expected = {
      long: -122.4194,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed('string')).toBeUndefined()
    expect(retrieveItemOrFeed(123)).toBeUndefined()
  })

  it('should handle array inputs by using first element', () => {
    const value = {
      'geo:lat': ['37.7749', '40.7128'],
    }
    const expected = {
      lat: 37.7749,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle very precise coordinates', () => {
    const value = {
      'geo:lat': '37.77492537',
      'geo:long': '-122.41941551',
      'geo:alt': '10.534582',
    }
    const expected = {
      lat: 37.77492537,
      long: -122.41941551,
      alt: 10.534582,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle below-sea-level altitude', () => {
    const value = {
      'geo:lat': '31.5',
      'geo:long': '35.5',
      'geo:alt': '-430',
    }
    const expected = {
      lat: 31.5,
      long: 35.5,
      alt: -430,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })
})
