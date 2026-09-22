import { describe, expect, it } from 'bun:test'
import {
  generateCategories,
  generateCategory,
  generateCollection,
  generateControl,
  generateEntry,
  generateFeed,
} from './utils.js'

describe('generateControl', () => {
  it('should generate control with draft=true as yes', () => {
    const value = {
      draft: true,
    }
    const expected = {
      'app:draft': 'yes',
    }

    expect(generateControl(value)).toEqual(expected)
  })

  it('should generate control with draft=false as no', () => {
    const value = {
      draft: false,
    }
    const expected = {
      'app:draft': 'no',
    }

    expect(generateControl(value)).toEqual(expected)
  })

  it('should return undefined for control without draft', () => {
    const value = {}

    expect(generateControl(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateControl('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateControl(123)).toBeUndefined()
    expect(generateControl(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateControl(null)).toBeUndefined()
  })
})

describe('generateCategory', () => {
  it('should generate category with all properties', () => {
    const value = {
      term: 'news',
      scheme: 'http://example.com/cats',
      label: 'News',
    }
    const expected = {
      '@term': 'news',
      '@scheme': 'http://example.com/cats',
      '@label': 'News',
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should generate category with term only', () => {
    const value = {
      term: 'news',
    }
    const expected = {
      '@term': 'news',
    }

    expect(generateCategory(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      term: '',
      label: '',
    }

    expect(generateCategory(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateCategory('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCategory(123)).toBeUndefined()
    expect(generateCategory(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCategory(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCategory([])).toBeUndefined()
  })
})

describe('generateCategories', () => {
  it('should generate inline categories with all properties', () => {
    const value = {
      fixed: true,
      scheme: 'http://example.com/cats',
      categories: [{ term: 'news' }, { term: 'sports', label: 'Sports' }],
    }
    const expected = {
      '@fixed': 'yes',
      '@scheme': 'http://example.com/cats',
      category: [{ '@term': 'news' }, { '@term': 'sports', '@label': 'Sports' }],
    }

    expect(generateCategories(value)).toEqual(expected)
  })

  it('should generate out-of-line categories with href', () => {
    const value = {
      href: 'http://example.com/cats.atomcat',
    }
    const expected = {
      '@href': 'http://example.com/cats.atomcat',
    }

    expect(generateCategories(value)).toEqual(expected)
  })

  it('should generate fixed false as no', () => {
    const value = {
      fixed: false,
    }
    const expected = {
      '@fixed': 'no',
    }

    expect(generateCategories(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateCategories(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateCategories('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCategories(123)).toBeUndefined()
    expect(generateCategories(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCategories(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCategories([])).toBeUndefined()
  })
})

describe('generateCollection', () => {
  it('should generate collection with all properties', () => {
    const value = {
      href: 'http://example.com/blog/edit/',
      title: { value: 'Blog Entries' },
      accepts: ['image/png', 'image/jpeg'],
      categories: [{ fixed: true, categories: [{ term: 'news' }] }],
    }
    const expected = {
      '@href': 'http://example.com/blog/edit/',
      title: { '#text': 'Blog Entries' },
      'app:accept': ['image/png', 'image/jpeg'],
      'app:categories': [{ '@fixed': 'yes', category: [{ '@term': 'news' }] }],
    }

    expect(generateCollection(value)).toEqual(expected)
  })

  it('should generate collection with href only', () => {
    const value = {
      href: 'http://example.com/blog/edit/',
    }
    const expected = {
      '@href': 'http://example.com/blog/edit/',
    }

    expect(generateCollection(value)).toEqual(expected)
  })

  it('should wrap title with special characters in CDATA', () => {
    const value = {
      title: { value: 'News & Views' },
    }
    const expected = {
      title: { '#cdata': 'News & Views' },
    }

    expect(generateCollection(value)).toEqual(expected)
  })

  it('should generate title of type text', () => {
    const value = {
      title: { value: 'Blog Entries', type: 'text' },
    }
    const expected = {
      title: { '#text': 'Blog Entries', '@type': 'text' },
    }

    expect(generateCollection(value)).toEqual(expected)
  })

  it('should generate title of type html', () => {
    const value = {
      title: { value: '<b>Blog</b> Entries', type: 'html' },
    }
    const expected = {
      title: { '#cdata': '<b>Blog</b> Entries', '@type': 'html' },
    }

    expect(generateCollection(value)).toEqual(expected)
  })

  it('should generate title of type xhtml', () => {
    const value = {
      title: { value: '<b>Blog</b> Entries', type: 'xhtml' },
    }
    const expected = {
      title: {
        '#text': '<div xmlns="http://www.w3.org/1999/xhtml"><b>Blog</b> Entries</div>\n',
        '@type': 'xhtml',
      },
    }

    expect(generateCollection(value)).toEqual(expected)
  })

  it('should keep empty accept values', () => {
    const value = {
      accepts: [''],
    }
    const expected = {
      'app:accept': [''],
    }

    expect(generateCollection(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      href: '',
      title: { value: '' },
    }

    expect(generateCollection(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateCollection(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateCollection('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCollection(123)).toBeUndefined()
    expect(generateCollection(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCollection(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateCollection([])).toBeUndefined()
  })
})

describe('generateEntry', () => {
  it('should generate entry with all properties', () => {
    const value = {
      edited: new Date('2024-03-15T14:30:00Z'),
      control: {
        draft: true,
      },
    }
    const expected = {
      'app:edited': '2024-03-15T14:30:00.000Z',
      'app:control': {
        'app:draft': 'yes',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with edited only', () => {
    const value = {
      edited: new Date('2024-03-15T14:30:00Z'),
    }
    const expected = {
      'app:edited': '2024-03-15T14:30:00.000Z',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate entry with control only', () => {
    const value = {
      control: {
        draft: false,
      },
    }
    const expected = {
      'app:control': {
        'app:draft': 'no',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate draft true as yes', () => {
    const value = {
      control: {
        draft: true,
      },
    }
    const expected = {
      'app:control': {
        'app:draft': 'yes',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate draft false as no', () => {
    const value = {
      control: {
        draft: false,
      },
    }
    const expected = {
      'app:control': {
        'app:draft': 'no',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle Date objects', () => {
    const value = {
      edited: new Date('2024-03-15T14:30:00.000Z'),
    }
    const expected = {
      'app:edited': '2024-03-15T14:30:00.000Z',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle string dates', () => {
    const value = {
      edited: '2024-03-15T14:30:00Z',
    }
    const expected = {
      'app:edited': '2024-03-15T14:30:00.000Z',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateEntry(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry(123)).toBeUndefined()
    expect(generateEntry(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry(null)).toBeUndefined()
  })

  it('should handle undefined edited value', () => {
    const value = {
      edited: undefined,
      control: {
        draft: true,
      },
    }
    const expected = {
      'app:control': {
        'app:draft': 'yes',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should handle undefined control value', () => {
    const value = {
      edited: new Date('2024-03-15T14:30:00Z'),
      control: undefined,
    }
    const expected = {
      'app:edited': '2024-03-15T14:30:00.000Z',
    }

    expect(generateEntry(value)).toEqual(expected)
  })
})

describe('generateFeed', () => {
  it('should generate feed with collection', () => {
    const value = {
      collections: [
        {
          href: 'http://example.com/blog/edit/',
          title: { value: 'Blog Entries' },
        },
      ],
    }
    const expected = {
      'app:collection': [
        {
          '@href': 'http://example.com/blog/edit/',
          title: { '#text': 'Blog Entries' },
        },
      ],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with multiple collections', () => {
    const value = {
      collections: [
        { href: 'http://example.com/blog/edit/' },
        { href: 'http://example.com/blog/media/' },
      ],
    }
    const expected = {
      'app:collection': [
        { '@href': 'http://example.com/blog/edit/' },
        { '@href': 'http://example.com/blog/media/' },
      ],
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should return undefined for empty collection', () => {
    const value = {
      collections: [{}],
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(123)).toBeUndefined()
    expect(generateFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeed([])).toBeUndefined()
  })
})
