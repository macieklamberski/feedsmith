import { describe, expect, it } from 'bun:test'
import { retrieveItem } from './utils.js'

describe('retrieveItem', () => {
  const expectedFull = {
    startDate: '2026-11-14T19:30:00+01:00',
    endDate: '2026-11-14T22:00:00+01:00',
    location: 'Town Hall, Main Street 12',
    organizer: 'City Library',
    type: 'concert',
  }

  it('should parse complete item object with all properties (with #text)', () => {
    const value = {
      'ev:startdate': { '#text': '2026-11-14T19:30:00+01:00' },
      'ev:enddate': { '#text': '2026-11-14T22:00:00+01:00' },
      'ev:location': { '#text': 'Town Hall, Main Street 12' },
      'ev:organizer': { '#text': 'City Library' },
      'ev:type': { '#text': 'concert' },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object with all properties (without #text)', () => {
    const value = {
      'ev:startdate': '2026-11-14T19:30:00+01:00',
      'ev:enddate': '2026-11-14T22:00:00+01:00',
      'ev:location': 'Town Hall, Main Street 12',
      'ev:organizer': 'City Library',
      'ev:type': 'concert',
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object with all properties (with array of values)', () => {
    const value = {
      'ev:startdate': ['2026-11-14T19:30:00+01:00', '2026-11-15T19:30:00+01:00'],
      'ev:enddate': ['2026-11-14T22:00:00+01:00', '2026-11-15T22:00:00+01:00'],
      'ev:location': ['Town Hall, Main Street 12', 'Community Centre'],
      'ev:organizer': ['City Library', 'Arts Council'],
      'ev:type': ['concert', 'workshop'],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item with only startDate', () => {
    const value = {
      'ev:startdate': { '#text': '2026-06-20' },
    }
    const expected = {
      startDate: '2026-06-20',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should keep a year-only date as written', () => {
    const value = {
      'ev:startdate': { '#text': '2026' },
    }
    const expected = {
      startDate: '2026',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should keep a year and month date as written', () => {
    const value = {
      'ev:enddate': { '#text': '2026-09' },
    }
    const expected = {
      endDate: '2026-09',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse dates with custom parseDateFn', () => {
    const value = {
      'ev:startdate': { '#text': '2026-11-14T19:30:00+01:00' },
      'ev:enddate': { '#text': '2026-11-14T22:00:00+01:00' },
    }
    const expected = {
      startDate: new Date('2026-11-14T19:30:00+01:00'),
      endDate: new Date('2026-11-14T22:00:00+01:00'),
    }

    expect(retrieveItem(value, { parseDateFn: (raw) => new Date(raw) })).toEqual(expected)
  })

  it('should parse item with only location', () => {
    const value = {
      'ev:location': { '#text': 'Town Hall, Main Street 12' },
    }
    const expected = {
      location: 'Town Hall, Main Street 12',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities', () => {
    const value = {
      'ev:location': { '#text': 'Smith &amp; Sons Hall' },
      'ev:organizer': { '#text': 'Friends &amp; Neighbours' },
    }
    const expected = {
      location: 'Smith & Sons Hall',
      organizer: 'Friends & Neighbours',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA', () => {
    const value = {
      'ev:location': { '#text': '<![CDATA[Town Hall, Main Street 12]]>' },
    }
    const expected = {
      location: 'Town Hall, Main Street 12',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'ev:startdate': { '#text': 2026 },
      'ev:type': { '#text': 123 },
    }
    const expected = {
      startDate: '2026',
      type: '123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should omit empty strings', () => {
    const value = {
      'ev:startdate': { '#text': '' },
      'ev:location': { '#text': '' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should omit whitespace-only strings', () => {
    const value = {
      'ev:startdate': { '#text': '   ' },
      'ev:location': { '#text': '   ' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when no ev properties exist', () => {
    const value = {
      title: { '#text': 'Autumn concert' },
      'dc:date': { '#text': '2026-11-01' },
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
