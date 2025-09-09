import { describe, expect, it } from 'bun:test'
import { generateFeed, generateItem } from './utils.js'

describe('generateItem', () => {
  it('should generate complete item object with all properties', () => {
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

  it('should generate partial item object', () => {
    const value = {
      author: 'Jane Doe',
      explicit: false,
    }
    const expected = {
      'googleplay:author': 'Jane Doe',
      'googleplay:explicit': 'no',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle boolean values correctly', () => {
    const value = {
      explicit: true,
      block: false,
    }
    const expected = {
      'googleplay:explicit': 'yes',
      'googleplay:block': 'no',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should return undefined for non-object', () => {
    expect(generateItem('not an object')).toBeUndefined()
    expect(generateItem(null)).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    expect(generateItem(123)).toBeUndefined()
    expect(generateItem([])).toBeUndefined()
  })

  it('should ignore empty strings', () => {
    const value = {
      author: '',
      description: '   ',
      block: false,
      explicit: true,
    }
    const expected = {
      'googleplay:block': 'no',
      'googleplay:explicit': 'yes',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should ignore undefined and null values', () => {
    const value = {
      author: undefined,
      description: null,
      image: { href: 'https://example.com/image.jpg' },
    }
    const expected = {
      'googleplay:image': { '@href': 'https://example.com/image.jpg' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle non-boolean explicit and block values', () => {
    const value = {
      explicit: 'not-boolean',
      block: 123,
      author: 'John Doe',
    }
    const expected = {
      'googleplay:author': 'John Doe',
    }

    expect(generateItem(value)).toEqual(expected)
  })
})

describe('generateFeed', () => {
  it('should generate complete feed object with all properties', () => {
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

  it('should handle single category', () => {
    const value = {
      categories: ['Technology'],
    }
    const expected = {
      'googleplay:category': [{ '@text': 'Technology' }],
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

  it('should handle empty category array', () => {
    const value = {
      category: [],
      author: 'Author',
    }
    const expected = {
      'googleplay:author': 'Author',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate partial feed object', () => {
    const value = {
      author: 'Podcast Creator',
      email: 'creator@example.com',
    }
    const expected = {
      'googleplay:author': 'Podcast Creator',
      'googleplay:email': 'creator@example.com',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object', () => {
    expect(generateFeed('not an object')).toBeUndefined()
    expect(generateFeed(null)).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    expect(generateFeed(123)).toBeUndefined()
    expect(generateFeed([])).toBeUndefined()
  })

  it('should handle categories with mixed valid and invalid values', () => {
    const value = {
      categories: ['Technology', '', undefined, null, 'Education', 123],
      author: 'Author',
    }
    const expected = {
      'googleplay:author': 'Author',
      'googleplay:category': [{ '@text': 'Technology' }, { '@text': 'Education' }],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should ignore undefined category array', () => {
    const value = {
      category: undefined,
      author: 'Author',
    }
    const expected = {
      'googleplay:author': 'Author',
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})
