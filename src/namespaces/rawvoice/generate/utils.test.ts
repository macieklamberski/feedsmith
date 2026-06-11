import { describe, expect, it } from 'bun:test'
import {
  generateAlternateEnclosure,
  generateDonate,
  generateFeed,
  generateItem,
  generateLiveStream,
  generateMetamark,
  generatePoster,
  generateRating,
  generateSubscribe,
} from './utils.js'

describe('generateItem', () => {
  it('should generate valid item object with all properties', () => {
    const value = {
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
    const expected = {
      'rawvoice:poster': {
        '@url': 'https://example.com/poster.jpg',
      },
      'rawvoice:isHd': 'yes',
      'rawvoice:embed': {
        '#cdata': '<iframe src="https://example.com/embed"></iframe>',
      },
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
      'rawvoice:metamark': [
        {
          '#text': 'ad-123456',
          '@type': 'ad',
          '@link': 'https://example.com/ad',
          '@position': 120,
          '@duration': 30,
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should filter out undefined values', () => {
    const value = {
      poster: {
        url: 'https://example.com/poster.jpg',
      },
      isHd: undefined,
      embed: undefined,
    }
    const expected = {
      'rawvoice:poster': {
        '@url': 'https://example.com/poster.jpg',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle false boolean value', () => {
    const value = {
      isHd: false,
      embed: '<div>content</div>',
    }
    const expected = {
      'rawvoice:isHd': 'no',
      'rawvoice:embed': {
        '#cdata': '<div>content</div>',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })

  it('should handle objects with all undefined values', () => {
    const value = {
      poster: undefined,
      isHd: undefined,
      embed: undefined,
      webm: undefined,
      mp4: undefined,
      metamarks: undefined,
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should generate metamark with all attributes', () => {
    const value = {
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
    const expected = {
      'rawvoice:metamark': [
        {
          '#text': 'ad-123456',
          '@type': 'ad',
          '@link': 'https://example.com/ad',
          '@position': 120,
          '@duration': 30,
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate metamark with only required attributes', () => {
    const value = {
      metamarks: [
        {
          type: 'comment',
          position: 60,
        },
      ],
    }
    const expected = {
      'rawvoice:metamark': [
        {
          '@type': 'comment',
          '@position': 60,
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate metamark with value only', () => {
    const value = {
      metamarks: [
        {
          value: 'Chapter marker text',
        },
      ],
    }
    const expected = {
      'rawvoice:metamark': [
        {
          '#text': 'Chapter marker text',
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should filter out undefined metamark attributes', () => {
    const value = {
      metamarks: [
        {
          type: 'video',
          link: undefined,
          position: 180,
          duration: undefined,
          value: 'Video marker',
        },
      ],
    }
    const expected = {
      'rawvoice:metamark': [
        {
          '#text': 'Video marker',
          '@type': 'video',
          '@position': 180,
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })
})

describe('generateMetamark', () => {
  it('should generate metamark with all properties', () => {
    const value = {
      type: 'ad',
      link: 'https://example.com/ad',
      position: 120,
      duration: 30,
      value: 'ad-123456',
    }
    const expected = {
      '#text': 'ad-123456',
      '@type': 'ad',
      '@link': 'https://example.com/ad',
      '@position': 120,
      '@duration': 30,
    }

    expect(generateMetamark(value)).toEqual(expected)
  })

  it('should generate metamark with minimal properties', () => {
    const value = {
      type: 'comment',
      position: 60,
    }
    const expected = {
      '@type': 'comment',
      '@position': 60,
    }

    expect(generateMetamark(value)).toEqual(expected)
  })

  it('should generate metamark with special characters in value', () => {
    const value = {
      type: 'comment',
      value: 'Q&A segment',
    }
    const expected = {
      '#cdata': 'Q&A segment',
      '@type': 'comment',
    }

    expect(generateMetamark(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateMetamark(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateMetamark(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateMetamark('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateMetamark(null)).toBeUndefined()
  })
})

describe('generateRating', () => {
  it('should generate rating with all properties', () => {
    const value = {
      value: 'TV-14',
      tv: 'TV-14',
      movie: 'PG-13',
    }
    const expected = {
      '#text': 'TV-14',
      '@tv': 'TV-14',
      '@movie': 'PG-13',
    }

    expect(generateRating(value)).toEqual(expected)
  })

  it('should generate rating with minimal properties', () => {
    const value = {
      value: 'TV-G',
    }
    const expected = {
      '#text': 'TV-G',
    }

    expect(generateRating(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateRating(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateRating(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateRating('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateRating(null)).toBeUndefined()
  })
})

describe('generateLiveStream', () => {
  it('should generate live stream with all properties', () => {
    const value = {
      url: 'https://live.example.com/stream.m3u8',
      schedule: new Date('Mon, 15 Jan 2024 10:00:00 GMT'),
      duration: '3600',
      type: 'audio',
    }
    const expected = {
      '#text': 'https://live.example.com/stream.m3u8',
      '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
      '@duration': '3600',
      '@type': 'audio',
    }

    expect(generateLiveStream(value)).toEqual(expected)
  })

  it('should generate live stream with minimal properties', () => {
    const value = {
      url: 'https://live.example.com/stream.m3u8',
    }
    const expected = {
      '#text': 'https://live.example.com/stream.m3u8',
    }

    expect(generateLiveStream(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateLiveStream(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateLiveStream(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateLiveStream('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateLiveStream(null)).toBeUndefined()
  })
})

describe('generatePoster', () => {
  it('should generate poster with url', () => {
    const value = {
      url: 'https://example.com/poster.jpg',
    }
    const expected = {
      '@url': 'https://example.com/poster.jpg',
    }

    expect(generatePoster(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generatePoster(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generatePoster(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePoster('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePoster(null)).toBeUndefined()
  })
})

describe('generateAlternateEnclosure', () => {
  it('should generate alternate enclosure with all properties', () => {
    const value = {
      src: 'https://example.com/video.webm',
      type: 'video/webm',
      length: 1024,
    }
    const expected = {
      '@src': 'https://example.com/video.webm',
      '@type': 'video/webm',
      '@length': 1024,
    }

    expect(generateAlternateEnclosure(value)).toEqual(expected)
  })

  it('should generate alternate enclosure with minimal properties', () => {
    const value = {
      src: 'https://example.com/video.mp4',
    }
    const expected = {
      '@src': 'https://example.com/video.mp4',
    }

    expect(generateAlternateEnclosure(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateAlternateEnclosure(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateAlternateEnclosure(undefined)).toBeUndefined()
    expect(generateAlternateEnclosure('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateAlternateEnclosure(null)).toBeUndefined()
  })
})

describe('generateSubscribe', () => {
  it('should generate subscribe with multiple attributes', () => {
    const value = {
      feed: 'https://example.com/feed/podcast/',
      itunes: 'https://itunes.apple.com/us/podcast/example/id123',
      spotify: 'https://open.spotify.com/show/example123',
    }
    const expected = {
      '@feed': 'https://example.com/feed/podcast/',
      '@itunes': 'https://itunes.apple.com/us/podcast/example/id123',
      '@spotify': 'https://open.spotify.com/show/example123',
    }

    expect(generateSubscribe(value)).toEqual(expected)
  })

  it('should filter out empty attribute values', () => {
    const value = {
      feed: 'https://example.com/feed/',
      itunes: '',
    }
    const expected = {
      '@feed': 'https://example.com/feed/',
    }

    expect(generateSubscribe(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateSubscribe(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateSubscribe(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateSubscribe('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateSubscribe(null)).toBeUndefined()
  })
})

describe('generateDonate', () => {
  it('should generate donate with all properties', () => {
    const value = {
      href: 'https://example.com/donate',
      value: 'Support the show',
    }
    const expected = {
      '#text': 'Support the show',
      '@href': 'https://example.com/donate',
    }

    expect(generateDonate(value)).toEqual(expected)
  })

  it('should generate donate with minimal properties', () => {
    const value = {
      href: 'https://example.com/donate',
    }
    const expected = {
      '@href': 'https://example.com/donate',
    }

    expect(generateDonate(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateDonate(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateDonate(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateDonate('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateDonate(null)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate valid feed object with all properties', () => {
    const value = {
      rating: {
        value: 'TV-14',
        tv: 'TV-14',
      },
      liveEmbed: '<iframe src="https://live.example.com"></iframe>',
      flashLiveStream: {
        url: 'rtmp://live.example.com/stream',
        schedule: new Date('Mon, 15 Jan 2024 10:00:00 GMT'),
        duration: '3600',
      },
      httpLiveStream: {
        url: 'https://live.example.com/stream.m3u8',
        schedule: new Date('Mon, 15 Jan 2024 10:00:00 GMT'),
        duration: '3600',
      },
      shoutcastLiveStream: {
        url: 'http://live.example.com:8000/stream',
        schedule: new Date('Mon, 15 Jan 2024 10:00:00 GMT'),
        duration: '3600',
      },
      liveStream: {
        url: 'https://example.com/live',
        schedule: new Date('Mon, 15 Jan 2024 10:00:00 GMT'),
        duration: '7200',
        type: 'audio',
      },
      location: 'San Francisco, CA',
      frequency: 'Weekly',
      mycast: true,
    }
    const expected = {
      'rawvoice:rating': {
        '#text': 'TV-14',
        '@tv': 'TV-14',
      },
      'rawvoice:liveEmbed': {
        '#cdata': '<iframe src="https://live.example.com"></iframe>',
      },
      'rawvoice:flashLiveStream': {
        '#text': 'rtmp://live.example.com/stream',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '3600',
      },
      'rawvoice:httpLiveStream': {
        '#text': 'https://live.example.com/stream.m3u8',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '3600',
      },
      'rawvoice:shoutcastLiveStream': {
        '#text': 'http://live.example.com:8000/stream',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '3600',
      },
      'rawvoice:liveStream': {
        '#text': 'https://example.com/live',
        '@schedule': 'Mon, 15 Jan 2024 10:00:00 GMT',
        '@duration': '7200',
        '@type': 'audio',
      },
      'rawvoice:location': 'San Francisco, CA',
      'rawvoice:frequency': 'Weekly',
      'rawvoice:mycast': 'yes',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should filter out undefined values', () => {
    const value = {
      location: 'Boston, MA',
      frequency: undefined,
      mycast: undefined,
    }
    const expected = {
      'rawvoice:location': 'Boston, MA',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle false boolean value', () => {
    const value = {
      mycast: false,
      location: 'New York, NY',
    }
    const expected = {
      'rawvoice:mycast': 'no',
      'rawvoice:location': 'New York, NY',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should filter out empty string values', () => {
    const value = {
      location: '',
      frequency: 'Weekly',
    }
    const expected = {
      'rawvoice:frequency': 'Weekly',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(generateFeed(undefined)).toBeUndefined()
  })

  it('should handle objects with all undefined values', () => {
    const value = {
      rating: undefined,
      liveEmbed: undefined,
      flashLiveStream: undefined,
      httpLiveStream: undefined,
      shoutcastLiveStream: undefined,
      liveStream: undefined,
      location: undefined,
      frequency: undefined,
      mycast: undefined,
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle location with special characters', () => {
    const value = {
      location: 'San Francisco, CA & Los Angeles, CA',
    }
    const expected = {
      'rawvoice:location': {
        '#cdata': 'San Francisco, CA & Los Angeles, CA',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate subscribe with multiple attributes', () => {
    const value = {
      subscribe: {
        feed: 'https://example.com/feed/podcast/',
        itunes: 'https://itunes.apple.com/us/podcast/example/id123',
        spotify: 'https://open.spotify.com/show/example123',
      },
    }
    const expected = {
      'rawvoice:subscribe': {
        '@feed': 'https://example.com/feed/podcast/',
        '@itunes': 'https://itunes.apple.com/us/podcast/example/id123',
        '@spotify': 'https://open.spotify.com/show/example123',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should filter out empty subscribe attributes', () => {
    const value = {
      subscribe: {
        feed: 'https://example.com/feed/',
        itunes: '',
      },
    }
    const expected = {
      'rawvoice:subscribe': {
        '@feed': 'https://example.com/feed/',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate donate with href and value', () => {
    const value = {
      donate: {
        href: 'https://example.com/donate',
        value: 'Support the show',
      },
    }
    const expected = {
      'rawvoice:donate': {
        '#text': 'Support the show',
        '@href': 'https://example.com/donate',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate donate with only href (no value)', () => {
    const value = {
      donate: {
        href: 'https://example.com/donate',
      },
    }
    const expected = {
      'rawvoice:donate': {
        '@href': 'https://example.com/donate',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate donate with special characters in value', () => {
    const value = {
      donate: {
        href: 'https://example.com/donate',
        value: 'Support & Donate',
      },
    }
    const expected = {
      'rawvoice:donate': {
        '#cdata': 'Support & Donate',
        '@href': 'https://example.com/donate',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should filter out empty donate value', () => {
    const value = {
      donate: {
        href: 'https://example.com/donate',
        value: '',
      },
    }
    const expected = {
      'rawvoice:donate': {
        '@href': 'https://example.com/donate',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should filter out whitespace-only donate value', () => {
    const value = {
      donate: {
        href: 'https://example.com/donate',
        value: '   ',
      },
    }
    const expected = {
      'rawvoice:donate': {
        '@href': 'https://example.com/donate',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle donate with undefined value', () => {
    const value = {
      donate: {
        href: 'https://example.com/donate',
        value: undefined,
      },
    }
    const expected = {
      'rawvoice:donate': {
        '@href': 'https://example.com/donate',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
