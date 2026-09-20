import { describe, expect, it } from 'bun:test'
import { parseFeedFlare, retrieveFeed, retrieveItem } from './utils.js'

describe('parseFeedFlare', () => {
  it('should parse feed flare with all properties', () => {
    const value = {
      '@href': 'https://add.my.yahoo.com/rss?url=https://example.com/feed',
      '@src': 'https://us.i1.yimg.com/addtomyyahoo4.gif',
      '#text': 'Add to My Yahoo',
    }
    const expected = {
      href: 'https://add.my.yahoo.com/rss?url=https://example.com/feed',
      src: 'https://us.i1.yimg.com/addtomyyahoo4.gif',
      value: 'Add to My Yahoo',
    }

    expect(parseFeedFlare(value)).toEqual(expected)
  })

  it('should parse feed flare with no text content', () => {
    const value = {
      '@href': 'https://fusion.google.com/add?feedurl=https://example.com/feed',
      '@src': 'https://buttons.googlesyndication.com/fusion/add.gif',
    }
    const expected = {
      href: 'https://fusion.google.com/add?feedurl=https://example.com/feed',
      src: 'https://buttons.googlesyndication.com/fusion/add.gif',
    }

    expect(parseFeedFlare(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseFeedFlare({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseFeedFlare(null)).toBeUndefined()
    expect(parseFeedFlare(undefined)).toBeUndefined()
    expect(parseFeedFlare('string')).toBeUndefined()
    expect(parseFeedFlare(123)).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse complete item with all properties', () => {
    const value = {
      'feedburner:origlink': 'https://example.com/2024/01/post.html',
      'feedburner:origenclosurelink': 'https://example.com/audio.mp3',
    }
    const expected = {
      origLink: 'https://example.com/2024/01/post.html',
      origEnclosureLink: 'https://example.com/audio.mp3',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only origLink', () => {
    const value = { 'feedburner:origlink': 'https://example.com/2024/01/post.html' }
    const expected = { origLink: 'https://example.com/2024/01/post.html' }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = { 'feedburner:origlink': { '#text': 'https://example.com/?a=1&amp;b=2' } }
    const expected = { origLink: 'https://example.com/?a=1&b=2' }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'feedburner:origlink': { '#text': '<![CDATA[https://example.com/post]]>' },
    }
    const expected = { origLink: 'https://example.com/post' }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'feedburner:origlink': '',
      'feedburner:origenclosurelink': 'https://example.com/audio.mp3',
    }
    const expected = { origEnclosureLink: 'https://example.com/audio.mp3' }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = { 'feedburner:origlink': '   ' }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse complete feed with all properties', () => {
    const value = {
      'feedburner:info': { '@uri': '1000awesomethings' },
      'feedburner:feedflare': [
        { '@href': 'https://add.example.com/a', '@src': 'https://img.example.com/a.gif' },
        { '@href': 'https://add.example.com/b', '@src': 'https://img.example.com/b.gif' },
      ],
      'feedburner:browserfriendly': 'This is an XML content feed.',
      'feedburner:emailserviceid': 'ChrisPirillo',
      'feedburner:feedburnerhostname': 'https://feedburner.google.com',
      'feedburner:awareness': 'https://feedburner.google.com/awareness/1000awesomethings',
    }
    const expected = {
      info: '1000awesomethings',
      feedFlares: [
        { href: 'https://add.example.com/a', src: 'https://img.example.com/a.gif' },
        { href: 'https://add.example.com/b', src: 'https://img.example.com/b.gif' },
      ],
      browserFriendly: 'This is an XML content feed.',
      emailServiceId: 'ChrisPirillo',
      feedburnerHostname: 'https://feedburner.google.com',
      awareness: 'https://feedburner.google.com/awareness/1000awesomethings',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse the info uri attribute from a self-closing element', () => {
    const value = { 'feedburner:info': { '@uri': 'QQQQ' } }
    const expected = { info: 'QQQQ' }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse a single feed flare into an array', () => {
    const value = {
      'feedburner:feedflare': {
        '@href': 'https://add.example.com/a',
        '@src': 'https://img.example.com/a.gif',
      },
    }
    const expected = {
      feedFlares: [{ href: 'https://add.example.com/a', src: 'https://img.example.com/a.gif' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for an info element with no uri', () => {
    const value = { 'feedburner:info': {} }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
  })
})
