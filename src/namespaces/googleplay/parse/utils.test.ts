import { describe, expect, it } from 'bun:test'
import type { GooglePlayNs } from '../common/types.js'
import { retrieveFeed, retrieveItem } from './utils.js'

describe('retrieveItem', () => {
  it('should parse complete item object with all properties', () => {
    const value = {
      'googleplay:author': 'John Doe',
      'googleplay:description': 'Episode description',
      'googleplay:explicit': 'Yes',
      'googleplay:block': 'No',
      'googleplay:image': { '@href': 'https://example.com/image.jpg' },
    }
    const expected = {
      author: 'John Doe',
      description: 'Episode description',
      explicit: true,
      block: false,
      image: { href: 'https://example.com/image.jpg' },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse image as text content when no href attribute', () => {
    const value = {
      'googleplay:image': 'https://example.com/image.jpg',
    }
    const expected = {
      image: { href: 'https://example.com/image.jpg' },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle boolean string values correctly', () => {
    const value = {
      'googleplay:explicit': 'Yes',
      'googleplay:block': 'No',
    }
    const expected = {
      explicit: true,
      block: false,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle case-insensitive boolean values', () => {
    const value = {
      'googleplay:explicit': 'YES',
      'googleplay:block': 'no',
    }
    const expected = {
      explicit: true,
      block: false,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle explicit="clean" value', () => {
    const value = {
      'googleplay:explicit': 'clean',
    }
    const expected: GooglePlayNs.Item = {
      explicit: 'clean',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle explicit="clean" with different casing', () => {
    const value = {
      'googleplay:explicit': 'CLEAN',
    }
    const expected: GooglePlayNs.Item = {
      explicit: 'clean',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse partial item object', () => {
    const value = {
      'googleplay:author': 'Jane Doe',
      'googleplay:explicit': 'No',
    }
    const expected = {
      author: 'Jane Doe',
      explicit: false,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined for non-object', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })

  it('should handle nested text content', () => {
    const value = {
      'googleplay:author': { '#text': 'John Doe' },
      'googleplay:description': { '#text': 'Episode description' },
    }
    const expected = {
      author: 'John Doe',
      description: 'Episode description',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should ignore empty strings', () => {
    const value = {
      'googleplay:author': '',
      'googleplay:description': '   ',
      'googleplay:explicit': 'No',
    }
    const expected = {
      explicit: false,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })
})

describe('retrieveFeed', () => {
  it('should parse complete feed object with all properties', () => {
    const value = {
      'googleplay:author': 'Podcast Author',
      'googleplay:description': 'Podcast description',
      'googleplay:explicit': 'No',
      'googleplay:block': 'Yes',
      'googleplay:image': { '@href': 'https://example.com/podcast.jpg' },
      'googleplay:new-feed-url': 'https://example.com/new-podcast-feed',
      'googleplay:email': 'contact@example.com',
      'googleplay:category': [{ '@text': 'Technology' }, { '@text': 'Education' }],
    }
    const expected = {
      author: 'Podcast Author',
      description: 'Podcast description',
      explicit: false,
      block: true,
      image: { href: 'https://example.com/podcast.jpg' },
      newFeedUrl: 'https://example.com/new-podcast-feed',
      email: 'contact@example.com',
      categories: ['Technology', 'Education'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse categories as text content when no text attribute', () => {
    const value = {
      'googleplay:category': ['Technology', 'Education'],
    }
    const expected = {
      categories: ['Technology', 'Education'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle single category', () => {
    const value = {
      'googleplay:category': { '@text': 'Technology' },
    }
    const expected = {
      categories: ['Technology'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse partial feed object', () => {
    const value = {
      'googleplay:author': 'Podcast Creator',
      'googleplay:email': 'creator@example.com',
    }
    const expected = {
      author: 'Podcast Creator',
      email: 'creator@example.com',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(retrieveFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object', () => {
    expect(retrieveFeed('not an object')).toBeUndefined()
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })

  it('should handle mixed category formats', () => {
    const value = {
      'googleplay:category': [{ '@text': 'Technology' }, 'Education', { '@text': 'Science' }],
    }
    const expected = {
      categories: ['Technology', 'Education', 'Science'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should ignore empty categories', () => {
    const value = {
      'googleplay:category': [{ '@text': 'Technology' }, '', { '@text': '' }, 'Education'],
    }
    const expected = {
      categories: ['Technology', 'Education'],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle explicit="clean" value at feed level', () => {
    const value = {
      'googleplay:explicit': 'clean',
    }
    const expected: GooglePlayNs.Feed = {
      explicit: 'clean',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle explicit="clean" with whitespace and casing', () => {
    const value = {
      'googleplay:explicit': '  Clean  ',
    }
    const expected: GooglePlayNs.Feed = {
      explicit: 'clean',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })
})
