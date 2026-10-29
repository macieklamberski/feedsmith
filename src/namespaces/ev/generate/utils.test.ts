import { describe, expect, it } from 'bun:test'
import { generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate valid item object with all properties', () => {
    const value = {
      startDate: new Date('2026-11-14T18:30:00Z'),
      endDate: new Date('2026-11-14T21:00:00Z'),
      location: 'Town Hall, Main Street 12',
      organizer: 'City Library',
      type: 'concert',
    }
    const expected = {
      'ev:startdate': '2026-11-14T18:30:00.000Z',
      'ev:enddate': '2026-11-14T21:00:00.000Z',
      'ev:location': 'Town Hall, Main Street 12',
      'ev:organizer': 'City Library',
      'ev:type': 'concert',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item object with only startDate', () => {
    const value = {
      startDate: new Date('2026-06-20T00:00:00Z'),
    }
    const expected = {
      'ev:startdate': '2026-06-20T00:00:00.000Z',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate dates given as strings', () => {
    const value = {
      startDate: '2026-11-14T18:30:00Z',
      endDate: '2026-11-14T21:00:00Z',
    }
    const expected = {
      'ev:startdate': '2026-11-14T18:30:00.000Z',
      'ev:enddate': '2026-11-14T21:00:00.000Z',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should keep unparsable date strings as given', () => {
    const value = {
      startDate: 'Saturday evening',
    }
    const expected = {
      'ev:startdate': 'Saturday evening',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should wrap text with special characters in CDATA', () => {
    const value = {
      location: 'Smith & Sons Hall',
    }
    const expected = {
      'ev:location': { '#cdata': 'Smith & Sons Hall' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should filter out empty string values', () => {
    const value = {
      startDate: '',
      location: '',
      type: 'concert',
    }
    const expected = {
      'ev:type': 'concert',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should filter out whitespace-only values', () => {
    const value = {
      location: '   ',
      organizer: '   ',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should filter out invalid dates', () => {
    const value = {
      startDate: new Date('invalid'),
      type: 'concert',
    }
    const expected = {
      'ev:type': 'concert',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('not an object')).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
  })

  it('should return undefined for array input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})
