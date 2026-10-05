import { describe, expect, it } from 'bun:test'
import {
  generateAnalytics,
  generateCover,
  generateFeaturedImage,
  generateFeed,
  generateItem,
  generateRelated,
} from './utils.js'

describe('generateCover', () => {
  it('should generate cover with image', () => {
    const value = {
      image: 'https://example.com/images/cover.png',
    }
    const expected = {
      '@image': 'https://example.com/images/cover.png',
    }

    expect(generateCover(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      image: '',
    }

    expect(generateCover(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      image: '   ',
    }

    expect(generateCover(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateCover({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateCover('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCover(123)).toBeUndefined()
    expect(generateCover(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCover(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCover([])).toBeUndefined()
  })
})

describe('generateRelated', () => {
  it('should generate related with all properties', () => {
    const value = {
      layout: 'card',
      target: 'browser',
    }
    const expected = {
      '@layout': 'card',
      '@target': 'browser',
    }

    expect(generateRelated(value)).toEqual(expected)
  })

  it('should generate related with only layout', () => {
    const value = {
      layout: 'card',
    }
    const expected = {
      '@layout': 'card',
    }

    expect(generateRelated(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateRelated({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateRelated('string')).toBeUndefined()
    expect(generateRelated(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateRelated(null)).toBeUndefined()
  })
})

describe('generateAnalytics', () => {
  it('should generate analytics with all properties', () => {
    const value = {
      id: 'G-E1P00P5NYS',
      engine: 'GoogleAnalytics',
    }
    const expected = {
      '@id': 'G-E1P00P5NYS',
      '@engine': 'GoogleAnalytics',
    }

    expect(generateAnalytics(value)).toEqual(expected)
  })

  it('should generate analytics with only id', () => {
    const value = {
      id: 'UA-48687000-1',
    }
    const expected = {
      '@id': 'UA-48687000-1',
    }

    expect(generateAnalytics(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateAnalytics({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateAnalytics('string')).toBeUndefined()
    expect(generateAnalytics(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateAnalytics(null)).toBeUndefined()
  })
})

describe('generateFeaturedImage', () => {
  it('should generate featured image with all properties', () => {
    const value = {
      url: 'https://example.com/images/logo-408x230.svg',
      type: 'image/svg',
      width: 408,
      height: 230,
    }
    const expected = {
      '@url': 'https://example.com/images/logo-408x230.svg',
      '@type': 'image/svg',
      '@width': 408,
      '@height': 230,
    }

    expect(generateFeaturedImage(value)).toEqual(expected)
  })

  it('should generate featured image with only url', () => {
    const value = {
      url: 'https://example.com/images/featured.jpg',
    }
    const expected = {
      '@url': 'https://example.com/images/featured.jpg',
    }

    expect(generateFeaturedImage(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    expect(generateFeaturedImage({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeaturedImage('string')).toBeUndefined()
    expect(generateFeaturedImage(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeaturedImage(null)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      cover: { image: 'https://example.com/images/cover.png' },
      icon: 'https://example.com/images/icon.png',
      logo: 'https://example.com/images/logo.svg',
      accentColor: 'BE4825',
      related: { layout: 'card', target: 'browser' },
      analytics: { id: 'G-E1P00P5NYS', engine: 'GoogleAnalytics' },
      partial: true,
    }
    const expected = {
      'webfeeds:cover': { '@image': 'https://example.com/images/cover.png' },
      'webfeeds:icon': 'https://example.com/images/icon.png',
      'webfeeds:logo': 'https://example.com/images/logo.svg',
      'webfeeds:accentColor': 'BE4825',
      'webfeeds:related': { '@layout': 'card', '@target': 'browser' },
      'webfeeds:analytics': { '@id': 'G-E1P00P5NYS', '@engine': 'GoogleAnalytics' },
      'webfeeds:partial': true,
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only icon', () => {
    const value = {
      icon: 'https://example.com/images/icon.png',
    }
    const expected = {
      'webfeeds:icon': 'https://example.com/images/icon.png',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate partial set to false', () => {
    const value = {
      partial: false,
    }
    const expected = {
      'webfeeds:partial': false,
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should wrap HTML entities in CDATA', () => {
    const value = {
      icon: 'https://example.com/icon.png?v=1&size=96',
    }
    const expected = {
      'webfeeds:icon': { '#cdata': 'https://example.com/icon.png?v=1&size=96' },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      icon: '',
      accentColor: '249F80',
    }
    const expected = {
      'webfeeds:accentColor': '249F80',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      icon: '   ',
      logo: '\t\n',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed([])).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with featured image', () => {
    const value = {
      featuredImage: {
        url: 'https://example.com/images/logo-408x230.svg',
        type: 'image/svg',
        width: 408,
        height: 230,
      },
    }
    const expected = {
      'webfeeds:featuredImage': {
        '@url': 'https://example.com/images/logo-408x230.svg',
        '@type': 'image/svg',
        '@width': 408,
        '@height': 230,
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty featured image', () => {
    const value = {
      featuredImage: {},
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
  })
})
