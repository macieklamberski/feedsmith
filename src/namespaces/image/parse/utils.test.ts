import { describe, expect, it } from 'bun:test'
import { parseFavicon, parseImage, retrieveFeed, retrieveItem } from './utils.js'

describe('parseImage', () => {
  it('should parse image with all properties', () => {
    const value = {
      '@rdf:about': 'https://example.com/images/topics/culture.jpg',
      '@rdf:resource': 'https://example.com/stories/culture',
      'image:width': { '#text': '80' },
      'image:height': { '#text': '50' },
      'dc:title': { '#text': 'Culture' },
    }
    const expected = {
      about: 'https://example.com/images/topics/culture.jpg',
      resource: 'https://example.com/stories/culture',
      width: 80,
      height: 50,
      dc: { titles: ['Culture'] },
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should parse image with only about', () => {
    const value = {
      '@rdf:about': 'https://example.com/covers/2018-04-23.jpg',
    }
    const expected = {
      about: 'https://example.com/covers/2018-04-23.jpg',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should parse image with only resource', () => {
    const value = {
      '@rdf:resource': 'https://example.com/documents/images/2019/sass.jpg',
    }
    const expected = {
      resource: 'https://example.com/documents/images/2019/sass.jpg',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should parse about and resource without the rdf prefix', () => {
    const value = {
      '@about': 'https://example.com/images/topics/culture.jpg',
      '@resource': 'https://example.com/stories/culture',
    }
    const expected = {
      about: 'https://example.com/images/topics/culture.jpg',
      resource: 'https://example.com/stories/culture',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should prefer unprefixed about and resource when both spellings are present', () => {
    const value = {
      '@about': 'https://example.com/unprefixed.jpg',
      '@rdf:about': 'https://example.com/prefixed.jpg',
      '@resource': 'https://example.com/unprefixed',
      '@rdf:resource': 'https://example.com/prefixed',
    }
    const expected = {
      about: 'https://example.com/unprefixed.jpg',
      resource: 'https://example.com/unprefixed',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should fall back to prefixed about and resource when unprefixed are empty', () => {
    const value = {
      '@about': '',
      '@rdf:about': 'https://example.com/prefixed.jpg',
      '@resource': '   ',
      '@rdf:resource': 'https://example.com/prefixed',
    }
    const expected = {
      about: 'https://example.com/prefixed.jpg',
      resource: 'https://example.com/prefixed',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should parse width and height from strings', () => {
    const value = {
      'image:width': '1920',
      'image:height': '1080',
    }
    const expected = {
      width: 1920,
      height: 1080,
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should handle HTML entities in attributes and title', () => {
    const value = {
      '@rdf:about': 'https://example.com/thumb?id=1&amp;size=small',
      'dc:title': { '#text': 'Rencontres &amp; Journ&#233;es' },
    }
    const expected = {
      about: 'https://example.com/thumb?id=1&size=small',
      dc: { titles: ['Rencontres & Journées'] },
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should handle CDATA sections in title', () => {
    const value = {
      'dc:title': { '#text': '<![CDATA[Culture]]>' },
    }
    const expected = {
      dc: { titles: ['Culture'] },
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should skip invalid width and height', () => {
    const value = {
      '@rdf:about': 'https://example.com/image.png',
      'image:width': { '#text': 'wide' },
      'image:height': { '#text': 'tall' },
    }
    const expected = {
      about: 'https://example.com/image.png',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      '@rdf:about': '',
      'image:width': { '#text': '' },
    }

    expect(parseImage(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      '@rdf:about': '   ',
      'image:height': { '#text': '   ' },
    }

    expect(parseImage(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseImage(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseImage('string')).toBeUndefined()
    expect(parseImage(123)).toBeUndefined()
    expect(parseImage(undefined)).toBeUndefined()
    expect(parseImage(null)).toBeUndefined()
  })

  it('should return undefined for array input', () => {
    expect(parseImage([])).toBeUndefined()
  })
})

describe('parseFavicon', () => {
  it('should parse favicon with all properties', () => {
    const value = {
      '@rdf:about': 'https://example.com/favicon.ico',
      '@image:size': 'small',
      'dc:title': { '#text': 'Example Diary' },
    }
    const expected = {
      about: 'https://example.com/favicon.ico',
      size: 'small',
      dc: { titles: ['Example Diary'] },
    }

    expect(parseFavicon(value)).toEqual(expected)
  })

  it('should parse favicon with only about', () => {
    const value = {
      '@rdf:about': 'https://example.com/favicon.ico',
    }
    const expected = {
      about: 'https://example.com/favicon.ico',
    }

    expect(parseFavicon(value)).toEqual(expected)
  })

  it('should parse about without the rdf prefix', () => {
    const value = {
      '@about': 'https://example.com/favicon.ico',
    }
    const expected = {
      about: 'https://example.com/favicon.ico',
    }

    expect(parseFavicon(value)).toEqual(expected)
  })

  it('should prefer unprefixed about when both spellings are present', () => {
    const value = {
      '@about': 'https://example.com/unprefixed.ico',
      '@rdf:about': 'https://example.com/prefixed.ico',
    }
    const expected = {
      about: 'https://example.com/unprefixed.ico',
    }

    expect(parseFavicon(value)).toEqual(expected)
  })

  it('should fall back to prefixed about when unprefixed is empty', () => {
    const value = {
      '@about': '',
      '@rdf:about': 'https://example.com/prefixed.ico',
    }
    const expected = {
      about: 'https://example.com/prefixed.ico',
    }

    expect(parseFavicon(value)).toEqual(expected)
  })

  it('should handle HTML entities in title', () => {
    const value = {
      'dc:title': { '#text': 'Camp &amp; Check' },
    }
    const expected = {
      dc: { titles: ['Camp & Check'] },
    }

    expect(parseFavicon(value)).toEqual(expected)
  })

  it('should handle CDATA sections in title', () => {
    const value = {
      'dc:title': { '#text': '<![CDATA[Example Diary]]>' },
    }
    const expected = {
      dc: { titles: ['Example Diary'] },
    }

    expect(parseFavicon(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      '@rdf:about': '',
      '@image:size': '',
    }

    expect(parseFavicon(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      '@rdf:about': '   ',
      '@image:size': '   ',
    }

    expect(parseFavicon(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseFavicon(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseFavicon('string')).toBeUndefined()
    expect(parseFavicon(123)).toBeUndefined()
    expect(parseFavicon(undefined)).toBeUndefined()
    expect(parseFavicon(null)).toBeUndefined()
  })

  it('should return undefined for array input', () => {
    expect(parseFavicon([])).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse favicon', () => {
    const value = {
      'image:favicon': {
        '@image:size': 'small',
        '@rdf:about': 'https://example.com/far.ico',
        'dc:title': { '#text': 'https://example.com/far.ico' },
      },
    }
    const expected = {
      favicon: {
        about: 'https://example.com/far.ico',
        size: 'small',
        dc: { titles: ['https://example.com/far.ico'] },
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should use first favicon when multiple are present', () => {
    const value = {
      'image:favicon': [
        { '@rdf:about': 'https://example.com/favicon-16.ico', '@image:size': 'small' },
        { '@rdf:about': 'https://example.com/favicon-32.ico', '@image:size': 'medium' },
      ],
    }
    const expected = {
      favicon: {
        about: 'https://example.com/favicon-16.ico',
        size: 'small',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty favicon', () => {
    const value = {
      'image:favicon': {},
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
  })

  it('should return undefined for array input', () => {
    expect(retrieveFeed([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse item with all properties', () => {
    const value = {
      'image:item': {
        '@rdf:about': 'https://example.com/edito/rencontres/image_thumb',
        'dc:title': { '#text': 'Rencontres internationales' },
        'image:width': { '#text': '80' },
        'image:height': { '#text': '50' },
      },
      'image:favicon': {
        '@rdf:about': 'https://example.com/favicon.ico',
        '@image:size': 'small',
      },
    }
    const expected = {
      item: {
        about: 'https://example.com/edito/rencontres/image_thumb',
        width: 80,
        height: 50,
        dc: { titles: ['Rencontres internationales'] },
      },
      favicon: {
        about: 'https://example.com/favicon.ico',
        size: 'small',
      },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only image', () => {
    const value = {
      'image:item': {
        '@rdf:about': 'https://example.com/covers/2018-04-23.jpg',
        'image:width': { '#text': '1920' },
        'image:height': { '#text': '1080' },
      },
    }
    const expected = {
      item: {
        about: 'https://example.com/covers/2018-04-23.jpg',
        width: 1920,
        height: 1080,
      },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should use first image when multiple are present', () => {
    const value = {
      'image:item': [
        { '@rdf:about': 'https://example.com/first.jpg' },
        { '@rdf:about': 'https://example.com/second.jpg' },
      ],
    }
    const expected = {
      item: {
        about: 'https://example.com/first.jpg',
      },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty image and favicon', () => {
    const value = {
      'image:item': {},
      'image:favicon': {},
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
  })

  it('should return undefined for array input', () => {
    expect(retrieveItem([])).toBeUndefined()
  })
})
