import { describe, expect, it } from 'bun:test'
import type { ParsePartialFunction } from '@/common/types.js'
import {
  parseBackLinks,
  parseCategory,
  parseComments,
  parseCommunity,
  parseContent,
  parseCopyright,
  parseCredit,
  parseEmbed,
  parseGroup,
  parseHash,
  parseLicense,
  parseLocation,
  parseParam,
  parsePeerLink,
  parsePlayer,
  parsePrice,
  parseRating,
  parseResponses,
  parseRestriction,
  parseRights,
  parseScene,
  parseScenes,
  parseStarRating,
  parseStatistics,
  parseStatus,
  parseSubTitle,
  parseTags,
  parseText,
  parseThumbnail,
  parseTitleOrDescription,
  retrieveCommonElements,
  retrieveItemOrFeed,
  retrieveRatings,
} from './utils.js'

const createSimpleArrayParserTests = (
  functionName: string,
  parserFunction: ParsePartialFunction<Array<string>>,
  propertyName: string,
) => {
  describe(functionName, () => {
    it(`should parse array of ${propertyName} elements`, () => {
      const value = {
        [propertyName]: ['First item', 'Second item'],
      }
      const expected = ['First item', 'Second item']

      expect(parserFunction(value)).toEqual(expected)
    })

    it(`should parse a single ${propertyName} element`, () => {
      const value = {
        [propertyName]: 'Single item',
      }
      const expected = ['Single item']

      expect(parserFunction(value)).toEqual(expected)
    })

    it('should return undefined when required property is missing', () => {
      const value = {
        otherProperty: 'value',
      }

      expect(parserFunction(value)).toBeUndefined()
    })

    it('should return undefined for unsupported input', () => {
      expect(parserFunction('not an object')).toBeUndefined()
      expect(parserFunction(undefined)).toBeUndefined()
      expect(parserFunction(null)).toBeUndefined()
      expect(parserFunction([])).toBeUndefined()
    })
  })
}

describe('parseRating', () => {
  it('should parse complete rating object', () => {
    const value = {
      '#text': 'adult',
      '@scheme': 'urn:simple',
    }
    const expected = {
      value: 'adult',
      scheme: 'urn:simple',
    }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should parse rating with only required value field (as object)', () => {
    const value = {
      '#text': 'nonadult',
    }
    const expected = {
      value: 'nonadult',
    }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should parse rating with only required value field (as string)', () => {
    const value = 'PG-13'
    const expected = {
      value: 'PG-13',
    }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@scheme': 456,
    }
    const expected = {
      value: '123',
      scheme: '456',
    }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'adult',
      '@scheme': 'urn:simple',
      '@invalid': 'property',
    }
    const expected = {
      value: 'adult',
      scheme: 'urn:simple',
    }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseRating(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseRating(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseRating(undefined)).toBeUndefined()
    expect(parseRating(null)).toBeUndefined()
    expect(parseRating([])).toBeUndefined()
  })
})

describe('retrieveRatings', () => {
  it('should parse object with media:rating', () => {
    const value = {
      'media:rating': {
        '#text': 'adult',
        '@scheme': 'urn:simple',
      },
    }
    const expected = [
      {
        value: 'adult',
        scheme: 'urn:simple',
      },
    ]

    expect(retrieveRatings(value)).toEqual(expected)
  })

  it('should parse object with multiple media:rating elements', () => {
    const value = {
      'media:rating': [
        {
          '#text': 'adult',
          '@scheme': 'urn:simple',
        },
        {
          '#text': 'R',
          '@scheme': 'urn:mpaa',
        },
      ],
    }
    const expected = [
      {
        value: 'adult',
        scheme: 'urn:simple',
      },
      {
        value: 'R',
        scheme: 'urn:mpaa',
      },
    ]

    expect(retrieveRatings(value)).toEqual(expected)
  })

  it('should handle migration from media:adult=true to media:rating', () => {
    const value = {
      'media:adult': {
        '#text': 'true',
      },
    }
    const expected = [
      {
        value: 'adult',
        scheme: 'urn:simple',
      },
    ]

    expect(retrieveRatings(value)).toEqual(expected)
  })

  it('should handle migration from media:adult=false to media:rating', () => {
    const value = {
      'media:adult': {
        '#text': 'false',
      },
    }
    const expected = [
      {
        value: 'nonadult',
        scheme: 'urn:simple',
      },
    ]

    expect(retrieveRatings(value)).toEqual(expected)
  })

  it('should filter out invalid rating elements', () => {
    const value = {
      'media:rating': [
        {
          '#text': 'adult',
          '@scheme': 'urn:simple',
        },
        {
          '@scheme': 'urn:mpaa',
        },
      ],
    }
    const expected = [
      {
        value: 'adult',
        scheme: 'urn:simple',
      },
      {
        scheme: 'urn:mpaa',
      },
    ]

    expect(retrieveRatings(value)).toEqual(expected)
  })

  it('should prioritize media:rating over media:adult when both are present', () => {
    const value = {
      'media:rating': {
        '#text': 'PG-13',
        '@scheme': 'urn:mpaa',
      },
      'media:adult': {
        '#text': 'true',
      },
    }
    const expected = [
      {
        value: 'PG-13',
        scheme: 'urn:mpaa',
      },
    ]

    expect(retrieveRatings(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(retrieveRatings(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      unrelated: 'property',
      random: 'value',
    }

    expect(retrieveRatings(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveRatings('not an object')).toBeUndefined()
    expect(retrieveRatings(undefined)).toBeUndefined()
    expect(retrieveRatings(null)).toBeUndefined()
    expect(retrieveRatings([])).toBeUndefined()
  })
})

describe('parseTitleOrDescription', () => {
  it('should parse complete titleOrDescription object', () => {
    const value = {
      '#text': 'Sample content',
      '@type': 'plain',
    }
    const expected = {
      value: 'Sample content',
      type: 'plain',
    }

    expect(parseTitleOrDescription(value)).toEqual(expected)
  })

  it('should parse titleOrDescription with only required value field (as object)', () => {
    const value = {
      '#text': 'Sample content',
    }
    const expected = {
      value: 'Sample content',
    }

    expect(parseTitleOrDescription(value)).toEqual(expected)
  })

  it('should parse titleOrDescription with only required value field (as string)', () => {
    const value = 'Sample content'
    const expected = {
      value: 'Sample content',
    }

    expect(parseTitleOrDescription(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@type': 456,
    }
    const expected = {
      value: '123',
      type: '456',
    }

    expect(parseTitleOrDescription(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'Sample content',
      '@type': 'plain',
      '@invalid': 'property',
    }
    const expected = {
      value: 'Sample content',
      type: 'plain',
    }

    expect(parseTitleOrDescription(value)).toEqual(expected)
  })

  it('should handle partial objects (missing value)', () => {
    const value = {
      '@type': 'plain',
    }
    const expected = {
      type: 'plain',
    }

    expect(parseTitleOrDescription(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseTitleOrDescription(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseTitleOrDescription(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseTitleOrDescription(undefined)).toBeUndefined()
    expect(parseTitleOrDescription(null)).toBeUndefined()
    expect(parseTitleOrDescription([])).toBeUndefined()
  })
})

describe('parseThumbnail', () => {
  it('should parse complete thumbnail object', () => {
    const value = {
      '@url': 'https://example.com/image.jpg',
      '@height': 480,
      '@width': 640,
      '@time': '00:05:30',
    }
    const expected = {
      url: 'https://example.com/image.jpg',
      height: 480,
      width: 640,
      time: '00:05:30',
    }

    expect(parseThumbnail(value)).toEqual(expected)
  })

  it('should parse thumbnail with only required url field', () => {
    const value = {
      '@url': 'https://example.com/image.jpg',
    }
    const expected = {
      url: 'https://example.com/image.jpg',
    }

    expect(parseThumbnail(value)).toEqual(expected)
  })

  it('should handle string values that can be coerced to numbers', () => {
    const value = {
      '@url': 'https://example.com/image.jpg',
      '@height': '480',
      '@width': '640',
    }
    const expected = {
      url: 'https://example.com/image.jpg',
      height: 480,
      width: 640,
    }

    expect(parseThumbnail(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@url': 123,
      '@height': '480',
      '@width': '640',
      '@time': 500,
    }
    const expected = {
      url: '123',
      height: 480,
      width: 640,
      time: '500',
    }

    expect(parseThumbnail(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@url': 'https://example.com/image.jpg',
      '@height': 480,
      '@width': 640,
      '@invalid': 'property',
    }
    const expected = {
      url: 'https://example.com/image.jpg',
      height: 480,
      width: 640,
    }

    expect(parseThumbnail(value)).toEqual(expected)
  })

  it('should handle partial objects (missing url)', () => {
    const value = {
      '@height': 480,
      '@width': 640,
      '@time': '00:05:30',
    }
    const expected = {
      height: 480,
      width: 640,
      time: '00:05:30',
    }

    expect(parseThumbnail(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseThumbnail(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseThumbnail(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseThumbnail('not an object')).toBeUndefined()
    expect(parseThumbnail(undefined)).toBeUndefined()
    expect(parseThumbnail(null)).toBeUndefined()
    expect(parseThumbnail([])).toBeUndefined()
  })
})

describe('parseCategory', () => {
  it('should parse complete category object', () => {
    const value = {
      '#text': 'Technology',
      '@scheme': 'http://example.com/categories',
      '@label': 'Tech News',
    }
    const expected = {
      name: 'Technology',
      scheme: 'http://example.com/categories',
      label: 'Tech News',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should parse category with only required name field (as object)', () => {
    const value = {
      '#text': 'Technology',
    }
    const expected = {
      name: 'Technology',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should parse category with only required name field (as string)', () => {
    const value = 'Technology'
    const expected = {
      name: 'Technology',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@scheme': 456,
    }
    const expected = {
      name: '123',
      scheme: '456',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'Technology',
      '@scheme': 'http://example.com/categories',
      '@invalid': 'property',
    }
    const expected = {
      name: 'Technology',
      scheme: 'http://example.com/categories',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should handle partial objects (missing name)', () => {
    const value = {
      '@scheme': 'http://example.com/categories',
      '@label': 'Tech News',
    }
    const expected = {
      scheme: 'http://example.com/categories',
      label: 'Tech News',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseCategory(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseCategory(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseCategory(undefined)).toBeUndefined()
    expect(parseCategory(null)).toBeUndefined()
    expect(parseCategory([])).toBeUndefined()
  })
})

describe('parseHash', () => {
  it('should parse complete hash object', () => {
    const value = {
      '#text': '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
      '@algo': 'sha256',
    }
    const expected = {
      value: '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
      algo: 'sha256',
    }

    expect(parseHash(value)).toEqual(expected)
  })

  it('should parse hash with only required value field (as object)', () => {
    const value = {
      '#text': '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
    }
    const expected = {
      value: '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
    }

    expect(parseHash(value)).toEqual(expected)
  })

  it('should parse hash with only required value field (as string)', () => {
    const value = '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20'
    const expected = {
      value: '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
    }

    expect(parseHash(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@algo': 456,
    }
    const expected = {
      value: '123',
      algo: '456',
    }

    expect(parseHash(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
      '@algo': 'sha256',
      '@invalid': 'property',
    }
    const expected = {
      value: '7694f4a66316e53c8cdd9d79c6d6e5152528a9d2de82758bc08b0025a253ac20',
      algo: 'sha256',
    }

    expect(parseHash(value)).toEqual(expected)
  })

  it('should handle partial objects (missing hash)', () => {
    const value = {
      '@algo': 'sha256',
    }
    const expected = {
      algo: 'sha256',
    }

    expect(parseHash(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseHash(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseHash(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseHash(undefined)).toBeUndefined()
    expect(parseHash(null)).toBeUndefined()
    expect(parseHash([])).toBeUndefined()
  })
})

describe('parsePlayer', () => {
  it('should parse complete player object', () => {
    const value = {
      '@url': 'https://example.com/player',
      '@height': 480,
      '@width': 640,
    }
    const expected = {
      url: 'https://example.com/player',
      height: 480,
      width: 640,
    }

    expect(parsePlayer(value)).toEqual(expected)
  })

  it('should parse player with only required url field', () => {
    const value = {
      '@url': 'https://example.com/player',
    }
    const expected = {
      url: 'https://example.com/player',
    }

    expect(parsePlayer(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@url': 'https://example.com/player',
      '@height': '480',
      '@width': '640',
    }
    const expected = {
      url: 'https://example.com/player',
      height: 480,
      width: 640,
    }

    expect(parsePlayer(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@url': 'https://example.com/player',
      '@height': 480,
      '@width': 640,
      '@invalid': 'property',
    }
    const expected = {
      url: 'https://example.com/player',
      height: 480,
      width: 640,
    }

    expect(parsePlayer(value)).toEqual(expected)
  })

  it('should handle partial objects (missing url)', () => {
    const value = {
      '@height': 480,
      '@width': 640,
    }
    const expected = {
      height: 480,
      width: 640,
    }

    expect(parsePlayer(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parsePlayer(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parsePlayer(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parsePlayer('not an object')).toBeUndefined()
    expect(parsePlayer(undefined)).toBeUndefined()
    expect(parsePlayer(null)).toBeUndefined()
    expect(parsePlayer([])).toBeUndefined()
  })
})

describe('parseCredit', () => {
  it('should parse complete credit object', () => {
    const value = {
      '#text': 'John Doe',
      '@role': 'producer',
      '@scheme': 'urn:roles',
    }
    const expected = {
      value: 'John Doe',
      role: 'producer',
      scheme: 'urn:roles',
    }

    expect(parseCredit(value)).toEqual(expected)
  })

  it('should parse credit with only required value field (as object)', () => {
    const value = {
      '#text': 'John Doe',
    }
    const expected = {
      value: 'John Doe',
    }

    expect(parseCredit(value)).toEqual(expected)
  })

  it('should parse credit with only required value field (as string)', () => {
    const value = 'John Doe'
    const expected = {
      value: 'John Doe',
    }

    expect(parseCredit(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@role': 456,
    }
    const expected = {
      value: '123',
      role: '456',
    }

    expect(parseCredit(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'John Doe',
      '@role': 'producer',
      '@invalid': 'property',
    }
    const expected = {
      value: 'John Doe',
      role: 'producer',
    }

    expect(parseCredit(value)).toEqual(expected)
  })

  it('should handle partial objects (missing value)', () => {
    const value = {
      '@role': 'producer',
      '@scheme': 'urn:roles',
    }
    const expected = {
      role: 'producer',
      scheme: 'urn:roles',
    }

    expect(parseCredit(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseCredit(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseCredit(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseCredit(undefined)).toBeUndefined()
    expect(parseCredit(null)).toBeUndefined()
    expect(parseCredit([])).toBeUndefined()
  })
})

describe('parseCopyright', () => {
  it('should parse complete copyright object', () => {
    const value = {
      '#text': '© 2023 Example Media',
      '@url': 'https://example.com/copyright',
    }
    const expected = {
      value: '© 2023 Example Media',
      url: 'https://example.com/copyright',
    }

    expect(parseCopyright(value)).toEqual(expected)
  })

  it('should parse copyright with only required value field (as object)', () => {
    const value = {
      '#text': '© 2023 Example Media',
    }
    const expected = {
      value: '© 2023 Example Media',
    }

    expect(parseCopyright(value)).toEqual(expected)
  })

  it('should parse copyright with only required value field (as string)', () => {
    const value = '© 2023 Example Media'
    const expected = {
      value: '© 2023 Example Media',
    }

    expect(parseCopyright(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 2023,
      '@url': 123,
    }
    const expected = {
      value: '2023',
      url: '123',
    }

    expect(parseCopyright(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': '© 2023 Example Media',
      '@url': 'https://example.com/copyright',
      '@invalid': 'property',
    }
    const expected = {
      value: '© 2023 Example Media',
      url: 'https://example.com/copyright',
    }

    expect(parseCopyright(value)).toEqual(expected)
  })

  it('should handle partial objects (missing value)', () => {
    const value = {
      '@url': 'https://example.com/copyright',
    }
    const expected = {
      url: 'https://example.com/copyright',
    }

    expect(parseCopyright(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseCopyright(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseCopyright(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseCopyright(undefined)).toBeUndefined()
    expect(parseCopyright(null)).toBeUndefined()
    expect(parseCopyright([])).toBeUndefined()
  })
})

describe('parseText', () => {
  it('should parse complete text object', () => {
    const value = {
      '#text': 'This is a sample text',
      '@type': 'plain',
      '@lang': 'en',
      '@start': '00:00:10',
      '@end': '00:01:20',
    }
    const expected = {
      value: 'This is a sample text',
      type: 'plain',
      lang: 'en',
      start: '00:00:10',
      end: '00:01:20',
    }

    expect(parseText(value)).toEqual(expected)
  })

  it('should parse text with only required value field (as object)', () => {
    const value = {
      '#text': 'This is a sample text',
    }
    const expected = {
      value: 'This is a sample text',
    }

    expect(parseText(value)).toEqual(expected)
  })

  it('should parse text with only required value field (as string)', () => {
    const value = 'This is a sample text'
    const expected = {
      value: 'This is a sample text',
    }

    expect(parseText(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@type': 456,
    }
    const expected = {
      value: '123',
      type: '456',
    }

    expect(parseText(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'This is a sample text',
      '@type': 'plain',
      '@invalid': 'property',
    }
    const expected = {
      value: 'This is a sample text',
      type: 'plain',
    }

    expect(parseText(value)).toEqual(expected)
  })

  it('should handle partial objects (missing value)', () => {
    const value = {
      '@type': 'plain',
      '@lang': 'en',
    }
    const expected = {
      type: 'plain',
      lang: 'en',
    }

    expect(parseText(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseText(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseText(undefined)).toBeUndefined()
    expect(parseText(null)).toBeUndefined()
    expect(parseText([])).toBeUndefined()
  })
})

describe('parseRestriction', () => {
  it('should parse complete restriction object', () => {
    const value = {
      '#text': 'US',
      '@relationship': 'allow',
      '@type': 'country',
    }
    const expected = {
      value: 'US',
      relationship: 'allow',
      type: 'country',
    }

    expect(parseRestriction(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@relationship': 'allow',
      '@type': 456,
    }
    const expected = {
      value: '123',
      relationship: 'allow',
      type: '456',
    }

    expect(parseRestriction(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'US',
      '@relationship': 'allow',
      '@type': 'country',
      '@invalid': 'property',
    }
    const expected = {
      value: 'US',
      relationship: 'allow',
      type: 'country',
    }

    expect(parseRestriction(value)).toEqual(expected)
  })

  it('should handle partial objects (missing value)', () => {
    const value = {
      '@relationship': 'allow',
      '@type': 'country',
    }
    const expected = {
      relationship: 'allow',
      type: 'country',
    }

    expect(parseRestriction(value)).toEqual(expected)
  })

  it('should handle partial objects (missing relationship)', () => {
    const value = {
      '#text': 'US',
      '@type': 'country',
    }
    const expected = {
      value: 'US',
      type: 'country',
    }

    expect(parseRestriction(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseRestriction(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseRestriction('not an object')).toBeUndefined()
    expect(parseRestriction(undefined)).toBeUndefined()
    expect(parseRestriction(null)).toBeUndefined()
    expect(parseRestriction([])).toBeUndefined()
  })
})

describe('parseCommunity', () => {
  it('should parse complete community object', () => {
    const value = {
      'media:starrating': {
        '@average': 4.5,
        '@count': 127,
        '@min': 1,
        '@max': 5,
      },
      'media:statistics': {
        '@views': 5000,
        '@favorites': 42,
      },
      'media:tags': 'news:5,politics,world:2',
    }
    const expected = {
      starRating: {
        average: 4.5,
        count: 127,
        min: 1,
        max: 5,
      },
      statistics: {
        views: 5000,
        favorites: 42,
      },
      tags: [
        { name: 'news', weight: 5 },
        { name: 'politics', weight: 1 },
        { name: 'world', weight: 2 },
      ],
    }

    expect(parseCommunity(value)).toEqual(expected)
  })

  it('should parse community with only starRating', () => {
    const value = {
      'media:starrating': {
        '@average': 3.8,
        '@count': 45,
      },
    }
    const expected = {
      starRating: {
        average: 3.8,
        count: 45,
      },
    }

    expect(parseCommunity(value)).toEqual(expected)
  })

  it('should parse community with only statistics', () => {
    const value = {
      'media:statistics': {
        '@views': 12345,
      },
    }
    const expected = {
      statistics: {
        views: 12345,
      },
    }

    expect(parseCommunity(value)).toEqual(expected)
  })

  it('should parse community with only tags', () => {
    const value = {
      'media:tags': 'tech:8,programming:6',
    }
    const expected = {
      tags: [
        { name: 'tech', weight: 8 },
        { name: 'programming', weight: 6 },
      ],
    }

    expect(parseCommunity(value)).toEqual(expected)
  })

  it('should handle mixed valid and invalid properties', () => {
    const value = {
      'media:starrating': {
        '@average': 4.2,
      },
      'media:tags': '',
      'invalid:property': 'value',
    }
    const expected = {
      starRating: {
        average: 4.2,
      },
    }

    expect(parseCommunity(value)).toEqual(expected)
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      'media:unrelated': 'property',
    }

    expect(parseCommunity(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseCommunity(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseCommunity('not an object')).toBeUndefined()
    expect(parseCommunity(undefined)).toBeUndefined()
    expect(parseCommunity(null)).toBeUndefined()
    expect(parseCommunity([])).toBeUndefined()
    expect(parseCommunity(123)).toBeUndefined()
    expect(parseCommunity(true)).toBeUndefined()
  })
})

describe('parseStarRating', () => {
  it('should parse complete star rating object', () => {
    const value = {
      '@average': 4.5,
      '@count': 200,
      '@min': 1,
      '@max': 5,
    }
    const expected = {
      average: 4.5,
      count: 200,
      min: 1,
      max: 5,
    }

    expect(parseStarRating(value)).toEqual(expected)
  })

  it('should parse star rating with partial fields', () => {
    const value = {
      '@average': 4.5,
      '@count': 200,
    }
    const expected = {
      average: 4.5,
      count: 200,
    }

    expect(parseStarRating(value)).toEqual(expected)
  })

  it('should handle coercible string values', () => {
    const value = {
      '@average': '4.5',
      '@count': '200',
      '@min': '1',
      '@max': '5',
    }
    const expected = {
      average: 4.5,
      count: 200,
      min: 1,
      max: 5,
    }

    expect(parseStarRating(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@average': 4.5,
      '@count': 200,
      '@invalid': 'property',
    }
    const expected = {
      average: 4.5,
      count: 200,
    }

    expect(parseStarRating(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseStarRating(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseStarRating('not an object')).toBeUndefined()
    expect(parseStarRating(undefined)).toBeUndefined()
    expect(parseStarRating(null)).toBeUndefined()
    expect(parseStarRating([])).toBeUndefined()
  })
})

describe('parseStatistics', () => {
  it('should parse complete statistics object', () => {
    const value = {
      '@views': 15000,
      '@favorites': 2500,
    }
    const expected = {
      views: 15000,
      favorites: 2500,
    }

    expect(parseStatistics(value)).toEqual(expected)
  })

  it('should parse statistics with partial fields', () => {
    const value = {
      '@views': 15000,
    }
    const expected = {
      views: 15000,
    }

    expect(parseStatistics(value)).toEqual(expected)
  })

  it('should handle coercible string values', () => {
    const value = {
      '@views': '15000',
      '@favorites': '2500',
    }
    const expected = {
      views: 15000,
      favorites: 2500,
    }

    expect(parseStatistics(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@views': 15000,
      '@favorites': 2500,
      '@invalid': 'property',
    }
    const expected = {
      views: 15000,
      favorites: 2500,
    }

    expect(parseStatistics(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseStatistics(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseStatistics('not an object')).toBeUndefined()
    expect(parseStatistics(undefined)).toBeUndefined()
    expect(parseStatistics(null)).toBeUndefined()
    expect(parseStatistics([])).toBeUndefined()
  })
})

describe('parseTags', () => {
  it('should parse comma-separated tags with weights', () => {
    const value = 'news:5,politics:4,world:2'
    const expected = [
      { name: 'news', weight: 5 },
      { name: 'politics', weight: 4 },
      { name: 'world', weight: 2 },
    ]

    expect(parseTags(value)).toEqual(expected)
  })

  it('should parse tags without explicit weights (defaulting to 1)', () => {
    const value = 'sports,entertainment,tech'
    const expected = [
      { name: 'sports', weight: 1 },
      { name: 'entertainment', weight: 1 },
      { name: 'tech', weight: 1 },
    ]

    expect(parseTags(value)).toEqual(expected)
  })

  it('should parse mixed tags with and without weights', () => {
    const value = 'important:10,normal,lowpriority:3'
    const expected = [
      { name: 'important', weight: 10 },
      { name: 'normal', weight: 1 },
      { name: 'lowpriority', weight: 3 },
    ]

    expect(parseTags(value)).toEqual(expected)
  })

  it('should parse mixed tags with mixed whitespace', () => {
    const value = 'important:    10,normal ,    lowpriority  :3'
    const expected = [
      { name: 'important', weight: 10 },
      { name: 'normal', weight: 1 },
      { name: 'lowpriority', weight: 3 },
    ]

    expect(parseTags(value)).toEqual(expected)
  })

  it('should handle numeric input', () => {
    const value = 123
    const expected = [{ name: '123', weight: 1 }]

    expect(parseTags(value)).toEqual(expected)
  })

  it('should handle empty tags after splitting', () => {
    const value = 'tag1,,tag2:5,'
    const expected = [
      { name: 'tag1', weight: 1 },
      { name: '', weight: 1 },
      { name: 'tag2', weight: 5 },
      { name: '', weight: 1 },
    ]

    expect(parseTags(value)).toEqual(expected)
  })

  it('should handle invalid weight values by defaulting to 1', () => {
    const value = 'tag1:invalid,tag2:5'
    const expected = [
      { name: 'tag1', weight: 1 },
      { name: 'tag2', weight: 5 },
    ]

    expect(parseTags(value)).toEqual(expected)
  })

  it('should return undefined for empty string', () => {
    const value = ''

    expect(parseTags(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseTags(undefined)).toBeUndefined()
    expect(parseTags(null)).toBeUndefined()
    expect(parseTags([])).toBeUndefined()
    expect(parseTags({})).toBeUndefined()
    expect(parseTags(true)).toBeUndefined()
  })
})

createSimpleArrayParserTests('parseComments', parseComments, 'media:comment')

describe('parseEmbed', () => {
  it('should parse complete embed object', () => {
    const value = {
      '@url': 'https://example.com/player.html',
      '@width': 640,
      '@height': 480,
      'media:param': [
        {
          '@name': 'autoplay',
          '#text': 'true',
        },
        {
          '@name': 'loop',
          '#text': 'false',
        },
      ],
    }
    const expected = {
      url: 'https://example.com/player.html',
      width: 640,
      height: 480,
      params: [
        {
          name: 'autoplay',
          value: 'true',
        },
        {
          name: 'loop',
          value: 'false',
        },
      ],
    }

    expect(parseEmbed(value)).toEqual(expected)
  })

  it('should parse embed with only required url field', () => {
    const value = {
      '@url': 'https://example.com/player.html',
    }
    const expected = {
      url: 'https://example.com/player.html',
    }

    expect(parseEmbed(value)).toEqual(expected)
  })

  it('should parse embed with single param', () => {
    const value = {
      '@url': 'https://example.com/player.html',
      'media:param': {
        '@name': 'theme',
        '#text': 'dark',
      },
    }
    const expected = {
      url: 'https://example.com/player.html',
      params: [
        {
          name: 'theme',
          value: 'dark',
        },
      ],
    }

    expect(parseEmbed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@url': 'https://example.com/player.html',
      '@width': '640',
      '@height': '480',
    }
    const expected = {
      url: 'https://example.com/player.html',
      width: 640,
      height: 480,
    }

    expect(parseEmbed(value)).toEqual(expected)
  })

  it('should handle invalid params', () => {
    const value = {
      '@url': 'https://example.com/player.html',
      'media:param': [
        {
          '@name': 'valid',
          '#text': 'param',
        },
        {
          '@name': 'missing-value',
        },
        {
          '#text': 'missing-name',
        },
      ],
    }
    const expected = {
      url: 'https://example.com/player.html',
      params: [
        {
          name: 'valid',
          value: 'param',
        },
        {
          name: 'missing-value',
        },
        {
          value: 'missing-name',
        },
      ],
    }

    expect(parseEmbed(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@url': 'https://example.com/player.html',
      '@width': 640,
      '@invalid': 'property',
    }
    const expected = {
      url: 'https://example.com/player.html',
      width: 640,
    }

    expect(parseEmbed(value)).toEqual(expected)
  })

  it('should handle partial objects (missing url)', () => {
    const value = {
      '@width': 640,
      '@height': 480,
    }
    const expected = {
      width: 640,
      height: 480,
    }

    expect(parseEmbed(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseEmbed(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseEmbed(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseEmbed('not an object')).toBeUndefined()
    expect(parseEmbed(undefined)).toBeUndefined()
    expect(parseEmbed(null)).toBeUndefined()
    expect(parseEmbed([])).toBeUndefined()
    expect(parseEmbed(123)).toBeUndefined()
    expect(parseEmbed(true)).toBeUndefined()
  })
})

describe('parseParam', () => {
  it('should parse complete param object', () => {
    const value = {
      '@name': 'autoplay',
      '#text': 'true',
    }
    const expected = {
      name: 'autoplay',
      value: 'true',
    }

    expect(parseParam(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = {
      '@name': 123,
      '#text': 456,
    }
    const expected = {
      name: '123',
      value: '456',
    }

    expect(parseParam(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@name': 'color',
      '#text': 'blue',
      '@invalid': 'property',
    }
    const expected = {
      name: 'color',
      value: 'blue',
    }

    expect(parseParam(value)).toEqual(expected)
  })

  it('should handle partial objects (missing name)', () => {
    const value = {
      '#text': 'some value',
    }
    const expected = {
      value: 'some value',
    }

    expect(parseParam(value)).toEqual(expected)
  })

  it('should handle partial objects (missing value)', () => {
    const value = {
      '@name': 'some name',
    }
    const expected = {
      name: 'some name',
    }

    expect(parseParam(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseParam(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseParam(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseParam('not an object')).toBeUndefined()
    expect(parseParam(undefined)).toBeUndefined()
    expect(parseParam(null)).toBeUndefined()
    expect(parseParam([])).toBeUndefined()
    expect(parseParam(123)).toBeUndefined()
    expect(parseParam(true)).toBeUndefined()
  })
})

createSimpleArrayParserTests('parseResponses', parseResponses, 'media:response')
createSimpleArrayParserTests('parseBackLinks', parseBackLinks, 'media:backlink')

describe('parseStatus', () => {
  it('should parse complete status object', () => {
    const value = {
      '@state': 'active',
      '@reason': 'content approved',
    }
    const expected = {
      state: 'active',
      reason: 'content approved',
    }

    expect(parseStatus(value)).toEqual(expected)
  })

  it('should parse status with only required state field', () => {
    const value = {
      '@state': 'blocked',
    }
    const expected = {
      state: 'blocked',
    }

    expect(parseStatus(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@state': 123,
      '@reason': 456,
    }
    const expected = {
      state: '123',
      reason: '456',
    }

    expect(parseStatus(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@state': 'pending',
      '@reason': 'under review',
      '@invalid': 'property',
    }
    const expected = {
      state: 'pending',
      reason: 'under review',
    }

    expect(parseStatus(value)).toEqual(expected)
  })

  it('should handle partial objects (missing state)', () => {
    const value = {
      '@reason': 'no state provided',
    }
    const expected = {
      reason: 'no state provided',
    }

    expect(parseStatus(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseStatus(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseStatus(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseStatus('not an object')).toBeUndefined()
    expect(parseStatus(undefined)).toBeUndefined()
    expect(parseStatus(null)).toBeUndefined()
    expect(parseStatus([])).toBeUndefined()
  })
})

describe('parsePrice', () => {
  it('should parse complete price object', () => {
    const value = {
      '@type': 'subscription',
      '@info': 'Premium plan',
      '@price': 9.99,
      '@currency': 'USD',
    }
    const expected = {
      type: 'subscription',
      info: 'Premium plan',
      price: 9.99,
      currency: 'USD',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@type': 123,
      '@info': 456,
      '@price': '19.99',
      '@currency': 789,
    }
    const expected = {
      type: '123',
      info: '456',
      price: 19.99,
      currency: '789',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@type': 'subscription',
      '@price': 9.99,
      '@invalid': 'property',
    }
    const expected = {
      type: 'subscription',
      price: 9.99,
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parsePrice(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parsePrice(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parsePrice('not an object')).toBeUndefined()
    expect(parsePrice(undefined)).toBeUndefined()
    expect(parsePrice(null)).toBeUndefined()
    expect(parsePrice([])).toBeUndefined()
  })
})

describe('parseLicense', () => {
  it('should parse complete license object', () => {
    const value = {
      '#text': 'Creative Commons Attribution 4.0',
      '@type': 'cc-by',
      '@href': 'https://creativecommons.org/licenses/by/4.0/',
    }
    const expected = {
      name: 'Creative Commons Attribution 4.0',
      type: 'cc-by',
      href: 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should parse license with only name field (as object)', () => {
    const value = {
      '#text': 'All Rights Reserved',
    }
    const expected = {
      name: 'All Rights Reserved',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should parse license with only name field (as string)', () => {
    const value = 'All Rights Reserved'
    const expected = {
      name: 'All Rights Reserved',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should parse license with only href field', () => {
    const value = {
      '@href': 'https://example.com/license',
    }
    const expected = {
      href: 'https://example.com/license',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '#text': 123,
      '@type': 456,
      '@href': 789,
    }
    const expected = {
      name: '123',
      type: '456',
      href: '789',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '#text': 'CC License',
      '@href': 'https://example.com/license',
      '@invalid': 'property',
    }
    const expected = {
      name: 'CC License',
      href: 'https://example.com/license',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should handle partial objects (missing name and href)', () => {
    const value = {
      '@type': 'cc-by',
    }
    const expected = {
      type: 'cc-by',
    }

    expect(parseLicense(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseLicense(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseLicense(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseLicense(undefined)).toBeUndefined()
    expect(parseLicense(null)).toBeUndefined()
    expect(parseLicense([])).toBeUndefined()
  })
})

describe('parseSubTitle', () => {
  it('should parse complete subtitle object', () => {
    const value = {
      '@type': 'text/vtt',
      '@lang': 'en',
      '@href': 'https://example.com/subtitles.vtt',
    }
    const expected = {
      type: 'text/vtt',
      lang: 'en',
      href: 'https://example.com/subtitles.vtt',
    }

    expect(parseSubTitle(value)).toEqual(expected)
  })

  it('should parse subtitle with only required href field', () => {
    const value = {
      '@href': 'https://example.com/subtitles.vtt',
    }
    const expected = {
      href: 'https://example.com/subtitles.vtt',
    }

    expect(parseSubTitle(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@type': 123,
      '@lang': 456,
      '@href': 'https://example.com/subtitles.vtt',
    }
    const expected = {
      type: '123',
      lang: '456',
      href: 'https://example.com/subtitles.vtt',
    }

    expect(parseSubTitle(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@type': 'text/vtt',
      '@href': 'https://example.com/subtitles.vtt',
      '@invalid': 'property',
    }
    const expected = {
      type: 'text/vtt',
      href: 'https://example.com/subtitles.vtt',
    }

    expect(parseSubTitle(value)).toEqual(expected)
  })

  it('should handle partial objects (missing href)', () => {
    const value = {
      '@type': 'text/vtt',
      '@lang': 'en',
    }
    const expected = {
      type: 'text/vtt',
      lang: 'en',
    }

    expect(parseSubTitle(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseSubTitle(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parseSubTitle(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseSubTitle('not an object')).toBeUndefined()
    expect(parseSubTitle(undefined)).toBeUndefined()
    expect(parseSubTitle(null)).toBeUndefined()
    expect(parseSubTitle([])).toBeUndefined()
  })
})

describe('parsePeerLink', () => {
  it('should parse complete peerLink object', () => {
    const value = {
      '@type': 'torrent',
      '@href': 'magnet:?xt=urn:btih:HASH',
    }
    const expected = {
      type: 'torrent',
      href: 'magnet:?xt=urn:btih:HASH',
    }

    expect(parsePeerLink(value)).toEqual(expected)
  })

  it('should parse peerLink with only required href field', () => {
    const value = {
      '@href': 'magnet:?xt=urn:btih:HASH',
    }
    const expected = {
      href: 'magnet:?xt=urn:btih:HASH',
    }

    expect(parsePeerLink(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@type': 123,
      '@href': 'magnet:?xt=urn:btih:HASH',
    }
    const expected = {
      type: '123',
      href: 'magnet:?xt=urn:btih:HASH',
    }

    expect(parsePeerLink(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@type': 'torrent',
      '@href': 'magnet:?xt=urn:btih:HASH',
      '@invalid': 'property',
    }
    const expected = {
      type: 'torrent',
      href: 'magnet:?xt=urn:btih:HASH',
    }

    expect(parsePeerLink(value)).toEqual(expected)
  })

  it('should handle partial objects (missing href)', () => {
    const value = {
      '@type': 'torrent',
    }
    const expected = {
      type: 'torrent',
    }

    expect(parsePeerLink(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parsePeerLink(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(parsePeerLink(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parsePeerLink('not an object')).toBeUndefined()
    expect(parsePeerLink(undefined)).toBeUndefined()
    expect(parsePeerLink(null)).toBeUndefined()
    expect(parsePeerLink([])).toBeUndefined()
  })
})

describe('parseRights', () => {
  it('should parse complete rights object', () => {
    const value = {
      '@status': 'copyrighted',
    }
    const expected = {
      status: 'copyrighted',
    }

    expect(parseRights(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@status': 123,
    }
    const expected = {
      status: '123',
    }

    expect(parseRights(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      '@status': 'copyrighted',
      '@invalid': 'property',
    }
    const expected = {
      status: 'copyrighted',
    }

    expect(parseRights(value)).toEqual(expected)
  })

  it('should return undefined if status is missing', () => {
    const value = {
      '@other': 'property',
    }

    expect(parseRights(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseRights(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseRights('not an object')).toBeUndefined()
    expect(parseRights(undefined)).toBeUndefined()
    expect(parseRights(null)).toBeUndefined()
    expect(parseRights([])).toBeUndefined()
  })
})

describe('parseScene', () => {
  const expectedFull = {
    title: 'Opening Scene',
    description: 'The intro to the episode',
    startTime: '00:00:00',
    endTime: '00:02:30',
  }

  it('should parse complete scene object (with #text)', () => {
    const value = {
      scenetitle: { '#text': 'Opening Scene' },
      scenedescription: { '#text': 'The intro to the episode' },
      scenestarttime: { '#text': '00:00:00' },
      sceneendtime: { '#text': '00:02:30' },
    }

    expect(parseScene(value)).toEqual(expectedFull)
  })

  it('should parse complete scene object (without #text)', () => {
    const value = {
      scenetitle: 'Opening Scene',
      scenedescription: 'The intro to the episode',
      scenestarttime: '00:00:00',
      sceneendtime: '00:02:30',
    }

    expect(parseScene(value)).toEqual(expectedFull)
  })

  it('should parse complete scene object (with array of values)', () => {
    const value = {
      scenetitle: ['Opening Scene'],
      scenedescription: ['The intro to the episode'],
      scenestarttime: ['00:00:00'],
      sceneendtime: ['00:02:30'],
    }

    expect(parseScene(value)).toEqual(expectedFull)
  })

  it('should parse scene with partial fields', () => {
    const value = {
      scenetitle: 'Interview Section',
      scenestarttime: '00:05:00',
    }
    const expected = {
      title: 'Interview Section',
      startTime: '00:05:00',
    }

    expect(parseScene(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      scenetitle: 123,
      scenestarttime: 456,
    }
    const expected = {
      title: '123',
      startTime: '456',
    }

    expect(parseScene(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      scenetitle: 'Closing Remarks',
      sceneendtime: '00:45:00',
      randomproperty: 'should be ignored',
    }
    const expected = {
      title: 'Closing Remarks',
      endTime: '00:45:00',
    }

    expect(parseScene(value)).toEqual(expected)
  })

  it('should return undefined if no scene properties exist', () => {
    const value = {
      otherproperty: 'not a scene property',
    }

    expect(parseScene(value)).toBeUndefined()
  })

  it('should return undefined for empty objects', () => {
    const value = {}

    expect(parseScene(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseScene('not an object')).toBeUndefined()
    expect(parseScene(undefined)).toBeUndefined()
    expect(parseScene(null)).toBeUndefined()
    expect(parseScene([])).toBeUndefined()
  })
})

describe('parseScenes', () => {
  it('should parse a single scene', () => {
    const value = {
      'media:scene': {
        scenetitle: 'Introduction',
        scenedescription: 'Opening sequence of the movie',
        scenestarttime: '00:00:30',
        sceneendtime: '00:01:45',
      },
    }
    const expected = [
      {
        title: 'Introduction',
        description: 'Opening sequence of the movie',
        startTime: '00:00:30',
        endTime: '00:01:45',
      },
    ]

    expect(parseScenes(value)).toEqual(expected)
  })

  it('should parse multiple scenes', () => {
    const value = {
      'media:scene': [
        {
          scenetitle: 'Introduction',
          scenedescription: 'Opening sequence',
          scenestarttime: '00:00:30',
          sceneendtime: '00:01:45',
        },
        {
          scenetitle: 'Conflict',
          scenedescription: 'Main character faces a challenge',
          scenestarttime: '00:05:10',
          sceneendtime: '00:08:30',
        },
      ],
    }
    const expected = [
      {
        title: 'Introduction',
        description: 'Opening sequence',
        startTime: '00:00:30',
        endTime: '00:01:45',
      },
      {
        title: 'Conflict',
        description: 'Main character faces a challenge',
        startTime: '00:05:10',
        endTime: '00:08:30',
      },
    ]

    expect(parseScenes(value)).toEqual(expected)
  })

  it('should handle scenes with partial data', () => {
    const value = {
      'media:scene': [
        {
          scenetitle: 'Introduction',
          scenestarttime: '00:00:30',
        },
        {
          scenedescription: 'Closing credits',
          sceneendtime: '01:30:00',
        },
      ],
    }
    const expected = [
      {
        title: 'Introduction',
        startTime: '00:00:30',
      },
      {
        description: 'Closing credits',
        endTime: '01:30:00',
      },
    ]

    expect(parseScenes(value)).toEqual(expected)
  })

  it('should filter out invalid scenes', () => {
    const value = {
      'media:scene': [
        {
          scenetitle: 'Valid Scene',
          scenestarttime: '00:00:30',
        },
        {}, // Empty scene should be filtered out
        null, // Null scene should be filtered out
        undefined, // Undefined scene should be filtered out
      ],
    }
    const expected = [
      {
        title: 'Valid Scene',
        startTime: '00:00:30',
      },
    ]

    expect(parseScenes(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'media:scene': {
        scenetitle: 123,
        scenestarttime: 456,
      },
    }
    const expected = [
      {
        title: '123',
        startTime: '456',
      },
    ]

    expect(parseScenes(value)).toEqual(expected)
  })

  it('should return undefined when media:scene is missing', () => {
    const value = {
      'some:other': 'property',
    }

    expect(parseScenes(value)).toBeUndefined()
  })

  it('should return undefined when media:scene is empty array', () => {
    const value = {
      'media:scene': [],
    }

    expect(parseScenes(value)).toBeUndefined()
  })

  it('should handle cases where all scenes are invalid', () => {
    const value = {
      'media:scene': [
        {}, // Empty scene
        {
          invalidProperty: 'value',
        },
      ],
    }

    expect(parseScenes(value)).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseScenes('not an object')).toBeUndefined()
    expect(parseScenes(undefined)).toBeUndefined()
    expect(parseScenes(null)).toBeUndefined()
    expect(parseScenes([])).toBeUndefined()
  })
})

describe('parseLocation', () => {
  it('should parse non-standard string-only version of the location (with #text)', () => {
    const value = {
      '#text': 'San Francisco, CA',
    }
    const expected = {
      description: 'San Francisco, CA',
    }

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should parse non-standard string-only version of the location (without #text)', () => {
    const value = 'San Francisco, CA'
    const expected = {
      description: 'San Francisco, CA',
    }

    expect(parseLocation(value)).toEqual(expected)
  })

  it('should return undefined for unsupported input', () => {
    expect(parseLocation(undefined)).toBeUndefined()
    expect(parseLocation(null)).toBeUndefined()
    expect(parseLocation([])).toBeUndefined()
  })
})

describe('retrieveCommonElements', () => {
  it('should parse a complete object with all common elements', () => {
    const value = {
      'media:rating': [
        {
          '#text': 'adult',
          '@scheme': 'urn:simple',
        },
        {
          '#text': 'PG-13',
          '@scheme': 'urn:mpaa',
        },
      ],
      'media:title': {
        '#text': 'Sample Title',
        '@type': 'plain',
      },
      'media:description': {
        '#text': 'Sample Description',
        '@type': 'plain',
      },
      'media:keywords': 'keyword1,keyword2,keyword3',
      'media:thumbnail': [
        {
          '@url': 'https://example.com/thumbnail1.jpg',
          '@width': 120,
          '@height': 60,
          '@time': '00:00:05.000',
        },
        {
          '@url': 'https://example.com/thumbnail2.jpg',
          '@width': 300,
          '@height': 150,
        },
      ],
      'media:category': [
        {
          '#text': 'Category1',
          '@scheme': 'https://example.com/categories',
          '@label': 'Category Label',
        },
        {
          '#text': 'Category2',
        },
      ],
      'media:hash': [
        {
          '#text': '3f3bdfd1b8796f3c63e32a2bc54c35c3',
          '@algo': 'md5',
        },
      ],
      'media:player': {
        '@url': 'https://example.com/player',
        '@height': 400,
        '@width': 600,
      },
      'media:credit': [
        {
          '#text': 'John Doe',
          '@role': 'producer',
          '@scheme': 'urn:staff',
        },
        {
          '#text': 'Jane Smith',
          '@role': 'director',
        },
      ],
      'media:copyright': {
        '#text': '2023 Example Media',
        '@url': 'https://example.com/copyright',
      },
      'media:text': [
        {
          '#text': 'Sample text content',
          '@type': 'plain',
          '@lang': 'en',
          '@start': '00:00:10.000',
          '@end': '00:00:20.000',
        },
      ],
      'media:restriction': [
        {
          '#text': 'us ca',
          '@relationship': 'allow',
          '@type': 'country',
        },
      ],
      'media:community': {
        'media:starrating': {
          '@average': 4.5,
          '@count': 150,
          '@min': 1,
          '@max': 5,
        },
        'media:statistics': {
          '@views': 10000,
          '@favorites': 500,
        },
        'media:tags': 'technology:5,news:3',
      },
      'media:comments': {
        'media:comment': ['Great content!', 'Very informative'],
      },
      'media:embed': {
        '@url': 'https://example.com/embed',
        '@width': 640,
        '@height': 480,
        'media:param': {
          '@name': 'type',
          '#text': 'application/x-shockwave-flash',
        },
      },
      'media:responses': {
        'media:response': ['https://example.com/response1', 'https://example.com/response2'],
      },
      'media:backlinks': {
        'media:backlink': ['https://example.com/backlink1', 'https://example.com/backlink2'],
      },
      'media:status': {
        '@state': 'active',
        '@reason': 'approved',
      },
      'media:price': [
        {
          '@price': 9.99,
          '@type': 'rent',
          '@info': 'Rental Period: 48 hours',
          '@currency': 'USD',
        },
      ],
      'media:license': {
        '#text': 'Creative Commons',
        '@type': 'text/html',
        '@href': 'https://creativecommons.org/licenses/by/4.0/',
      },
      'media:subtitle': [
        {
          '@href': 'https://example.com/subtitles.vtt',
          '@type': 'text/vtt',
          '@lang': 'en',
        },
      ],
      'media:peerlink': [
        {
          '@href': 'https://example.com/peerlink',
          '@type': 'application/x-bittorrent',
        },
      ],
      'media:rights': {
        '@status': 'official',
      },
      'media:scenes': {
        'media:scene': [
          {
            scenetitle: 'Opening Scene',
            scenedescription: 'The movie begins',
            scenestarttime: '00:00:00',
            sceneendtime: '00:02:30',
          },
        ],
      },
    }
    const expected = {
      ratings: [
        {
          value: 'adult',
          scheme: 'urn:simple',
        },
        {
          value: 'PG-13',
          scheme: 'urn:mpaa',
        },
      ],
      title: {
        value: 'Sample Title',
        type: 'plain',
      },
      description: {
        value: 'Sample Description',
        type: 'plain',
      },
      keywords: ['keyword1', 'keyword2', 'keyword3'],
      thumbnails: [
        {
          url: 'https://example.com/thumbnail1.jpg',
          width: 120,
          height: 60,
          time: '00:00:05.000',
        },
        {
          url: 'https://example.com/thumbnail2.jpg',
          width: 300,
          height: 150,
        },
      ],
      categories: [
        {
          name: 'Category1',
          scheme: 'https://example.com/categories',
          label: 'Category Label',
        },
        {
          name: 'Category2',
        },
      ],
      hashes: [
        {
          value: '3f3bdfd1b8796f3c63e32a2bc54c35c3',
          algo: 'md5',
        },
      ],
      player: {
        url: 'https://example.com/player',
        height: 400,
        width: 600,
      },
      credits: [
        {
          value: 'John Doe',
          role: 'producer',
          scheme: 'urn:staff',
        },
        {
          value: 'Jane Smith',
          role: 'director',
        },
      ],
      copyright: {
        value: '2023 Example Media',
        url: 'https://example.com/copyright',
      },
      texts: [
        {
          value: 'Sample text content',
          type: 'plain',
          lang: 'en',
          start: '00:00:10.000',
          end: '00:00:20.000',
        },
      ],
      restrictions: [
        {
          value: 'us ca',
          relationship: 'allow',
          type: 'country',
        },
      ],
      community: {
        starRating: {
          average: 4.5,
          count: 150,
          min: 1,
          max: 5,
        },
        statistics: {
          views: 10000,
          favorites: 500,
        },
        tags: [
          {
            name: 'technology',
            weight: 5,
          },
          {
            name: 'news',
            weight: 3,
          },
        ],
      },
      comments: ['Great content!', 'Very informative'],
      embed: {
        url: 'https://example.com/embed',
        width: 640,
        height: 480,
        params: [
          {
            name: 'type',
            value: 'application/x-shockwave-flash',
          },
        ],
      },
      responses: ['https://example.com/response1', 'https://example.com/response2'],
      backLinks: ['https://example.com/backlink1', 'https://example.com/backlink2'],
      status: {
        state: 'active',
        reason: 'approved',
      },
      prices: [
        {
          price: 9.99,
          type: 'rent',
          info: 'Rental Period: 48 hours',
          currency: 'USD',
        },
      ],
      licenses: [
        {
          name: 'Creative Commons',
          type: 'text/html',
          href: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
      subTitles: [
        {
          href: 'https://example.com/subtitles.vtt',
          type: 'text/vtt',
          lang: 'en',
        },
      ],
      peerLinks: [
        {
          href: 'https://example.com/peerlink',
          type: 'application/x-bittorrent',
        },
      ],
      rights: {
        status: 'official',
      },
      scenes: [
        {
          title: 'Opening Scene',
          description: 'The movie begins',
          startTime: '00:00:00',
          endTime: '00:02:30',
        },
      ],
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with title as direct value', () => {
    const value = {
      'media:title': 'Sample Title',
    }
    const expected = {
      title: {
        value: 'Sample Title',
      },
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with title as array of values', () => {
    const value = {
      'media:title': [
        {
          '#text': 'Sample Title',
          '@type': 'plain',
        },
        {
          '#text': 'Alternative Title',
        },
      ],
    }
    const expected = {
      title: {
        value: 'Sample Title',
        type: 'plain',
      },
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with description', () => {
    const value = {
      'media:description': {
        '#text': 'Sample Description',
        '@type': 'plain',
      },
    }
    const expected = {
      description: {
        value: 'Sample Description',
        type: 'plain',
      },
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should handle media:adult migration to media:rating', () => {
    const value = {
      'media:adult': 'true',
    }
    const expected = {
      ratings: [
        {
          value: 'adult',
          scheme: 'urn:simple',
        },
      ],
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should handle media:adult false migration to media:rating', () => {
    const value = {
      'media:adult': 'false',
    }
    const expected = {
      ratings: [
        {
          value: 'nonadult',
          scheme: 'urn:simple',
        },
      ],
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with keywords', () => {
    const value = {
      'media:keywords': 'keyword1,keyword2,keyword3',
    }
    const expected = {
      keywords: ['keyword1', 'keyword2', 'keyword3'],
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with player', () => {
    const value = {
      'media:player': {
        '@url': 'https://example.com/player',
        '@height': 400,
        '@width': 600,
      },
    }
    const expected = {
      player: {
        url: 'https://example.com/player',
        height: 400,
        width: 600,
      },
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with copyright', () => {
    const value = {
      'media:copyright': {
        '#text': '2023 Example Media',
        '@url': 'https://example.com/copyright',
      },
    }
    const expected = {
      copyright: {
        value: '2023 Example Media',
        url: 'https://example.com/copyright',
      },
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with community', () => {
    const value = {
      'media:community': {
        'media:starrating': {
          '@average': 4.5,
          '@count': 150,
          '@min': 1,
          '@max': 5,
        },
        'media:statistics': {
          '@views': 10000,
          '@favorites': 500,
        },
        'media:tags': 'technology:5,news:3',
      },
    }
    const expected = {
      community: {
        starRating: {
          average: 4.5,
          count: 150,
          min: 1,
          max: 5,
        },
        statistics: {
          views: 10000,
          favorites: 500,
        },
        tags: [
          {
            name: 'technology',
            weight: 5,
          },
          {
            name: 'news',
            weight: 3,
          },
        ],
      },
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with embed', () => {
    const value = {
      'media:embed': {
        '@url': 'https://example.com/embed',
        '@width': 640,
        '@height': 480,
        'media:param': [
          {
            '@name': 'type',
            '#text': 'application/x-shockwave-flash',
          },
        ],
      },
    }
    const expected = {
      embed: {
        url: 'https://example.com/embed',
        width: 640,
        height: 480,
        params: [
          {
            name: 'type',
            value: 'application/x-shockwave-flash',
          },
        ],
      },
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with status', () => {
    const value = {
      'media:status': {
        '@state': 'active',
        '@reason': 'approved',
      },
    }
    const expected = {
      status: {
        state: 'active',
        reason: 'approved',
      },
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with rights', () => {
    const value = {
      'media:rights': {
        '@status': 'official',
      },
    }
    const expected = {
      rights: {
        status: 'official',
      },
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should parse object with scenes', () => {
    const value = {
      'media:scenes': {
        'media:scene': [
          {
            scenetitle: 'Opening Scene',
            scenedescription: 'The movie begins',
            scenestarttime: '00:00:00',
            sceneendtime: '00:02:30',
          },
        ],
      },
    }
    const expected = {
      scenes: [
        {
          title: 'Opening Scene',
          description: 'The movie begins',
          startTime: '00:00:00',
          endTime: '00:02:30',
        },
      ],
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should handle array properties correctly', () => {
    const value = {
      'media:thumbnail': [
        {
          '@url': 'https://example.com/thumbnail1.jpg',
          '@width': 120,
          '@height': 60,
        },
        {
          '@url': 'https://example.com/thumbnail2.jpg',
          '@width': 300,
          '@height': 150,
        },
      ],
      'media:category': [
        {
          '#text': 'Category1',
          '@scheme': 'https://example.com/categories',
        },
        {
          '#text': 'Category2',
        },
      ],
    }
    const expected = {
      thumbnails: [
        {
          url: 'https://example.com/thumbnail1.jpg',
          width: 120,
          height: 60,
        },
        {
          url: 'https://example.com/thumbnail2.jpg',
          width: 300,
          height: 150,
        },
      ],
      categories: [
        {
          name: 'Category1',
          scheme: 'https://example.com/categories',
        },
        {
          name: 'Category2',
        },
      ],
    }

    expect(retrieveCommonElements(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(retrieveCommonElements({})).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(retrieveCommonElements('not an object')).toBeUndefined()
    expect(retrieveCommonElements(undefined)).toBeUndefined()
    expect(retrieveCommonElements(null)).toBeUndefined()
    expect(retrieveCommonElements([])).toBeUndefined()
  })
})

describe('parseContent', () => {
  it('should parse complete content object', () => {
    const value = {
      '@url': 'https://example.com/video.mp4',
      '@filesize': 12345678,
      '@type': 'video/mp4',
      '@medium': 'video',
      '@isdefault': 'true',
      '@expression': 'full',
      '@bitrate': 1500,
      '@framerate': 30,
      '@samplingrate': 44100,
      '@channels': 2,
      '@duration': 360,
      '@height': 720,
      '@width': 1280,
      '@lang': 'en',
      'media:title': {
        '#text': 'Sample Video',
        '@type': 'plain',
      },
      'media:description': {
        '#text': 'A sample video for testing',
        '@type': 'plain',
      },
    }
    const expected = {
      url: 'https://example.com/video.mp4',
      fileSize: 12345678,
      type: 'video/mp4',
      medium: 'video',
      isDefault: true,
      expression: 'full',
      bitrate: 1500,
      framerate: 30,
      samplingrate: 44100,
      channels: 2,
      duration: 360,
      height: 720,
      width: 1280,
      lang: 'en',
      // INFO: Common elements would be included here, but they're already tested in
      // retrieveCommonElements, so here are just a few of them.
      title: {
        value: 'Sample Video',
        type: 'plain',
      },
      description: {
        value: 'A sample video for testing',
        type: 'plain',
      },
    }

    expect(parseContent(value)).toEqual(expected)
  })

  it('should parse content with only required url field', () => {
    const value = {
      '@url': 'https://example.com/video.mp4',
    }
    const expected = {
      url: 'https://example.com/video.mp4',
    }

    expect(parseContent(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      '@url': 'https://example.com/video.mp4',
      '@filesize': '12345678',
      '@duration': '360',
      '@height': '720',
      '@width': '1280',
      '@isdefault': 'true',
    }
    const expected = {
      url: 'https://example.com/video.mp4',
      fileSize: 12345678,
      duration: 360,
      height: 720,
      width: 1280,
      isDefault: true,
    }

    expect(parseContent(value)).toEqual(expected)
  })

  it('should integrate with common elements', () => {
    const value = {
      '@url': 'https://example.com/video.mp4',
      'media:title': 'Sample Video',
      'media:rating': {
        '#text': 'adult',
        '@scheme': 'urn:simple',
      },
    }
    const expected = {
      url: 'https://example.com/video.mp4',
      title: {
        value: 'Sample Video',
      },
      ratings: [
        {
          value: 'adult',
          scheme: 'urn:simple',
        },
      ],
    }

    expect(parseContent(value)).toEqual(expected)
  })

  it('should handle partial objects (missing url)', () => {
    const value = {
      '@type': 'video/mp4',
      '@medium': 'video',
      'media:title': 'Sample Video',
    }
    const expected = {
      type: 'video/mp4',
      medium: 'video',
      title: {
        value: 'Sample Video',
      },
    }

    expect(parseContent(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    expect(parseContent({})).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseContent('not an object')).toBeUndefined()
    expect(parseContent(undefined)).toBeUndefined()
    expect(parseContent(null)).toBeUndefined()
    expect(parseContent([])).toBeUndefined()
  })
})

describe('parseGroup', () => {
  it('should parse complete group object', () => {
    const value = {
      'media:content': [
        {
          '@url': 'https://example.com/video-hd.mp4',
          '@type': 'video/mp4',
          '@bitrate': 2000,
          '@width': 1920,
          '@height': 1080,
        },
        {
          '@url': 'https://example.com/video-sd.mp4',
          '@type': 'video/mp4',
          '@bitrate': 1000,
          '@width': 640,
          '@height': 360,
        },
      ],
      'media:title': {
        '#text': 'Group Title',
        '@type': 'plain',
      },
      'media:description': {
        '#text': 'Group Description',
        '@type': 'plain',
      },
    }
    const expected = {
      contents: [
        {
          url: 'https://example.com/video-hd.mp4',
          type: 'video/mp4',
          bitrate: 2000,
          width: 1920,
          height: 1080,
        },
        {
          url: 'https://example.com/video-sd.mp4',
          type: 'video/mp4',
          bitrate: 1000,
          width: 640,
          height: 360,
        },
      ],
      // INFO: Common elements would be included here, but they're already tested in
      // retrieveCommonElements, so here are just a few of them.
      title: {
        value: 'Group Title',
        type: 'plain',
      },
      description: {
        value: 'Group Description',
        type: 'plain',
      },
    }

    expect(parseGroup(value)).toEqual(expected)
  })

  it('should parse group with single content object', () => {
    const value = {
      'media:content': {
        '@url': 'https://example.com/video.mp4',
        '@type': 'video/mp4',
      },
      'media:title': 'Group Title',
    }
    const expected = {
      contents: [
        {
          url: 'https://example.com/video.mp4',
          type: 'video/mp4',
        },
      ],
      title: {
        value: 'Group Title',
      },
    }

    expect(parseGroup(value)).toEqual(expected)
  })

  it('should handle group with no content objects', () => {
    const value = {
      'media:title': 'Empty Group',
    }
    const expected = {
      title: {
        value: 'Empty Group',
      },
    }

    expect(parseGroup(value)).toEqual(expected)
  })

  it('should integrate with common elements', () => {
    const value = {
      'media:content': {
        '@url': 'https://example.com/video.mp4',
      },
      'media:rating': {
        '#text': 'adult',
        '@scheme': 'urn:simple',
      },
    }
    const expected = {
      contents: [
        {
          url: 'https://example.com/video.mp4',
        },
      ],
      ratings: [
        {
          value: 'adult',
          scheme: 'urn:simple',
        },
      ],
    }

    expect(parseGroup(value)).toEqual(expected)
  })

  it('should parse group with common elements only', () => {
    const value = {
      'media:title': 'Group Title',
      'media:description': 'Group Description',
    }
    const expected = {
      title: {
        value: 'Group Title',
      },
      description: {
        value: 'Group Description',
      },
    }

    expect(parseGroup(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    expect(parseGroup({})).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(parseGroup('not an object')).toBeUndefined()
    expect(parseGroup(undefined)).toBeUndefined()
    expect(parseGroup(null)).toBeUndefined()
    expect(parseGroup([])).toBeUndefined()
  })
})

describe('retrieveItemOrFeed', () => {
  it('should parse complete item with both group and content elements', () => {
    const value = {
      'media:group': {
        'media:content': [
          {
            '@url': 'https://example.com/video-hd.mp4',
            '@type': 'video/mp4',
          },
          {
            '@url': 'https://example.com/video-sd.mp4',
            '@type': 'video/mp4',
          },
        ],
        'media:title': 'Group Title',
      },
      'media:content': [
        {
          '@url': 'https://example.com/audio.mp3',
          '@type': 'audio/mpeg',
        },
        {
          '@url': 'https://example.com/image.jpg',
          '@type': 'image/jpeg',
        },
      ],
      'media:title': {
        '#text': 'Group Title',
        '@type': 'plain',
      },
      'media:description': {
        '#text': 'Group Description',
        '@type': 'plain',
      },
    }
    const expected = {
      group: {
        contents: [
          {
            url: 'https://example.com/video-hd.mp4',
            type: 'video/mp4',
          },
          {
            url: 'https://example.com/video-sd.mp4',
            type: 'video/mp4',
          },
        ],
        title: {
          value: 'Group Title',
        },
      },
      contents: [
        {
          url: 'https://example.com/audio.mp3',
          type: 'audio/mpeg',
        },
        {
          url: 'https://example.com/image.jpg',
          type: 'image/jpeg',
        },
      ],
      // INFO: Common elements would be included here, but they're already tested in
      // retrieveCommonElements, so here are just a few of them.
      title: {
        value: 'Group Title',
        type: 'plain',
      },
      description: {
        value: 'Group Description',
        type: 'plain',
      },
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with only group element', () => {
    const value = {
      'media:group': {
        'media:content': [
          {
            '@url': 'https://example.com/video-hd.mp4',
            '@type': 'video/mp4',
          },
        ],
        'media:title': 'Group Title',
      },
    }
    const expected = {
      group: {
        contents: [
          {
            url: 'https://example.com/video-hd.mp4',
            type: 'video/mp4',
          },
        ],
        title: {
          value: 'Group Title',
        },
      },
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with only content elements', () => {
    const value = {
      'media:content': [
        {
          '@url': 'https://example.com/audio.mp3',
          '@type': 'audio/mpeg',
        },
        {
          '@url': 'https://example.com/image.jpg',
          '@type': 'image/jpeg',
        },
      ],
    }
    const expected = {
      contents: [
        {
          url: 'https://example.com/audio.mp3',
          type: 'audio/mpeg',
        },
        {
          url: 'https://example.com/image.jpg',
          type: 'image/jpeg',
        },
      ],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with single content element', () => {
    const value = {
      'media:content': {
        '@url': 'https://example.com/audio.mp3',
        '@type': 'audio/mpeg',
      },
    }
    const expected = {
      contents: [
        {
          url: 'https://example.com/audio.mp3',
          type: 'audio/mpeg',
        },
      ],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty objects', () => {
    expect(retrieveItemOrFeed({})).toBeUndefined()
  })

  it('should return undefined for unsupported input', () => {
    expect(retrieveItemOrFeed('not an object')).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed([])).toBeUndefined()
  })
})
