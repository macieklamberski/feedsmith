import { describe, expect, it } from 'bun:test'
import { retrieveItem } from './utils.js'

describe('retrieveItem', () => {
  it('should parse complete item with all properties', () => {
    const value = {
      'trackback:ping': 'https://example.com/trackback/123',
      'trackback:about': ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
    }
    const expected = {
      ping: 'https://example.com/trackback/123',
      about: ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only ping property', () => {
    const value = {
      'trackback:ping': 'https://example.com/trackback/123',
    }
    const expected = {
      ping: 'https://example.com/trackback/123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only about property', () => {
    const value = {
      'trackback:about': ['https://blog1.com/trackback/456'],
    }
    const expected = {
      about: ['https://blog1.com/trackback/456'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with single about value', () => {
    const value = {
      'trackback:about': 'https://blog1.com/trackback/456',
    }
    const expected = {
      about: ['https://blog1.com/trackback/456'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with multiple about values', () => {
    const value = {
      'trackback:about': [
        'https://blog1.com/trackback/456',
        'https://blog2.com/trackback/789',
        'https://blog3.com/trackback/abc',
      ],
    }
    const expected = {
      about: [
        'https://blog1.com/trackback/456',
        'https://blog2.com/trackback/789',
        'https://blog3.com/trackback/abc',
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'trackback:ping': { '#text': 'https://example.com/track?id=1&amp;key=abc' },
    }
    const expected = {
      ping: 'https://example.com/track?id=1&key=abc',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in about array', () => {
    const value = {
      'trackback:about': [
        { '#text': 'https://blog1.com/track?id=1&amp;key=abc' },
        { '#text': 'https://blog2.com/track?id=2&amp;key=def' },
      ],
    }
    const expected = {
      about: ['https://blog1.com/track?id=1&key=abc', 'https://blog2.com/track?id=2&key=def'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'trackback:ping': { '#text': '<![CDATA[https://example.com/trackback/123]]>' },
    }
    const expected = {
      ping: 'https://example.com/trackback/123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections in about array', () => {
    const value = {
      'trackback:about': [
        { '#text': '<![CDATA[https://blog1.com/trackback/456]]>' },
        { '#text': '<![CDATA[https://blog2.com/trackback/789]]>' },
      ],
    }
    const expected = {
      about: ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'trackback:ping': '',
      'trackback:about': ['https://blog1.com/trackback/456'],
    }
    const expected = {
      about: ['https://blog1.com/trackback/456'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle empty strings in about array', () => {
    const value = {
      'trackback:about': ['', 'https://blog1.com/trackback/456', ''],
    }
    const expected = {
      about: ['https://blog1.com/trackback/456'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'trackback:ping': '   ',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings in about array', () => {
    const value = {
      'trackback:about': ['   ', '  ', '\t'],
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
  })

  it('should handle mixed valid and invalid values in about array', () => {
    const value = {
      'trackback:about': [
        'https://blog1.com/trackback/456',
        '',
        '   ',
        'https://blog2.com/trackback/789',
      ],
    }
    const expected = {
      about: ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle about array with objects containing #text', () => {
    const value = {
      'trackback:about': [
        { '#text': 'https://blog1.com/trackback/456' },
        { '#text': 'https://blog2.com/trackback/789' },
      ],
    }
    const expected = {
      about: ['https://blog1.com/trackback/456', 'https://blog2.com/trackback/789'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })
})
