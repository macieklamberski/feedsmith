import { describe, expect, it } from 'bun:test'
import type { GooglePlayNs } from '../common/types.js'
import { parseCategory, parseExplicit, parseImage, retrieveFeed, retrieveItem } from './utils.js'

describe('parseImage', () => {
  it('should parse image with href attribute', () => {
    const value = {
      '@href': 'https://example.com/image.jpg',
    }
    const expected: GooglePlayNs.Image = {
      href: 'https://example.com/image.jpg',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should parse image from string value', () => {
    const value = 'https://example.com/image.jpg'
    const expected: GooglePlayNs.Image = {
      href: 'https://example.com/image.jpg',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should parse image from #text property', () => {
    const value = {
      '#text': 'https://example.com/image.jpg',
    }
    const expected: GooglePlayNs.Image = {
      href: 'https://example.com/image.jpg',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should handle coercible number values', () => {
    const value = 123
    const expected: GooglePlayNs.Image = {
      href: '123',
    }

    expect(parseImage(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    expect(parseImage('')).toBeUndefined()
    expect(parseImage({ '@href': '' })).toBeUndefined()
  })

  it('should return undefined for whitespace-only strings', () => {
    expect(parseImage('   ')).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(parseImage({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseImage(null)).toBeUndefined()
    expect(parseImage(undefined)).toBeUndefined()
    expect(parseImage([])).toBeUndefined()
    expect(parseImage(true)).toBeUndefined()
  })
})

describe('parseCategory', () => {
  it('should parse category with text attribute', () => {
    const value = {
      '@text': 'Technology',
    }

    expect(parseCategory(value)).toBe('Technology')
  })

  it('should parse category from string value', () => {
    const value = 'Technology'

    expect(parseCategory(value)).toBe('Technology')
  })

  it('should parse category from #text property', () => {
    const value = {
      '#text': 'Technology',
    }

    expect(parseCategory(value)).toBe('Technology')
  })

  it('should handle coercible number values', () => {
    expect(parseCategory(123)).toBe('123')
  })

  it('should return undefined for empty strings', () => {
    expect(parseCategory('')).toBeUndefined()
    expect(parseCategory({ '@text': '' })).toBeUndefined()
  })

  it('should return undefined for whitespace-only strings', () => {
    expect(parseCategory('   ')).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(parseCategory({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseCategory(null)).toBeUndefined()
    expect(parseCategory(undefined)).toBeUndefined()
    expect(parseCategory([])).toBeUndefined()
  })
})

describe('parseExplicit', () => {
  it('should parse yes as true case-insensitively', () => {
    expect(parseExplicit('yes')).toBe(true)
    expect(parseExplicit('Yes')).toBe(true)
    expect(parseExplicit('YES')).toBe(true)
  })

  it('should parse no as false case-insensitively', () => {
    expect(parseExplicit('no')).toBe(false)
    expect(parseExplicit('NO')).toBe(false)
  })

  it('should parse clean value case-insensitively', () => {
    expect(parseExplicit('clean')).toBe('clean')
    expect(parseExplicit('CLEAN')).toBe('clean')
    expect(parseExplicit('  Clean  ')).toBe('clean')
  })

  it('should parse clean from #text property', () => {
    const value = {
      '#text': 'clean',
    }

    expect(parseExplicit(value)).toBe('clean')
  })

  it('should parse non-yes values as false', () => {
    expect(parseExplicit('maybe')).toBe(false)
  })

  it('should return undefined for empty and whitespace-only strings', () => {
    expect(parseExplicit('')).toBeUndefined()
    expect(parseExplicit('   ')).toBeUndefined()
  })

  it('should return undefined for null and undefined inputs', () => {
    expect(parseExplicit(null)).toBeUndefined()
    expect(parseExplicit(undefined)).toBeUndefined()
  })

  it.todo('should parse yes from #text property', () => {
    // parseExplicit({ '#text': 'yes' }) currently returns undefined because the yes/no branch
    // passes the raw object to parseYesNoBoolean instead of the retrieved text, while the clean
    // branch reads the retrieved text.
    // Expected: true.
  })

  it.todo('should handle non-string inputs without throwing', () => {
    // parseExplicit currently throws a TypeError for {}, [], 123 and true because retrieveText
    // returns the raw value and .trim() is called on a non-string.
    // Expected: undefined instead of a throw.
  })
})

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
