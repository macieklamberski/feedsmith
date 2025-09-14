import { describe, expect, it } from 'bun:test'
import { parseChapter, retrieveItem } from './utils.js'

describe('parseChapter', () => {
  it('should parse complete chapter with all attributes', () => {
    const value = {
      '@start': '00:00:00.000',
      '@title': 'Introduction',
      '@href': 'https://example.com/intro',
      '@image': 'https://example.com/intro.jpg',
    }
    const expected = {
      start: '00:00:00.000',
      title: 'Introduction',
      href: 'https://example.com/intro',
      image: 'https://example.com/intro.jpg',
    }

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should parse chapter with only required start attribute', () => {
    const value = {
      '@start': '00:01:30.500',
    }
    const expected = {
      start: '00:01:30.500',
    }

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should parse chapter with start and title only', () => {
    const value = {
      '@start': '00:05:00.000',
      '@title': 'Chapter 1',
    }
    const expected = {
      start: '00:05:00.000',
      title: 'Chapter 1',
    }

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should parse chapter without start attribute', () => {
    const value = {
      '@title': 'Introduction',
      '@href': 'https://example.com/intro',
    }
    const expected = {
      title: 'Introduction',
      href: 'https://example.com/intro',
    }

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should parse chapter with empty start attribute', () => {
    const value = {
      '@start': '',
      '@title': 'Introduction',
    }
    const expected = {
      title: 'Introduction',
    }

    expect(parseChapter(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    expect(parseChapter('not an object')).toBeUndefined()
    expect(parseChapter(null)).toBeUndefined()
    expect(parseChapter(undefined)).toBeUndefined()
    expect(parseChapter([])).toBeUndefined()
  })

  it('should handle coercible start values', () => {
    const value = {
      '@start': 123,
      '@title': 'Numeric start',
    }
    const expected = {
      start: '123',
      title: 'Numeric start',
    }

    expect(parseChapter(value)).toEqual(expected)
  })
})

describe('retrieveItem', () => {
  it('should parse complete psc item with multiple chapters', () => {
    const value = {
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
    const expected = {
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

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse psc item with single chapter', () => {
    const value = {
      'psc:chapters': {
        'psc:chapter': {
          '@start': '00:00:00.000',
          '@title': 'Single Chapter',
        },
      },
    }
    const expected = {
      chapters: [
        {
          start: '00:00:00.000',
          title: 'Single Chapter',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse all chapters without filtering', () => {
    const value = {
      'psc:chapters': {
        'psc:chapter': [
          {
            '@start': '00:00:00.000',
            '@title': 'Valid Chapter',
          },
          {
            '@title': 'Chapter Without Start',
            '@href': 'https://example.com/invalid',
          },
          {
            '@start': '00:05:00.000',
            '@title': 'Another Valid Chapter',
          },
        ],
      },
    }
    const expected = {
      chapters: [
        {
          start: '00:00:00.000',
          title: 'Valid Chapter',
        },
        {
          title: 'Chapter Without Start',
          href: 'https://example.com/invalid',
        },
        {
          start: '00:05:00.000',
          title: 'Another Valid Chapter',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse chapters without start attributes', () => {
    const value = {
      'psc:chapters': {
        'psc:chapter': [
          {
            '@title': 'No Start Time',
          },
          {
            '@href': 'https://example.com/invalid',
          },
        ],
      },
    }
    const expected = {
      chapters: [
        {
          title: 'No Start Time',
        },
        {
          href: 'https://example.com/invalid',
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined when psc:chapters is missing', () => {
    const value = {
      'other:property': 'value',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when psc:chapters is not an object', () => {
    const value = {
      'psc:chapters': 'not an object',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when psc:chapter is missing', () => {
    const value = {
      'psc:chapters': {
        'other:element': 'value',
      },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem('not an object')).toBeUndefined()
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})
