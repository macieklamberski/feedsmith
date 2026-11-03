import { describe, expect, it } from 'bun:test'
import { retrieveFeed, retrieveItem } from './utils.js'

describe('retrieveFeed', () => {
  const expectedFull = {
    uid: '17834af78de544b6957678a2918ef04c',
    pid: '1318014',
    type: 'private',
  }

  it('should parse all feed properties (with #text)', () => {
    const value = {
      'castbox:uid': { '#text': '17834af78de544b6957678a2918ef04c' },
      'castbox:pid': { '#text': '1318014' },
      'castbox:type': { '#text': 'private' },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse all feed properties (without #text)', () => {
    const value = {
      'castbox:uid': '17834af78de544b6957678a2918ef04c',
      'castbox:pid': '1318014',
      'castbox:type': 'private',
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed properties from arrays (uses first)', () => {
    const value = {
      'castbox:uid': ['17834af78de544b6957678a2918ef04c', 'ad24cf9481fd43d3bf50d3db482a414a'],
      'castbox:pid': ['1318014', '1948674'],
      'castbox:type': ['private', ''],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with only uid', () => {
    const value = {
      'castbox:uid': '17834af78de544b6957678a2918ef04c',
    }
    const expected = {
      uid: '17834af78de544b6957678a2918ef04c',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only pid', () => {
    const value = {
      'castbox:pid': '1318014',
    }
    const expected = {
      pid: '1318014',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only type', () => {
    const value = {
      'castbox:type': 'private',
    }
    const expected = {
      type: 'private',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse numeric pid as string', () => {
    const value = {
      'castbox:pid': 1318014,
    }
    const expected = {
      pid: '1318014',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should skip empty type', () => {
    const value = {
      'castbox:uid': '17834af78de544b6957678a2918ef04c',
      'castbox:pid': '1318014',
      'castbox:type': '',
    }
    const expected = {
      uid: '17834af78de544b6957678a2918ef04c',
      pid: '1318014',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'castbox:type': { '#text': 'private&amp;listed' },
    }
    const expected = {
      type: 'private&listed',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'castbox:uid': { '#text': '<![CDATA[17834af78de544b6957678a2918ef04c]]>' },
      'castbox:pid': { '#text': '<![CDATA[1318014]]>' },
    }
    const expected = {
      uid: '17834af78de544b6957678a2918ef04c',
      pid: '1318014',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'castbox:uid': { '#text': '   ' },
      'castbox:type': { '#text': '\t\n' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveFeed({})).toBeUndefined()
  })

  it('should return undefined when no castbox properties are present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed(true)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  const expectedFull = {
    tid: '211277615',
    episodePremium: true,
  }

  it('should parse all item properties (with #text)', () => {
    const value = {
      'castbox:tid': { '#text': '211277615' },
      'castbox:episode_premium': { '#text': 'yes' },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse all item properties (without #text)', () => {
    const value = {
      'castbox:tid': '211277615',
      'castbox:episode_premium': 'yes',
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item properties from arrays (uses first)', () => {
    const value = {
      'castbox:tid': ['211277615', '210191364'],
      'castbox:episode_premium': ['yes', 'no'],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item with only tid', () => {
    const value = {
      'castbox:tid': '211277615',
    }
    const expected = {
      tid: '211277615',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only episodePremium', () => {
    const value = {
      'castbox:episode_premium': 'yes',
    }
    const expected = {
      episodePremium: true,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse episodePremium "no" as false', () => {
    const value = {
      'castbox:episode_premium': 'no',
    }
    const expected = {
      episodePremium: false,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should skip empty episodePremium', () => {
    const value = {
      'castbox:tid': '211277615',
      'castbox:episode_premium': '',
    }
    const expected = {
      tid: '211277615',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse numeric tid as string', () => {
    const value = {
      'castbox:tid': 211277615,
    }
    const expected = {
      tid: '211277615',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'castbox:tid': { '#text': '211277615&amp;' },
    }
    const expected = {
      tid: '211277615&',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'castbox:tid': { '#text': '<![CDATA[211277615]]>' },
      'castbox:episode_premium': { '#text': '<![CDATA[yes]]>' },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'castbox:tid': { '#text': '   ' },
      'castbox:episode_premium': { '#text': '\t\n' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined when no castbox properties are present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
    expect(retrieveItem(true)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})
