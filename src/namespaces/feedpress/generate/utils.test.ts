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

  const localeCases: Array<[string, { 'feedpress:locale': string }]> = [
    ['en', { 'feedpress:locale': 'en' }],
    ['fr', { 'feedpress:locale': 'fr' }],
    ['de', { 'feedpress:locale': 'de' }],
    ['es', { 'feedpress:locale': 'es' }],
    ['ja', { 'feedpress:locale': 'ja' }],
    ['zh', { 'feedpress:locale': 'zh' }],
    ['pt', { 'feedpress:locale': 'pt' }],
    ['ru', { 'feedpress:locale': 'ru' }],
  ]

  it.each(localeCases)('should handle locale code: %s', (locale, expected) => {
    expect(generateFeed({ locale })).toEqual(expected)
  })

  const podcastIdCases: Array<[string, { 'feedpress:podcastId': string }]> = [
    ['123456', { 'feedpress:podcastId': '123456' }],
    ['789012', { 'feedpress:podcastId': '789012' }],
    ['345678', { 'feedpress:podcastId': '345678' }],
  ]

  it.each(podcastIdCases)('should handle numeric podcast ID: %s', (podcastId, expected) => {
    expect(generateFeed({ podcastId })).toEqual(expected)
  })

  const cssFileCases: Array<[string, { 'feedpress:cssFile': string }]> = [
    ['https://example.com/custom.css', { 'feedpress:cssFile': 'https://example.com/custom.css' }],
    [
      'https://cdn.example.com/styles/podcast.css',
      { 'feedpress:cssFile': 'https://cdn.example.com/styles/podcast.css' },
    ],
    [
      'https://example.com/theme.css?v=1.0',
      { 'feedpress:cssFile': 'https://example.com/theme.css?v=1.0' },
    ],
  ]

  it.each(cssFileCases)('should handle CSS file URL: %s', (cssFile, expected) => {
    expect(generateFeed({ cssFile })).toEqual(expected)
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
