import { describe, expect, it } from 'bun:test'
import { parseHitParade, retrieveItem } from './utils.js'

describe('parseHitParade', () => {
  it('should parse comma-separated hit parade string to array of numbers', () => {
    const value = '42,38,24,16,8,4,2,0'
    const expected = [42, 38, 24, 16, 8, 4, 2, 0]

    expect(parseHitParade(value)).toEqual(expected)
  })

  it('should handle single value hit parade', () => {
    const value = '42'
    const expected = [42]

    expect(parseHitParade(value)).toEqual(expected)
  })

  it('should filter out non-numeric values', () => {
    const value = '42,invalid,24,NaN,8'
    const expected = [42, 24, 8]

    expect(parseHitParade(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = 123456
    const expected = [123456]

    expect(parseHitParade(value)).toEqual(expected)
  })

  it('should return undefined for empty string', () => {
    expect(parseHitParade('')).toBeUndefined()
  })

  it('should return undefined for non-string/non-number input', () => {
    expect(parseHitParade(null)).toBeUndefined()
    expect(parseHitParade(undefined)).toBeUndefined()
    expect(parseHitParade({})).toBeUndefined()
    expect(parseHitParade([])).toBeUndefined()
  })

  it('should return undefined if no valid numbers are found', () => {
    expect(parseHitParade('invalid,NaN')).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  const expectedFull = {
    section: 'technology',
    department: 'open-source',
    comments: 42,
    hitParade: [42, 38, 24, 16, 8, 4, 2],
  }

  it('should parse complete slash namespace item (with #text)', () => {
    const value = {
      'slash:section': { '#text': 'technology' },
      'slash:department': { '#text': 'open-source' },
      'slash:comments': { '#text': '42' },
      'slash:hit_parade': { '#text': '42,38,24,16,8,4,2' },
    }
    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete slash namespace item (without #text)', () => {
    const value = {
      'slash:section': 'technology',
      'slash:department': 'open-source',
      'slash:comments': '42',
      'slash:hit_parade': '42,38,24,16,8,4,2',
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete slash namespace item (with array of values)', () => {
    const value = {
      'slash:section': ['technology', 'computers'],
      'slash:department': ['open-source', 'closed-source'],
      'slash:comments': ['42', '55'],
      'slash:hit_parade': ['42,38,24,16,8,4,2', '11,10'],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item with only section field', () => {
    const value = {
      'slash:section': { '#text': 'technology' },
    }
    const expected = {
      section: 'technology',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only department field', () => {
    const value = {
      'slash:department': { '#text': 'open-source' },
    }
    const expected = {
      department: 'open-source',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only comments field', () => {
    const value = {
      'slash:comments': { '#text': '42' },
    }
    const expected = {
      comments: 42,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only hit_parade field', () => {
    const value = {
      'slash:hit_parade': { '#text': '42,38,24,16,8,4,2' },
    }
    const expected = {
      hitParade: [42, 38, 24, 16, 8, 4, 2],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'slash:section': { '#text': 123 },
      'slash:comments': { '#text': 'forty-two' },
      'slash:hit_parade': { '#text': 42 },
    }
    const expected = {
      section: '123',
      hitParade: [42],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined if no slash properties exist', () => {
    const value = {
      title: { '#text': 'Not a slash item' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when properties exist but values are invalid', () => {
    const value = {
      'slash:comments': { '#text': 'not a number' },
      'slash:hit_parade': { '#text': 'not,numbers' },
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
