import { describe, expect, it } from 'bun:test'
import { retrieveFeed } from './utils'

describe('retrieveFeed', () => {
  it('should parse complete channel object', () => {
    const value = {
      'sy:updatePeriod': { '#text': 'hourly' },
      'sy:updateFrequency': { '#text': '2' },
      'sy:updateBase': { '#text': '2023-01-01T12:00:00Z' },
    }
    const expected = {
      updatePeriod: 'hourly',
      updateFrequency: 2,
      updateBase: '2023-01-01T12:00:00Z',
    }

    expect(retrieveFeed(value, 'coerce')).toEqual(expected)
  })

  it('should handle partial channel object with only updatePeriod', () => {
    const value = {
      'sy:updatePeriod': { '#text': 'daily' },
    }
    const expected = {
      updatePeriod: 'daily',
    }

    expect(retrieveFeed(value, 'coerce')).toEqual(expected)
  })

  it('should handle partial channel object with only updateFrequency', () => {
    const value = {
      'sy:updateFrequency': { '#text': '6' },
    }
    const expected = {
      updateFrequency: 6,
    }

    expect(retrieveFeed(value, 'coerce')).toEqual(expected)
  })

  it('should handle partial channel object with only updateBase', () => {
    const value = {
      'sy:updateBase': { '#text': '2023-05-15T09:30:00Z' },
    }
    const expected = {
      updateBase: '2023-05-15T09:30:00Z',
    }

    expect(retrieveFeed(value, 'coerce')).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'sy:updatePeriod': { '#text': 123 },
      'sy:updateFrequency': { '#text': 'not a number' },
      'sy:updateBase': { '#text': true },
    }
    const expected = {
      updatePeriod: '123',
    }

    expect(retrieveFeed(value, 'coerce')).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value, 'coerce')).toBeUndefined()
  })

  it('should return undefined for non-object value', () => {
    expect(retrieveFeed('not an object', 'coerce')).toBeUndefined()
    expect(retrieveFeed(undefined, 'coerce')).toBeUndefined()
    expect(retrieveFeed(null, 'coerce')).toBeUndefined()
    expect(retrieveFeed([], 'coerce')).toBeUndefined()
  })

  it('should return undefined when no properties can be parsed', () => {
    const value = {
      'sy:updateFrequency': { '#text': 'not a number' },
      'other:property': { '#text': 'value' },
    }

    expect(retrieveFeed(value, 'coerce')).toBeUndefined()
  })

  it('should handle objects with missing #text property', () => {
    const value = {
      'sy:updatePeriod': {},
      'sy:updateFrequency': { '#text': '3' },
      'sy:updateBase': { '#text': '2023-01-01T12:00:00Z' },
    }
    const expected = {
      updateFrequency: 3,
      updateBase: '2023-01-01T12:00:00Z',
    }

    expect(retrieveFeed(value, 'coerce')).toEqual(expected)
  })

  it('should handle all properties with various values', () => {
    const value = {
      'sy:updatePeriod': { '#text': 'weekly' },
      'sy:updateFrequency': { '#text': '1' },
      'sy:updateBase': { '#text': '2023-01-01T00:00:00Z' },
    }
    const expected = {
      updatePeriod: 'weekly',
      updateFrequency: 1,
      updateBase: '2023-01-01T00:00:00Z',
    }

    expect(retrieveFeed(value, 'coerce')).toEqual(expected)
  })
})
