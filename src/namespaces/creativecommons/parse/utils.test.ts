import { describe, expect, it } from 'bun:test'
import { retrieveItemOrFeed } from './utils.js'

describe('retrieveItemOrFeed', () => {
  it('should parse license when present (with #text)', () => {
    const value = {
      'creativecommons:license': { '#text': 'http://creativecommons.org/licenses/by-nc-nd/2.0/' },
    }
    const expected = {
      licenses: ['http://creativecommons.org/licenses/by-nc-nd/2.0/'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse license when present (without #text)', () => {
    const value = {
      'creativecommons:license': 'http://creativecommons.org/licenses/by-nc-nd/3.0/',
    }
    const expected = {
      licenses: ['http://creativecommons.org/licenses/by-nc-nd/3.0/'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse multiple licenses from array', () => {
    const value = {
      'creativecommons:license': [
        'http://creativecommons.org/licenses/by/2.0/',
        'http://creativecommons.org/licenses/by-sa/2.0/',
      ],
    }
    const expected = {
      licenses: [
        'http://creativecommons.org/licenses/by/2.0/',
        'http://creativecommons.org/licenses/by-sa/2.0/',
      ],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse various Creative Commons license URLs', () => {
    const licenses = [
      'http://creativecommons.org/licenses/by/3.0/',
      'http://creativecommons.org/licenses/by-sa/4.0/',
      'http://creativecommons.org/licenses/by-nc/2.0/',
      'http://creativecommons.org/licenses/by-nc-sa/3.0/',
      'http://creativecommons.org/licenses/by-nc-nd/2.0/',
      'https://creativecommons.org/publicdomain/zero/1.0/',
      'Attribution-NonCommercial',
      'CreativeCommons license feed',
    ]

    for (const license of licenses) {
      const value = {
        'creativecommons:license': license,
      }
      const expected = {
        licenses: [license],
      }

      expect(retrieveItemOrFeed(value)).toEqual(expected)
    }
  })

  it('should handle HTML entities in license text', () => {
    const value = {
      'creativecommons:license': {
        '#text': 'http://creativecommons.org/licenses?type=by&amp;version=2.0',
      },
    }
    const expected = {
      licenses: ['http://creativecommons.org/licenses?type=by&version=2.0'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in license', () => {
    const value = {
      'creativecommons:license': {
        '#text': '<![CDATA[http://creativecommons.org/licenses/by-sa/4.0/]]>',
      },
    }
    const expected = {
      licenses: ['http://creativecommons.org/licenses/by-sa/4.0/'],
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle missing #text property', () => {
    const value = {
      'creativecommons:license': {},
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should handle null or undefined license', () => {
    const value = {
      'creativecommons:license': null,
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined when no valid feed properties are present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed('string')).toBeUndefined()
    expect(retrieveItemOrFeed(123)).toBeUndefined()
    expect(retrieveItemOrFeed(true)).toBeUndefined()
    expect(retrieveItemOrFeed([])).toBeUndefined()
    expect(retrieveItemOrFeed(() => {})).toBeUndefined()
  })

  it('should handle empty string values', () => {
    const value = {
      'creativecommons:license': { '#text': '' },
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'creativecommons:license': { '#text': '   ' },
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })
})
