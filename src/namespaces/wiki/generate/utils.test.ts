import { describe, expect, it } from 'bun:test'
import { generateFeed, generateInterwiki, generateItem } from './utils.js'

describe('generateInterwiki', () => {
  it('should generate rdf:Description with moniker and link', () => {
    const value = {
      value: 'ExampleWiki',
      link: 'https://example.com/wiki.cgi?',
    }
    const expected = {
      'rdf:Description': {
        '@link': 'https://example.com/wiki.cgi?',
        'rdf:value': 'ExampleWiki',
      },
    }

    expect(generateInterwiki(value)).toEqual(expected)
  })

  it('should generate plain moniker without link', () => {
    const value = {
      value: 'OddMuse',
    }

    expect(generateInterwiki(value)).toBe('OddMuse')
  })

  it('should generate rdf:Description with only link', () => {
    const value = {
      link: 'https://example.com/wiki.cgi?',
    }
    const expected = {
      'rdf:Description': {
        '@link': 'https://example.com/wiki.cgi?',
      },
    }

    expect(generateInterwiki(value)).toEqual(expected)
  })

  it('should wrap moniker with special characters in CDATA', () => {
    const value = {
      value: 'Example & Wiki',
    }
    const expected = {
      '#cdata': 'Example & Wiki',
    }

    expect(generateInterwiki(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      value: '',
      link: '',
    }

    expect(generateInterwiki(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generateInterwiki({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateInterwiki('string')).toBeUndefined()
    expect(generateInterwiki(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateInterwiki(null)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with interwiki', () => {
    const value = {
      interwiki: {
        value: 'ExampleWiki',
        link: 'https://example.com/wiki.cgi?',
      },
    }
    const expected = {
      'wiki:interwiki': {
        'rdf:Description': {
          '@link': 'https://example.com/wiki.cgi?',
          'rdf:value': 'ExampleWiki',
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty interwiki', () => {
    const value = {
      interwiki: {},
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
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
      version: '24',
      status: 'updated',
      importance: 'minor',
      diff: 'https://example.com/wiki?action=browse;diff=1;id=SandBox',
      history: 'https://example.com/wiki?action=history;id=SandBox',
    }
    const expected = {
      'wiki:version': '24',
      'wiki:status': 'updated',
      'wiki:importance': 'minor',
      'wiki:diff': 'https://example.com/wiki?action=browse;diff=1;id=SandBox',
      'wiki:history': 'https://example.com/wiki?action=history;id=SandBox',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only status', () => {
    const value = {
      status: 'new',
    }
    const expected = {
      'wiki:status': 'new',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should leave out host', () => {
    const value = {
      host: '192.0.2.10',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should wrap urls with ampersands in CDATA', () => {
    const value = {
      diff: 'https://example.com/?p=SandBox&a=diff',
    }
    const expected = {
      'wiki:diff': { '#cdata': 'https://example.com/?p=SandBox&a=diff' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      version: '',
      status: '',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined for whitespace only', () => {
    const value = {
      status: '   ',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})
