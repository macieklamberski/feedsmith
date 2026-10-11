import { describe, expect, it } from 'bun:test'
import {
  parseAffiliation,
  parseAuthor,
  parseOrg,
  parsePerson,
  parseProfile,
  parseTheme,
  retrieveFeed,
  retrieveItem,
} from './utils.js'

describe('parseProfile', () => {
  it('should parse profile with href and rel', () => {
    const value = {
      '@href': 'https://mastodon.social/@annie',
      '@rel': 'mastodon',
    }
    const expected = {
      href: 'https://mastodon.social/@annie',
      rel: 'mastodon',
    }

    expect(parseProfile(value)).toEqual(expected)
  })

  it('should parse profile with only href', () => {
    const value = {
      '@href': 'https://example.com',
    }
    const expected = {
      href: 'https://example.com',
    }

    expect(parseProfile(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseProfile({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseProfile(null)).toBeUndefined()
    expect(parseProfile(undefined)).toBeUndefined()
    expect(parseProfile('string')).toBeUndefined()
    expect(parseProfile(123)).toBeUndefined()
  })
})

describe('parseTheme', () => {
  it('should parse theme with all attributes', () => {
    const value = {
      '@color': '#4A90A4',
      '@accent': '#FF6B6B',
      '@style': 'light',
    }
    const expected = {
      color: '#4A90A4',
      accent: '#FF6B6B',
      style: 'light',
    }

    expect(parseTheme(value)).toEqual(expected)
  })

  it('should parse theme with only style', () => {
    const value = {
      '@style': 'dark',
    }
    const expected = {
      style: 'dark',
    }

    expect(parseTheme(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseTheme({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseTheme(null)).toBeUndefined()
    expect(parseTheme(undefined)).toBeUndefined()
    expect(parseTheme('string')).toBeUndefined()
  })
})

describe('parsePerson', () => {
  it('should parse complete person with all properties', () => {
    const value = {
      '@id': 'annie',
      'byline:name': 'Annie Park',
      'byline:context': 'Designer and photographer.',
      'byline:url': 'https://annie.example.com',
      'byline:avatar': 'https://annie.example.com/avatar.jpg',
      'byline:profile': [
        { '@href': 'https://mastodon.social/@annie', '@rel': 'mastodon' },
        { '@href': 'https://github.com/annie', '@rel': 'github' },
      ],
      'byline:now': 'https://annie.example.com/now',
      'byline:uses': 'https://annie.example.com/uses',
      'byline:theme': { '@color': '#4A90A4', '@accent': '#FF6B6B', '@style': 'light' },
    }
    const expected = {
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

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should parse person with only name', () => {
    const value = {
      'byline:name': 'Marcus Chen',
    }
    const expected = {
      name: 'Marcus Chen',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should parse multiple urls into an array', () => {
    const value = {
      'byline:name': 'Annie Park',
      'byline:url': ['https://annie.example.com', 'https://annie.dev'],
    }
    const expected = {
      name: 'Annie Park',
      urls: ['https://annie.example.com', 'https://annie.dev'],
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'byline:name': { '#text': 'Tom &amp; Jerry' },
    }
    const expected = {
      name: 'Tom & Jerry',
    }

    expect(parsePerson(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parsePerson({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parsePerson(null)).toBeUndefined()
    expect(parsePerson(undefined)).toBeUndefined()
    expect(parsePerson('string')).toBeUndefined()
  })
})

describe('parseOrg', () => {
  it('should parse complete org with all properties', () => {
    const value = {
      '@id': 'ttr',
      'byline:name': 'The Tech Review',
      'byline:url': 'https://thetechreview.example.com',
      'byline:type': 'news',
      'byline:theme': { '@color': '#1A1A2E', '@accent': '#E94560', '@style': 'dark' },
    }
    const expected = {
      id: 'ttr',
      name: 'The Tech Review',
      url: 'https://thetechreview.example.com',
      type: 'news',
      theme: { color: '#1A1A2E', accent: '#E94560', style: 'dark' },
    }

    expect(parseOrg(value)).toEqual(expected)
  })

  it('should parse org with only name', () => {
    const value = {
      'byline:name': 'Acme Inc.',
    }
    const expected = {
      name: 'Acme Inc.',
    }

    expect(parseOrg(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseOrg({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseOrg(null)).toBeUndefined()
    expect(parseOrg(undefined)).toBeUndefined()
  })
})

describe('parseAuthor', () => {
  it('should parse author reference by ref', () => {
    const value = {
      '@ref': 'annie',
    }
    const expected = {
      ref: 'annie',
    }

    expect(parseAuthor(value)).toEqual(expected)
  })

  it('should parse author with inline person', () => {
    const value = {
      'byline:person': {
        '@id': 'guest-sara',
        'byline:name': 'Sara Mitchell',
        'byline:context': 'Guest contributor.',
      },
    }
    const expected = {
      person: {
        id: 'guest-sara',
        name: 'Sara Mitchell',
        context: 'Guest contributor.',
      },
    }

    expect(parseAuthor(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseAuthor({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseAuthor(null)).toBeUndefined()
    expect(parseAuthor(undefined)).toBeUndefined()
  })
})

describe('parseAffiliation', () => {
  it('should parse complete affiliation', () => {
    const value = {
      'byline:org-ref': { '@ref': 'apple' },
      'byline:relationship': 'employed',
      'byline:title': 'Senior Engineer',
    }
    const expected = {
      org: 'apple',
      relationship: 'employed',
      title: 'Senior Engineer',
    }

    expect(parseAffiliation(value)).toEqual(expected)
  })

  it('should parse affiliation with only relationship', () => {
    const value = {
      'byline:relationship': 'sponsored',
    }
    const expected = {
      relationship: 'sponsored',
    }

    expect(parseAffiliation(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(parseAffiliation({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseAffiliation(null)).toBeUndefined()
    expect(parseAffiliation(undefined)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  it('should parse feed with contributors and organizations', () => {
    const value = {
      'byline:contributors': {
        'byline:person': [
          { '@id': 'marcus', 'byline:name': 'Marcus Chen' },
          { '@id': 'elena', 'byline:name': 'Elena Vance' },
        ],
      },
      'byline:organizations': {
        'byline:org': { '@id': 'ttr', 'byline:name': 'The Tech Review' },
      },
    }
    const expected = {
      contributors: [
        { id: 'marcus', name: 'Marcus Chen' },
        { id: 'elena', name: 'Elena Vance' },
      ],
      organizations: [{ id: 'ttr', name: 'The Tech Review' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse feed with a single contributor', () => {
    const value = {
      'byline:contributors': {
        'byline:person': { '@id': 'annie', 'byline:name': 'Annie Park' },
      },
    }
    const expected = {
      contributors: [{ id: 'annie', name: 'Annie Park' }],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(retrieveFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse complete item with all properties', () => {
    const value = {
      'byline:author': { '@ref': 'marcus' },
      'byline:role': 'staff',
      'byline:perspective': 'reporting',
      'byline:affiliation': {
        'byline:org-ref': { '@ref': 'apple' },
        'byline:relationship': 'employed',
      },
    }
    const expected = {
      author: { ref: 'marcus' },
      role: 'staff',
      perspective: 'reporting',
      affiliation: { org: 'apple', relationship: 'employed' },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only perspective', () => {
    const value = {
      'byline:perspective': 'personal',
    }
    const expected = {
      perspective: 'personal',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
  })
})
