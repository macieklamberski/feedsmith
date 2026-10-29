import { describe, expect, it } from 'bun:test'
import { retrieveItem } from './utils.js'

describe('retrieveItem', () => {
  it('should parse all properties (with #text)', () => {
    const value = {
      'wikidot:authorname': { '#text': 'Crayne' },
      'wikidot:authoruserid': { '#text': '1346995' },
    }
    const expected = {
      authorName: 'Crayne',
      authorUserId: '1346995',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse all properties (without #text)', () => {
    const value = {
      'wikidot:authorname': 'Crayne',
      'wikidot:authoruserid': '1346995',
    }
    const expected = {
      authorName: 'Crayne',
      authorUserId: '1346995',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse the first value from arrays', () => {
    const value = {
      'wikidot:authorname': [{ '#text': 'Crayne' }, { '#text': 'A Random Day' }],
      'wikidot:authoruserid': [{ '#text': '1346995' }, { '#text': '1841781' }],
    }
    const expected = {
      authorName: 'Crayne',
      authorUserId: '1346995',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse an anonymous post with only authorName', () => {
    const value = {
      'wikidot:authorname': { '#text': 'anon' },
    }
    const expected = {
      authorName: 'anon',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse a post with only authorUserId', () => {
    const value = {
      'wikidot:authoruserid': { '#text': '7347499' },
    }
    const expected = {
      authorUserId: '7347499',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should keep a numeric authorUserId as a string', () => {
    const value = {
      'wikidot:authoruserid': { '#text': 740 },
    }
    const expected = {
      authorUserId: '740',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should decode HTML entities', () => {
    const value = {
      'wikidot:authorname': { '#text': 'Tom &amp; Jerry' },
    }
    const expected = {
      authorName: 'Tom & Jerry',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'wikidot:authorname': { '#text': '<![CDATA[Crayne]]>' },
    }
    const expected = {
      authorName: 'Crayne',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should skip empty string values', () => {
    const value = {
      'wikidot:authorname': { '#text': '' },
      'wikidot:authoruserid': { '#text': '1346995' },
    }
    const expected = {
      authorUserId: '1346995',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for whitespace-only values', () => {
    const value = {
      'wikidot:authorname': { '#text': '   ' },
      'wikidot:authoruserid': { '#text': '\t\n' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined when no wikidot properties exist', () => {
    const value = {
      title: { '#text': 'Re: Non-Disc Record' },
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
