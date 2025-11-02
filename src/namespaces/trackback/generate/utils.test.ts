import { describe, expect, it } from 'bun:test'
import { generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      ping: 'https://example.com/trackback/123',
      abouts: ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
    }
    const expected = {
      'trackback:ping': 'https://example.com/trackback/123',
      'trackback:about': ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only ping property', () => {
    const value = {
      ping: 'https://example.com/trackback/123',
    }
    const expected = {
      'trackback:ping': 'https://example.com/trackback/123',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only about property', () => {
    const value = {
      abouts: ['https://blog1.com/trackback/456'],
    }
    const expected = {
      'trackback:about': ['https://blog1.com/trackback/456'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with single about value', () => {
    const value = {
      abouts: ['https://blog1.com/trackback/456'],
    }
    const expected = {
      'trackback:about': ['https://blog1.com/trackback/456'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with multiple about values', () => {
    const value = {
      abouts: [
        'https://blog1.com/trackback/456',
        'https://blog2.com/trackback/789',
        'https://blog3.com/trackback/abc',
      ],
    }
    const expected = {
      'trackback:about': [
        'https://blog1.com/trackback/456',
        'https://blog2.com/trackback/789',
        'https://blog3.com/trackback/abc',
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle special characters requiring CDATA', () => {
    const value = {
      ping: 'https://example.com/track?id=1&key=abc',
    }
    const expected = {
      'trackback:ping': { '#cdata': 'https://example.com/track?id=1&key=abc' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle special characters in about array', () => {
    const value = {
      abouts: ['https://blog1.com/track?id=1&key=abc', 'https://blog2.com/track?id=2&key=def'],
    }
    const expected = {
      'trackback:about': [
        { '#cdata': 'https://blog1.com/track?id=1&key=abc' },
        { '#cdata': 'https://blog2.com/track?id=2&key=def' },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      ping: '',
      abouts: ['https://blog1.com/trackback/456'],
    }
    const expected = {
      'trackback:about': ['https://blog1.com/trackback/456'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings in about array', () => {
    const value = {
      abouts: ['', 'https://blog1.com/trackback/456', ''],
    }
    const expected = {
      'trackback:about': ['https://blog1.com/trackback/456'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      ping: '   ',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings in about array', () => {
    const value = {
      abouts: ['   ', '  ', '\t'],
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(123)).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
  })

  it('should handle mixed valid and invalid values in about array', () => {
    const value = {
      abouts: ['https://blog1.com/trackback/456', '', '   ', 'https://blog2.com/trackback/789'],
    }
    const expected = {
      'trackback:about': ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty about array', () => {
    const value = {
      ping: 'https://example.com/trackback/123',
      abouts: [],
    }
    const expected = {
      'trackback:ping': 'https://example.com/trackback/123',
    }

    expect(generateItem(value)).toEqual(expected)
  })
})
