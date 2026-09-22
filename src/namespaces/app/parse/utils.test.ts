import { describe, expect, it } from 'bun:test'
import {
  parseCategories,
  parseCategory,
  parseCollection,
  parseControl,
  retrieveEntry,
  retrieveFeed,
} from './utils.js'

describe('parseControl', () => {
  it('should parse control with draft=yes', () => {
    const value = {
      'app:draft': 'yes',
    }
    const expected = {
      draft: true,
    }

    expect(parseControl(value)).toEqual(expected)
  })

  it('should parse control with draft=no', () => {
    const value = {
      'app:draft': 'no',
    }
    const expected = {
      draft: false,
    }

    expect(parseControl(value)).toEqual(expected)
  })

  it('should return undefined for control without draft', () => {
    const value = {}

    expect(parseControl(value)).toBeUndefined()
  })

  it('should handle invalid draft values', () => {
    const value = {
      'app:draft': 'maybe',
    }
    const expected = {
      draft: false,
    }

    expect(parseControl(value)).toEqual(expected)
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseControl(null)).toBeUndefined()
    expect(parseControl(undefined)).toBeUndefined()
    expect(parseControl('string')).toBeUndefined()
    expect(parseControl(123)).toBeUndefined()
  })
})

describe('parseCategory', () => {
  it('should parse category with all properties', () => {
    const value = {
      '@term': 'news',
      '@scheme': 'http://example.com/cats',
      '@label': 'News',
    }
    const expected = {
      term: 'news',
      scheme: 'http://example.com/cats',
      label: 'News',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should parse category with term only', () => {
    const value = {
      '@term': 'news',
    }
    const expected = {
      term: 'news',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should decode HTML entities in label', () => {
    const value = {
      '@term': 'arts',
      '@label': 'Arts &amp; Culture',
    }
    const expected = {
      term: 'arts',
      label: 'Arts & Culture',
    }

    expect(parseCategory(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseCategory(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseCategory(null)).toBeUndefined()
    expect(parseCategory(undefined)).toBeUndefined()
    expect(parseCategory('string')).toBeUndefined()
    expect(parseCategory(123)).toBeUndefined()
    expect(parseCategory([])).toBeUndefined()
  })
})

describe('parseCategories', () => {
  it('should parse inline categories with all properties', () => {
    const value = {
      '@fixed': 'yes',
      '@scheme': 'http://example.com/cats',
      category: [{ '@term': 'news' }, { '@term': 'sports', '@label': 'Sports' }],
    }
    const expected = {
      fixed: true,
      scheme: 'http://example.com/cats',
      categories: [{ term: 'news' }, { term: 'sports', label: 'Sports' }],
    }

    expect(parseCategories(value)).toEqual(expected)
  })

  it('should parse out-of-line categories with href', () => {
    const value = {
      '@href': 'http://example.com/cats.atomcat',
    }
    const expected = {
      href: 'http://example.com/cats.atomcat',
    }

    expect(parseCategories(value)).toEqual(expected)
  })

  it('should parse fixed="no" as false', () => {
    const value = {
      '@fixed': 'no',
    }
    const expected = {
      fixed: false,
    }

    expect(parseCategories(value)).toEqual(expected)
  })

  it('should parse a single category not wrapped in an array', () => {
    const value = {
      category: { '@term': 'news' },
    }
    const expected = {
      categories: [{ term: 'news' }],
    }

    expect(parseCategories(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseCategories(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseCategories(null)).toBeUndefined()
    expect(parseCategories(undefined)).toBeUndefined()
    expect(parseCategories('string')).toBeUndefined()
    expect(parseCategories(123)).toBeUndefined()
    expect(parseCategories([])).toBeUndefined()
  })
})

describe('parseCollection', () => {
  it('should parse collection with all properties', () => {
    const value = {
      '@href': 'http://example.com/blog/edit/',
      title: { '#text': 'Blog Entries' },
      'app:accept': [{ '#text': 'image/png' }, { '#text': 'image/jpeg' }],
      'app:categories': [{ '@fixed': 'yes', category: { '@term': 'news' } }],
    }
    const expected = {
      href: 'http://example.com/blog/edit/',
      title: { value: 'Blog Entries' },
      accepts: ['image/png', 'image/jpeg'],
      categories: [{ fixed: true, categories: [{ term: 'news' }] }],
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should parse collection with href only', () => {
    const value = {
      '@href': 'http://example.com/blog/edit/',
    }
    const expected = {
      href: 'http://example.com/blog/edit/',
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should parse title from a plain string', () => {
    const value = {
      title: 'Blog Entries',
    }
    const expected = {
      title: { value: 'Blog Entries' },
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should parse title wrapped in CDATA', () => {
    const value = {
      title: { '#text': '<![CDATA[Blog Entries]]>' },
    }
    const expected = {
      title: { value: 'Blog Entries' },
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should decode HTML entities in title', () => {
    const value = {
      title: { '#text': 'News &amp; Views' },
    }
    const expected = {
      title: { value: 'News & Views' },
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should parse title of type text', () => {
    const value = {
      title: { '#text': 'Blog Entries', '@type': 'text' },
    }
    const expected = {
      title: { value: 'Blog Entries', type: 'text' },
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should parse title of type html', () => {
    const value = {
      title: { '#text': '&lt;b&gt;Blog&lt;/b&gt; Entries', '@type': 'html' },
    }
    const expected = {
      title: { value: '<b>Blog</b> Entries', type: 'html' },
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should parse title of type xhtml', () => {
    const value = {
      title: {
        '#text': '<div xmlns="http://www.w3.org/1999/xhtml"><b>Blog</b> Entries</div>',
        '@type': 'xhtml',
      },
    }
    const expected = {
      title: { value: '<b>Blog</b> Entries', type: 'xhtml' },
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should parse a single accept not wrapped in an array', () => {
    const value = {
      'app:accept': 'application/atom+xml;type=entry',
    }
    const expected = {
      accepts: ['application/atom+xml;type=entry'],
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should ignore whitespace around accept', () => {
    const value = {
      'app:accept': '  image/png  ',
    }
    const expected = {
      accepts: ['image/png'],
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should keep empty accept as an empty string', () => {
    const value = {
      'app:accept': '',
    }
    const expected = {
      accepts: [''],
    }

    expect(parseCollection(value)).toEqual(expected)
  })

  it('should return undefined for whitespace-only values', () => {
    const value = {
      '@href': '   ',
      title: '   ',
    }

    expect(parseCollection(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseCollection(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(parseCollection(null)).toBeUndefined()
    expect(parseCollection(undefined)).toBeUndefined()
    expect(parseCollection('string')).toBeUndefined()
    expect(parseCollection(123)).toBeUndefined()
    expect(parseCollection([])).toBeUndefined()
  })
})

describe('retrieveEntry', () => {
  it('should parse entry with edited and control', () => {
    const value = {
      'app:edited': '2024-03-15T14:30:00Z',
      'app:control': {
        'app:draft': 'yes',
      },
    }
    const expected = {
      edited: '2024-03-15T14:30:00Z',
      control: {
        draft: true,
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse entry with edited only', () => {
    const value = {
      'app:edited': '2024-03-15T14:30:00Z',
    }
    const expected = {
      edited: '2024-03-15T14:30:00Z',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse entry with control only', () => {
    const value = {
      'app:control': {
        'app:draft': 'no',
      },
    }
    const expected = {
      control: {
        draft: false,
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse draft=yes as true', () => {
    const value = {
      'app:control': {
        'app:draft': 'yes',
      },
    }
    const expected = {
      control: {
        draft: true,
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse draft=no as false', () => {
    const value = {
      'app:control': {
        'app:draft': 'no',
      },
    }
    const expected = {
      control: {
        draft: false,
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle ISO 8601 dates', () => {
    const value = {
      'app:edited': '2024-03-15T14:30:00.000Z',
    }
    const expected = {
      edited: '2024-03-15T14:30:00.000Z',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle dates without milliseconds', () => {
    const value = {
      'app:edited': '2024-03-15T14:30:00Z',
    }
    const expected = {
      edited: '2024-03-15T14:30:00Z',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'app:edited': '',
    }

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should handle invalid dates', () => {
    const value = {
      'app:edited': 'not-a-date',
    }
    const expected = {
      edited: 'not-a-date',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveEntry(null)).toBeUndefined()
    expect(retrieveEntry(undefined)).toBeUndefined()
    expect(retrieveEntry('string')).toBeUndefined()
    expect(retrieveEntry(123)).toBeUndefined()
  })

  it.todo('should parse edited date with custom parseDateFn', () => {
    // Pass options.parseDateFn that maps the edited string to a Date instance.
    // Expected: edited equals the value returned by the custom parser instead of the raw string.
  })
})

describe('retrieveFeed', () => {
  it('should parse feed with collection', () => {
    const value = {
      'app:collection': {
        '@href': 'http://example.com/blog/edit/',
        title: 'Blog Entries',
      },
    }
    const expected = {
      collections: [
        {
          href: 'http://example.com/blog/edit/',
          title: { value: 'Blog Entries' },
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse multiple collections', () => {
    const value = {
      'app:collection': [
        { '@href': 'http://example.com/blog/edit/' },
        { '@href': 'http://example.com/blog/media/' },
      ],
    }
    const expected = {
      collections: [
        { href: 'http://example.com/blog/edit/' },
        { href: 'http://example.com/blog/media/' },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty collection', () => {
    const value = {
      'app:collection': {},
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
  })
})
