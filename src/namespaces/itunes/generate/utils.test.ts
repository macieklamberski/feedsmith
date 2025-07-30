import { describe, expect, it } from 'bun:test'
import {
  generateCategory,
  generateFeed,
  generateImage,
  generateItem,
  generateOwner,
} from './utils.js'

describe('generateImage', () => {
  it('should generate image with href attribute from string', () => {
    const value = 'https://example.com/podcast-cover.jpg'
    const expected = {
      '@href': 'https://example.com/podcast-cover.jpg',
    }

    expect(generateImage(value)).toEqual(expected)
  })

  it('should handle empty string', () => {
    const value = ''

    expect(generateImage(value)).toBeUndefined()
  })

  it('should handle non-string inputs', () => {
    // @ts-ignore: This is for testing purposes.
    expect(generateImage(123)).toBeUndefined()
    // @ts-ignore: This is for testing purposes.
    expect(generateImage({})).toBeUndefined()
    expect(generateImage(undefined)).toBeUndefined()
  })

  it('should handle whitespace-only string', () => {
    const value = '   '

    expect(generateImage(value)).toBeUndefined()
  })
})

describe('generateCategory', () => {
  it('should generate category with text', () => {
    const value = {
      text: 'Technology',
    }
    const expected = {
      '@text': 'Technology',
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should generate category with nested categories', () => {
    const value = {
      text: 'Society & Culture',
      categories: [{ text: 'Documentary' }, { text: 'Personal Journals' }],
    }
    const expected = {
      '@text': 'Society & Culture',
      'itunes:category': [{ '@text': 'Documentary' }, { '@text': 'Personal Journals' }],
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should handle deeply nested categories', () => {
    const value = {
      text: 'Arts',
      categories: [
        {
          text: 'Design',
          categories: [{ text: 'Graphic Design' }],
        },
      ],
    }
    const expected = {
      '@text': 'Arts',
      'itunes:category': [
        {
          '@text': 'Design',
          'itunes:category': [{ '@text': 'Graphic Design' }],
        },
      ],
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should handle empty categories array', () => {
    const value = {
      text: 'Technology',
      categories: [],
    }
    const expected = {
      '@text': 'Technology',
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    // @ts-ignore: This is for testing purposes.
    expect(generateCategory('string')).toBeUndefined()
    expect(generateCategory(undefined)).toBeUndefined()
  })
})

describe('generateOwner', () => {
  it('should generate owner with all properties', () => {
    const value = {
      name: 'John Doe',
      email: 'john@example.com',
    }
    const expected = {
      'itunes:name': 'John Doe',
      'itunes:email': 'john@example.com',
    }

    expect(generateOwner(value)).toEqual(expected)
  })

  it('should generate owner with only name', () => {
    const value = {
      name: 'John Doe',
    }
    const expected = {
      'itunes:name': 'John Doe',
    }

    expect(generateOwner(value)).toEqual(expected)
  })

  it('should generate owner with only email', () => {
    const value = {
      email: 'john@example.com',
    }
    const expected = {
      'itunes:email': 'john@example.com',
    }

    expect(generateOwner(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateOwner(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateOwner(undefined)).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      duration: 1800,
      image: 'https://example.com/episode-image.jpg',
      explicit: true,
      title: 'Episode Title',
      episode: 5,
      season: 2,
      episodeType: 'full',
      block: false,
      summary: 'Episode summary',
      subtitle: 'Episode subtitle',
      keywords: ['podcast', 'technology', 'interview'],
    }
    const expected = {
      'itunes:duration': 1800,
      'itunes:image': {
        '@href': 'https://example.com/episode-image.jpg',
      },
      'itunes:explicit': 'yes',
      'itunes:title': 'Episode Title',
      'itunes:episode': 5,
      'itunes:season': 2,
      'itunes:episodeType': 'full',
      'itunes:block': 'no',
      'itunes:summary': 'Episode summary',
      'itunes:subtitle': 'Episode subtitle',
      'itunes:keywords': 'podcast,technology,interview',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with minimal properties', () => {
    const value = {
      title: 'Minimal Episode',
    }
    const expected = {
      'itunes:title': 'Minimal Episode',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle explicit as false', () => {
    const value = {
      explicit: false,
    }
    const expected = {
      'itunes:explicit': 'no',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle block as true', () => {
    const value = {
      block: true,
    }
    const expected = {
      'itunes:block': 'yes',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle different episodeType values', () => {
    const values = [{ episodeType: 'full' }, { episodeType: 'trailer' }, { episodeType: 'bonus' }]

    for (const value of values) {
      const expected = {
        'itunes:episodeType': value.episodeType,
      }

      expect(generateItem(value)).toEqual(expected)
    }
  })

  it('should handle empty keywords array', () => {
    const value = {
      keywords: [],
    }

    // @ts-ignore: Testing edge case
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle single keyword', () => {
    const value = {
      keywords: ['podcast'],
    }
    const expected = {
      'itunes:keywords': 'podcast',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle object with all undefined properties', () => {
    const value = {
      duration: undefined,
      image: undefined,
      explicit: undefined,
      title: undefined,
      episode: undefined,
      season: undefined,
      episodeType: undefined,
      block: undefined,
      summary: undefined,
      subtitle: undefined,
      keywords: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      image: 'https://example.com/podcast-logo.jpg',
      categories: [
        {
          text: 'Technology',
          categories: [{ text: 'Tech News' }],
        },
      ],
      explicit: false,
      author: 'John Doe',
      title: 'My Podcast',
      type: 'episodic',
      newFeedUrl: 'https://example.com/new-feed',
      block: false,
      complete: false,
      applePodcastsVerify: 'abc123',
      summary: 'A podcast about technology',
      subtitle: 'Tech talks and interviews',
      keywords: ['technology', 'interviews', 'news'],
      owner: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    }
    const expected = {
      'itunes:image': {
        '@href': 'https://example.com/podcast-logo.jpg',
      },
      'itunes:category': [
        {
          '@text': 'Technology',
          'itunes:category': [{ '@text': 'Tech News' }],
        },
      ],
      'itunes:explicit': 'no',
      'itunes:author': 'John Doe',
      'itunes:title': 'My Podcast',
      'itunes:type': 'episodic',
      'itunes:new-feed-url': 'https://example.com/new-feed',
      'itunes:block': 'no',
      'itunes:complete': 'no',
      'itunes:applepodcastsverify': 'abc123',
      'itunes:summary': 'A podcast about technology',
      'itunes:subtitle': 'Tech talks and interviews',
      'itunes:keywords': 'technology,interviews,news',
      'itunes:owner': {
        'itunes:name': 'John Doe',
        'itunes:email': 'john@example.com',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with minimal properties', () => {
    const value = {
      title: 'Minimal Podcast',
    }
    const expected = {
      'itunes:title': 'Minimal Podcast',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle explicit as true', () => {
    const value = {
      explicit: true,
    }
    const expected = {
      'itunes:explicit': 'yes',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle block as true', () => {
    const value = {
      block: true,
    }
    const expected = {
      'itunes:block': 'yes',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle complete as true', () => {
    const value = {
      complete: true,
    }
    const expected = {
      'itunes:complete': 'yes',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle type values', () => {
    const values = [{ type: 'episodic' }, { type: 'serial' }]

    for (const value of values) {
      const expected = {
        'itunes:type': value.type,
      }

      expect(generateFeed(value)).toEqual(expected)
    }
  })

  it('should handle empty categories array', () => {
    const value = {
      categories: [],
    }

    // @ts-ignore: Testing edge case
    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle object with all undefined properties', () => {
    const value = {
      image: undefined,
      categories: undefined,
      explicit: undefined,
      author: undefined,
      title: undefined,
      type: undefined,
      newFeedUrl: undefined,
      block: undefined,
      complete: undefined,
      applePodcastsVerify: undefined,
      summary: undefined,
      subtitle: undefined,
      keywords: undefined,
      owner: undefined,
    }

    // @ts-ignore: This is for testing purposes.
    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-ignore: This is for testing purposes.
    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateFeed(undefined)).toBeUndefined()
  })
})
