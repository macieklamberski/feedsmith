import { describe, expect, it } from 'bun:test'
import { retrieveFeed, retrieveItem } from './utils.js'

describe('retrieveItem', () => {
  const expectedFull = {
    videoId: 'dQw4w9WgXcQ',
    channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
  }

  it('should parse complete item object with all properties (with #text)', () => {
    const value = {
      'yt:videoid': { '#text': 'dQw4w9WgXcQ' },
      'yt:channelid': { '#text': 'UCuAXFkgsw1L7xaCfnd5JJOw' },
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object with all properties (without #text)', () => {
    const value = {
      'yt:videoid': 'dQw4w9WgXcQ',
      'yt:channelid': 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse complete item object with all properties (with array of values)', () => {
    const value = {
      'yt:videoid': ['dQw4w9WgXcQ', 'anotherVideoId'],
      'yt:channelid': ['UCuAXFkgsw1L7xaCfnd5JJOw', 'UCanotherChannelId'],
    }

    expect(retrieveItem(value)).toEqual(expectedFull)
  })

  it('should parse item with only videoId field', () => {
    const value = {
      'yt:videoid': { '#text': 'dQw4w9WgXcQ' },
    }
    const expected = {
      videoId: 'dQw4w9WgXcQ',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only channelId field', () => {
    const value = {
      'yt:channelid': { '#text': 'UCuAXFkgsw1L7xaCfnd5JJOw' },
    }
    const expected = {
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle real YouTube video IDs', () => {
    const value = {
      'yt:videoid': { '#text': 'OTYFJaT-Glk' },
      'yt:channelid': { '#text': 'UCtNjkMLQQOX251hjGqimx2w' },
    }
    const expected = {
      videoId: 'OTYFJaT-Glk',
      channelId: 'UCtNjkMLQQOX251hjGqimx2w',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'yt:videoid': { '#text': 123456 },
      'yt:channelid': { '#text': 'test-channel' },
    }
    const expected = {
      videoId: '123456',
      channelId: 'test-channel',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when no yt properties exist', () => {
    const value = {
      title: { '#text': 'Not a YouTube item' },
      'media:group': { 'media:title': 'Some title' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })

  it('should handle objects with missing #text property', () => {
    const value = {
      'yt:videoid': {},
      'yt:channelid': { '#text': 'UCuAXFkgsw1L7xaCfnd5JJOw' },
    }
    const expected = {
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle mixed valid and invalid properties', () => {
    const value = {
      'yt:videoid': { '#text': 'dQw4w9WgXcQ' },
      'yt:channelid': { '#text': '' }, // Empty string should be filtered out.
      'other:property': { '#text': 'value' },
    }
    const expected = {
      videoId: 'dQw4w9WgXcQ',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle YouTube Shorts IDs', () => {
    const value = {
      'yt:videoid': { '#text': 'rUxyKA_-grg' },
      'yt:channelid': { '#text': 'UCF4eDDnOVE6Ih6q1R8V3aOA' },
    }
    const expected = {
      videoId: 'rUxyKA_-grg',
      channelId: 'UCF4eDDnOVE6Ih6q1R8V3aOA',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
    channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
  }

  it('should parse complete feed object with all properties (with #text)', () => {
    const value = {
      'yt:channelid': { '#text': 'UCuAXFkgsw1L7xaCfnd5JJOw' },
      'yt:playlistid': { '#text': 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf' },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete feed object with all properties (without #text)', () => {
    const value = {
      'yt:channelid': 'UCuAXFkgsw1L7xaCfnd5JJOw',
      'yt:playlistid': 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse complete feed object with all properties (with array of values)', () => {
    const value = {
      'yt:channelid': ['UCuAXFkgsw1L7xaCfnd5JJOw', 'UCanotherChannelId'],
      'yt:playlistid': ['PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf', 'PLanotherPlaylistId'],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse feed with only channelId field', () => {
    const value = {
      'yt:channelid': { '#text': 'UCuAXFkgsw1L7xaCfnd5JJOw' },
    }
    const expected = {
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with only playlistId field', () => {
    const value = {
      'yt:playlistid': { '#text': 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf' },
    }
    const expected = {
      playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle real YouTube channel IDs', () => {
    const value = {
      'yt:channelid': { '#text': 'UCT5jsrerQIrgFhjscRM5TTA' },
      'yt:playlistid': { '#text': 'UUT5jsrerQIrgFhjscRM5TTA' },
    }
    const expected = {
      channelId: 'UCT5jsrerQIrgFhjscRM5TTA',
      playlistId: 'UUT5jsrerQIrgFhjscRM5TTA',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle coercible values', () => {
    const value = {
      'yt:channelid': { '#text': 123456 },
      'yt:playlistid': { '#text': 'test-playlist' },
    }
    const expected = {
      channelId: '123456',
      playlistId: 'test-playlist',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined when no yt properties exist', () => {
    const value = {
      title: { '#text': 'Not a YouTube feed' },
      'media:group': { 'media:title': 'Some title' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed('not an object')).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })

  it('should handle objects with missing #text property', () => {
    const value = {
      'yt:channelid': {},
      'yt:playlistid': { '#text': 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf' },
    }
    const expected = {
      playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle mixed valid and invalid properties', () => {
    const value = {
      'yt:channelid': { '#text': 'UCuAXFkgsw1L7xaCfnd5JJOw' },
      'yt:playlistid': { '#text': '' }, // Empty string should be filtered out.
      'other:property': { '#text': 'value' },
    }
    const expected = {
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })
})
