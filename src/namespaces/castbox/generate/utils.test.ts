import { describe, expect, it } from 'bun:test'
import { generateFeed, generateItem } from './utils.js'

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      uid: '17834af78de544b6957678a2918ef04c',
      pid: '1318014',
      type: 'private',
    }
    const expected = {
      'castbox:uid': '17834af78de544b6957678a2918ef04c',
      'castbox:pid': '1318014',
      'castbox:type': 'private',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only uid', () => {
    const value = {
      uid: '17834af78de544b6957678a2918ef04c',
    }
    const expected = {
      'castbox:uid': '17834af78de544b6957678a2918ef04c',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only pid', () => {
    const value = {
      pid: '1318014',
    }
    const expected = {
      'castbox:pid': '1318014',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only type', () => {
    const value = {
      type: 'private',
    }
    const expected = {
      'castbox:type': 'private',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should wrap text with special characters in CDATA', () => {
    const value = {
      type: 'private & listed',
    }
    const expected = {
      'castbox:type': { '#cdata': 'private & listed' },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      uid: '17834af78de544b6957678a2918ef04c',
      type: '',
    }
    const expected = {
      'castbox:uid': '17834af78de544b6957678a2918ef04c',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      uid: '   ',
      type: '\t\n',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed([])).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      tid: '211277615',
      episodePremium: true,
    }
    const expected = {
      'castbox:tid': '211277615',
      'castbox:episode_premium': 'yes',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only tid', () => {
    const value = {
      tid: '211277615',
    }
    const expected = {
      'castbox:tid': '211277615',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only episodePremium', () => {
    const value = {
      episodePremium: true,
    }
    const expected = {
      'castbox:episode_premium': 'yes',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate episodePremium false as "no"', () => {
    const value = {
      episodePremium: false,
    }
    const expected = {
      'castbox:episode_premium': 'no',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should wrap text with special characters in CDATA', () => {
    const value = {
      tid: '<211277615>',
    }
    const expected = {
      'castbox:tid': { '#cdata': '<211277615>' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      tid: '',
      episodePremium: true,
    }
    const expected = {
      'castbox:episode_premium': 'yes',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      tid: '   ',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
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
