import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate with single license', () => {
    const value = {
      licenses: ['http://creativecommons.org/licenses/by-nc-nd/2.0/'],
    }
    const expected = {
      'creativeCommons:license': ['http://creativecommons.org/licenses/by-nc-nd/2.0/'],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate with multiple licenses', () => {
    const value = {
      licenses: [
        'http://creativecommons.org/licenses/by/2.0/',
        'http://creativecommons.org/licenses/by-sa/2.0/',
      ],
    }
    const expected = {
      'creativeCommons:license': [
        'http://creativecommons.org/licenses/by/2.0/',
        'http://creativecommons.org/licenses/by-sa/2.0/',
      ],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle license URLs with special characters', () => {
    const value = {
      licenses: ['http://creativecommons.org/licenses?type=by&version=2.0'],
    }
    const expected = {
      'creativeCommons:license': [
        {
          '#cdata': 'http://creativecommons.org/licenses?type=by&version=2.0',
        },
      ],
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty string', () => {
    const value = {
      licenses: [''],
    }

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle whitespace-only string', () => {
    const value = {
      licenses: ['   '],
    }

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItemOrFeed(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(123)).toBeUndefined()
    expect(generateItemOrFeed(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemOrFeed(null)).toBeUndefined()
  })

  it('should handle undefined licenses value', () => {
    const value = {
      licenses: undefined,
    }

    expect(generateItemOrFeed(value)).toBeUndefined()
  })
})
