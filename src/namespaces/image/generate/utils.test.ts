import { describe, expect, it } from 'bun:test'
import { generateFavicon, generateFeed, generateImage, generateItem } from './utils.js'

describe('generateImage', () => {
  it('should generate image with all properties', () => {
    const value = {
      about: 'https://example.com/images/topics/culture.jpg',
      resource: 'https://example.com/stories/culture',
      width: 80,
      height: 50,
      dc: { titles: ['Culture'] },
    }
    const expected = {
      '@rdf:about': 'https://example.com/images/topics/culture.jpg',
      '@rdf:resource': 'https://example.com/stories/culture',
      'image:width': 80,
      'image:height': 50,
      'dc:title': ['Culture'],
    }

    expect(generateImage(value)).toEqual(expected)
  })

  it('should generate image with only about', () => {
    const value = {
      about: 'https://example.com/covers/2018-04-23.jpg',
    }
    const expected = {
      '@rdf:about': 'https://example.com/covers/2018-04-23.jpg',
    }

    expect(generateImage(value)).toEqual(expected)
  })

  it('should generate zero width and height', () => {
    const value = {
      width: 0,
      height: 0,
    }
    const expected = {
      'image:width': 0,
      'image:height': 0,
    }

    expect(generateImage(value)).toEqual(expected)
  })

  it('should wrap title with special characters in CDATA', () => {
    const value = {
      dc: { titles: ['Rencontres & Journées'] },
    }
    const expected = {
      'dc:title': [{ '#cdata': 'Rencontres & Journées' }],
    }

    expect(generateImage(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      about: '',
      resource: 'https://example.com/stories/culture',
    }
    const expected = {
      '@rdf:resource': 'https://example.com/stories/culture',
    }

    expect(generateImage(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      about: '   ',
      resource: '\t\n',
    }

    expect(generateImage(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateImage(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateImage('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateImage(123)).toBeUndefined()
    expect(generateImage(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateImage(null)).toBeUndefined()
  })

  it('should handle array input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateImage([])).toBeUndefined()
  })
})

describe('generateFavicon', () => {
  it('should generate favicon with all properties', () => {
    const value = {
      about: 'https://example.com/favicon.ico',
      size: 'small',
      dc: { titles: ['Example Diary'] },
    }
    const expected = {
      '@rdf:about': 'https://example.com/favicon.ico',
      '@image:size': 'small',
      'dc:title': ['Example Diary'],
    }

    expect(generateFavicon(value)).toEqual(expected)
  })

  it('should generate favicon with only about', () => {
    const value = {
      about: 'https://example.com/favicon.ico',
    }
    const expected = {
      '@rdf:about': 'https://example.com/favicon.ico',
    }

    expect(generateFavicon(value)).toEqual(expected)
  })

  it('should wrap title with special characters in CDATA', () => {
    const value = {
      dc: { titles: ['Camp & Check'] },
    }
    const expected = {
      'dc:title': [{ '#cdata': 'Camp & Check' }],
    }

    expect(generateFavicon(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      about: 'https://example.com/favicon.ico',
      size: '',
    }
    const expected = {
      '@rdf:about': 'https://example.com/favicon.ico',
    }

    expect(generateFavicon(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      about: '   ',
      size: '\t\n',
    }

    expect(generateFavicon(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateFavicon(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFavicon('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFavicon(123)).toBeUndefined()
    expect(generateFavicon(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFavicon(null)).toBeUndefined()
  })

  it('should handle array input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFavicon([])).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with favicon', () => {
    const value = {
      favicon: {
        about: 'https://example.com/favicon.ico',
        size: 'small',
        dc: { titles: ['Example Diary'] },
      },
    }
    const expected = {
      'image:favicon': {
        '@rdf:about': 'https://example.com/favicon.ico',
        '@image:size': 'small',
        'dc:title': ['Example Diary'],
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty favicon', () => {
    const value = {
      favicon: {},
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
  })

  it('should handle array input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed([])).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      item: {
        about: 'https://example.com/images/topics/culture.jpg',
        width: 80,
        height: 50,
        dc: { titles: ['Culture'] },
      },
      favicon: {
        about: 'https://example.com/favicon.ico',
        size: 'small',
      },
    }
    const expected = {
      'image:item': {
        '@rdf:about': 'https://example.com/images/topics/culture.jpg',
        'image:width': 80,
        'image:height': 50,
        'dc:title': ['Culture'],
      },
      'image:favicon': {
        '@rdf:about': 'https://example.com/favicon.ico',
        '@image:size': 'small',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only image', () => {
    const value = {
      item: {
        about: 'https://example.com/covers/2018-04-23.jpg',
      },
    }
    const expected = {
      'image:item': {
        '@rdf:about': 'https://example.com/covers/2018-04-23.jpg',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty image and favicon', () => {
    const value = {
      item: {},
      favicon: {},
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

  it('should handle array input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})
