import { describe, expect, it } from 'bun:test'
import { generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      authorName: 'Crayne',
      authorUserId: '1346995',
    }
    const expected = {
      'wikidot:authorName': 'Crayne',
      'wikidot:authorUserId': '1346995',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only authorName', () => {
    const value = {
      authorName: 'anon',
    }
    const expected = {
      'wikidot:authorName': 'anon',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only authorUserId', () => {
    const value = {
      authorUserId: '7347499',
    }
    const expected = {
      'wikidot:authorUserId': '7347499',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should wrap a name with special characters in CDATA', () => {
    const value = {
      authorName: 'Tom & Jerry',
    }
    const expected = {
      'wikidot:authorName': { '#cdata': 'Tom & Jerry' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should skip empty strings', () => {
    const value = {
      authorName: '',
      authorUserId: '1346995',
    }
    const expected = {
      'wikidot:authorUserId': '1346995',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      authorName: '   ',
      authorUserId: '\t\n',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(123)).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})
