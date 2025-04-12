import { describe, expect, it } from 'bun:test'
import { parseFeed } from './utils.js'

describe('parseFeed', () => {
  it('should parse complete channel object', () => {
    const value = {
      'sy:updateperiod': { '#text': 'hourly' },
      'sy:updatefrequency': { '#text': '2' },
      'sy:updatebase': { '#text': '2023-01-01T12:00:00Z' },
    }
    const expected = {
      updatePeriod: 'hourly',
      updateFrequency: 2,
      updateBase: '2023-01-01T12:00:00Z',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle partial channel object with only updatePeriod', () => {
    const value = {
      'sy:updateperiod': { '#text': 'daily' },
    }
    const expected = {
      updatePeriod: 'daily',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle partial channel object with only updateFrequency', () => {
    const value = {
      'sy:updatefrequency': { '#text': '6' },
    }
    const expected = {
      updateFrequency: 6,
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle partial channel object with only updateBase', () => {
    const value = {
      'sy:updatebase': { '#text': '2023-05-15T09:30:00Z' },
    }
    const expected = {
      updateBase: '2023-05-15T09:30:00Z',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'sy:updateperiod': { '#text': 123 },
      'sy:updatefrequency': { '#text': 'not a number' },
      'sy:updatebase': { '#text': true },
    }
    const expected = {
      updatePeriod: '123',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object value', () => {
    expect(parseFeed('not an object')).toBeUndefined()
    expect(parseFeed(undefined)).toBeUndefined()
    expect(parseFeed(null)).toBeUndefined()
    expect(parseFeed([])).toBeUndefined()
  })

  it('should return undefined when no properties can be parsed', () => {
    const value = {
      'sy:updatefrequency': { '#text': 'not a number' },
      'other:property': { '#text': 'value' },
    }

    expect(parseFeed(value)).toBeUndefined()
  })

  it('should handle objects with missing #text property', () => {
    const value = {
      'sy:updateperiod': {},
      'sy:updatefrequency': { '#text': '3' },
      'sy:updatebase': { '#text': '2023-01-01T12:00:00Z' },
    }
    const expected = {
      updateFrequency: 3,
      updateBase: '2023-01-01T12:00:00Z',
    }

    expect(parseFeed(value)).toEqual(expected)
  })

  it('should handle all properties with various values', () => {
    const value = {
      'sy:updateperiod': { '#text': 'weekly' },
      'sy:updatefrequency': { '#text': '1' },
      'sy:updatebase': { '#text': '2023-01-01T00:00:00Z' },
    }
    const expected = {
      updatePeriod: 'weekly',
      updateFrequency: 1,
      updateBase: '2023-01-01T00:00:00Z',
    }

    expect(parseFeed(value)).toEqual(expected)
  })
})
