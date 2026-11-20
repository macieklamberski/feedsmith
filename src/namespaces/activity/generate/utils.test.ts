import { describe, expect, it } from 'bun:test'
import { generateEntry, generateItem, generatePerson } from './utils.js'

describe('generatePerson', () => {
  it('should generate object type', () => {
    const value = {
      objectType: 'http://activitystrea.ms/schema/1.0/person',
    }
    const expected = {
      'activity:object-type': 'http://activitystrea.ms/schema/1.0/person',
    }

    expect(generatePerson(value)).toEqual(expected)
  })

  it('should return undefined for empty string', () => {
    const value = {
      objectType: '',
    }

    expect(generatePerson(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only string', () => {
    const value = {
      objectType: '   ',
    }

    expect(generatePerson(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generatePerson({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePerson('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePerson(123)).toBeUndefined()
    expect(generatePerson(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePerson(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePerson([])).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate all properties', () => {
    const value = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
      objectType: 'http://activitystrea.ms/schema/1.0/blog-entry',
    }
    const expected = {
      'activity:verb': 'http://activitystrea.ms/schema/1.0/post',
      'activity:object-type': 'http://activitystrea.ms/schema/1.0/blog-entry',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate verb only', () => {
    const value = {
      verb: 'post',
    }
    const expected = {
      'activity:verb': 'post',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should wrap verb with HTML characters in CDATA', () => {
    const value = {
      verb: 'http://example.com/verbs?type=save&list=wish',
    }
    const expected = {
      'activity:verb': { '#cdata': 'http://example.com/verbs?type=save&list=wish' },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      verb: '',
      objectType: '',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      verb: '   ',
      objectType: '   ',
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generateItem({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(123)).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})

describe('generateEntry', () => {
  it('should generate all properties', () => {
    const value = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
      objectType: 'http://activitystrea.ms/schema/1.0/note',
      object: {
        id: 'tag:example.com,2009:photo/1643',
        title: { value: 'My Cat' },
        links: [{ href: 'https://example.com/photos/1643', rel: 'alternate', type: 'text/html' }],
        activity: {
          objectType: 'http://activitystrea.ms/schema/1.0/photo',
        },
      },
      target: {
        id: 'tag:example.com,2009:photo-album/2519',
        title: { value: 'My Pets' },
        activity: {
          objectType: 'http://activitystrea.ms/schema/1.0/photo-album',
        },
      },
    }
    const expected = {
      'activity:verb': 'http://activitystrea.ms/schema/1.0/post',
      'activity:object-type': 'http://activitystrea.ms/schema/1.0/note',
      'activity:object': {
        id: 'tag:example.com,2009:photo/1643',
        link: [
          {
            '@href': 'https://example.com/photos/1643',
            '@rel': 'alternate',
            '@type': 'text/html',
          },
        ],
        title: { '#text': 'My Cat' },
        'activity:object-type': 'http://activitystrea.ms/schema/1.0/photo',
      },
      'activity:target': {
        id: 'tag:example.com,2009:photo-album/2519',
        title: { '#text': 'My Pets' },
        'activity:object-type': 'http://activitystrea.ms/schema/1.0/photo-album',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should generate object holding only an object type', () => {
    const value = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
      object: {
        activity: {
          objectType: 'http://activitystrea.ms/schema/1.0/blog-entry',
        },
      },
    }
    const expected = {
      'activity:verb': 'http://activitystrea.ms/schema/1.0/post',
      'activity:object': {
        'activity:object-type': 'http://activitystrea.ms/schema/1.0/blog-entry',
      },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should wrap verb with HTML characters in CDATA', () => {
    const value = {
      verb: 'http://example.com/verbs?type=save&list=wish',
    }
    const expected = {
      'activity:verb': { '#cdata': 'http://example.com/verbs?type=save&list=wish' },
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should skip empty object and target', () => {
    const value = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
      object: {},
      target: {},
    }
    const expected = {
      'activity:verb': 'http://activitystrea.ms/schema/1.0/post',
    }

    expect(generateEntry(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      verb: '',
      objectType: '',
    }

    expect(generateEntry(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      verb: '   ',
      objectType: '   ',
    }

    expect(generateEntry(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(generateEntry({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry(123)).toBeUndefined()
    expect(generateEntry(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntry([])).toBeUndefined()
  })
})
