import { describe, expect, it } from 'bun:test'
import {
  parseCategory,
  parseDuration,
  parseExplicit,
  parseImage,
  parseOwner,
  retrieveFeed,
  retrieveItem,
} from './utils.js'

describe('parseCategory', () => {
  it('should parse a simple category with only text', () => {
    const value = { '@text': 'Technology' }
    const expected = { text: 'Technology' }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should parse a category with single nested subcategory', () => {
    const value = {
      '@text': 'Technology',
      'itunes:category': {
        '@text': 'Software',
      },
    }
    const expected = {
      text: 'Technology',
      categories: [{ text: 'Software' }],
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should parse a category with multiple nested subcategories', () => {
    const value = {
      '@text': 'Technology',
      'itunes:category': [
        { '@text': 'Software' },
        { '@text': 'Programming' },
        { '@text': 'Web Development' },
      ],
    }
    const expected = {
      text: 'Technology',
      categories: [{ text: 'Software' }, { text: 'Programming' }, { text: 'Web Development' }],
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should parse deeply nested categories', () => {
    const value = {
      '@text': 'Technology',
      'itunes:category': [
        {
          '@text': 'Software',
          'itunes:category': { '@text': 'Development Tools' },
        },
        { '@text': 'Programming' },
      ],
    }
    const expected = {
      text: 'Technology',
      categories: [
        {
          text: 'Software',
          categories: [{ text: 'Development Tools' }],
        },
        { text: 'Programming' },
      ],
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should handle coercible string values', () => {
    const value = { '@text': 123 }
    const expected = { text: '123' }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should filter out invalid subcategories', () => {
    const value = {
      '@text': 'Technology',
      'itunes:category': [
        { '@text': 'Software' },
        { notText: 'Invalid' },
        { '@text': 'Programming' },
      ],
    }
    const expected = {
      text: 'Technology',
      categories: [{ text: 'Software' }, { text: 'Programming' }],
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should return category if text is empty', () => {
    const value = {
      '@text': '',
      'itunes:category': [{ '@text': 'Software' }],
    }
    const expected = {
      categories: [
        {
          text: 'Software',
        },
      ],
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should return sub-categories if text is missing', () => {
    const value = {
      'itunes:category': [{ '@text': 'Software' }],
    }
    const expected = {
      categories: [
        {
          text: 'Software',
        },
      ],
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should omit categories if none are valid', () => {
    const value = {
      '@text': 'Technology',
      'itunes:category': [{ notText: 'Invalid1' }, { notText: 'Invalid2' }],
    }
    const expected = {
      text: 'Technology',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(parseCategory('not an object')).toBeUndefined()
    expect(parseCategory(undefined)).toBeUndefined()
    expect(parseCategory(null)).toBeUndefined()
    expect(parseCategory([])).toBeUndefined()
    expect(parseCategory(123)).toBeUndefined()
  })
})

describe('parseOwner', () => {
  const expectedFull = {
    name: 'John Doe',
    email: 'john@example.com',
  }

  it('should parse owner with both name and email (with #text)', () => {
    const value = {
      'itunes:name': { '#text': 'John Doe' },
      'itunes:email': { '#text': 'john@example.com' },
    }

    expect(parseOwner(value)).toEqual(expectedFull)
  })

  it('should parse owner with both name and email (without #text)', () => {
    const value = {
      'itunes:name': 'John Doe',
      'itunes:email': 'john@example.com',
    }

    expect(parseOwner(value)).toEqual(expectedFull)
  })

  it('should parse owner with both name and email (with array of values)', () => {
    const value = {
      'itunes:name': ['John Doe', 'Jane Smith'],
      'itunes:email': ['john@example.com', 'jane@example.com'],
    }

    expect(parseOwner(value)).toEqual(expectedFull)
  })

  it('should parse owner with only name', () => {
    const value = {
      'itunes:name': { '#text': 'John Doe' },
    }
    const expected = {
      name: 'John Doe',
    }

    expect(parseOwner(value)).toEqual(expected)
  })

  it('should return owner with only email when name is missing', () => {
    const value = {
      'itunes:email': { '#text': 'john@example.com' },
    }
    const expected = {
      email: 'john@example.com',
    }

    expect(parseOwner(value)).toEqual(expected)
  })

  it('should return undefined when name is empty', () => {
    const value = {
      'itunes:name': { '#text': '' },
      'itunes:email': { '#text': 'john@example.com' },
    }
    const expected = {
      email: 'john@example.com',
    }

    expect(parseOwner(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'itunes:name': { '#text': 'John &amp; Jane Doe' },
      'itunes:email': { '#text': 'john&jane@example.com' },
    }
    const expected = {
      name: 'John & Jane Doe',
      email: 'john&jane@example.com',
    }

    expect(parseOwner(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'itunes:name': { '#text': '<![CDATA[John Doe]]>' },
      'itunes:email': { '#text': '<![CDATA[john@example.com]]>' },
    }
    const expected = {
      name: 'John Doe',
      email: 'john@example.com',
    }

    expect(parseOwner(value)).toEqual(expected)
  })
  it('should handle non-string values for name and email', () => {
    const value = {
      'itunes:name': { '#text': 123 },
      'itunes:email': { '#text': true },
    }
    const expected = {
      name: '123',
    }

    expect(parseOwner(value)).toEqual(expected)
  })

  it('should handle missing #text properties', () => {
    const value = {
      'itunes:name': {},
      'itunes:email': {},
    }

    expect(parseOwner(value)).toBeUndefined()
  })

  it('should handle null or undefined properties', () => {
    const value = {
      'itunes:name': null,
      'itunes:email': undefined,
    }

    expect(parseOwner(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseOwner(null)).toBeUndefined()
    expect(parseOwner(undefined)).toBeUndefined()
    expect(parseOwner('string')).toBeUndefined()
    expect(parseOwner(123)).toBeUndefined()
    expect(parseOwner(true)).toBeUndefined()
    expect(parseOwner([])).toBeUndefined()
    expect(parseOwner(() => {})).toBeUndefined()
  })
})

describe('parseExplicit', () => {
  it('should return boolean true', () => {
    const value = true

    expect(parseExplicit(value)).toBe(true)
  })

  it('should return boolean false', () => {
    const value = false

    expect(parseExplicit(value)).toBe(false)
  })

  it('should handle true string', () => {
    const value = 'true'

    expect(parseExplicit(value)).toBe(true)
  })

  it('should handle false string', () => {
    const value = 'false'

    expect(parseExplicit(value)).toBe(false)
  })

  it('should handle "yes" string as true', () => {
    const value = 'yes'

    expect(parseExplicit(value)).toBe(true)
  })

  it('should handle case insensitive "yes" string', () => {
    const value = 'YeS'

    expect(parseExplicit(value)).toBe(true)
  })

  it('should handle values with whitespace around', () => {
    expect(parseExplicit(' yes ')).toBe(true)
    expect(parseExplicit('\tyes\t')).toBe(true)
    expect(parseExplicit('\nyes\n')).toBe(true)
    expect(parseExplicit(' \t\nYES\n\t ')).toBe(true)
    expect(parseExplicit(' explicit ')).toBe(true)
    expect(parseExplicit('\texplicit\t')).toBe(true)
    expect(parseExplicit('\nEXPLICIT\n')).toBe(true)
    expect(parseExplicit(' true ')).toBe(true)
    expect(parseExplicit('\tfalse\t')).toBe(false)
  })

  it('should handle "explicit" string as true', () => {
    const value = 'explicit'

    expect(parseExplicit(value)).toBe(true)
  })

  it('should handle case insensitive "explicit" string', () => {
    const value = 'ExPlIcIt'

    expect(parseExplicit(value)).toBe(true)
  })

  it('should handle "explicit" with whitespace around', () => {
    expect(parseExplicit(' explicit')).toBe(true)
    expect(parseExplicit('explicit ')).toBe(true)
    expect(parseExplicit(' explicit ')).toBe(true)
    expect(parseExplicit('  explicit  ')).toBe(true)
    expect(parseExplicit('\texplicit\t')).toBe(true)
    expect(parseExplicit('\nexplicit\n')).toBe(true)
    expect(parseExplicit(' \t\nexplicit\n\t ')).toBe(true)
  })

  it('should handle case insensitive "explicit" with whitespace', () => {
    expect(parseExplicit(' EXPLICIT ')).toBe(true)
    expect(parseExplicit('  ExPlIcIt  ')).toBe(true)
    expect(parseExplicit('\tExplicit\n')).toBe(true)
  })

  it('should handle "clean" string as false', () => {
    const value = 'clean'

    expect(parseExplicit(value)).toBe(false)
  })

  it('should handle "f" string as false', () => {
    const value = 'f'

    expect(parseExplicit(value)).toBe(false)
  })

  it('should handle other non-true strings as false', () => {
    const value = 'anything'

    expect(parseExplicit(value)).toBe(false)
  })

  it('should handle empty string as false', () => {
    const value = ''

    expect(parseExplicit(value)).toBe(false)
  })

  it('should return number as undefined', () => {
    const value = 420

    expect(parseExplicit(value)).toBeUndefined()
  })

  it('should handle array as undefined', () => {
    const value = ['javascript', { another: 'typescript' }]

    expect(parseExplicit(value)).toBeUndefined()
  })

  it('should handle object as undefined', () => {
    const value = { name: 'javascript' }

    expect(parseExplicit(value)).toBeUndefined()
  })

  it('should handle null as undefined', () => {
    const value = null

    expect(parseExplicit(value)).toBeUndefined()
  })

  it('should handle undefined as undefined', () => {
    const value = undefined

    expect(parseExplicit(value)).toBeUndefined()
  })
})

describe('parseDuration', () => {
  it('should handle numbers directly', () => {
    expect(parseDuration(42)).toEqual(42)
    expect(parseDuration(0)).toEqual(0)
    expect(parseDuration(3600)).toEqual(3600)
  })

  it('should handle numeric strings', () => {
    expect(parseDuration('120')).toEqual(120)
    expect(parseDuration('0')).toEqual(0)
    expect(parseDuration('3600')).toEqual(3600)
  })

  it('should parse HH:MM:SS format', () => {
    expect(parseDuration('01:30:45')).toEqual(5445)
    expect(parseDuration('00:00:30')).toEqual(30)
    expect(parseDuration('02:00:00')).toEqual(7200)
    expect(parseDuration('100:00:00')).toEqual(360000)
  })

  it('should parse MM:SS format', () => {
    expect(parseDuration('05:30')).toEqual(330)
    expect(parseDuration('00:45')).toEqual(45)
    expect(parseDuration('90:00')).toEqual(5400)
    expect(parseDuration('1:30')).toEqual(90)
  })

  it('should handle invalid time formats', () => {
    expect(parseDuration('01:30:45:60')).toBeUndefined()
    expect(parseDuration(':30:45')).toBeUndefined()
    expect(parseDuration('01::45')).toBeUndefined()
    expect(parseDuration('01:30:')).toBeUndefined()
  })

  it('should handle non-numeric parts in time format', () => {
    expect(parseDuration('1a:30:45')).toBeUndefined()
    expect(parseDuration('01:3b:45')).toBeUndefined()
    expect(parseDuration('01:30:4c')).toBeUndefined()
    expect(parseDuration('01:xx:45')).toBeUndefined()
    expect(parseDuration('xx:30')).toBeUndefined()
    expect(parseDuration('01:xx')).toBeUndefined()
  })

  it('should handle empty time parts appropriately', () => {
    expect(parseDuration(':')).toBeUndefined()
    expect(parseDuration('::')).toBeUndefined()
    expect(parseDuration('')).toBeUndefined()
  })

  it('should handle strings that are not valid durations', () => {
    expect(parseDuration('not a duration')).toBeUndefined()
    expect(parseDuration('1h30m')).toBeUndefined()
    expect(parseDuration('1:30:45 PM')).toBeUndefined()
  })

  it('should handle arrays', () => {
    const value = [1, 2, 3]

    expect(parseDuration(value)).toBeUndefined()
  })

  it('should handle objects', () => {
    const value = { duration: '01:30:45' }

    expect(parseDuration(value)).toBeUndefined()
  })

  it('should handle boolean values', () => {
    expect(parseDuration(true)).toBeUndefined()
    expect(parseDuration(false)).toBeUndefined()
  })

  it('should handle null', () => {
    expect(parseDuration(null)).toBeUndefined()
  })

  it('should handle undefined', () => {
    expect(parseDuration(undefined)).toBeUndefined()
  })
})

describe('parseImage', () => {
  it('should parse image with @href attribute', () => {
    const value = { '@href': 'https://example.com/image.jpg' }
    const expected = 'https://example.com/image.jpg'

    expect(parseImage(value)).toEqual(expected)
  })

  it('should parse image in a non-standard format', () => {
    const value = 'https://example.com/image.jpg'
    const expected = 'https://example.com/image.jpg'

    expect(parseImage(value)).toEqual(expected)
  })

  it('should return undefined when @href is missing', () => {
    const value = { otherAttr: 'value' }

    expect(parseImage(value)).toBeUndefined()
  })

  it('should return undefined when @href is empty', () => {
    const value = { '@href': '' }

    expect(parseImage(value)).toBeUndefined()
  })

  it('should handle HTML entities in @href', () => {
    const value = { '@href': 'https://example.com/image&amp;.jpg' }
    const expected = 'https://example.com/image&.jpg'

    expect(parseImage(value)).toEqual(expected)
  })

  it('should handle CDATA in @href', () => {
    const value = { '@href': '<![CDATA[https://example.com/image.jpg]]>' }
    const expected = 'https://example.com/image.jpg'

    expect(parseImage(value)).toEqual(expected)
  })

  it('should coerce non-string @href values to string', () => {
    const value = { '@href': 123 }
    const expected = '123'

    expect(parseImage(value)).toEqual(expected)
  })

  it('should return undefined for null or undefined @href', () => {
    expect(parseImage({ '@href': null })).toBeUndefined()
    expect(parseImage({ '@href': undefined })).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseImage(null)).toBeUndefined()
    expect(parseImage(undefined)).toBeUndefined()
    expect(parseImage(true)).toBeUndefined()
    expect(parseImage([])).toBeUndefined()
    expect(parseImage(() => {})).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  const expectedFull = {
    duration: 3600,
    image: 'https://example.com/image.jpg',
    explicit: true,
    title: 'Episode Title',
    episode: 42,
    season: 2,
    episodeType: 'full',
    block: true,
    keywords: ['podcast', 'technology', 'programming'],
    summary: 'A detailed summary of this episode',
    subtitle: 'Episode subtitle',
  }

  it('should parse all iTunes item properties when present (with #text)', () => {
    const value = {
      'itunes:duration': { '#text': '3600' },
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:explicit': { '#text': 'yes' },
      'itunes:title': { '#text': 'Episode Title' },
      'itunes:episode': { '#text': '42' },
      'itunes:season': { '#text': '2' },
      'itunes:episodetype': { '#text': 'full' },
      'itunes:block': { '#text': 'yes' },
      'itunes:keywords': { '#text': 'podcast,technology,programming' },
      'itunes:summary': { '#text': 'A detailed summary of this episode' },
      'itunes:subtitle': { '#text': 'Episode subtitle' },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse all iTunes item properties when present (without #text)', () => {
    const value = {
      'itunes:duration': '3600',
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:explicit': 'yes',
      'itunes:title': 'Episode Title',
      'itunes:episode': '42',
      'itunes:season': '2',
      'itunes:episodetype': 'full',
      'itunes:block': 'yes',
      'itunes:keywords': 'podcast,technology,programming',
      'itunes:summary': 'A detailed summary of this episode',
      'itunes:subtitle': 'Episode subtitle',
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse all iTunes item properties when present (with array of values)', () => {
    const value = {
      'itunes:duration': ['3600', '1800'],
      'itunes:image': [
        { '@href': 'https://example.com/image.jpg' },
        { '@href': 'https://example.com/alternate-image.jpg' },
      ],
      'itunes:explicit': ['yes', 'no'],
      'itunes:title': ['Episode Title', 'Alternative Episode Title'],
      'itunes:episode': ['42', '43'],
      'itunes:season': ['2', '3'],
      'itunes:episodetype': ['full', 'trailer'],
      'itunes:block': ['yes', 'no'],
      'itunes:keywords': ['podcast,technology,programming', 'development,coding,software'],
      'itunes:summary': [
        'A detailed summary of this episode',
        'An alternative description of this episode',
      ],
      'itunes:subtitle': ['Episode subtitle', 'Alternative episode subtitle'],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse only the valid properties and omit undefined ones', () => {
    const value = {
      'itunes:duration': { '#text': 'not a number' },
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:explicit': { '#text': 'clean' },
      'itunes:title': { '#text': 'Episode Title' },
      'itunes:episode': { '#text': 'not a number' },
      'itunes:season': { '#text': '2' },
    }
    const expected = {
      image: 'https://example.com/image.jpg',
      explicit: false,
      title: 'Episode Title',
      season: 2,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse duration in various formats', () => {
    const testWithDuration = (durationValue: string, expectedDuration: number) => {
      const value = { 'itunes:duration': { '#text': durationValue } }
      const expected = retrieveItem(value)

      expect(expected).toHaveProperty('duration', expectedDuration)
    }

    testWithDuration('3600', 3600)
    testWithDuration('01:30:00', 5400)
    testWithDuration('45:30', 2730)
  })

  it('should parse explicit value correctly', () => {
    const testWithExplicit = (explicitValue: string, expectedExplicit: boolean) => {
      const value = {
        'itunes:explicit': { '#text': explicitValue },
      }
      const result = retrieveItem(value)
      expect(result).toHaveProperty('explicit', expectedExplicit)
    }

    testWithExplicit('true', true)
    testWithExplicit('false', false)
    testWithExplicit('yes', true)
    testWithExplicit('no', false)
    testWithExplicit('explicit', true)
    testWithExplicit('clean', false)
  })

  it('should parse block value correctly', () => {
    const testWithBlock = (blockValue: string, expectedBlock: boolean) => {
      const value = {
        'itunes:block': { '#text': blockValue },
      }
      const result = retrieveItem(value)
      expect(result).toHaveProperty('block', expectedBlock)
    }

    testWithBlock('yes', true)
    testWithBlock('no', false)
    testWithBlock('true', true)
    testWithBlock('false', false)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'itunes:title': { '#text': 'Title with &amp; symbol' },
    }
    const expected = {
      title: 'Title with & symbol',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'itunes:title': { '#text': '<![CDATA[Title with <tags> inside]]>' },
    }
    const expected = {
      title: 'Title with <tags> inside',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle mix of valid and invalid properties', () => {
    const value = {
      'itunes:duration': { '#text': '3600' },
      'itunes:image': { '#text': null },
      'itunes:explicit': { '#text': [] },
      'itunes:title': { '#text': 'Episode Title' },
      'itunes:episode': { '#text': '42' },
      'itunes:season': { '#text': 'not a number' },
      'itunes:episodeType': {},
      'itunes:block': { '#text': 'invalid value' },
    }
    const expected = {
      duration: 3600,
      title: 'Episode Title',
      episode: 42,
      block: false,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle nested tag structure correctly', () => {
    const value = {
      'some:wrapper': {
        'itunes:duration': { '#text': '3600' },
      },
      'itunes:title': { '#text': 'Episode Title' },
    }
    const expected = {
      title: 'Episode Title',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined when no valid item properties are present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
    expect(retrieveItem(true)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
    expect(retrieveItem(() => {})).toBeUndefined()
  })

  it('should return undefined if all parsed properties are undefined', () => {
    const value = {
      'itunes:duration': { '#text': 'not a number' },
      'itunes:image': null,
      'itunes:explicit': { '#text': {} },
      'itunes:title': {},
      'itunes:episode': { '#text': 'not a number' },
      'itunes:season': { '#text': 'not a number' },
      'itunes:episodeType': null,
      'itunes:block': { '#text': {} },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
    image: 'https://example.com/image.jpg',
    explicit: true,
    author: 'Podcast Author',
    title: 'Podcast Title',
    type: 'episodic',
    newFeedUrl: 'https://example.com/new-feed',
    block: true,
    complete: true,
    applePodcastsVerify: 'verification-code',
    categories: [
      { text: 'Technology' },
      { text: 'Business', categories: [{ text: 'Entrepreneurship' }] },
    ],
    owner: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    keywords: ['podcast', 'technology', 'programming'],
    summary: 'A detailed summary of this episode',
    subtitle: 'Episode subtitle',
  }

  it('should parse all iTunes feed properties when present (with #text)', () => {
    const value = {
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:explicit': { '#text': 'yes' },
      'itunes:author': { '#text': 'Podcast Author' },
      'itunes:title': { '#text': 'Podcast Title' },
      'itunes:type': { '#text': 'episodic' },
      'itunes:new-feed-url': { '#text': 'https://example.com/new-feed' },
      'itunes:block': { '#text': 'yes' },
      'itunes:complete': { '#text': 'yes' },
      'itunes:applepodcastsverify': { '#text': 'verification-code' },
      'itunes:category': [
        { '@text': 'Technology' },
        { '@text': 'Business', 'itunes:category': { '@text': 'Entrepreneurship' } },
      ],
      'itunes:owner': {
        'itunes:name': { '#text': 'John Doe' },
        'itunes:email': { '#text': 'john@example.com' },
      },
      'itunes:keywords': { '#text': 'podcast,technology,programming' },
      'itunes:summary': { '#text': 'A detailed summary of this episode' },
      'itunes:subtitle': { '#text': 'Episode subtitle' },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse all iTunes feed properties when present (without #text)', () => {
    const value = {
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:explicit': 'yes',
      'itunes:author': 'Podcast Author',
      'itunes:title': 'Podcast Title',
      'itunes:type': 'episodic',
      'itunes:new-feed-url': 'https://example.com/new-feed',
      'itunes:block': 'yes',
      'itunes:complete': 'yes',
      'itunes:applepodcastsverify': 'verification-code',
      'itunes:category': [
        { '@text': 'Technology' },
        { '@text': 'Business', 'itunes:category': { '@text': 'Entrepreneurship' } },
      ],
      'itunes:owner': {
        'itunes:name': 'John Doe',
        'itunes:email': 'john@example.com',
      },
      'itunes:keywords': 'podcast,technology,programming',
      'itunes:summary': 'A detailed summary of this episode',
      'itunes:subtitle': 'Episode subtitle',
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse all iTunes feed properties when present (with array of values)', () => {
    const value = {
      'itunes:image': [
        { '@href': 'https://example.com/image.jpg' },
        { '@href': 'https://example.com/image2.jpg' },
      ],
      'itunes:explicit': ['yes', 'no'],
      'itunes:author': ['Podcast Author', 'Another Author'],
      'itunes:title': ['Podcast Title', 'Alternative Podcast Title'],
      'itunes:type': ['episodic', 'serial'],
      'itunes:new-feed-url': ['https://example.com/new-feed', 'https://example.com/alternate-feed'],
      'itunes:block': ['yes', 'no'],
      'itunes:complete': ['yes', 'no'],
      'itunes:applepodcastsverify': ['verification-code', 'secondary-verification-code'],
      'itunes:category': [
        { '@text': 'Technology' },
        { '@text': 'Business', 'itunes:category': { '@text': 'Entrepreneurship' } },
      ],
      'itunes:owner': [
        {
          'itunes:name': 'John Doe',
          'itunes:email': 'john@example.com',
        },
        {
          'itunes:name': 'Jane Smith',
          'itunes:email': 'jane@example.com',
        },
      ],
      'itunes:keywords': ['podcast,technology,programming', 'development,coding,software'],
      'itunes:summary': [
        'A detailed summary of this episode',
        'An alternative description of this podcast content',
      ],
      'itunes:subtitle': ['Episode subtitle', 'Alternative episode tagline'],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse only the valid properties and omit undefined ones', () => {
    const value = {
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:explicit': { '#text': 'clean' },
      'itunes:author': { '#text': 'Podcast Author' },
      'itunes:title': {},
      'itunes:type': { '#text': [] },
      'itunes:new-feed-url': null,
      'itunes:block': { '#text': 'tRuE' },
      'itunes:category': { '@text': 'Technology' },
    }
    const expected = {
      image: 'https://example.com/image.jpg',
      explicit: false,
      author: 'Podcast Author',
      block: true,
      categories: [{ text: 'Technology' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle missing image @href attribute', () => {
    const value = {
      'itunes:image': {},
      'itunes:author': { '#text': 'Podcast Author' },
    }
    const expected = {
      author: 'Podcast Author',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse explicit value correctly', () => {
    const testWithExplicit = (explicitValue: string, expectedExplicit: boolean) => {
      const value = {
        'itunes:image': { '@href': 'https://example.com/image.jpg' },
        'itunes:explicit': { '#text': explicitValue },
      }
      const expected = {
        image: 'https://example.com/image.jpg',
        explicit: expectedExplicit,
      }

      expect(retrieveFeed(value)).toEqual(expected)
    }

    testWithExplicit('true', true)
    testWithExplicit('false', false)
    testWithExplicit('yes', true)
    testWithExplicit('no', false)
    testWithExplicit('explicit', true)
    testWithExplicit('clean', false)
  })

  it('should parse block and complete values correctly', () => {
    const value = {
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:block': { '#text': 'yes' },
      'itunes:complete': { '#text': 'no' },
    }
    const expected = {
      image: 'https://example.com/image.jpg',
      block: true,
      complete: false,
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:author': { '#text': 'Author with &amp; symbol' },
    }
    const expected = {
      image: 'https://example.com/image.jpg',
      author: 'Author with & symbol',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:author': { '#text': '<![CDATA[Author with <formatting> inside]]>' },
    }
    const expected = {
      image: 'https://example.com/image.jpg',
      author: 'Author with <formatting> inside',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse single category correctly', () => {
    const value = {
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:category': { '@text': 'Technology' },
    }
    const expected = {
      image: 'https://example.com/image.jpg',
      categories: [{ text: 'Technology' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse multiple categories with subcategories', () => {
    const value = {
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:category': [
        { '@text': 'Technology' },
        { '@text': 'Business', 'itunes:category': { '@text': 'Entrepreneurship' } },
        { '@text': 'Education', 'itunes:category': { '@text': 'How To' } },
      ],
    }
    const expected = {
      image: 'https://example.com/image.jpg',
      categories: [
        { text: 'Technology' },
        { text: 'Business', categories: [{ text: 'Entrepreneurship' }] },
        { text: 'Education', categories: [{ text: 'How To' }] },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle invalid category structure', () => {
    const value = {
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:category': [
        { '@text': 'Technology' },
        {},
        { other: 'value' },
        { '@text': 'Business', 'itunes:category': {} },
      ],
    }
    const expected = {
      image: 'https://example.com/image.jpg',
      categories: [{ text: 'Technology' }, { text: 'Business' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle Apple Podcasts verification tag', () => {
    const value = {
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
      'itunes:applepodcastsverify': { '#text': 'verification-code' },
    }
    const expected = {
      image: 'https://example.com/image.jpg',
      applePodcastsVerify: 'verification-code',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle nested tag structure correctly', () => {
    const value = {
      'some:wrapper': {
        'itunes:image': { '@href': 'https://example.com/nested-image.jpg' },
      },
      'itunes:image': { '@href': 'https://example.com/image.jpg' },
    }
    const expected = {
      image: 'https://example.com/image.jpg',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined when no valid feed properties are present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed(true)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
    expect(retrieveFeed(() => {})).toBeUndefined()
  })

  it('should return undefined if all parsed properties are undefined', () => {
    const value = {
      'itunes:image': {},
      'itunes:explicit': { '#text': {} },
      'itunes:author': {},
      'itunes:title': null,
      'itunes:type': undefined,
      'itunes:new-feed-url': {},
      'itunes:block': { '#text': {} },
      'itunes:complete': { '#text': [] },
      'itunes:applepodcastsverify': null,
      'itunes:category': null,
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })
})
