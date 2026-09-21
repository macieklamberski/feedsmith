import { describe, expect, it } from 'bun:test'
import { generateFeed, generateFeedFlare, generateInfo, generateItem } from './utils.js'

describe('generateInfo', () => {
  it('should generate info with uri attribute', () => {
    const expected = { '@uri': 'exampleblog' }

    expect(generateInfo('exampleblog')).toEqual(expected)
  })

  it('should handle empty string', () => {
    expect(generateInfo('')).toBeUndefined()
  })

  it('should handle whitespace-only string', () => {
    expect(generateInfo('   ')).toBeUndefined()
  })

  it('should handle non-string inputs', () => {
    expect(generateInfo(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateInfo(123)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateInfo(null)).toBeUndefined()
  })
})

describe('generateFeedFlare', () => {
  it('should generate feed flare with all properties', () => {
    const value = {
      href: 'https://add.my.yahoo.com/rss?url=https://example.com/feed',
      src: 'https://us.i1.yimg.com/addtomyyahoo4.gif',
      value: 'Add to My Yahoo',
    }
    const expected = {
      '@href': 'https://add.my.yahoo.com/rss?url=https://example.com/feed',
      '@src': 'https://us.i1.yimg.com/addtomyyahoo4.gif',
      '#text': 'Add to My Yahoo',
    }

    expect(generateFeedFlare(value)).toEqual(expected)
  })

  it('should generate feed flare with no text content', () => {
    const value = {
      href: 'https://fusion.google.com/add?feedurl=https://example.com/feed',
      src: 'https://buttons.googlesyndication.com/fusion/add.gif',
    }
    const expected = {
      '@href': 'https://fusion.google.com/add?feedurl=https://example.com/feed',
      '@src': 'https://buttons.googlesyndication.com/fusion/add.gif',
    }

    expect(generateFeedFlare(value)).toEqual(expected)
  })

  it('should wrap text containing special characters in CDATA', () => {
    const value = {
      href: 'https://add.example.com/a',
      src: 'https://img.example.com/a.gif',
      value: 'Add to <My> Yahoo & More',
    }
    const expected = {
      '@href': 'https://add.example.com/a',
      '@src': 'https://img.example.com/a.gif',
      '#cdata': 'Add to <My> Yahoo & More',
    }

    expect(generateFeedFlare(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      href: '   ',
      src: '\t\n',
      value: '   ',
    }

    expect(generateFeedFlare(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateFeedFlare({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateFeedFlare(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeedFlare('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeedFlare(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeedFlare([])).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      origLink: 'https://example.com/2024/01/post.html',
      origEnclosureLink: 'https://example.com/audio.mp3',
      awareness: 'https://feedburner.google.com/awareness/1.0/data/example/item',
    }
    const expected = {
      'feedburner:origLink': 'https://example.com/2024/01/post.html',
      'feedburner:origEnclosureLink': 'https://example.com/audio.mp3',
      'feedburner:awareness': 'https://feedburner.google.com/awareness/1.0/data/example/item',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should wrap a value containing an ampersand in CDATA', () => {
    const value = { origLink: 'https://example.com/?a=1&b=2' }
    const expected = { 'feedburner:origLink': { '#cdata': 'https://example.com/?a=1&b=2' } }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = { origLink: '', origEnclosureLink: 'https://example.com/audio.mp3' }
    const expected = { 'feedburner:origEnclosureLink': 'https://example.com/audio.mp3' }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      origLink: '   ',
      origEnclosureLink: '\t\n',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      info: '1000awesomethings',
      feedFlares: [{ href: 'https://add.example.com/a', src: 'https://img.example.com/a.gif' }],
      browserFriendly: 'This is an XML content feed.',
      emailServiceId: 'ChrisPirillo',
      feedburnerHostname: 'https://feedburner.google.com',
      awareness: 'https://feedburner.google.com/awareness/1000awesomethings',
    }
    const expected = {
      'feedburner:info': { '@uri': '1000awesomethings' },
      'feedburner:feedFlare': [
        { '@href': 'https://add.example.com/a', '@src': 'https://img.example.com/a.gif' },
      ],
      'feedburner:browserFriendly': 'This is an XML content feed.',
      'feedburner:emailServiceId': 'ChrisPirillo',
      'feedburner:feedburnerHostname': 'https://feedburner.google.com',
      'feedburner:awareness': 'https://feedburner.google.com/awareness/1000awesomethings',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate info as a uri attribute', () => {
    const value = { info: 'QQQQ' }
    const expected = { 'feedburner:info': { '@uri': 'QQQQ' } }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should wrap text containing special characters in CDATA', () => {
    const value = { browserFriendly: 'Subscribe <now> & read later' }
    const expected = {
      'feedburner:browserFriendly': { '#cdata': 'Subscribe <now> & read later' },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      info: '',
      browserFriendly: '',
      emailServiceId: 'ExampleBlog',
    }
    const expected = { 'feedburner:emailServiceId': 'ExampleBlog' }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      info: '   ',
      browserFriendly: '\t\n',
      awareness: '   ',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed([])).toBeUndefined()
  })
})
