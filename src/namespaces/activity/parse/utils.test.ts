import { describe, expect, it } from 'bun:test'
import { retrieveEntry, retrieveItem, retrievePerson } from './utils.js'

describe('retrievePerson', () => {
  it('should parse object type', () => {
    const value = {
      'activity:object-type': { '#text': 'http://activitystrea.ms/schema/1.0/person' },
    }
    const expected = {
      objectType: 'http://activitystrea.ms/schema/1.0/person',
    }

    expect(retrievePerson(value)).toEqual(expected)
  })

  it('should parse object type from CDATA', () => {
    const value = {
      'activity:object-type': { '#text': '<![CDATA[http://activitystrea.ms/schema/1.0/person]]>' },
    }
    const expected = {
      objectType: 'http://activitystrea.ms/schema/1.0/person',
    }

    expect(retrievePerson(value)).toEqual(expected)
  })

  it('should return undefined for empty object type', () => {
    const value = {
      'activity:object-type': '',
    }

    expect(retrievePerson(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only object type', () => {
    const value = {
      'activity:object-type': '   ',
    }

    expect(retrievePerson(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrievePerson({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrievePerson(null)).toBeUndefined()
    expect(retrievePerson(undefined)).toBeUndefined()
    expect(retrievePerson('string')).toBeUndefined()
    expect(retrievePerson(123)).toBeUndefined()
    expect(retrievePerson([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse all properties', () => {
    const value = {
      'activity:verb': { '#text': 'http://activitystrea.ms/schema/1.0/post' },
      'activity:object-type': { '#text': 'http://activitystrea.ms/schema/1.0/blog-entry' },
    }
    const expected = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
      objectType: 'http://activitystrea.ms/schema/1.0/blog-entry',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse verb only', () => {
    const value = {
      'activity:verb': { '#text': 'post' },
    }
    const expected = {
      verb: 'post',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse verb with HTML entities', () => {
    const value = {
      'activity:verb': { '#text': 'http://example.com/verbs?type=save&amp;list=wish' },
    }
    const expected = {
      verb: 'http://example.com/verbs?type=save&list=wish',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse verb from CDATA', () => {
    const value = {
      'activity:verb': { '#text': '<![CDATA[http://activitystrea.ms/schema/1.0/post]]>' },
    }
    const expected = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should take the first verb when repeated', () => {
    const value = {
      'activity:verb': [
        { '#text': 'http://activitystrea.ms/schema/1.0/post' },
        { '#text': 'http://activitystrea.ms/schema/1.0/share' },
      ],
    }
    const expected = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      'activity:verb': '',
      'activity:object-type': '',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      'activity:verb': '   ',
      'activity:object-type': '   ',
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItem({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})

describe('retrieveEntry', () => {
  it('should parse all properties', () => {
    const value = {
      'activity:verb': { '#text': 'http://activitystrea.ms/schema/1.0/post' },
      'activity:object-type': { '#text': 'http://activitystrea.ms/schema/1.0/note' },
      'activity:object': {
        id: { '#text': 'tag:example.com,2009:photo/1643' },
        title: { '#text': 'My Cat' },
        link: [
          { '@rel': 'alternate', '@type': 'text/html', '@href': 'https://example.com/photos/1643' },
          { '@rel': 'preview', '@type': 'image/jpeg', '@href': 'https://example.com/thumb.jpg' },
        ],
        'activity:object-type': { '#text': 'http://activitystrea.ms/schema/1.0/photo' },
      },
      'activity:target': {
        id: { '#text': 'tag:example.com,2009:photo-album/2519' },
        title: { '#text': 'My Pets' },
        'activity:object-type': { '#text': 'http://activitystrea.ms/schema/1.0/photo-album' },
      },
    }
    const expected = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
      objectType: 'http://activitystrea.ms/schema/1.0/note',
      object: {
        id: 'tag:example.com,2009:photo/1643',
        title: { value: 'My Cat' },
        links: [
          { rel: 'alternate', type: 'text/html', href: 'https://example.com/photos/1643' },
          { rel: 'preview', type: 'image/jpeg', href: 'https://example.com/thumb.jpg' },
        ],
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

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse object holding only an object type', () => {
    const value = {
      'activity:object': {
        'activity:object-type': { '#text': 'http://activitystrea.ms/schema/1.0/blog-entry' },
      },
      'activity:verb': { '#text': 'http://activitystrea.ms/schema/1.0/post' },
    }
    const expected = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
      object: {
        activity: {
          objectType: 'http://activitystrea.ms/schema/1.0/blog-entry',
        },
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse object nesting another activity', () => {
    const value = {
      'activity:verb': { '#text': 'http://activitystrea.ms/schema/1.0/share' },
      'activity:object': {
        'activity:object-type': { '#text': 'http://activitystrea.ms/schema/1.0/activity' },
        id: { '#text': 'https://example.com/users/jk/statuses/101631959188968839' },
        'activity:verb': { '#text': 'http://activitystrea.ms/schema/1.0/post' },
        author: {
          'activity:object-type': { '#text': 'http://activitystrea.ms/schema/1.0/person' },
          uri: { '#text': 'https://example.com/users/jk' },
          name: { '#text': 'jk' },
        },
        'activity:object': {
          'activity:object-type': { '#text': 'http://activitystrea.ms/schema/1.0/note' },
          id: { '#text': 'https://example.com/users/jk/statuses/101631959188968839' },
          title: { '#text': 'New note by jk' },
        },
      },
    }
    const expected = {
      verb: 'http://activitystrea.ms/schema/1.0/share',
      object: {
        authors: [
          {
            name: 'jk',
            uri: 'https://example.com/users/jk',
            activity: {
              objectType: 'http://activitystrea.ms/schema/1.0/person',
            },
          },
        ],
        id: 'https://example.com/users/jk/statuses/101631959188968839',
        activity: {
          verb: 'http://activitystrea.ms/schema/1.0/post',
          objectType: 'http://activitystrea.ms/schema/1.0/activity',
          object: {
            id: 'https://example.com/users/jk/statuses/101631959188968839',
            title: { value: 'New note by jk' },
            activity: {
              objectType: 'http://activitystrea.ms/schema/1.0/note',
            },
          },
        },
      },
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse object with atom-prefixed children', () => {
    const value = {
      'activity:object': {
        'atom:id': { '#text': 'tag:example.com,2009:photo/4352' },
        'atom:title': { '#text': 'My Cat' },
      },
    }
    const expected = {
      object: {
        id: 'tag:example.com,2009:photo/4352',
        title: { value: 'My Cat' },
      },
    }

    expect(retrieveEntry(value, { prefix: 'atom:' })).toEqual(expected)
  })

  it('should parse verb with HTML entities', () => {
    const value = {
      'activity:verb': { '#text': 'http://example.com/verbs?type=save&amp;list=wish' },
    }
    const expected = {
      verb: 'http://example.com/verbs?type=save&list=wish',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should parse verb from CDATA', () => {
    const value = {
      'activity:verb': { '#text': '<![CDATA[http://activitystrea.ms/schema/1.0/post]]>' },
    }
    const expected = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should skip empty object and target', () => {
    const value = {
      'activity:verb': { '#text': 'http://activitystrea.ms/schema/1.0/post' },
      'activity:object': {},
      'activity:target': '',
    }
    const expected = {
      verb: 'http://activitystrea.ms/schema/1.0/post',
    }

    expect(retrieveEntry(value)).toEqual(expected)
  })

  it('should return undefined for empty strings', () => {
    const value = {
      'activity:verb': '',
      'activity:object-type': '',
    }

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only strings', () => {
    const value = {
      'activity:verb': '   ',
      'activity:object-type': '   ',
    }

    expect(retrieveEntry(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveEntry({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveEntry(null)).toBeUndefined()
    expect(retrieveEntry(undefined)).toBeUndefined()
    expect(retrieveEntry('string')).toBeUndefined()
    expect(retrieveEntry(123)).toBeUndefined()
    expect(retrieveEntry([])).toBeUndefined()
  })
})
