import { describe, expect, it } from 'bun:test'
import { retrieveItemOrFeed } from './utils.js'

describe('retrieveItemOrFeed', () => {
  it('should parse complete coordinates with all properties', () => {
    const value = {
      'icbm:latitude': '68.3495046',
      'icbm:longitude': '18.8304306',
    }
    const expected = {
      latitude: 68.3495046,
      longitude: 18.8304306,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse negative coordinates', () => {
    const value = {
      'icbm:latitude': '33.92537',
      'icbm:longitude': '-115.92887',
    }
    const expected = {
      latitude: 33.92537,
      longitude: -115.92887,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse coordinates with floating point noise', () => {
    const value = {
      'icbm:latitude': '37.1773363',
      'icbm:longitude': '-3.5985570999999936',
    }
    const expected = {
      latitude: 37.1773363,
      longitude: -3.5985570999999936,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse zero coordinates', () => {
    const value = {
      'icbm:latitude': '0',
      'icbm:longitude': '0',
    }
    const expected = {
      latitude: 0,
      longitude: 0,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse latitude only', () => {
    const value = {
      'icbm:latitude': '39.02980',
    }
    const expected = {
      latitude: 39.0298,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse longitude only', () => {
    const value = {
      'icbm:longitude': '-77.07929',
    }
    const expected = {
      longitude: -77.07929,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse coordinates wrapped in CDATA', () => {
    const value = {
      'icbm:latitude': { '#text': '<![CDATA[39.02980]]>' },
      'icbm:longitude': { '#text': '<![CDATA[-77.07929]]>' },
    }
    const expected = {
      latitude: 39.0298,
      longitude: -77.07929,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse coordinates surrounded by whitespace', () => {
    const value = {
      'icbm:latitude': '\n  39.02980\n',
      'icbm:longitude': '\n  -77.07929\n',
    }
    const expected = {
      latitude: 39.0298,
      longitude: -77.07929,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should skip an empty string', () => {
    const value = {
      'icbm:latitude': '',
      'icbm:longitude': '-77.07929',
    }
    const expected = {
      longitude: -77.07929,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      'icbm:latitude': '   ',
      'icbm:longitude': '   ',
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should skip a value that is not a number', () => {
    const value = {
      'icbm:latitude': 'north',
      'icbm:longitude': '-77.07929',
    }
    const expected = {
      longitude: -77.07929,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should use the first value when an element repeats', () => {
    const value = {
      'icbm:latitude': ['39.02980', '40.7128'],
      'icbm:longitude': ['-77.07929', '-74.006'],
    }
    const expected = {
      latitude: 39.0298,
      longitude: -77.07929,
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItemOrFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed('string')).toBeUndefined()
    expect(retrieveItemOrFeed(123)).toBeUndefined()
    expect(retrieveItemOrFeed([])).toBeUndefined()
  })
})
