import { describe, expect, it } from 'bun:test'
import { generateFeed } from './utils.js'

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      link: 'https://feedpress.com/podcast',
      newsletterId: 'newsletter123',
      locale: 'en',
      podcastId: 'podcast456',
      cssFile: 'https://example.com/custom.css',
    }
    const expected = {
      'feedpress:link': 'https://feedpress.com/podcast',
      'feedpress:newsletterId': 'newsletter123',
      'feedpress:locale': 'en',
      'feedpress:podcastId': 'podcast456',
      'feedpress:cssFile': 'https://example.com/custom.css',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only link', () => {
    const value = {
      link: 'https://feedpress.com/podcast',
    }
    const expected = {
      'feedpress:link': 'https://feedpress.com/podcast',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only newsletterId', () => {
    const value = {
      newsletterId: 'newsletter123',
    }
    const expected = {
      'feedpress:newsletterId': 'newsletter123',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only locale', () => {
    const value = {
      locale: 'fr',
    }
    const expected = {
      'feedpress:locale': 'fr',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only podcastId', () => {
    const value = {
      podcastId: 'podcast456',
    }
    const expected = {
      'feedpress:podcastId': 'podcast456',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only cssFile', () => {
    const value = {
      cssFile: 'https://example.com/custom.css',
    }
    const expected = {
      'feedpress:cssFile': 'https://example.com/custom.css',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      link: '',
      newsletterId: 'newsletter123',
    }
    const expected = {
      'feedpress:newsletterId': 'newsletter123',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      link: '   ',
      locale: '\t\n',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle object with all undefined properties', () => {
    const value = {
      link: undefined,
      newsletterId: undefined,
      locale: undefined,
      podcastId: undefined,
      cssFile: undefined,
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

  it('should handle various locale codes correctly', () => {
    const locales = ['en', 'fr', 'de', 'es', 'ja', 'zh', 'pt', 'ru']

    for (const locale of locales) {
      const value = {
        locale,
      }
      const expected = {
        'feedpress:locale': locale,
      }

      expect(generateFeed(value)).toEqual(expected)
    }
  })

  it('should handle numeric podcast IDs', () => {
    const podcastIds = ['123456', '789012', '345678']

    for (const podcastId of podcastIds) {
      const value = {
        podcastId,
      }
      const expected = {
        'feedpress:podcastId': podcastId,
      }

      expect(generateFeed(value)).toEqual(expected)
    }
  })

  it('should handle various CSS file URLs', () => {
    const cssFiles = [
      'https://example.com/custom.css',
      'https://cdn.example.com/styles/podcast.css',
      'https://example.com/theme.css?v=1.0',
    ]

    for (const cssFile of cssFiles) {
      const value = {
        cssFile,
      }
      const expected = {
        'feedpress:cssFile': cssFile,
      }

      expect(generateFeed(value)).toEqual(expected)
    }
  })

  it('should handle partial feed data', () => {
    const value = {
      link: 'https://feedpress.com/podcast',
      locale: 'en',
      cssFile: 'https://example.com/custom.css',
    }
    const expected = {
      'feedpress:link': 'https://feedpress.com/podcast',
      'feedpress:locale': 'en',
      'feedpress:cssFile': 'https://example.com/custom.css',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle mixed empty and valid strings', () => {
    const value = {
      link: '',
      newsletterId: 'newsletter123',
      locale: '   ',
      podcastId: 'podcast456',
    }
    const expected = {
      'feedpress:newsletterId': 'newsletter123',
      'feedpress:podcastId': 'podcast456',
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
