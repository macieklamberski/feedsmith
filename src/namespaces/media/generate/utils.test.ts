import { describe, expect, it } from 'bun:test'
import {
  generateBackLinks,
  generateCategory,
  generateComments,
  generateContent,
  generateCopyright,
  generateCredit,
  generateEmbed,
  generateGroup,
  generateHash,
  generateItemOrFeed,
  generateLicense,
  generateLocation,
  generateParam,
  generatePeerLink,
  generatePlayer,
  generatePrice,
  generateRating,
  generateResponses,
  generateRestriction,
  generateRights,
  generateScene,
  generateScenes,
  generateStarRating,
  generateStatistics,
  generateStatus,
  generateSubTitle,
  generateTag,
  generateText,
  generateThumbnail,
  generateTitleOrDescription,
} from './utils.js'

describe('generateRating', () => {
  it('should generate rating with all properties', () => {
    const value = {
      value: 'adult',
      scheme: 'urn:simple',
    }
    const expected = {
      '#text': 'adult',
      '@scheme': 'urn:simple',
    }

    expect(generateRating(value)).toEqual(expected)
  })

  it('should generate rating with minimal properties', () => {
    const value = {
      value: 'nonadult',
    }
    const expected = {
      '#text': 'nonadult',
    }

    expect(generateRating(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateRating(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateRating('string')).toBeUndefined()
  })
})

describe('generateTitleOrDescription', () => {
  it('should generate title with all properties', () => {
    const value = {
      value: 'Media Content Title',
      type: 'plain',
    }
    const expected = {
      '#text': 'Media Content Title',
      '@type': 'plain',
    }

    expect(generateTitleOrDescription(value)).toEqual(expected)
  })

  it('should generate title with minimal properties', () => {
    const value = {
      value: 'Simple Title',
    }
    const expected = {
      '#text': 'Simple Title',
    }

    expect(generateTitleOrDescription(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateTitleOrDescription(undefined)).toBeUndefined()
  })
})

describe('generateThumbnail', () => {
  it('should generate thumbnail with all properties', () => {
    const value = {
      url: 'https://example.com/thumb.jpg',
      height: 120,
      width: 160,
      time: '12:05:01.123',
    }
    const expected = {
      '@url': 'https://example.com/thumb.jpg',
      '@height': 120,
      '@width': 160,
      '@time': '12:05:01.123',
    }

    expect(generateThumbnail(value)).toEqual(expected)
  })

  it('should generate thumbnail with minimal properties', () => {
    const value = {
      url: 'https://example.com/thumb.jpg',
    }
    const expected = {
      '@url': 'https://example.com/thumb.jpg',
    }

    expect(generateThumbnail(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateThumbnail(undefined)).toBeUndefined()
  })
})

describe('generateCategory', () => {
  it('should generate category with all properties', () => {
    const value = {
      name: 'music/artist/album/song',
      scheme: 'http://blah.com/scheme',
      label: 'Music',
    }
    const expected = {
      '#text': 'music/artist/album/song',
      '@scheme': 'http://blah.com/scheme',
      '@label': 'Music',
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should generate category with minimal properties', () => {
    const value = {
      name: 'Arts/Movies',
    }
    const expected = {
      '#text': 'Arts/Movies',
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateCategory(undefined)).toBeUndefined()
  })
})

describe('generateHash', () => {
  it('should generate hash with all properties', () => {
    const value = {
      value: 'dfdec888b72151965a34b4b59031290a',
      algo: 'md5',
    }
    const expected = {
      '#text': 'dfdec888b72151965a34b4b59031290a',
      '@algo': 'md5',
    }

    expect(generateHash(value)).toEqual(expected)
  })

  it('should generate hash with minimal properties', () => {
    const value = {
      value: 'sha1hashvalue',
    }
    const expected = {
      '#text': 'sha1hashvalue',
    }

    expect(generateHash(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateHash(undefined)).toBeUndefined()
  })
})

describe('generatePlayer', () => {
  it('should generate player with all properties', () => {
    const value = {
      url: 'http://www.foo.com/player?id=1111',
      height: 200,
      width: 400,
    }
    const expected = {
      '@url': 'http://www.foo.com/player?id=1111',
      '@height': 200,
      '@width': 400,
    }

    expect(generatePlayer(value)).toEqual(expected)
  })

  it('should generate player with minimal properties', () => {
    const value = {
      url: 'http://www.foo.com/player',
    }
    const expected = {
      '@url': 'http://www.foo.com/player',
    }

    expect(generatePlayer(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generatePlayer(undefined)).toBeUndefined()
  })
})

describe('generateCredit', () => {
  it('should generate credit with all properties', () => {
    const value = {
      value: 'John Smith',
      role: 'author',
      scheme: 'urn:ebu',
    }
    const expected = {
      '#text': 'John Smith',
      '@role': 'author',
      '@scheme': 'urn:ebu',
    }

    expect(generateCredit(value)).toEqual(expected)
  })

  it('should generate credit with minimal properties', () => {
    const value = {
      value: 'Jane Doe',
    }
    const expected = {
      '#text': 'Jane Doe',
    }

    expect(generateCredit(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateCredit(undefined)).toBeUndefined()
  })
})

describe('generateCopyright', () => {
  it('should generate copyright with all properties', () => {
    const value = {
      value: '2005 FooBar Media',
      url: 'http://blah.com/additional-info.html',
    }
    const expected = {
      '#text': '2005 FooBar Media',
      '@url': 'http://blah.com/additional-info.html',
    }

    expect(generateCopyright(value)).toEqual(expected)
  })

  it('should generate copyright with minimal properties', () => {
    const value = {
      value: '2023 Example Corp',
    }
    const expected = {
      '#text': '2023 Example Corp',
    }

    expect(generateCopyright(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateCopyright(undefined)).toBeUndefined()
  })
})

describe('generateText', () => {
  it('should generate text with all properties', () => {
    const value = {
      value: 'Oh, say, can you see',
      type: 'plain',
      lang: 'en',
      start: '00:00:03.000',
      end: '00:00:10.000',
    }
    const expected = {
      '#text': 'Oh, say, can you see',
      '@type': 'plain',
      '@lang': 'en',
      '@start': '00:00:03.000',
      '@end': '00:00:10.000',
    }

    expect(generateText(value)).toEqual(expected)
  })

  it('should generate text with minimal properties', () => {
    const value = {
      value: 'Sample text content',
    }
    const expected = {
      '#text': 'Sample text content',
    }

    expect(generateText(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateText(undefined)).toBeUndefined()
  })
})

describe('generateRestriction', () => {
  it('should generate restriction with all properties', () => {
    const value = {
      value: 'au us',
      relationship: 'allow',
      type: 'country',
    }
    const expected = {
      '#text': 'au us',
      '@relationship': 'allow',
      '@type': 'country',
    }

    expect(generateRestriction(value)).toEqual(expected)
  })

  it('should generate restriction with minimal properties', () => {
    const value = {
      value: 'gb',
      relationship: 'deny',
    }
    const expected = {
      '#text': 'gb',
      '@relationship': 'deny',
    }

    expect(generateRestriction(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateRestriction(undefined)).toBeUndefined()
  })
})

describe('generateStarRating', () => {
  it('should generate star rating with all properties', () => {
    const value = {
      average: 3.5,
      count: 20,
      min: 1,
      max: 5,
    }
    const expected = {
      '@average': 3.5,
      '@count': 20,
      '@min': 1,
      '@max': 5,
    }

    expect(generateStarRating(value)).toEqual(expected)
  })

  it('should generate star rating with minimal properties', () => {
    const value = {
      average: 4.0,
    }
    const expected = {
      '@average': 4.0,
    }

    expect(generateStarRating(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateStarRating(undefined)).toBeUndefined()
  })
})

describe('generateStatistics', () => {
  it('should generate statistics with all properties', () => {
    const value = {
      views: 12345,
      favorites: 100,
    }
    const expected = {
      '@views': 12345,
      '@favorites': 100,
    }

    expect(generateStatistics(value)).toEqual(expected)
  })

  it('should generate statistics with minimal properties', () => {
    const value = {
      views: 500,
    }
    const expected = {
      '@views': 500,
    }

    expect(generateStatistics(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateStatistics(undefined)).toBeUndefined()
  })
})

describe('generateTag', () => {
  it('should generate tag with all properties', () => {
    const value = {
      name: 'music',
      weight: 5,
    }
    const expected = 'music:5'

    expect(generateTag(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateTag(undefined)).toBeUndefined()
  })
})

describe('generateComments', () => {
  it('should generate comments array', () => {
    const value = ['Great video!', 'Thanks for sharing']
    const expected = {
      'media:comment': ['Great video!', 'Thanks for sharing'],
    }

    expect(generateComments(value)).toEqual(expected)
  })

  it('should handle empty array', () => {
    const value = []

    expect(generateComments(value)).toBeUndefined()
  })

  it('should handle undefined', () => {
    expect(generateComments(undefined)).toBeUndefined()
  })
})

describe('generateResponses', () => {
  it('should generate responses array', () => {
    const value = ['http://example.com/response1', 'http://example.com/response2']
    const expected = {
      'media:response': ['http://example.com/response1', 'http://example.com/response2'],
    }

    expect(generateResponses(value)).toEqual(expected)
  })

  it('should handle empty array', () => {
    const value = []

    expect(generateResponses(value)).toBeUndefined()
  })

  it('should handle undefined', () => {
    expect(generateResponses(undefined)).toBeUndefined()
  })
})

describe('generateBackLinks', () => {
  it('should generate back links array', () => {
    const value = ['http://example.com/link1', 'http://example.com/link2']
    const expected = {
      'media:backLink': ['http://example.com/link1', 'http://example.com/link2'],
    }

    expect(generateBackLinks(value)).toEqual(expected)
  })

  it('should handle empty array', () => {
    const value = []

    expect(generateBackLinks(value)).toBeUndefined()
  })

  it('should handle undefined', () => {
    expect(generateBackLinks(undefined)).toBeUndefined()
  })
})

describe('generateScenes', () => {
  it('should generate scenes array', () => {
    const value = [
      {
        title: 'Introduction',
        description: 'Opening sequence',
        startTime: '00:00:00',
        endTime: '00:00:30',
      },
      {
        title: 'Main Content',
        startTime: '00:00:30',
        endTime: '00:01:45',
      },
    ]
    const expected = {
      'media:scene': [
        {
          sceneTitle: 'Introduction',
          sceneDescription: 'Opening sequence',
          sceneStartTime: '00:00:00',
          sceneEndTime: '00:00:30',
        },
        {
          sceneTitle: 'Main Content',
          sceneStartTime: '00:00:30',
          sceneEndTime: '00:01:45',
        },
      ],
    }

    expect(generateScenes(value)).toEqual(expected)
  })

  it('should handle empty array', () => {
    const value = []

    expect(generateScenes(value)).toBeUndefined()
  })

  it('should handle undefined', () => {
    expect(generateScenes(undefined)).toBeUndefined()
  })
})

describe('generateParam', () => {
  it('should generate param with all properties', () => {
    const value = {
      name: 'type',
      value: 'application/x-shockwave-flash',
    }
    const expected = {
      '#text': 'application/x-shockwave-flash',
      '@name': 'type',
    }

    expect(generateParam(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateParam(undefined)).toBeUndefined()
  })
})

describe('generateEmbed', () => {
  it('should generate embed with all properties', () => {
    const value = {
      url: 'http://www.foo.com/player.swf',
      width: 512,
      height: 323,
      params: [
        {
          name: 'type',
          value: 'application/x-shockwave-flash',
        },
        {
          name: 'width',
          value: '512',
        },
      ],
    }
    const expected = {
      '@url': 'http://www.foo.com/player.swf',
      '@width': 512,
      '@height': 323,
      'media:param': [
        {
          '#text': 'application/x-shockwave-flash',
          '@name': 'type',
        },
        {
          '#text': '512',
          '@name': 'width',
        },
      ],
    }

    expect(generateEmbed(value)).toEqual(expected)
  })

  it('should generate embed with minimal properties', () => {
    const value = {
      url: 'http://www.foo.com/player.swf',
    }
    const expected = {
      '@url': 'http://www.foo.com/player.swf',
    }

    expect(generateEmbed(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateEmbed(undefined)).toBeUndefined()
  })
})

describe('generateStatus', () => {
  it('should generate status with all properties', () => {
    const value = {
      state: 'blocked',
      reason: 'country restriction',
    }
    const expected = {
      '@state': 'blocked',
      '@reason': 'country restriction',
    }

    expect(generateStatus(value)).toEqual(expected)
  })

  it('should generate status with minimal properties', () => {
    const value = {
      state: 'active',
    }
    const expected = {
      '@state': 'active',
    }

    expect(generateStatus(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateStatus(undefined)).toBeUndefined()
  })
})

describe('generatePrice', () => {
  it('should generate price with all properties', () => {
    const value = {
      type: 'rent',
      info: 'http://www.dummy.jp/payment_info',
      price: 19.99,
      currency: 'EUR',
    }
    const expected = {
      '@type': 'rent',
      '@info': 'http://www.dummy.jp/payment_info',
      '@price': 19.99,
      '@currency': 'EUR',
    }

    expect(generatePrice(value)).toEqual(expected)
  })

  it('should generate price with minimal properties', () => {
    const value = {
      price: 9.99,
    }
    const expected = {
      '@price': 9.99,
    }

    expect(generatePrice(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generatePrice(undefined)).toBeUndefined()
  })
})

describe('generateLicense', () => {
  it('should generate license with all properties', () => {
    const value = {
      name: 'Creative Commons Attribution 3.0 United States License',
      type: 'text/html',
      href: 'http://creativecommons.org/licenses/by/3.0/us/',
    }
    const expected = {
      '#text': 'Creative Commons Attribution 3.0 United States License',
      '@type': 'text/html',
      '@href': 'http://creativecommons.org/licenses/by/3.0/us/',
    }

    expect(generateLicense(value)).toEqual(expected)
  })

  it('should generate license with name only', () => {
    const value = {
      name: 'All Rights Reserved',
    }
    const expected = {
      '#text': 'All Rights Reserved',
    }

    expect(generateLicense(value)).toEqual(expected)
  })

  it('should generate license with href only', () => {
    const value = {
      href: 'http://example.com/license',
    }
    const expected = {
      '@href': 'http://example.com/license',
    }

    expect(generateLicense(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateLicense(undefined)).toBeUndefined()
  })
})

describe('generateSubTitle', () => {
  it('should generate subtitle with all properties', () => {
    const value = {
      type: 'application/smil',
      lang: 'en',
      href: 'http://www.foo.com/subtitle.smil',
    }
    const expected = {
      '@type': 'application/smil',
      '@lang': 'en',
      '@href': 'http://www.foo.com/subtitle.smil',
    }

    expect(generateSubTitle(value)).toEqual(expected)
  })

  it('should generate subtitle with minimal properties', () => {
    const value = {
      href: 'http://www.foo.com/subtitle.txt',
    }
    const expected = {
      '@href': 'http://www.foo.com/subtitle.txt',
    }

    expect(generateSubTitle(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateSubTitle(undefined)).toBeUndefined()
  })
})

describe('generatePeerLink', () => {
  it('should generate peer link with all properties', () => {
    const value = {
      type: 'application/x-bittorrent',
      href: 'http://www.foo.com/sampleFile.torrent',
    }
    const expected = {
      '@type': 'application/x-bittorrent',
      '@href': 'http://www.foo.com/sampleFile.torrent',
    }

    expect(generatePeerLink(value)).toEqual(expected)
  })

  it('should generate peer link with minimal properties', () => {
    const value = {
      href: 'http://www.foo.com/file.torrent',
    }
    const expected = {
      '@href': 'http://www.foo.com/file.torrent',
    }

    expect(generatePeerLink(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generatePeerLink(undefined)).toBeUndefined()
  })
})

describe('generateRights', () => {
  it('should generate rights with all properties', () => {
    const value = {
      status: 'userCreated',
    }
    const expected = {
      '@status': 'userCreated',
    }

    expect(generateRights(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateRights(undefined)).toBeUndefined()
  })
})

describe('generateScene', () => {
  it('should generate scene with all properties', () => {
    const value = {
      title: 'Introduction',
      description: 'Opening scene of the video',
      startTime: '00:00:00',
      endTime: '00:01:30',
    }
    const expected = {
      sceneTitle: 'Introduction',
      sceneDescription: 'Opening scene of the video',
      sceneStartTime: '00:00:00',
      sceneEndTime: '00:01:30',
    }

    expect(generateScene(value)).toEqual(expected)
  })

  it('should generate scene with minimal properties', () => {
    const value = {
      title: 'Scene 1',
    }
    const expected = {
      sceneTitle: 'Scene 1',
    }

    expect(generateScene(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateScene(undefined)).toBeUndefined()
  })
})

describe('generateLocation', () => {
  it('should generate location with all properties', () => {
    const value = {
      description: 'New York City',
      start: '01:00:00',
      end: '01:05:00',
      lat: 40.7128,
      lng: -74.006,
    }
    const expected = {
      '#text': 'New York City',
      '@start': '01:00:00',
      '@end': '01:05:00',
      '@lat': 40.7128,
      '@lng': -74.006,
    }

    expect(generateLocation(value)).toEqual(expected)
  })

  it('should generate location with minimal properties', () => {
    const value = {
      description: 'San Francisco',
    }
    const expected = {
      '#text': 'San Francisco',
    }

    expect(generateLocation(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateLocation(undefined)).toBeUndefined()
  })
})

describe('generateContent', () => {
  it('should generate content with all properties including CommonElements', () => {
    const value = {
      url: 'http://www.foo.com/movie.mov',
      fileSize: 2000,
      type: 'video/quicktime',
      medium: 'video',
      isDefault: true,
      expression: 'full',
      bitrate: 697,
      framerate: 24,
      samplingrate: 44100,
      channels: 2,
      duration: 185,
      height: 200,
      width: 300,
      lang: 'en',
      // All CommonElements properties
      ratings: [
        {
          value: 'adult',
          scheme: 'urn:simple',
        },
      ],
      title: {
        value: 'The Judy Mp4',
        type: 'plain',
      },
      description: {
        value: 'Video description',
        type: 'plain',
      },
      keywords: ['video', 'movie', 'entertainment'],
      thumbnails: [
        {
          url: 'http://www.foo.com/keyframe.jpg',
          width: 75,
          height: 50,
          time: '12:05:01.123',
        },
      ],
      categories: [
        {
          name: 'Arts/Movies',
          scheme: 'http://example.com',
          label: 'Movies',
        },
      ],
      hashes: [
        {
          value: 'dfdec888b72151965a34b4b59031290a',
          algo: 'md5',
        },
      ],
      player: {
        url: 'http://www.foo.com/player',
        height: 200,
        width: 400,
      },
      credits: [
        {
          value: 'John Smith',
          role: 'director',
          scheme: 'urn:ebu',
        },
      ],
      copyright: {
        value: '2005 FooBar Media',
        url: 'http://blah.com/info.html',
      },
      texts: [
        {
          value: 'Sample text',
          type: 'plain',
          lang: 'en',
          start: '00:00:03.000',
          end: '00:00:10.000',
        },
      ],
      restrictions: [
        {
          value: 'au us',
          relationship: 'allow',
          type: 'country',
        },
      ],
      community: {
        starRating: {
          average: 3.5,
          count: 20,
          min: 1,
          max: 5,
        },
        statistics: {
          views: 12345,
          favorites: 100,
        },
        tags: [
          {
            name: 'music',
            weight: 5,
          },
        ],
      },
      comments: ['Great video!', 'Thanks for sharing'],
      embed: {
        url: 'http://www.foo.com/player.swf',
        width: 512,
        height: 323,
        params: [
          {
            name: 'type',
            value: 'application/x-shockwave-flash',
          },
        ],
      },
      responses: ['http://example.com/response1'],
      backLinks: ['http://example.com/link1'],
      status: {
        state: 'active',
        reason: 'approved',
      },
      prices: [
        {
          type: 'rent',
          info: 'http://www.dummy.jp/payment_info',
          price: 19.99,
          currency: 'EUR',
        },
      ],
      licenses: [
        {
          name: 'Creative Commons',
          type: 'text/html',
          href: 'http://creativecommons.org/licenses/by/3.0/us/',
        },
      ],
      subTitles: [
        {
          type: 'application/smil',
          lang: 'en',
          href: 'http://www.foo.com/subtitle.smil',
        },
      ],
      peerLinks: [
        {
          type: 'application/x-bittorrent',
          href: 'http://www.foo.com/file.torrent',
        },
      ],
      locations: [
        {
          description: 'New York City',
          start: '01:00:00',
          end: '01:05:00',
          lat: 40.7128,
          lng: -74.006,
        },
      ],
      rights: {
        status: 'userCreated',
      },
      scenes: [
        {
          title: 'Introduction',
          description: 'Opening scene',
          startTime: '00:00:00',
          endTime: '00:01:30',
        },
      ],
    }
    const expected = {
      '@url': 'http://www.foo.com/movie.mov',
      '@fileSize': 2000,
      '@type': 'video/quicktime',
      '@medium': 'video',
      '@isDefault': 'yes',
      '@expression': 'full',
      '@bitrate': 697,
      '@framerate': 24,
      '@samplingrate': 44100,
      '@channels': 2,
      '@duration': 185,
      '@height': 200,
      '@width': 300,
      '@lang': 'en',
      'media:rating': [
        {
          '#text': 'adult',
          '@scheme': 'urn:simple',
        },
      ],
      'media:title': {
        '#text': 'The Judy Mp4',
        '@type': 'plain',
      },
      'media:description': {
        '#text': 'Video description',
        '@type': 'plain',
      },
      'media:keywords': 'video,movie,entertainment',
      'media:thumbnail': [
        {
          '@url': 'http://www.foo.com/keyframe.jpg',
          '@width': 75,
          '@height': 50,
          '@time': '12:05:01.123',
        },
      ],
      'media:category': [
        {
          '#text': 'Arts/Movies',
          '@scheme': 'http://example.com',
          '@label': 'Movies',
        },
      ],
      'media:hash': [
        {
          '#text': 'dfdec888b72151965a34b4b59031290a',
          '@algo': 'md5',
        },
      ],
      'media:player': {
        '@url': 'http://www.foo.com/player',
        '@height': 200,
        '@width': 400,
      },
      'media:credit': [
        {
          '#text': 'John Smith',
          '@role': 'director',
          '@scheme': 'urn:ebu',
        },
      ],
      'media:copyright': {
        '#text': '2005 FooBar Media',
        '@url': 'http://blah.com/info.html',
      },
      'media:text': [
        {
          '#text': 'Sample text',
          '@type': 'plain',
          '@lang': 'en',
          '@start': '00:00:03.000',
          '@end': '00:00:10.000',
        },
      ],
      'media:restriction': [
        {
          '#text': 'au us',
          '@relationship': 'allow',
          '@type': 'country',
        },
      ],
      'media:community': {
        'media:starRating': {
          '@average': 3.5,
          '@count': 20,
          '@min': 1,
          '@max': 5,
        },
        'media:statistics': {
          '@views': 12345,
          '@favorites': 100,
        },
        'media:tags': 'music:5',
      },
      'media:comments': {
        'media:comment': ['Great video!', 'Thanks for sharing'],
      },
      'media:embed': {
        '@url': 'http://www.foo.com/player.swf',
        '@width': 512,
        '@height': 323,
        'media:param': [
          {
            '#text': 'application/x-shockwave-flash',
            '@name': 'type',
          },
        ],
      },
      'media:responses': {
        'media:response': ['http://example.com/response1'],
      },
      'media:backLinks': {
        'media:backLink': ['http://example.com/link1'],
      },
      'media:status': {
        '@state': 'active',
        '@reason': 'approved',
      },
      'media:price': [
        {
          '@type': 'rent',
          '@info': 'http://www.dummy.jp/payment_info',
          '@price': 19.99,
          '@currency': 'EUR',
        },
      ],
      'media:license': [
        {
          '#text': 'Creative Commons',
          '@type': 'text/html',
          '@href': 'http://creativecommons.org/licenses/by/3.0/us/',
        },
      ],
      'media:subTitle': [
        {
          '@type': 'application/smil',
          '@lang': 'en',
          '@href': 'http://www.foo.com/subtitle.smil',
        },
      ],
      'media:peerLink': [
        {
          '@type': 'application/x-bittorrent',
          '@href': 'http://www.foo.com/file.torrent',
        },
      ],
      'media:location': [
        {
          '#text': 'New York City',
          '@start': '01:00:00',
          '@end': '01:05:00',
          '@lat': 40.7128,
          '@lng': -74.006,
        },
      ],
      'media:rights': {
        '@status': 'userCreated',
      },
      'media:scenes': {
        'media:scene': [
          {
            sceneTitle: 'Introduction',
            sceneDescription: 'Opening scene',
            sceneStartTime: '00:00:00',
            sceneEndTime: '00:01:30',
          },
        ],
      },
    }

    expect(generateContent(value)).toEqual(expected)
  })

  it('should generate content with minimal properties', () => {
    const value = {
      url: 'http://www.foo.com/audio.mp3',
    }
    const expected = {
      '@url': 'http://www.foo.com/audio.mp3',
    }

    expect(generateContent(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateContent(undefined)).toBeUndefined()
  })
})

describe('generateGroup', () => {
  it('should generate group with all properties including CommonElements', () => {
    const value = {
      contents: [
        {
          url: 'http://www.foo.com/song_lo.mp3',
          fileSize: 1000,
          bitrate: 128,
        },
        {
          url: 'http://www.foo.com/song_hi.mp3',
          fileSize: 2000,
          bitrate: 192,
        },
      ],
      // All CommonElements properties
      ratings: [
        {
          value: 'nonadult',
          scheme: 'urn:simple',
        },
      ],
      title: {
        value: 'Song Title',
        type: 'plain',
      },
      description: {
        value: 'Song description',
        type: 'plain',
      },
      keywords: ['music', 'audio', 'song'],
      thumbnails: [
        {
          url: 'http://www.foo.com/album_art.jpg',
          width: 300,
          height: 300,
        },
      ],
      categories: [
        {
          name: 'Music/Rock',
          scheme: 'http://example.com',
          label: 'Rock Music',
        },
      ],
      hashes: [
        {
          value: 'sha1hashvalue',
          algo: 'sha1',
        },
      ],
      player: {
        url: 'http://www.foo.com/music_player',
        height: 50,
        width: 400,
      },
      credits: [
        {
          value: 'Artist Name',
          role: 'performer',
          scheme: 'urn:ebu',
        },
      ],
      copyright: {
        value: '2023 Record Label',
        url: 'http://label.com/info.html',
      },
      texts: [
        {
          value: 'Lyrics here',
          type: 'plain',
          lang: 'en',
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
          average: 4.2,
          count: 150,
          min: 1,
          max: 5,
        },
        statistics: {
          views: 50000,
          favorites: 500,
        },
        tags: [
          {
            name: 'rock',
            weight: 8,
          },
          {
            name: 'alternative',
            weight: 3,
          },
        ],
      },
      comments: ['Love this song!', 'Amazing track'],
      embed: {
        url: 'http://www.foo.com/audio_player.swf',
        width: 400,
        height: 50,
      },
      responses: ['http://example.com/music_response'],
      backLinks: ['http://example.com/music_link'],
      status: {
        state: 'active',
      },
      prices: [
        {
          type: 'purchase',
          price: 0.99,
          currency: 'USD',
        },
      ],
      licenses: [
        {
          name: 'Standard License',
          href: 'http://example.com/license',
        },
      ],
      subTitles: [
        {
          href: 'http://www.foo.com/lyrics.txt',
          type: 'text/plain',
          lang: 'en',
        },
      ],
      peerLinks: [
        {
          href: 'http://www.foo.com/music.torrent',
        },
      ],
      locations: [
        {
          description: 'Recording Studio',
        },
      ],
      rights: {
        status: 'official',
      },
      scenes: [
        {
          title: 'Verse 1',
          startTime: '00:00:00',
          endTime: '00:01:00',
        },
      ],
    }
    const expected = {
      'media:content': [
        {
          '@url': 'http://www.foo.com/song_lo.mp3',
          '@fileSize': 1000,
          '@bitrate': 128,
        },
        {
          '@url': 'http://www.foo.com/song_hi.mp3',
          '@fileSize': 2000,
          '@bitrate': 192,
        },
      ],
      'media:rating': [
        {
          '#text': 'nonadult',
          '@scheme': 'urn:simple',
        },
      ],
      'media:title': {
        '#text': 'Song Title',
        '@type': 'plain',
      },
      'media:description': {
        '#text': 'Song description',
        '@type': 'plain',
      },
      'media:keywords': 'music,audio,song',
      'media:thumbnail': [
        {
          '@url': 'http://www.foo.com/album_art.jpg',
          '@width': 300,
          '@height': 300,
        },
      ],
      'media:category': [
        {
          '#text': 'Music/Rock',
          '@scheme': 'http://example.com',
          '@label': 'Rock Music',
        },
      ],
      'media:hash': [
        {
          '#text': 'sha1hashvalue',
          '@algo': 'sha1',
        },
      ],
      'media:player': {
        '@url': 'http://www.foo.com/music_player',
        '@height': 50,
        '@width': 400,
      },
      'media:credit': [
        {
          '#text': 'Artist Name',
          '@role': 'performer',
          '@scheme': 'urn:ebu',
        },
      ],
      'media:copyright': {
        '#text': '2023 Record Label',
        '@url': 'http://label.com/info.html',
      },
      'media:text': [
        {
          '#text': 'Lyrics here',
          '@type': 'plain',
          '@lang': 'en',
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
        'media:starRating': {
          '@average': 4.2,
          '@count': 150,
          '@min': 1,
          '@max': 5,
        },
        'media:statistics': {
          '@views': 50000,
          '@favorites': 500,
        },
        'media:tags': 'rock:8,alternative:3',
      },
      'media:comments': {
        'media:comment': ['Love this song!', 'Amazing track'],
      },
      'media:embed': {
        '@url': 'http://www.foo.com/audio_player.swf',
        '@width': 400,
        '@height': 50,
      },
      'media:responses': {
        'media:response': ['http://example.com/music_response'],
      },
      'media:backLinks': {
        'media:backLink': ['http://example.com/music_link'],
      },
      'media:status': {
        '@state': 'active',
      },
      'media:price': [
        {
          '@type': 'purchase',
          '@price': 0.99,
          '@currency': 'USD',
        },
      ],
      'media:license': [
        {
          '#text': 'Standard License',
          '@href': 'http://example.com/license',
        },
      ],
      'media:subTitle': [
        {
          '@href': 'http://www.foo.com/lyrics.txt',
          '@type': 'text/plain',
          '@lang': 'en',
        },
      ],
      'media:peerLink': [
        {
          '@href': 'http://www.foo.com/music.torrent',
        },
      ],
      'media:location': [
        {
          '#text': 'Recording Studio',
        },
      ],
      'media:rights': {
        '@status': 'official',
      },
      'media:scenes': {
        'media:scene': [
          {
            sceneTitle: 'Verse 1',
            sceneStartTime: '00:00:00',
            sceneEndTime: '00:01:00',
          },
        ],
      },
    }

    expect(generateGroup(value)).toEqual(expected)
  })

  it('should generate group with minimal properties', () => {
    const value = {
      title: {
        value: 'Simple Group',
      },
    }
    const expected = {
      'media:title': {
        '#text': 'Simple Group',
      },
    }

    expect(generateGroup(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateGroup(undefined)).toBeUndefined()
  })
})

describe('generateItemOrFeed', () => {
  it('should generate item with all properties', () => {
    const value = {
      group: {
        contents: [
          {
            url: 'http://www.foo.com/video.mp4',
            type: 'video/mp4',
          },
        ],
        title: {
          value: 'Video Group',
        },
      },
      contents: [
        {
          url: 'http://www.foo.com/audio.mp3',
          type: 'audio/mpeg',
        },
      ],
      // All CommonElements properties
      ratings: [
        {
          value: 'adult',
          scheme: 'urn:simple',
        },
      ],
      title: {
        value: 'Media Item Title',
        type: 'plain',
      },
      description: {
        value: 'Media item description',
        type: 'html',
      },
      keywords: ['media', 'content', 'test'],
      thumbnails: [
        {
          url: 'http://www.foo.com/thumb.jpg',
          width: 160,
          height: 120,
        },
      ],
      categories: [
        {
          name: 'Entertainment',
          scheme: 'http://example.com/categories',
          label: 'Entertainment',
        },
      ],
      hashes: [
        {
          value: 'abcdef123456',
          algo: 'sha256',
        },
      ],
      player: {
        url: 'http://www.foo.com/player',
        height: 400,
        width: 600,
      },
      credits: [
        {
          value: 'Content Creator',
          role: 'author',
        },
      ],
      copyright: {
        value: '2023 Media Corp',
      },
      texts: [
        {
          value: 'Sample text content',
          type: 'plain',
        },
      ],
      restrictions: [
        {
          value: 'worldwide',
          relationship: 'allow',
        },
      ],
      community: {
        starRating: {
          average: 4.5,
          count: 10,
        },
        statistics: {
          views: 1000,
        },
        tags: [
          {
            name: 'entertainment',
            weight: 10,
          },
        ],
      },
      comments: ['Great content!'],
      embed: {
        url: 'http://www.foo.com/embed.swf',
      },
      responses: ['http://example.com/response'],
      backLinks: ['http://example.com/backlink'],
      status: {
        state: 'published',
      },
      prices: [
        {
          type: 'free',
        },
      ],
      licenses: [
        {
          name: 'Creative Commons',
        },
      ],
      subTitles: [
        {
          href: 'http://www.foo.com/subs.srt',
        },
      ],
      peerLinks: [
        {
          href: 'http://www.foo.com/peer.torrent',
        },
      ],
      locations: [
        {
          description: 'Studio Location',
        },
      ],
      rights: {
        status: 'copyrighted',
      },
      scenes: [
        {
          title: 'Opening',
        },
      ],
    }
    const expected = {
      'media:group': {
        'media:content': [
          {
            '@url': 'http://www.foo.com/video.mp4',
            '@type': 'video/mp4',
          },
        ],
        'media:title': {
          '#text': 'Video Group',
        },
      },
      'media:content': [
        {
          '@url': 'http://www.foo.com/audio.mp3',
          '@type': 'audio/mpeg',
        },
      ],
      'media:rating': [
        {
          '#text': 'adult',
          '@scheme': 'urn:simple',
        },
      ],
      'media:title': {
        '#text': 'Media Item Title',
        '@type': 'plain',
      },
      'media:description': {
        '#text': 'Media item description',
        '@type': 'html',
      },
      'media:keywords': 'media,content,test',
      'media:thumbnail': [
        {
          '@url': 'http://www.foo.com/thumb.jpg',
          '@width': 160,
          '@height': 120,
        },
      ],
      'media:category': [
        {
          '#text': 'Entertainment',
          '@scheme': 'http://example.com/categories',
          '@label': 'Entertainment',
        },
      ],
      'media:hash': [
        {
          '#text': 'abcdef123456',
          '@algo': 'sha256',
        },
      ],
      'media:player': {
        '@url': 'http://www.foo.com/player',
        '@height': 400,
        '@width': 600,
      },
      'media:credit': [
        {
          '#text': 'Content Creator',
          '@role': 'author',
        },
      ],
      'media:copyright': {
        '#text': '2023 Media Corp',
      },
      'media:text': [
        {
          '#text': 'Sample text content',
          '@type': 'plain',
        },
      ],
      'media:restriction': [
        {
          '#text': 'worldwide',
          '@relationship': 'allow',
        },
      ],
      'media:community': {
        'media:starRating': {
          '@average': 4.5,
          '@count': 10,
        },
        'media:statistics': {
          '@views': 1000,
        },
        'media:tags': 'entertainment:10',
      },
      'media:comments': {
        'media:comment': ['Great content!'],
      },
      'media:embed': {
        '@url': 'http://www.foo.com/embed.swf',
      },
      'media:responses': {
        'media:response': ['http://example.com/response'],
      },
      'media:backLinks': {
        'media:backLink': ['http://example.com/backlink'],
      },
      'media:status': {
        '@state': 'published',
      },
      'media:price': [
        {
          '@type': 'free',
        },
      ],
      'media:license': [
        {
          '#text': 'Creative Commons',
        },
      ],
      'media:subTitle': [
        {
          '@href': 'http://www.foo.com/subs.srt',
        },
      ],
      'media:peerLink': [
        {
          '@href': 'http://www.foo.com/peer.torrent',
        },
      ],
      'media:location': [
        {
          '#text': 'Studio Location',
        },
      ],
      'media:rights': {
        '@status': 'copyrighted',
      },
      'media:scenes': {
        'media:scene': [
          {
            sceneTitle: 'Opening',
          },
        ],
      },
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate item with minimal properties', () => {
    const value = {
      title: {
        value: 'Simple Item',
      },
    }
    const expected = {
      'media:title': {
        '#text': 'Simple Item',
      },
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateItemOrFeed(undefined)).toBeUndefined()
  })
})
