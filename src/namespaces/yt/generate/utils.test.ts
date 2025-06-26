import { describe, expect, it } from 'bun:test'
import { generateFeed, generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate valid item object with all properties', () => {
    const value = {
      videoId: 'dQw4w9WgXcQ',
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }
    const expected = {
      'yt:videoId': 'dQw4w9WgXcQ',
      'yt:channelId': 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item object with only videoId', () => {
    const value = {
      videoId: 'dQw4w9WgXcQ',
    }
    const expected = {
      'yt:videoId': 'dQw4w9WgXcQ',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item object with only channelId', () => {
    const value = {
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }
    const expected = {
      'yt:channelId': 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle real YouTube video IDs', () => {
    const value = {
      videoId: 'OTYFJaT-Glk',
      channelId: 'UCtNjkMLQQOX251hjGqimx2w',
    }
    const expected = {
      'yt:videoId': 'OTYFJaT-Glk',
      'yt:channelId': 'UCtNjkMLQQOX251hjGqimx2w',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle YouTube Shorts IDs', () => {
    const value = {
      videoId: 'rUxyKA_-grg',
      channelId: 'UCF4eDDnOVE6Ih6q1R8V3aOA',
    }
    const expected = {
      'yt:videoId': 'rUxyKA_-grg',
      'yt:channelId': 'UCF4eDDnOVE6Ih6q1R8V3aOA',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should filter out undefined values', () => {
    const value = {
      videoId: 'dQw4w9WgXcQ',
      channelId: undefined,
    }
    const expected = {
      'yt:videoId': 'dQw4w9WgXcQ',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should filter out empty string values', () => {
    const value = {
      videoId: '',
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }
    const expected = {
      'yt:channelId': 'UCuAXFkgsw1L7xaCfnd5JJOw',
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
      videoId: undefined,
      channelId: undefined,
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle YouTube live stream IDs', () => {
    const value = {
      videoId: 'jfKfPfyJRdk',
      channelId: 'UCSJ4gkVC6NrvII8umztf0Ow',
    }
    const expected = {
      'yt:videoId': 'jfKfPfyJRdk',
      'yt:channelId': 'UCSJ4gkVC6NrvII8umztf0Ow',
    }

    expect(generateItem(value)).toEqual(expected)
  })
})

describe('generateFeed', () => {
  it('should generate valid feed object with all properties', () => {
    const value = {
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
      playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    }
    const expected = {
      'yt:channelId': 'UCuAXFkgsw1L7xaCfnd5JJOw',
      'yt:playlistId': 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed object with only channelId', () => {
    const value = {
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }
    const expected = {
      'yt:channelId': 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed object with only playlistId', () => {
    const value = {
      playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    }
    const expected = {
      'yt:playlistId': 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle real YouTube channel IDs', () => {
    const value = {
      channelId: 'UCT5jsrerQIrgFhjscRM5TTA',
      playlistId: 'UUT5jsrerQIrgFhjscRM5TTA',
    }
    const expected = {
      'yt:channelId': 'UCT5jsrerQIrgFhjscRM5TTA',
      'yt:playlistId': 'UUT5jsrerQIrgFhjscRM5TTA',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should filter out undefined values', () => {
    const value = {
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
      playlistId: undefined,
    }
    const expected = {
      'yt:channelId': 'UCuAXFkgsw1L7xaCfnd5JJOw',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should filter out empty string values', () => {
    const value = {
      channelId: '',
      playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    }
    const expected = {
      'yt:playlistId': 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
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
      channelId: undefined,
      playlistId: undefined,
    }

    expect(generateFeed(value)).toBeUndefined()
  })
})
