import { describe, expect, it } from 'bun:test'
import { generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate valid item object with all properties', () => {
    const value = {
      section: 'Technology',
      department: 'News',
      comments: 42,
      hit_parade: [1, 2, 3, 4, 5],
    }
    const expected = {
      'slash:section': 'Technology',
      'slash:department': 'News',
      'slash:comments': 42,
      'slash:hit_parade': '1,2,3,4,5',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with minimal properties', () => {
    const value = {
      comments: 10,
    }
    const expected = {
      'slash:comments': 10,
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty hit_parade array', () => {
    const value = {
      comments: 5,
      hit_parade: [],
    }
    const expected = {
      'slash:comments': 5,
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle object with only undefined/empty properties', () => {
    const value = {
      section: undefined,
      department: undefined,
      comments: undefined,
      hit_parade: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })
})
