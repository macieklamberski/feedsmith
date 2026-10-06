import { describe, expect, it } from 'bun:test'
import { parseHost, parseInterwiki, retrieveFeed, retrieveHost, retrieveItem } from './utils.js'

describe('parseInterwiki', () => {
  it('should parse plain text moniker', () => {
    const value = 'OddMuse'
    const expected = {
      value: 'OddMuse',
    }

    expect(parseInterwiki(value)).toEqual(expected)
  })

  it('should parse moniker with #text', () => {
    const value = { '#text': 'OddMuse' }
    const expected = {
      value: 'OddMuse',
    }

    expect(parseInterwiki(value)).toEqual(expected)
  })

  it('should parse rdf:Description with moniker and link', () => {
    const value = {
      'rdf:description': {
        '@link': 'https://example.com/wiki.cgi?',
        'rdf:value': { '#text': 'ExampleWiki' },
      },
    }
    const expected = {
      value: 'ExampleWiki',
      link: 'https://example.com/wiki.cgi?',
    }

    expect(parseInterwiki(value)).toEqual(expected)
  })

  it('should parse unprefixed description and value from RDF feeds', () => {
    const value = {
      description: {
        '@link': 'https://example.com/wiki.cgi?',
        value: 'ExampleWiki',
      },
    }
    const expected = {
      value: 'ExampleWiki',
      link: 'https://example.com/wiki.cgi?',
    }

    expect(parseInterwiki(value)).toEqual(expected)
  })

  it('should parse rdf:Description with rss:link attribute', () => {
    const value = {
      'rdf:description': {
        '@rss:link': 'https://example.com/wiki.cgi?',
        'rdf:value': 'ExampleWiki',
      },
    }
    const expected = {
      value: 'ExampleWiki',
      link: 'https://example.com/wiki.cgi?',
    }

    expect(parseInterwiki(value)).toEqual(expected)
  })

  it('should parse rdf:Description with only link', () => {
    const value = {
      'rdf:description': {
        '@link': 'https://example.com/wiki.cgi',
        'rdf:value': '',
      },
    }
    const expected = {
      link: 'https://example.com/wiki.cgi',
    }

    expect(parseInterwiki(value)).toEqual(expected)
  })

  it('should handle HTML entities', () => {
    const value = 'Example &amp; Wiki'
    const expected = {
      value: 'Example & Wiki',
    }

    expect(parseInterwiki(value)).toEqual(expected)
  })

  it('should handle CDATA', () => {
    const value = '<![CDATA[ExampleWiki]]>'
    const expected = {
      value: 'ExampleWiki',
    }

    expect(parseInterwiki(value)).toEqual(expected)
  })

  it('should return undefined for empty string', () => {
    expect(parseInterwiki('')).toBeUndefined()
  })

  it('should return undefined for whitespace only', () => {
    expect(parseInterwiki('   ')).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(parseInterwiki({})).toBeUndefined()
  })

  it('should return undefined for non-string inputs', () => {
    expect(parseInterwiki(undefined)).toBeUndefined()
    expect(parseInterwiki(null)).toBeUndefined()
    expect(parseInterwiki(true)).toBeUndefined()
  })
})

describe('parseHost', () => {
  it('should read host from raw rdf:Description markup', () => {
    const value =
      '<rdf:Description wiki:host="192.0.2.10"><rdf:value>Mary McConnell</rdf:value></rdf:Description>'

    expect(parseHost(value)).toBe('192.0.2.10')
  })

  it('should read host with #text', () => {
    const value = {
      '#text':
        '<rdf:Description wiki:host="192.0.2.10"><rdf:value>Mary</rdf:value></rdf:Description>',
    }

    expect(parseHost(value)).toBe('192.0.2.10')
  })

  it('should read host in single quotes', () => {
    const value =
      "<rdf:Description wiki:host='192.0.2.10'><rdf:value>Mary</rdf:value></rdf:Description>"

    expect(parseHost(value)).toBe('192.0.2.10')
  })

  it('should read host after other attributes', () => {
    const value = `
      <rdf:Description
        link="https://example.com/?MaryMcConnell"
        wiki:host="192.0.2.10"
      >
        <rdf:value>Mary McConnell</rdf:value>
      </rdf:Description>
    `

    expect(parseHost(value)).toBe('192.0.2.10')
  })

  it('should return undefined for plain text contributor', () => {
    expect(parseHost('Mary McConnell')).toBeUndefined()
  })

  it('should return undefined for rdf:Description without host', () => {
    const value = '<rdf:Description><rdf:value>Mary McConnell</rdf:value></rdf:Description>'

    expect(parseHost(value)).toBeUndefined()
  })

  it('should return undefined for empty host', () => {
    const value = '<rdf:Description wiki:host=""><rdf:value>Mary</rdf:value></rdf:Description>'

    expect(parseHost(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(parseHost({})).toBeUndefined()
  })

  it('should return undefined for non-string inputs', () => {
    expect(parseHost(undefined)).toBeUndefined()
    expect(parseHost(null)).toBeUndefined()
    expect(parseHost(123)).toBeUndefined()
  })
})

describe('retrieveHost', () => {
  it('should read host from first dc:contributor carrying one', () => {
    const value = [
      'Mary McConnell',
      '<rdf:Description wiki:host="192.0.2.10"><rdf:value>Mary</rdf:value></rdf:Description>',
      '<rdf:Description wiki:host="192.0.2.20"><rdf:value>Joe</rdf:value></rdf:Description>',
    ]

    expect(retrieveHost(value)).toBe('192.0.2.10')
  })

  it('should return undefined when no dc:contributor carries host', () => {
    expect(retrieveHost(['Mary McConnell', 'Joe User'])).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveHost(undefined)).toBeUndefined()
    expect(retrieveHost(null)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse feed with plain interwiki', () => {
    const value = {
      'wiki:interwiki': { '#text': 'OddMuse' },
    }
    const expected = {
      interwiki: { value: 'OddMuse' },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with nested interwiki', () => {
    const value = {
      'wiki:interwiki': {
        'rdf:description': {
          '@link': 'https://example.com/wiki.cgi?',
          'rdf:value': 'ExampleWiki',
        },
      },
    }
    const expected = {
      interwiki: {
        value: 'ExampleWiki',
        link: 'https://example.com/wiki.cgi?',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should use first interwiki when multiple present', () => {
    const value = {
      'wiki:interwiki': [{ '#text': 'FirstWiki' }, { '#text': 'SecondWiki' }],
    }
    const expected = {
      interwiki: { value: 'FirstWiki' },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty interwiki', () => {
    const value = {
      'wiki:interwiki': '',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse all item properties', () => {
    const value = {
      'dc:contributor':
        '<rdf:Description wiki:host="192.0.2.10"><rdf:value>Mary McConnell</rdf:value></rdf:Description>',
      'wiki:version': { '#text': '24' },
      'wiki:status': { '#text': 'updated' },
      'wiki:importance': { '#text': 'minor' },
      'wiki:diff': { '#text': 'https://example.com/wiki?action=browse;diff=1;id=SandBox' },
      'wiki:history': { '#text': 'https://example.com/wiki?action=history;id=SandBox' },
    }
    const expected = {
      host: '192.0.2.10',
      version: '24',
      status: 'updated',
      importance: 'minor',
      diff: 'https://example.com/wiki?action=browse;diff=1;id=SandBox',
      history: 'https://example.com/wiki?action=history;id=SandBox',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only status', () => {
    const value = {
      'wiki:status': 'deleted',
    }
    const expected = {
      status: 'deleted',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in urls', () => {
    const value = {
      'wiki:diff': 'https://example.com/?p=SandBox&amp;a=diff',
    }
    const expected = {
      diff: 'https://example.com/?p=SandBox&a=diff',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA', () => {
    const value = {
      'wiki:version': '<![CDATA[v23]]>',
    }
    const expected = {
      version: 'v23',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should use first value when multiple present', () => {
    const value = {
      'wiki:importance': ['major', 'minor'],
    }
    const expected = {
      importance: 'major',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should ignore plain text dc:contributor', () => {
    const value = {
      'dc:contributor': 'Mary McConnell',
      'wiki:status': 'new',
    }
    const expected = {
      status: 'new',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      'wiki:version': '',
      'wiki:status': '',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for whitespace only', () => {
    const value = {
      'wiki:status': '   ',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})
