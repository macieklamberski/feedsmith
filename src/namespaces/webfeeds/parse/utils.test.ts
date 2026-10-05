import { describe, expect, it } from 'bun:test'
import {
  parseAnalytics,
  parseCover,
  parseFeaturedImage,
  parseRelated,
  retrieveFeed,
  retrieveItem,
} from './utils.js'

describe('parseCover', () => {
  it('should parse cover with image', () => {
    const value = {
      '@image': 'https://example.com/images/cover.png',
    }
    const expected = {
      image: 'https://example.com/images/cover.png',
    }

    expect(parseCover(value)).toEqual(expected)
  })

  it('should handle HTML entities in image', () => {
    const value = {
      '@image': 'https://example.com/icon.php?type=favicon&amp;size=256',
    }
    const expected = {
      image: 'https://example.com/icon.php?type=favicon&size=256',
    }

    expect(parseCover(value)).toEqual(expected)
  })

  it('should return undefined for empty image', () => {
    const value = {
      '@image': '',
    }

    expect(parseCover(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only image', () => {
    const value = {
      '@image': '   ',
    }

    expect(parseCover(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(parseCover({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseCover('string')).toBeUndefined()
    expect(parseCover(undefined)).toBeUndefined()
    expect(parseCover(null)).toBeUndefined()
    expect(parseCover([])).toBeUndefined()
  })
})

describe('parseRelated', () => {
  it('should parse related with all properties', () => {
    const value = {
      '@layout': 'card',
      '@target': 'browser',
    }
    const expected = {
      layout: 'card',
      target: 'browser',
    }

    expect(parseRelated(value)).toEqual(expected)
  })

  it('should parse related with only layout', () => {
    const value = {
      '@layout': 'card',
    }
    const expected = {
      layout: 'card',
    }

    expect(parseRelated(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseRelated({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseRelated('string')).toBeUndefined()
    expect(parseRelated(undefined)).toBeUndefined()
    expect(parseRelated(null)).toBeUndefined()
    expect(parseRelated([])).toBeUndefined()
  })
})

describe('parseAnalytics', () => {
  it('should parse analytics with all properties', () => {
    const value = {
      '@id': 'G-E1P00P5NYS',
      '@engine': 'GoogleAnalytics',
    }
    const expected = {
      id: 'G-E1P00P5NYS',
      engine: 'GoogleAnalytics',
    }

    expect(parseAnalytics(value)).toEqual(expected)
  })

  it('should parse analytics with only id', () => {
    const value = {
      '@id': 'UA-48687000-1',
    }
    const expected = {
      id: 'UA-48687000-1',
    }

    expect(parseAnalytics(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseAnalytics({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseAnalytics('string')).toBeUndefined()
    expect(parseAnalytics(undefined)).toBeUndefined()
    expect(parseAnalytics(null)).toBeUndefined()
    expect(parseAnalytics([])).toBeUndefined()
  })
})

describe('parseFeaturedImage', () => {
  it('should parse featured image with all properties', () => {
    const value = {
      '@url': 'https://example.com/images/logo-408x230.svg',
      '@type': 'image/svg',
      '@width': '408',
      '@height': '230',
    }
    const expected = {
      url: 'https://example.com/images/logo-408x230.svg',
      type: 'image/svg',
      width: 408,
      height: 230,
    }

    expect(parseFeaturedImage(value)).toEqual(expected)
  })

  it('should parse featured image with only url', () => {
    const value = {
      '@url': 'https://example.com/images/featured.jpg',
    }
    const expected = {
      url: 'https://example.com/images/featured.jpg',
    }

    expect(parseFeaturedImage(value)).toEqual(expected)
  })

  it('should skip non-numeric dimensions', () => {
    const value = {
      '@url': 'https://example.com/images/featured.jpg',
      '@width': 'auto',
    }
    const expected = {
      url: 'https://example.com/images/featured.jpg',
    }

    expect(parseFeaturedImage(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseFeaturedImage({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseFeaturedImage('string')).toBeUndefined()
    expect(parseFeaturedImage(undefined)).toBeUndefined()
    expect(parseFeaturedImage(null)).toBeUndefined()
    expect(parseFeaturedImage([])).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
    cover: { image: 'https://example.com/images/cover.png' },
    icon: 'https://example.com/images/icon.png',
    logo: 'https://example.com/images/logo.svg',
    accentColor: 'BE4825',
    related: { layout: 'card', target: 'browser' },
    analytics: { id: 'G-E1P00P5NYS', engine: 'GoogleAnalytics' },
    partial: true,
    wordmark: 'https://example.com/images/wordmark.svg',
  }

  it('should parse all feed properties (with #text)', () => {
    const value = {
      'webfeeds:cover': { '@image': 'https://example.com/images/cover.png' },
      'webfeeds:icon': { '#text': 'https://example.com/images/icon.png' },
      'webfeeds:logo': { '#text': 'https://example.com/images/logo.svg' },
      'webfeeds:accentcolor': { '#text': 'BE4825' },
      'webfeeds:related': { '@layout': 'card', '@target': 'browser' },
      'webfeeds:analytics': { '@id': 'G-E1P00P5NYS', '@engine': 'GoogleAnalytics' },
      'webfeeds:partial': { '#text': 'true' },
      'webfeeds:wordmark': { '#text': 'https://example.com/images/wordmark.svg' },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse all feed properties (without #text)', () => {
    const value = {
      'webfeeds:cover': { '@image': 'https://example.com/images/cover.png' },
      'webfeeds:icon': 'https://example.com/images/icon.png',
      'webfeeds:logo': 'https://example.com/images/logo.svg',
      'webfeeds:accentcolor': 'BE4825',
      'webfeeds:related': { '@layout': 'card', '@target': 'browser' },
      'webfeeds:analytics': { '@id': 'G-E1P00P5NYS', '@engine': 'GoogleAnalytics' },
      'webfeeds:partial': 'true',
      'webfeeds:wordmark': 'https://example.com/images/wordmark.svg',
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed properties from arrays (uses first)', () => {
    const value = {
      'webfeeds:cover': [
        { '@image': 'https://example.com/images/cover.png' },
        { '@image': 'https://example.com/images/other.png' },
      ],
      'webfeeds:icon': ['https://example.com/images/icon.png', 'https://example.com/other.png'],
      'webfeeds:logo': ['https://example.com/images/logo.svg'],
      'webfeeds:accentcolor': ['BE4825', '249F80'],
      'webfeeds:related': [{ '@layout': 'card', '@target': 'browser' }],
      'webfeeds:analytics': [{ '@id': 'G-E1P00P5NYS', '@engine': 'GoogleAnalytics' }],
      'webfeeds:partial': ['true', 'false'],
      'webfeeds:wordmark': ['https://example.com/images/wordmark.svg'],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with only icon', () => {
    const value = {
      'webfeeds:icon': 'https://example.com/images/icon.png',
    }
    const expected = {
      icon: 'https://example.com/images/icon.png',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse partial set to false', () => {
    const value = {
      'webfeeds:partial': 'false',
    }
    const expected = {
      partial: false,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'webfeeds:icon': { '#text': 'https://example.com/icon.png?v=1&amp;size=96' },
    }
    const expected = {
      icon: 'https://example.com/icon.png?v=1&size=96',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'webfeeds:logo': { '#text': '<![CDATA[https://example.com/images/logo.svg]]>' },
    }
    const expected = {
      logo: 'https://example.com/images/logo.svg',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle empty string values', () => {
    const value = {
      'webfeeds:icon': { '#text': '' },
      'webfeeds:accentcolor': { '#text': '249F80' },
    }
    const expected = {
      accentColor: '249F80',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'webfeeds:icon': { '#text': '   ' },
      'webfeeds:logo': { '#text': '\t\n' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse featured image', () => {
    const value = {
      'webfeeds:featuredimage': {
        '@url': 'https://example.com/images/logo-408x230.svg',
        '@height': '230',
        '@width': '408',
        '@type': 'image/svg',
      },
    }
    const expected = {
      featuredImage: {
        url: 'https://example.com/images/logo-408x230.svg',
        type: 'image/svg',
        width: 408,
        height: 230,
      },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse featured visual', () => {
    const value = {
      'webfeeds:featuredvisual': { '#text': 'https://example.com/images/featured.jpg' },
    }
    const expected = {
      featuredVisual: 'https://example.com/images/featured.jpg',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse featured visual wrapped in CDATA', () => {
    const value = {
      'webfeeds:featuredvisual': { '#text': '<![CDATA[https://example.com/images/featured.jpg]]>' },
    }
    const expected = {
      featuredVisual: 'https://example.com/images/featured.jpg',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for whitespace-only featured visual', () => {
    const value = {
      'webfeeds:featuredvisual': { '#text': '   ' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should parse featured image from array (uses first)', () => {
    const value = {
      'webfeeds:featuredimage': [
        { '@url': 'https://example.com/images/first.jpg' },
        { '@url': 'https://example.com/images/second.jpg' },
      ],
    }
    const expected = {
      featuredImage: {
        url: 'https://example.com/images/first.jpg',
      },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty featured image', () => {
    const value = {
      'webfeeds:featuredimage': {},
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})
