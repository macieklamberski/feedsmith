import { describe, expect, it } from 'bun:test'
import type { GooglePlayNs } from '../common/types.js'
import { generateFeed, generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      author: 'John Doe',
      description: 'Episode description',
      explicit: true,
      block: false,
      image: { href: 'https://example.com/image.jpg' },
    }
    const expected = {
      'googleplay:author': 'John Doe',
      'googleplay:description': 'Episode description',
      'googleplay:explicit': 'yes',
      'googleplay:block': 'no',
      'googleplay:image': { '@href': 'https://example.com/image.jpg' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with minimal properties', () => {
    const value = {
      author: 'Jane Doe',
    }
    const expected = {
      'googleplay:author': 'Jane Doe',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate explicit="clean" value', () => {
    const value: GooglePlayNs.Item = {
      explicit: 'clean',
      author: 'John Doe',
    }
    const expected = {
      'googleplay:author': 'John Doe',
      'googleplay:explicit': 'clean',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should ignore empty strings', () => {
    const value = {
      author: '',
      description: '   ',
      block: false,
    }
    const expected = {
      'googleplay:block': 'no',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(123)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
      author: 'Podcast Author',
      description: 'Podcast description',
      explicit: false,
      block: true,
      image: { href: 'https://example.com/podcast.jpg' },
      newFeedUrl: 'https://example.com/new-podcast-feed',
      email: 'contact@example.com',
      categories: ['Technology', 'Education'],
    }
    const expected = {
      'googleplay:author': 'Podcast Author',
      'googleplay:description': 'Podcast description',
      'googleplay:explicit': 'no',
      'googleplay:block': 'yes',
      'googleplay:image': { '@href': 'https://example.com/podcast.jpg' },
      'googleplay:new-feed-url': 'https://example.com/new-podcast-feed',
      'googleplay:email': 'contact@example.com',
      'googleplay:category': [{ '@text': 'Technology' }, { '@text': 'Education' }],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with minimal properties', () => {
    const value = {
      author: 'Podcast Creator',
    }
    const expected = {
      'googleplay:author': 'Podcast Creator',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate explicit="clean" value', () => {
    const value: GooglePlayNs.Feed = {
      explicit: 'clean',
      author: 'Podcast Author',
    }
    const expected = {
      'googleplay:author': 'Podcast Author',
      'googleplay:explicit': 'clean',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should ignore empty categories', () => {
    const value = {
      categories: ['Technology', '', '   ', 'Education'],
      author: 'Author',
    }
    const expected = {
      'googleplay:author': 'Author',
      'googleplay:category': [{ '@text': 'Technology' }, { '@text': 'Education' }],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
  })
})
