import { describe, expect, it } from 'bun:test'
import {
  parseAlternateEnclosure,
  parseDonate,
  parseLiveStream,
  parseMetamark,
  parsePoster,
  parseRating,
  parseSubscribe,
  retrieveFeed,
  retrieveItem,
} from './utils.js'

describe('retrieveItem', () => {
  const expectedFull = {
    poster: {
      url: 'https://example.com/poster.jpg',
    },
    isHd: true,
    embed: '<iframe src="https://example.com/embed"></iframe>',
    webm: {
      src: 'https://example.com/video.webm',
      type: 'video/webm',
      length: 1024,
    },
    mp4: {
      src: 'https://example.com/video.mp4',
      type: 'video/mp4',
      length: 2048,
    },
    metamarks: [
      {
        type: 'ad',
        link: 'https://example.com/ad',
        position: 120,
        duration: 30,
        value: 'ad-123456',
      },
    ],
  }

  it('should parse complete item object with all properties (with #text)', () => {
    const value = {
      'rawvoice:poster': {
        '@url': 'https://example.com/poster.jpg',
      },
      'rawvoice:ishd': { '#text': 'yes' },
      'rawvoice:embed': { '#text': '<iframe src="https://example.com/embed"></iframe>' },
      'rawvoice:webm': {
        '@src': 'https://example.com/video.webm',
        '@type': 'video/webm',
        '@length': 1024,
      },
      'rawvoice:mp4': {
        '@src': 'https://example.com/video.mp4',
        '@type': 'video/mp4',
        '@length': 2048,
      },
      'rawvoice:metamark': {
        '#text': 'ad-123456',
        '@type': 'ad',
        '@link': 'https://example.com/ad',
        '@position': 120,
        '@duration': 30,
      },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object with all properties (without #text)', () => {
    const value = {
      'rawvoice:poster': {
        '@url': 'https://example.com/poster.jpg',
      },
      'rawvoice:ishd': 'yes',
      'rawvoice:embed': '<iframe src="https://example.com/embed"></iframe>',
      'rawvoice:webm': {
        '@src': 'https://example.com/video.webm',
        '@type': 'video/webm',
        '@length': 1024,
      },
      'rawvoice:mp4': {
        '@src': 'https://example.com/video.mp4',
        '@type': 'video/mp4',
        '@length': 2048,
      },
      'rawvoice:metamark': {
        '#text': 'ad-123456',
        '@type': 'ad',
        '@link': 'https://example.com/ad',
        '@position': 120,
        '@duration': 30,
      },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should handle HTML entities in embed', () => {
    const value = {
      'rawvoice:embed': { '#text': '&lt;iframe&gt;&lt;/iframe&gt;' },
    }
    const expected = {
      embed: '<iframe></iframe>',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections in embed', () => {
    const value = {
      'rawvoice:embed': { '#text': '<![CDATA[<iframe src="test"></iframe>]]>' },
    }
    const expected = {
      embed: '<iframe src="test"></iframe>',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'rawvoice:ishd': '',
      'rawvoice:embed': { '#text': 'content' },
    }
    const expected = {
      embed: 'content',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'rawvoice:ishd': '   ',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when no rawvoice properties exist', () => {
    const value = {
      title: { '#text': 'Not a rawvoice item' },
      'dc:creator': { '#text': 'John Doe' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })

  it('should handle objects with missing #text property', () => {
    const value = {
      'rawvoice:ishd': {},
      'rawvoice:embed': { '#text': '<div>content</div>' },
    }
    const expected = {
      embed: '<div>content</div>',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle mixed valid and invalid properties', () => {
    const value = {
      'rawvoice:ishd': { '#text': 'yes' },
      'rawvoice:embed': { '#text': '' }, // Empty string should be filtered out.
      'other:property': { '#text': 'value' },
    }
    const expected = {
      isHd: true,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle array inputs (uses first element)', () => {
    const value = {
      'rawvoice:ishd': ['yes', 'no'],
      'rawvoice:embed': ['<div>first</div>', '<div>second</div>'],
    }
    const expected = {
      isHd: true,
      embed: '<div>first</div>',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse metamark with all attributes', () => {
    const value = {
      'rawvoice:metamark': {
        '#text': 'ad-123456',
        '@type': 'ad',
        '@link': 'https://example.com/ad',
        '@position': 120,
        '@duration': 30,
      },
    }
    const expected = {
      metamarks: [
        {
          type: 'ad',
          link: 'https://example.com/ad',
          position: 120,
          duration: 30,
          value: 'ad-123456',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse metamark with only required attributes', () => {
    const value = {
      'rawvoice:metamark': {
        '@type': 'comment',
        '@position': 60,
      },
    }
    const expected = {
      metamarks: [
        {
          type: 'comment',
          position: 60,
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse metamark with value only', () => {
    const value = {
      'rawvoice:metamark': {
        '#text': 'Chapter marker text',
      },
    }
    const expected = {
      metamarks: [
        {
          value: 'Chapter marker text',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle metamark with numeric string attributes', () => {
    const value = {
      'rawvoice:metamark': {
        '@type': 'video',
        '@position': '180',
        '@duration': '45',
      },
    }
    const expected = {
      metamarks: [
        {
          type: 'video',
          position: 180,
          duration: 45,
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
    rating: {
      value: 'TV-14',
      tv: 'TV-14',
    },
    liveEmbed: '<iframe src="https://live.example.com"></iframe>',
    flashLiveStream: {
      url: 'rtmp://live.example.com/stream',
      schedule: 'Mon, 15 Jan 2024 10:00:00 GMT',
      duration: '3600',
    },
    httpLiveStream: {
      url: 'https://live.example.com/stream.m3u8',
      schedule: 'Mon, 15 Jan 2024 10:00:00 GMT',
      duration: '3600',
    },
    shoutcastLiveStream: {
      url: 'http://live.example.com:8000/stream',
      schedule: 'Mon, 15 Jan 2024 10:00:00 GMT',
      duration: '3600',
    },
    liveStream: {
      url: 'https://example.com/live',
      schedule: 'Mon, 15 Jan 2024 10:00:00 GMT',
      duration: '7200',
      type: 'audio',
    },
    location: 'San Francisco, CA',
    frequency: 'Weekly',
    mycast: true,
    donate: {
      href: 'https://example.com/donate',
      value: 'Support the show',
    },
  }

  it('should parse complete feed object with all properties (with #text)', () => {
    const value = {
      'rawvoice:rating': {
        '#text': 'TV-14',
        '@tv': 'TV-14',
      },
      'rawvoice:liveembed': { '#text': '<iframe src="https://live.example.com"></iframe>' },
      'rawvoice:flashlivestream': {
        '#text': 'rtmp://live.example.com/stream',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '3600',
      },
      'rawvoice:httplivestream': {
        '#text': 'https://live.example.com/stream.m3u8',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '3600',
      },
      'rawvoice:shoutcastlivestream': {
        '#text': 'http://live.example.com:8000/stream',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '3600',
      },
      'rawvoice:livestream': {
        '#text': 'https://example.com/live',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '7200',
        '@type': 'audio',
      },
      'rawvoice:location': { '#text': 'San Francisco, CA' },
      'rawvoice:frequency': { '#text': 'Weekly' },
      'rawvoice:mycast': { '#text': 'yes' },
      'rawvoice:donate': {
        '#text': 'Support the show',
        '@href': 'https://example.com/donate',
      },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete feed object with all properties (without #text)', () => {
    const value = {
      'rawvoice:rating': {
        '#text': 'TV-14',
        '@tv': 'TV-14',
      },
      'rawvoice:liveembed': '<iframe src="https://live.example.com"></iframe>',
      'rawvoice:flashlivestream': {
        '#text': 'rtmp://live.example.com/stream',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '3600',
      },
      'rawvoice:httplivestream': {
        '#text': 'https://live.example.com/stream.m3u8',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '3600',
      },
      'rawvoice:shoutcastlivestream': {
        '#text': 'http://live.example.com:8000/stream',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '3600',
      },
      'rawvoice:livestream': {
        '#text': 'https://example.com/live',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '7200',
        '@type': 'audio',
      },
      'rawvoice:location': 'San Francisco, CA',
      'rawvoice:frequency': 'Weekly',
      'rawvoice:mycast': 'yes',
      'rawvoice:donate': {
        '#text': 'Support the show',
        '@href': 'https://example.com/donate',
      },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should handle HTML entities in liveEmbed', () => {
    const value = {
      'rawvoice:liveembed': { '#text': '&lt;iframe&gt;&lt;/iframe&gt;' },
    }
    const expected = {
      liveEmbed: '<iframe></iframe>',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in liveEmbed', () => {
    const value = {
      'rawvoice:liveembed': { '#text': '<![CDATA[<iframe src="test"></iframe>]]>' },
    }
    const expected = {
      liveEmbed: '<iframe src="test"></iframe>',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'rawvoice:location': '',
      'rawvoice:frequency': { '#text': 'Weekly' },
    }
    const expected = {
      frequency: 'Weekly',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'rawvoice:location': '   ',
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined when no rawvoice properties exist', () => {
    const value = {
      title: { '#text': 'Not a rawvoice feed' },
      'itunes:author': { '#text': 'John Doe' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveFeed('not an object')).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })

  it('should handle objects with missing #text property', () => {
    const value = {
      'rawvoice:location': {},
      'rawvoice:frequency': { '#text': 'Monthly' },
    }
    const expected = {
      frequency: 'Monthly',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle mixed valid and invalid properties', () => {
    const value = {
      'rawvoice:location': { '#text': 'Boston, MA' },
      'rawvoice:frequency': { '#text': '' }, // Empty string should be filtered out.
      'other:property': { '#text': 'value' },
    }
    const expected = {
      location: 'Boston, MA',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle array inputs (uses first element)', () => {
    const value = {
      'rawvoice:location': ['San Francisco, CA', 'Los Angeles, CA'],
      'rawvoice:frequency': ['Weekly', 'Daily'],
    }
    const expected = {
      location: 'San Francisco, CA',
      frequency: 'Weekly',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse subscribe with multiple attributes', () => {
    const value = {
      'rawvoice:subscribe': {
        '@feed': 'https://example.com/feed/podcast/',
        '@itunes': 'https://itunes.apple.com/us/podcast/example/id123',
        '@spotify': 'https://open.spotify.com/show/example123',
      },
    }
    const expected = {
      subscribe: {
        feed: 'https://example.com/feed/podcast/',
        itunes: 'https://itunes.apple.com/us/podcast/example/id123',
        spotify: 'https://open.spotify.com/show/example123',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle subscribe with empty attributes', () => {
    const value = {
      'rawvoice:subscribe': {
        '@feed': 'https://example.com/feed/',
        '@itunes': '',
      },
    }
    const expected = {
      subscribe: {
        feed: 'https://example.com/feed/',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse donate with href and value', () => {
    const value = {
      'rawvoice:donate': {
        '#text': 'Support the show',
        '@href': 'https://example.com/donate',
      },
    }
    const expected = {
      donate: {
        href: 'https://example.com/donate',
        value: 'Support the show',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse donate with only href (no value)', () => {
    const value = {
      'rawvoice:donate': {
        '@href': 'https://example.com/donate',
      },
    }
    const expected = {
      donate: {
        href: 'https://example.com/donate',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle donate with HTML entities in value', () => {
    const value = {
      'rawvoice:donate': {
        '#text': 'Support &amp; Donate',
        '@href': 'https://example.com/donate',
      },
    }
    const expected = {
      donate: {
        href: 'https://example.com/donate',
        value: 'Support & Donate',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle donate with CDATA section in value', () => {
    const value = {
      'rawvoice:donate': {
        '#text': '<![CDATA[Support & Donate]]>',
        '@href': 'https://example.com/donate',
      },
    }
    const expected = {
      donate: {
        href: 'https://example.com/donate',
        value: 'Support & Donate',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle donate with empty value', () => {
    const value = {
      'rawvoice:donate': {
        '#text': '',
        '@href': 'https://example.com/donate',
      },
    }
    const expected = {
      donate: {
        href: 'https://example.com/donate',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle donate with whitespace-only value', () => {
    const value = {
      'rawvoice:donate': {
        '#text': '   ',
        '@href': 'https://example.com/donate',
      },
    }
    const expected = {
      donate: {
        href: 'https://example.com/donate',
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })
})

describe('parseMetamark', () => {
  it('should parse metamark with all properties', () => {
    const value = {
      '#text': 'ad-123456',
      '@type': 'ad',
      '@link': 'https://example.com/ad',
      '@position': 120,
      '@duration': 30,
    }
    const expected = {
      type: 'ad',
      link: 'https://example.com/ad',
      position: 120,
      duration: 30,
      value: 'ad-123456',
    }

    expect(parseMetamark(value)).toEqual(expected)
  })

  it('should parse metamark with minimal properties', () => {
    const value = {
      '@type': 'comment',
      '@position': 60,
    }
    const expected = {
      type: 'comment',
      position: 60,
    }

    expect(parseMetamark(value)).toEqual(expected)
  })

  it('should handle coercible numeric string attributes', () => {
    const value = {
      '@type': 'video',
      '@position': '180',
      '@duration': '45',
    }
    const expected = {
      type: 'video',
      position: 180,
      duration: 45,
    }

    expect(parseMetamark(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseMetamark(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseMetamark(undefined)).toBeUndefined()
    expect(parseMetamark('string')).toBeUndefined()
    expect(parseMetamark(null)).toBeUndefined()
  })
})

describe('parseRating', () => {
  it('should parse rating with all properties', () => {
    const value = {
      '#text': 'TV-14',
      '@tv': 'TV-14',
      '@movie': 'PG-13',
    }
    const expected = {
      value: 'TV-14',
      tv: 'TV-14',
      movie: 'PG-13',
    }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should parse rating from plain string', () => {
    const value = 'TV-G'
    const expected = {
      value: 'TV-G',
    }

    expect(parseRating(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseRating(value)).toBeUndefined()
  })

  it('should return undefined for null and undefined inputs', () => {
    expect(parseRating(undefined)).toBeUndefined()
    expect(parseRating(null)).toBeUndefined()
  })
})

describe('parseLiveStream', () => {
  it('should parse live stream with all properties', () => {
    const value = {
      '#text': 'https://live.example.com/stream.m3u8',
      '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
      '@duration': '3600',
      '@type': 'audio',
    }
    const expected = {
      url: 'https://live.example.com/stream.m3u8',
      schedule: 'Mon, 15 Jan 2024 10:00:00 GMT',
      duration: '3600',
      type: 'audio',
    }

    expect(parseLiveStream(value)).toEqual(expected)
  })

  it('should parse live stream from plain string', () => {
    const value = 'https://live.example.com/stream.m3u8'
    const expected = {
      url: 'https://live.example.com/stream.m3u8',
    }

    expect(parseLiveStream(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseLiveStream(value)).toBeUndefined()
  })

  it('should return undefined for null and undefined inputs', () => {
    expect(parseLiveStream(undefined)).toBeUndefined()
    expect(parseLiveStream(null)).toBeUndefined()
  })

  it.todo('should parse schedule with custom parseDateFn', () => {
    // Pass options.parseDateFn that converts the RFC 822 string into a Date instance.
    // Expected: schedule equals the value returned by parseDateFn instead of the raw string.
  })
})

describe('parsePoster', () => {
  it('should parse poster with url', () => {
    const value = {
      '@url': 'https://example.com/poster.jpg',
    }
    const expected = {
      url: 'https://example.com/poster.jpg',
    }

    expect(parsePoster(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parsePoster(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parsePoster('not an object')).toBeUndefined()
    expect(parsePoster(undefined)).toBeUndefined()
    expect(parsePoster(null)).toBeUndefined()
    expect(parsePoster([])).toBeUndefined()
  })
})

describe('parseAlternateEnclosure', () => {
  it('should parse alternate enclosure with all properties', () => {
    const value = {
      '@src': 'https://example.com/video.webm',
      '@type': 'video/webm',
      '@length': 1024,
    }
    const expected = {
      src: 'https://example.com/video.webm',
      type: 'video/webm',
      length: 1024,
    }

    expect(parseAlternateEnclosure(value)).toEqual(expected)
  })

  it('should parse alternate enclosure with minimal properties', () => {
    const value = {
      '@src': 'https://example.com/video.mp4',
    }
    const expected = {
      src: 'https://example.com/video.mp4',
    }

    expect(parseAlternateEnclosure(value)).toEqual(expected)
  })

  it('should handle coercible numeric string length', () => {
    const value = {
      '@src': 'https://example.com/video.mp4',
      '@length': '2048',
    }
    const expected = {
      src: 'https://example.com/video.mp4',
      length: 2048,
    }

    expect(parseAlternateEnclosure(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseAlternateEnclosure(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseAlternateEnclosure('not an object')).toBeUndefined()
    expect(parseAlternateEnclosure(undefined)).toBeUndefined()
    expect(parseAlternateEnclosure(null)).toBeUndefined()
    expect(parseAlternateEnclosure([])).toBeUndefined()
  })
})

describe('parseSubscribe', () => {
  it('should parse subscribe with multiple attributes', () => {
    const value = {
      '@feed': 'https://example.com/feed/podcast/',
      '@itunes': 'https://itunes.apple.com/us/podcast/example/id123',
      '@spotify': 'https://open.spotify.com/show/example123',
    }
    const expected = {
      feed: 'https://example.com/feed/podcast/',
      itunes: 'https://itunes.apple.com/us/podcast/example/id123',
      spotify: 'https://open.spotify.com/show/example123',
    }

    expect(parseSubscribe(value)).toEqual(expected)
  })

  it('should ignore non-attribute keys', () => {
    const value = {
      '#text': 'Subscribe here',
      '@feed': 'https://example.com/feed/',
    }
    const expected = {
      feed: 'https://example.com/feed/',
    }

    expect(parseSubscribe(value)).toEqual(expected)
  })

  it('should filter out empty attribute values', () => {
    const value = {
      '@feed': 'https://example.com/feed/',
      '@itunes': '',
    }
    const expected = {
      feed: 'https://example.com/feed/',
    }

    expect(parseSubscribe(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseSubscribe(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseSubscribe('not an object')).toBeUndefined()
    expect(parseSubscribe(undefined)).toBeUndefined()
    expect(parseSubscribe(null)).toBeUndefined()
    expect(parseSubscribe([])).toBeUndefined()
  })
})

describe('parseDonate', () => {
  it('should parse donate with all properties', () => {
    const value = {
      '#text': 'Support the show',
      '@href': 'https://example.com/donate',
    }
    const expected = {
      href: 'https://example.com/donate',
      value: 'Support the show',
    }

    expect(parseDonate(value)).toEqual(expected)
  })

  it('should parse donate with minimal properties', () => {
    const value = {
      '@href': 'https://example.com/donate',
    }
    const expected = {
      href: 'https://example.com/donate',
    }

    expect(parseDonate(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseDonate(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseDonate('not an object')).toBeUndefined()
    expect(parseDonate(undefined)).toBeUndefined()
    expect(parseDonate(null)).toBeUndefined()
    expect(parseDonate([])).toBeUndefined()
  })
})
