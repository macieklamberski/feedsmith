import { describe, expect, it } from 'bun:test'
import {
  generateAlternateEnclosure,
  generateBaseItem,
  generateBlock,
  generateChapters,
  generateContentLink,
  generateEpisode,
  generateFeed,
  generateFunding,
  generateImages,
  generateIntegrity,
  generateItem,
  generateLicense,
  generateLiveItem,
  generateLocation,
  generateLocked,
  generatePerson,
  generatePodping,
  generatePodroll,
  generateRemoteItem,
  generateSeason,
  generateSocialInteract,
  generateSoundbite,
  generateSource,
  generateTrailer,
  generateTranscript,
  generateTxt,
  generateUpdateFrequency,
  generateValue,
  generateValueRecipient,
  generateValueTimeSplit,
} from './utils.js'

describe('generateTranscript', () => {
  it('should generate transcript with all properties', () => {
    const value = {
      url: 'https://example.com/transcript.txt',
      type: 'text/plain',
      language: 'en',
      rel: 'captions',
    }
    const expected = {
      '@url': 'https://example.com/transcript.txt',
      '@type': 'text/plain',
      '@language': 'en',
      '@rel': 'captions',
    }

    expect(generateTranscript(value)).toEqual(expected)
  })

  it('should generate transcript with minimal properties', () => {
    const value = {
      url: 'https://example.com/transcript.txt',
      type: 'text/plain',
    }
    const expected = {
      '@url': 'https://example.com/transcript.txt',
      '@type': 'text/plain',
    }

    expect(generateTranscript(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateTranscript(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateTranscript('string')).toBeUndefined()
  })
})

describe('generateLocked', () => {
  it('should generate locked with all properties', () => {
    const value = {
      value: true,
      owner: 'owner@example.com',
    }
    const expected = {
      '#text': 'yes',
      '@owner': 'owner@example.com',
    }

    expect(generateLocked(value)).toEqual(expected)
  })

  it('should generate locked with value false', () => {
    const value = {
      value: false,
    }
    const expected = {
      '#text': 'no',
    }

    expect(generateLocked(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateLocked(undefined)).toBeUndefined()
  })
})

describe('generateFunding', () => {
  it('should generate funding with all properties', () => {
    const value = {
      url: 'https://example.com/support',
      display: 'Support the show',
    }
    const expected = {
      '#text': 'Support the show',
      '@url': 'https://example.com/support',
    }

    expect(generateFunding(value)).toEqual(expected)
  })

  it('should generate funding with only url', () => {
    const value = {
      url: 'https://example.com/support',
    }
    const expected = {
      '@url': 'https://example.com/support',
    }

    expect(generateFunding(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateFunding(undefined)).toBeUndefined()
  })
})

describe('generateChapters', () => {
  it('should generate chapters with all properties', () => {
    const value = {
      url: 'https://example.com/chapters.json',
      type: 'application/json+chapters',
    }
    const expected = {
      '@url': 'https://example.com/chapters.json',
      '@type': 'application/json+chapters',
    }

    expect(generateChapters(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateChapters(undefined)).toBeUndefined()
  })
})

describe('generateSoundbite', () => {
  it('should generate soundbite with all properties', () => {
    const value = {
      startTime: 120.5,
      duration: 30.2,
      display: 'Great quote from the guest',
    }
    const expected = {
      '#text': 'Great quote from the guest',
      '@startTime': 120.5,
      '@duration': 30.2,
    }

    expect(generateSoundbite(value)).toEqual(expected)
  })

  it('should generate soundbite without display', () => {
    const value = {
      startTime: 120.5,
      duration: 30.2,
    }
    const expected = {
      '@startTime': 120.5,
      '@duration': 30.2,
    }

    expect(generateSoundbite(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateSoundbite(undefined)).toBeUndefined()
  })
})

describe('generatePerson', () => {
  it('should generate person with all properties', () => {
    const value = {
      display: 'John Doe',
      role: 'host',
      group: 'cast',
      img: 'https://example.com/john.jpg',
      href: 'https://johndoe.com',
    }
    const expected = {
      '#text': 'John Doe',
      '@role': 'host',
      '@group': 'cast',
      '@img': 'https://example.com/john.jpg',
      '@href': 'https://johndoe.com',
    }

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should generate person with minimal properties', () => {
    const value = {
      display: 'Jane Smith',
    }
    const expected = {
      '#text': 'Jane Smith',
    }

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generatePerson(undefined)).toBeUndefined()
  })
})

describe('generateLocation', () => {
  it('should generate location with all properties', () => {
    const value = {
      display: 'Austin, TX',
      geo: 'geo:30.2672,-97.7431',
      osm: 'R113314',
    }
    const expected = {
      '#text': 'Austin, TX',
      '@geo': 'geo:30.2672,-97.7431',
      '@osm': 'R113314',
    }

    expect(generateLocation(value)).toEqual(expected)
  })

  it('should generate location with minimal properties', () => {
    const value = {
      display: 'New York, NY',
    }
    const expected = {
      '#text': 'New York, NY',
    }

    expect(generateLocation(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateLocation(undefined)).toBeUndefined()
  })
})

describe('generateSeason', () => {
  it('should generate season with all properties', () => {
    const value = {
      number: 2,
      name: 'The Second Season',
    }
    const expected = {
      '#text': 2,
      '@name': 'The Second Season',
    }

    expect(generateSeason(value)).toEqual(expected)
  })

  it('should generate season with only number', () => {
    const value = {
      number: 1,
    }
    const expected = {
      '#text': 1,
    }

    expect(generateSeason(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateSeason(undefined)).toBeUndefined()
  })
})

describe('generateEpisode', () => {
  it('should generate episode with all properties', () => {
    const value = {
      number: 42,
      display: 'Episode 42: The Answer',
    }
    const expected = {
      '#text': 42,
      '@display': 'Episode 42: The Answer',
    }

    expect(generateEpisode(value)).toEqual(expected)
  })

  it('should generate episode with only number', () => {
    const value = {
      number: 1,
    }
    const expected = {
      '#text': 1,
    }

    expect(generateEpisode(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateEpisode(undefined)).toBeUndefined()
  })
})

describe('generateTrailer', () => {
  it('should generate trailer with all properties', () => {
    const value = {
      display: 'Season 2 Trailer',
      url: 'https://example.com/trailer.mp3',
      pubDate: new Date('2023-01-01T00:00:00Z'),
      length: 12345,
      type: 'audio/mpeg',
      season: 2,
    }
    const expected = {
      '#text': 'Season 2 Trailer',
      '@url': 'https://example.com/trailer.mp3',
      '@pubdate': 'Sun, 01 Jan 2023 00:00:00 GMT',
      '@length': 12345,
      '@type': 'audio/mpeg',
      '@season': 2,
    }

    expect(generateTrailer(value)).toEqual(expected)
  })

  it('should generate trailer with minimal properties', () => {
    const value = {
      display: 'Trailer',
      url: 'https://example.com/trailer.mp3',
      pubDate: new Date('2023-01-01T00:00:00Z'),
    }
    const expected = {
      '#text': 'Trailer',
      '@url': 'https://example.com/trailer.mp3',
      '@pubdate': 'Sun, 01 Jan 2023 00:00:00 GMT',
    }

    expect(generateTrailer(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateTrailer(undefined)).toBeUndefined()
  })
})

describe('generateLicense', () => {
  it('should generate license with all properties', () => {
    const value = {
      display: 'Creative Commons Attribution 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    }
    const expected = {
      '#text': 'Creative Commons Attribution 4.0',
      '@url': 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(generateLicense(value)).toEqual(expected)
  })

  it('should generate license with only display', () => {
    const value = {
      display: 'All Rights Reserved',
    }
    const expected = {
      '#text': 'All Rights Reserved',
    }

    expect(generateLicense(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateLicense(undefined)).toBeUndefined()
  })
})

describe('generateSource', () => {
  it('should generate source with all properties', () => {
    const value = {
      uri: 'https://example.com/source.mp3',
      contentType: 'audio/mpeg',
    }
    const expected = {
      '@uri': 'https://example.com/source.mp3',
      '@contentType': 'audio/mpeg',
    }

    expect(generateSource(value)).toEqual(expected)
  })

  it('should generate source with only uri', () => {
    const value = {
      uri: 'https://example.com/source.mp3',
    }
    const expected = {
      '@uri': 'https://example.com/source.mp3',
    }

    expect(generateSource(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateSource(undefined)).toBeUndefined()
  })
})

describe('generateIntegrity', () => {
  it('should generate integrity with all properties', () => {
    const value = {
      type: 'sri',
      value: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
    }
    const expected = {
      '@type': 'sri',
      '@value': 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
    }

    expect(generateIntegrity(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateIntegrity(undefined)).toBeUndefined()
  })
})

describe('generateAlternateEnclosure', () => {
  it('should generate alternate enclosure with all properties', () => {
    const value = {
      type: 'audio/mpeg',
      length: 12345,
      bitrate: 128000,
      height: 720,
      lang: 'en',
      title: 'High Quality Audio',
      rel: 'alternate',
      codecs: 'mp3',
      default: true,
      sources: [
        {
          uri: 'https://example.com/source1.mp3',
          contentType: 'audio/mpeg',
        },
      ],
      integrity: {
        type: 'sri',
        value: 'sha384-test',
      },
    }
    const expected = {
      '@type': 'audio/mpeg',
      '@length': 12345,
      '@bitrate': 128000,
      '@height': 720,
      '@lang': 'en',
      '@title': 'High Quality Audio',
      '@rel': 'alternate',
      '@codecs': 'mp3',
      '@default': true,
      'podcast:source': [
        {
          '@uri': 'https://example.com/source1.mp3',
          '@contentType': 'audio/mpeg',
        },
      ],
      'podcast:integrity': {
        '@type': 'sri',
        '@value': 'sha384-test',
      },
    }

    expect(generateAlternateEnclosure(value)).toEqual(expected)
  })

  it('should generate alternate enclosure with minimal properties', () => {
    const value = {
      type: 'audio/mpeg',
    }
    const expected = {
      '@type': 'audio/mpeg',
    }

    expect(generateAlternateEnclosure(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateAlternateEnclosure(undefined)).toBeUndefined()
  })
})

describe('generateValueRecipient', () => {
  it('should generate value recipient with all properties', () => {
    const value = {
      name: 'Host',
      customKey: 'custom123',
      customValue: 'value123',
      type: 'node',
      address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbd39dc2eeb204860c4ffa5c1b0dcb54aa',
      split: 50,
      fee: true,
    }
    const expected = {
      '@name': 'Host',
      '@customKey': 'custom123',
      '@customValue': 'value123',
      '@type': 'node',
      '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbd39dc2eeb204860c4ffa5c1b0dcb54aa',
      '@split': 50,
      '@fee': true,
    }

    expect(generateValueRecipient(value)).toEqual(expected)
  })

  it('should generate value recipient with minimal properties', () => {
    const value = {
      type: 'node',
      address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbd39dc2eeb204860c4ffa5c1b0dcb54aa',
      split: 100,
    }
    const expected = {
      '@type': 'node',
      '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbd39dc2eeb204860c4ffa5c1b0dcb54aa',
      '@split': 100,
    }

    expect(generateValueRecipient(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateValueRecipient(undefined)).toBeUndefined()
  })
})

describe('generateValueTimeSplit', () => {
  it('should generate value time split with all properties', () => {
    const value = {
      startTime: 120,
      duration: 60,
      remoteStartTime: 0,
      remotePercentage: 25,
      remoteItem: {
        feedGuid: 'remote-guid-123',
        feedUrl: 'https://remote.example.com/feed.xml',
        itemGuid: 'remote-item-123',
        medium: 'music',
      },
      valueRecipients: [
        {
          type: 'node',
          address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbd39dc2eeb204860c4ffa5c1b0dcb54aa',
          split: 100,
        },
      ],
    }
    const expected = {
      '@startTime': 120,
      '@duration': 60,
      '@remoteStartTime': 0,
      '@remotePercentage': 25,
      'podcast:remoteItem': {
        '@feedGuid': 'remote-guid-123',
        '@feedUrl': 'https://remote.example.com/feed.xml',
        '@itemGuid': 'remote-item-123',
        '@medium': 'music',
      },
      'podcast:valueRecipient': [
        {
          '@type': 'node',
          '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbd39dc2eeb204860c4ffa5c1b0dcb54aa',
          '@split': 100,
        },
      ],
    }

    expect(generateValueTimeSplit(value)).toEqual(expected)
  })

  it('should generate value time split with minimal properties', () => {
    const value = {
      startTime: 120,
      duration: 60,
    }
    const expected = {
      '@startTime': 120,
      '@duration': 60,
    }

    expect(generateValueTimeSplit(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateValueTimeSplit(undefined)).toBeUndefined()
  })
})

describe('generateValue', () => {
  it('should generate value with all properties', () => {
    const value = {
      type: 'lightning',
      method: 'keysend',
      suggested: 0.00000005,
      valueRecipients: [
        {
          type: 'node',
          address: '02d5c1bf8b940dc9cadca86d1b0a3c37fbd39dc2eeb204860c4ffa5c1b0dcb54aa',
          split: 50,
        },
      ],
      valueTimeSplits: [
        {
          startTime: 120,
          duration: 60,
        },
      ],
    }
    const expected = {
      '@type': 'lightning',
      '@method': 'keysend',
      '@suggested': 0.00000005,
      'podcast:valueRecipient': [
        {
          '@type': 'node',
          '@address': '02d5c1bf8b940dc9cadca86d1b0a3c37fbd39dc2eeb204860c4ffa5c1b0dcb54aa',
          '@split': 50,
        },
      ],
      'podcast:valueTimeSplit': [
        {
          '@startTime': 120,
          '@duration': 60,
        },
      ],
    }

    expect(generateValue(value)).toEqual(expected)
  })

  it('should generate value with minimal properties', () => {
    const value = {
      type: 'lightning',
      method: 'keysend',
    }
    const expected = {
      '@type': 'lightning',
      '@method': 'keysend',
    }

    expect(generateValue(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateValue(undefined)).toBeUndefined()
  })
})

describe('generateImages', () => {
  it('should generate images with srcset', () => {
    const value = {
      srcset: 'https://example.com/image-400.jpg 400w, https://example.com/image-800.jpg 800w',
    }
    const expected = {
      '@srcset': 'https://example.com/image-400.jpg 400w, https://example.com/image-800.jpg 800w',
    }

    expect(generateImages(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateImages(undefined)).toBeUndefined()
  })
})

describe('generateContentLink', () => {
  it('should generate content link with all properties', () => {
    const value = {
      href: 'https://example.com/live-chat',
      display: 'Join Live Chat',
    }
    const expected = {
      '#text': 'Join Live Chat',
      '@href': 'https://example.com/live-chat',
    }

    expect(generateContentLink(value)).toEqual(expected)
  })

  it('should generate content link with only href', () => {
    const value = {
      href: 'https://example.com/live-chat',
    }
    const expected = {
      '@href': 'https://example.com/live-chat',
    }

    expect(generateContentLink(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateContentLink(undefined)).toBeUndefined()
  })
})

describe('generateSocialInteract', () => {
  it('should generate social interact with all properties', () => {
    const value = {
      uri: 'https://podcastindex.social/@dave',
      protocol: 'activitypub',
      accountId: '@dave',
      accountUrl: 'https://podcastindex.social/@dave',
      priority: 1,
    }
    const expected = {
      '@uri': 'https://podcastindex.social/@dave',
      '@protocol': 'activitypub',
      '@accountId': '@dave',
      '@accountUrl': 'https://podcastindex.social/@dave',
      '@priority': 1,
    }

    expect(generateSocialInteract(value)).toEqual(expected)
  })

  it('should generate social interact with disabled protocol', () => {
    const value = {
      protocol: 'disabled',
    }
    const expected = {
      '@protocol': 'disabled',
    }

    expect(generateSocialInteract(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateSocialInteract(undefined)).toBeUndefined()
  })
})

describe('generateBlock', () => {
  it('should generate block with all properties', () => {
    const value = {
      value: true,
      id: 'service-id-123',
    }
    const expected = {
      '#text': 'yes',
      '@id': 'service-id-123',
    }

    expect(generateBlock(value)).toEqual(expected)
  })

  it('should generate block with value false', () => {
    const value = {
      value: false,
    }
    const expected = {
      '#text': 'no',
    }

    expect(generateBlock(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateBlock(undefined)).toBeUndefined()
  })
})

describe('generateTxt', () => {
  it('should generate txt with all properties', () => {
    const value = {
      display: 'Copyright 2023 Example Podcast',
      purpose: 'copyright',
    }
    const expected = {
      '#text': 'Copyright 2023 Example Podcast',
      '@purpose': 'copyright',
    }

    expect(generateTxt(value)).toEqual(expected)
  })

  it('should generate txt with only display', () => {
    const value = {
      display: 'Some text content',
    }
    const expected = {
      '#text': 'Some text content',
    }

    expect(generateTxt(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateTxt(undefined)).toBeUndefined()
  })
})

describe('generateRemoteItem', () => {
  it('should generate remote item with all properties', () => {
    const value = {
      feedGuid: 'remote-feed-guid-123',
      feedUrl: 'https://remote.example.com/feed.xml',
      itemGuid: 'remote-item-guid-456',
      medium: 'music',
    }
    const expected = {
      '@feedGuid': 'remote-feed-guid-123',
      '@feedUrl': 'https://remote.example.com/feed.xml',
      '@itemGuid': 'remote-item-guid-456',
      '@medium': 'music',
    }

    expect(generateRemoteItem(value)).toEqual(expected)
  })

  it('should generate remote item with minimal properties', () => {
    const value = {
      feedGuid: 'remote-feed-guid-123',
    }
    const expected = {
      '@feedGuid': 'remote-feed-guid-123',
    }

    expect(generateRemoteItem(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateRemoteItem(undefined)).toBeUndefined()
  })
})

describe('generatePodroll', () => {
  it('should generate podroll with remote items', () => {
    const value = {
      remoteItems: [
        {
          feedGuid: 'remote-feed-1',
          feedUrl: 'https://example1.com/feed.xml',
        },
        {
          feedGuid: 'remote-feed-2',
          itemGuid: 'episode-123',
        },
      ],
    }
    const expected = {
      'podcast:remoteItem': [
        {
          '@feedGuid': 'remote-feed-1',
          '@feedUrl': 'https://example1.com/feed.xml',
        },
        {
          '@feedGuid': 'remote-feed-2',
          '@itemGuid': 'episode-123',
        },
      ],
    }

    expect(generatePodroll(value)).toEqual(expected)
  })

  it('should handle empty remote items array', () => {
    const value = {
      remoteItems: [],
    }

    // @ts-expect-error: Testing edge case
    expect(generatePodroll(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generatePodroll(undefined)).toBeUndefined()
  })
})

describe('generateUpdateFrequency', () => {
  it('should generate update frequency with all properties', () => {
    const value = {
      display: 'Weekly on Mondays',
      complete: true,
      dtstart: new Date('2023-01-01T00:00:00Z'),
      rrule: 'FREQ=WEEKLY;BYDAY=MO',
    }
    const expected = {
      '#text': 'Weekly on Mondays',
      '@complete': true,
      '@dtstart': '2023-01-01T00:00:00.000Z',
      '@rrule': 'FREQ=WEEKLY;BYDAY=MO',
    }

    expect(generateUpdateFrequency(value)).toEqual(expected)
  })

  it('should generate update frequency with minimal properties', () => {
    const value = {
      display: 'Irregular',
    }
    const expected = {
      '#text': 'Irregular',
    }

    expect(generateUpdateFrequency(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateUpdateFrequency(undefined)).toBeUndefined()
  })
})

describe('generatePodping', () => {
  it('should generate podping with usesPodping true', () => {
    const value = {
      usesPodping: true,
    }
    const expected = {
      '@usesPodping': true,
    }

    expect(generatePodping(value)).toEqual(expected)
  })

  it('should generate podping with usesPodping false', () => {
    const value = {
      usesPodping: false,
    }
    const expected = {
      '@usesPodping': false,
    }

    expect(generatePodping(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generatePodping(undefined)).toBeUndefined()
  })
})

describe('generateBaseItem', () => {
  it('should generate base item with all properties', () => {
    const value = {
      transcripts: [
        {
          url: 'https://example.com/transcript.txt',
          type: 'text/plain',
        },
      ],
      chapters: {
        url: 'https://example.com/chapters.json',
        type: 'application/json+chapters',
      },
      soundbites: [
        {
          startTime: 120.5,
          duration: 30.2,
        },
      ],
      persons: [
        {
          display: 'John Doe',
          role: 'host',
        },
      ],
      location: {
        display: 'Austin, TX',
      },
      season: {
        number: 2,
      },
      episode: {
        number: 42,
      },
      license: {
        display: 'Creative Commons',
      },
      alternateEnclosures: [
        {
          type: 'audio/mpeg',
        },
      ],
      value: {
        type: 'lightning',
        method: 'keysend',
      },
      images: {
        srcset: 'https://example.com/image.jpg',
      },
      socialInteracts: [
        {
          protocol: 'activitypub',
        },
      ],
      txts: [
        {
          display: 'Copyright notice',
        },
      ],
    }
    const expected = {
      'podcast:transcript': [
        {
          '@url': 'https://example.com/transcript.txt',
          '@type': 'text/plain',
        },
      ],
      'podcast:chapters': {
        '@url': 'https://example.com/chapters.json',
        '@type': 'application/json+chapters',
      },
      'podcast:soundbite': [
        {
          '@startTime': 120.5,
          '@duration': 30.2,
        },
      ],
      'podcast:person': [
        {
          '#text': 'John Doe',
          '@role': 'host',
        },
      ],
      'podcast:location': {
        '#text': 'Austin, TX',
      },
      'podcast:season': {
        '#text': 2,
      },
      'podcast:episode': {
        '#text': 42,
      },
      'podcast:license': {
        '#text': 'Creative Commons',
      },
      'podcast:alternateEnclosure': [
        {
          '@type': 'audio/mpeg',
        },
      ],
      'podcast:value': {
        '@type': 'lightning',
        '@method': 'keysend',
      },
      'podcast:images': {
        '@srcset': 'https://example.com/image.jpg',
      },
      'podcast:socialInteract': [
        {
          '@protocol': 'activitypub',
        },
      ],
      'podcast:txt': [
        {
          '#text': 'Copyright notice',
        },
      ],
    }

    expect(generateBaseItem(value)).toEqual(expected)
  })

  it('should generate base item with minimal properties', () => {
    const value = {
      episode: {
        number: 1,
      },
    }
    const expected = {
      'podcast:episode': {
        '#text': 1,
      },
    }

    expect(generateBaseItem(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
    expect(generateBaseItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateBaseItem(undefined)).toBeUndefined()
  })
})

describe('generateLiveItem', () => {
  it('should generate live item with all properties', () => {
    const value = {
      status: 'live',
      start: new Date('2023-01-01T10:00:00Z'),
      end: new Date('2023-01-01T11:00:00Z'),
      contentLinks: [
        {
          href: 'https://example.com/live-chat',
          display: 'Join Chat',
        },
      ],
      episode: {
        number: 42,
      },
      persons: [
        {
          display: 'Host Name',
          role: 'host',
        },
      ],
    }
    const expected = {
      '@status': 'live',
      '@start': '2023-01-01T10:00:00.000Z',
      '@end': '2023-01-01T11:00:00.000Z',
      'podcast:contentLink': [
        {
          '#text': 'Join Chat',
          '@href': 'https://example.com/live-chat',
        },
      ],
      'podcast:episode': {
        '#text': 42,
      },
      'podcast:person': [
        {
          '#text': 'Host Name',
          '@role': 'host',
        },
      ],
    }

    expect(generateLiveItem(value)).toEqual(expected)
  })

  it('should generate live item with minimal properties', () => {
    const value = {
      status: 'pending',
      start: new Date('2023-01-01T10:00:00Z'),
    }
    const expected = {
      '@status': 'pending',
      '@start': '2023-01-01T10:00:00.000Z',
    }

    expect(generateLiveItem(value)).toEqual(expected)
  })

  it('should handle non-object inputs', () => {
    expect(generateLiveItem(undefined)).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item using base item function', () => {
    const value = {
      episode: {
        number: 1,
      },
      persons: [
        {
          display: 'Host',
        },
      ],
    }
    const expected = {
      'podcast:episode': {
        '#text': 1,
      },
      'podcast:person': [
        {
          '#text': 'Host',
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateItem(undefined)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      locked: {
        value: true,
        owner: 'owner@example.com',
      },
      fundings: [
        {
          url: 'https://example.com/support',
          display: 'Support us',
        },
      ],
      persons: [
        {
          display: 'Host Name',
          role: 'host',
        },
      ],
      location: {
        display: 'Austin, TX',
      },
      trailers: [
        {
          display: 'Season 2 Trailer',
          url: 'https://example.com/trailer.mp3',
          pubDate: new Date('2023-01-01T00:00:00Z'),
        },
      ],
      license: {
        display: 'Creative Commons',
      },
      guid: 'feed-guid-123',
      value: {
        type: 'lightning',
        method: 'keysend',
      },
      medium: 'podcast',
      images: {
        srcset: 'https://example.com/image.jpg',
      },
      liveItems: [
        {
          status: 'live',
          start: new Date('2023-01-01T10:00:00Z'),
        },
      ],
      blocks: [
        {
          value: true,
          id: 'service-123',
        },
      ],
      txts: [
        {
          display: 'Copyright notice',
        },
      ],
      remoteItems: [
        {
          feedGuid: 'remote-feed-123',
        },
      ],
      podroll: {
        remoteItems: [
          {
            feedGuid: 'podroll-feed-123',
          },
        ],
      },
      updateFrequency: {
        display: 'Weekly',
      },
      podping: {
        usesPodping: true,
      },
    }
    const expected = {
      'podcast:locked': {
        '#text': 'yes',
        '@owner': 'owner@example.com',
      },
      'podcast:funding': [
        {
          '#text': 'Support us',
          '@url': 'https://example.com/support',
        },
      ],
      'podcast:person': [
        {
          '#text': 'Host Name',
          '@role': 'host',
        },
      ],
      'podcast:location': {
        '#text': 'Austin, TX',
      },
      'podcast:trailer': [
        {
          '#text': 'Season 2 Trailer',
          '@url': 'https://example.com/trailer.mp3',
          '@pubdate': 'Sun, 01 Jan 2023 00:00:00 GMT',
        },
      ],
      'podcast:license': {
        '#text': 'Creative Commons',
      },
      'podcast:guid': 'feed-guid-123',
      'podcast:value': {
        '@type': 'lightning',
        '@method': 'keysend',
      },
      'podcast:medium': 'podcast',
      'podcast:images': {
        '@srcset': 'https://example.com/image.jpg',
      },
      'podcast:liveItem': [
        {
          '@status': 'live',
          '@start': '2023-01-01T10:00:00.000Z',
        },
      ],
      'podcast:block': [
        {
          '#text': 'yes',
          '@id': 'service-123',
        },
      ],
      'podcast:txt': [
        {
          '#text': 'Copyright notice',
        },
      ],
      'podcast:remoteItem': [
        {
          '@feedGuid': 'remote-feed-123',
        },
      ],
      'podcast:podroll': {
        'podcast:remoteItem': [
          {
            '@feedGuid': 'podroll-feed-123',
          },
        ],
      },
      'podcast:updateFrequency': {
        '#text': 'Weekly',
      },
      'podcast:podping': {
        '@usesPodping': true,
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with minimal properties', () => {
    const value = {
      guid: 'minimal-feed-guid',
    }
    const expected = {
      'podcast:guid': 'minimal-feed-guid',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateFeed(undefined)).toBeUndefined()
  })
})
