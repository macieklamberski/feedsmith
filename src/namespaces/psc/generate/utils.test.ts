import { describe, expect, it } from 'bun:test'
import { generateChapter, generateChapters, generateItem } from './utils.js'

describe('generateChapter', () => {
  it('should generate valid chapter object with all properties', () => {
    const value = {
      start: '00:00:00.000',
      title: 'Introduction',
      href: 'https://example.com/intro',
      image: 'https://example.com/intro.jpg',
    }
    const expected = {
      '@start': '00:00:00.000',
      '@title': 'Introduction',
      '@href': 'https://example.com/intro',
      '@image': 'https://example.com/intro.jpg',
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should generate chapter with only required properties', () => {
    const value = {
      start: '00:01:30.500',
      title: 'Chapter 2',
    }
    const expected = {
      '@start': '00:01:30.500',
      '@title': 'Chapter 2',
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle undefined optional properties', () => {
    const value = {
      start: '00:00:00.000',
      title: 'Chapter Title',
      href: undefined,
      image: undefined,
    }
    const expected = {
      '@start': '00:00:00.000',
      '@title': 'Chapter Title',
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle empty strings in optional properties', () => {
    const value = {
      start: '00:00:00.000',
      title: 'Chapter Title',
      href: '',
      image: '',
    }
    const expected = {
      '@start': '00:00:00.000',
      '@title': 'Chapter Title',
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateChapter(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateChapter(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateChapter('not an object')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateChapter([])).toBeUndefined()
  })
})

describe('generateChapters', () => {
  it('should generate the version attribute and the chapter list', () => {
    const value = {
      version: '1.2',
      items: [
        {
          start: '00:00:00.000',
          title: 'Introduction',
        },
        {
          start: '00:05:30.000',
          title: 'Chapter 1',
        },
      ],
    }
    const expected = {
      '@version': '1.2',
      'psc:chapter': [
        {
          '@start': '00:00:00.000',
          '@title': 'Introduction',
        },
        {
          '@start': '00:05:30.000',
          '@title': 'Chapter 1',
        },
      ],
    }

    expect(generateChapters(value)).toEqual(expected)
  })

  it('should generate the chapter list with no version', () => {
    const value = {
      items: [{ start: '00:00:00.000', title: 'Introduction' }],
    }
    const expected = {
      'psc:chapter': [{ '@start': '00:00:00.000', '@title': 'Introduction' }],
    }

    expect(generateChapters(value)).toEqual(expected)
  })

  it('should generate a version with no chapters', () => {
    const value = { version: '1.2' }
    const expected = { '@version': '1.2' }

    expect(generateChapters(value)).toEqual(expected)
  })

  it('should handle an empty chapter list', () => {
    expect(generateChapters({ items: [] })).toBeUndefined()
  })

  it('should handle empty object', () => {
    expect(generateChapters({})).toBeUndefined()
  })

  it('should handle undefined', () => {
    expect(generateChapters(undefined)).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate valid item object with multiple chapters', () => {
    const value = {
      chapters: {
        items: [
          {
            start: '00:00:00.000',
            title: 'Introduction',
            href: 'https://example.com/intro',
            image: 'https://example.com/intro.jpg',
          },
          {
            start: '00:05:30.000',
            title: 'Chapter 1',
            href: 'https://example.com/chapter1',
          },
          {
            start: '00:12:15.500',
            title: 'Conclusion',
          },
        ],
      },
    }
    const expected = {
      'psc:chapters': {
        'psc:chapter': [
          {
            '@start': '00:00:00.000',
            '@title': 'Introduction',
            '@href': 'https://example.com/intro',
            '@image': 'https://example.com/intro.jpg',
          },
          {
            '@start': '00:05:30.000',
            '@title': 'Chapter 1',
            '@href': 'https://example.com/chapter1',
          },
          {
            '@start': '00:12:15.500',
            '@title': 'Conclusion',
          },
        ],
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with single chapter', () => {
    const value = {
      chapters: {
        items: [
          {
            start: '00:00:00.000',
            title: 'Single Chapter',
          },
        ],
      },
    }
    const expected = {
      'psc:chapters': {
        'psc:chapter': [
          {
            '@start': '00:00:00.000',
            '@title': 'Single Chapter',
          },
        ],
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined when chapters array is empty', () => {
    const value = {
      chapters: {
        items: [],
      },
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined when chapters is undefined', () => {
    const value = {
      chapters: undefined,
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('not an object')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})
