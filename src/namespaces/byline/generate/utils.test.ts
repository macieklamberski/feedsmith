import { describe, expect, it } from 'bun:test'
import {
  generateAffiliation,
  generateAuthor,
  generateFeed,
  generateItem,
  generateOrg,
  generatePerson,
  generateProfile,
  generateTheme,
} from './utils.js'

describe('generateProfile', () => {
  it('should generate profile with href and rel', () => {
    const value = {
      href: 'https://mastodon.social/@annie',
      rel: 'mastodon',
    }
    const expected = {
      '@href': 'https://mastodon.social/@annie',
      '@rel': 'mastodon',
    }

    expect(generateProfile(value)).toEqual(expected)
  })

  it('should generate profile with only href', () => {
    const value = {
      href: 'https://example.com',
    }
    const expected = {
      '@href': 'https://example.com',
    }

    expect(generateProfile(value)).toEqual(expected)
  })

  it('should return undefined when href is missing', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateProfile({ rel: 'mastodon' })).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateProfile('string')).toBeUndefined()
    expect(generateProfile(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateProfile(null)).toBeUndefined()
  })
})

describe('generateTheme', () => {
  it('should generate theme with all attributes', () => {
    const value = {
      color: '#4A90A4',
      accent: '#FF6B6B',
      style: 'light',
    }
    const expected = {
      '@color': '#4A90A4',
      '@accent': '#FF6B6B',
      '@style': 'light',
    }

    expect(generateTheme(value)).toEqual(expected)
  })

  it('should generate theme with only style', () => {
    const value = {
      style: 'dark',
    }
    const expected = {
      '@style': 'dark',
    }

    expect(generateTheme(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateTheme({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateTheme('string')).toBeUndefined()
    expect(generateTheme(undefined)).toBeUndefined()
  })
})

describe('generatePerson', () => {
  it('should generate complete person with all properties', () => {
    const value = {
      id: 'annie',
      name: 'Annie Park',
      context: 'Designer and photographer.',
      urls: ['https://annie.example.com'],
      avatar: 'https://annie.example.com/avatar.jpg',
      profiles: [
        { href: 'https://mastodon.social/@annie', rel: 'mastodon' },
        { href: 'https://github.com/annie', rel: 'github' },
      ],
      now: 'https://annie.example.com/now',
      uses: 'https://annie.example.com/uses',
      theme: { color: '#4A90A4', accent: '#FF6B6B', style: 'light' },
    }
    const expected = {
      '@id': 'annie',
      'byline:name': 'Annie Park',
      'byline:context': 'Designer and photographer.',
      'byline:url': ['https://annie.example.com'],
      'byline:avatar': 'https://annie.example.com/avatar.jpg',
      'byline:profile': [
        { '@href': 'https://mastodon.social/@annie', '@rel': 'mastodon' },
        { '@href': 'https://github.com/annie', '@rel': 'github' },
      ],
      'byline:now': 'https://annie.example.com/now',
      'byline:uses': 'https://annie.example.com/uses',
      'byline:theme': { '@color': '#4A90A4', '@accent': '#FF6B6B', '@style': 'light' },
    }

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should generate person with only name', () => {
    const value = {
      name: 'Marcus Chen',
    }
    const expected = {
      'byline:name': 'Marcus Chen',
    }

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should return undefined when name is missing', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePerson({ id: 'annie' })).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePerson('string')).toBeUndefined()
    expect(generatePerson(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePerson(null)).toBeUndefined()
  })
})

describe('generateOrg', () => {
  it('should generate complete org with all properties', () => {
    const value = {
      id: 'ttr',
      name: 'The Tech Review',
      url: 'https://thetechreview.example.com',
      type: 'news',
      theme: { color: '#1A1A2E', accent: '#E94560', style: 'dark' },
    }
    const expected = {
      '@id': 'ttr',
      'byline:name': 'The Tech Review',
      'byline:url': 'https://thetechreview.example.com',
      'byline:type': 'news',
      'byline:theme': { '@color': '#1A1A2E', '@accent': '#E94560', '@style': 'dark' },
    }

    expect(generateOrg(value)).toEqual(expected)
  })

  it('should return undefined when name is missing', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateOrg({ id: 'ttr' })).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateOrg('string')).toBeUndefined()
    expect(generateOrg(undefined)).toBeUndefined()
  })
})

describe('generateAuthor', () => {
  it('should generate author reference by ref', () => {
    const value = {
      ref: 'annie',
    }
    const expected = {
      '@ref': 'annie',
    }

    expect(generateAuthor(value)).toEqual(expected)
  })

  it('should generate author with inline person', () => {
    const value = {
      person: {
        id: 'guest-sara',
        name: 'Sara Mitchell',
        context: 'Guest contributor.',
      },
    }
    const expected = {
      'byline:person': {
        '@id': 'guest-sara',
        'byline:name': 'Sara Mitchell',
        'byline:context': 'Guest contributor.',
      },
    }

    expect(generateAuthor(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateAuthor({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateAuthor('string')).toBeUndefined()
    expect(generateAuthor(undefined)).toBeUndefined()
  })
})

describe('generateAffiliation', () => {
  it('should generate complete affiliation', () => {
    const value = {
      org: 'apple',
      relationship: 'employed',
      title: 'Senior Engineer',
    }
    const expected = {
      'byline:org-ref': { '@ref': 'apple' },
      'byline:relationship': 'employed',
      'byline:title': 'Senior Engineer',
    }

    expect(generateAffiliation(value)).toEqual(expected)
  })

  it('should generate affiliation with only relationship', () => {
    const value = {
      relationship: 'sponsored',
    }
    const expected = {
      'byline:relationship': 'sponsored',
    }

    expect(generateAffiliation(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateAffiliation({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateAffiliation('string')).toBeUndefined()
    expect(generateAffiliation(undefined)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with contributors and organizations', () => {
    const value = {
      contributors: [
        { id: 'marcus', name: 'Marcus Chen' },
        { id: 'elena', name: 'Elena Vance' },
      ],
      organizations: [{ id: 'ttr', name: 'The Tech Review' }],
    }
    const expected = {
      'byline:contributors': {
        'byline:person': [
          { '@id': 'marcus', 'byline:name': 'Marcus Chen' },
          { '@id': 'elena', 'byline:name': 'Elena Vance' },
        ],
      },
      'byline:organizations': {
        'byline:org': [{ '@id': 'ttr', 'byline:name': 'The Tech Review' }],
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only contributors', () => {
    const value = {
      contributors: [{ name: 'Annie Park' }],
    }
    const expected = {
      'byline:contributors': {
        'byline:person': [{ 'byline:name': 'Annie Park' }],
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateFeed({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate complete item with all properties', () => {
    const value = {
      author: { ref: 'marcus' },
      role: 'staff',
      perspective: 'reporting',
      affiliation: { org: 'apple', relationship: 'employed' },
    }
    const expected = {
      'byline:author': { '@ref': 'marcus' },
      'byline:role': 'staff',
      'byline:perspective': 'reporting',
      'byline:affiliation': {
        'byline:org-ref': { '@ref': 'apple' },
        'byline:relationship': 'employed',
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only perspective', () => {
    const value = {
      perspective: 'personal',
    }
    const expected = {
      'byline:perspective': 'personal',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
  })
})
