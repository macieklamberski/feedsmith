import { describe, expect, it } from 'bun:test'
import { generateChapter, generateItem } from './utils.js'

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

  it('should generate chapter with only required start property', () => {
    const value = {
      start: '00:01:30.500',
    }
    const expected = {
      '@start': '00:01:30.500',
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should generate chapter with start and title only', () => {
    const value = {
      start: '00:05:00.000',
      title: 'Chapter 1',
    }
    const expected = {
      '@start': '00:05:00.000',
      '@title': 'Chapter 1',
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle undefined optional properties', () => {
    const value = {
      start: '00:00:00.000',
      title: undefined,
      href: undefined,
      image: undefined,
    }
    const expected = {
      '@start': '00:00:00.000',
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle empty strings in optional properties', () => {
    const value = {
      start: '00:00:00.000',
      title: '',
      href: '',
      image: '',
    }
    const expected = {
      '@start': '00:00:00.000',
    }

    expect(generateChapter(value)).toEqual(expected)
  })

  it('should handle non-object inputs gracefully', () => {
    expect(generateChapter(undefined)).toBeUndefined()
    expect(generateChapter(null)).toBeUndefined()
    expect(generateChapter('not an object')).toBeUndefined()
    expect(generateChapter([])).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate valid item object with multiple chapters', () => {
    const value = {
      chapters: [
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
      chapters: [
        {
          start: '00:00:00.000',
          title: 'Single Chapter',
        },
      ],
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

  it('should filter out invalid chapters (missing start)', () => {
    const value = {
      chapters: [
        {
          start: '00:00:00.000',
          title: 'Valid Chapter',
        },
        {
          title: 'Invalid Chapter - No Start',
          href: 'https://example.com/invalid',
        },
        {
          start: '00:05:00.000',
          title: 'Another Valid Chapter',
        },
      ],
    }
    const expected = {
      'psc:chapters': {
        'psc:chapter': [
          {
            '@start': '00:00:00.000',
            '@title': 'Valid Chapter',
          },
          {
            '@start': '00:05:00.000',
            '@title': 'Another Valid Chapter',
          },
        ],
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined when no valid chapters exist', () => {
    const value = {
      chapters: [
        {
          title: 'No Start Time',
        },
        {
          href: 'https://example.com/invalid',
        },
      ],
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined when chapters array is empty', () => {
    const value = {
      chapters: [],
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
    expect(generateItem(null)).toBeUndefined()
    expect(generateItem('not an object')).toBeUndefined()
    expect(generateItem([])).toBeUndefined()
  })
})
