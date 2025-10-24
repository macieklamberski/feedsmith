import { describe, expect, it } from 'bun:test'
import { generateFeed } from './utils.js'

describe('generateFeed', () => {
  it('should generate feed with license', () => {
    const value = {
      license: 'http://creativecommons.org/licenses/by-nc-nd/2.0/',
    }
    const expected = {
      'creativeCommons:license': 'http://creativecommons.org/licenses/by-nc-nd/2.0/',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle license URLs with special characters', () => {
    const value = {
      license: 'http://creativecommons.org/licenses?type=by&version=2.0',
    }
    const expected = {
      'creativeCommons:license': {
        '#cdata': 'http://creativecommons.org/licenses?type=by&version=2.0',
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty string', () => {
    const value = {
      license: '',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle whitespace-only string', () => {
    const value = {
      license: '   ',
    }

    expect(generateFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
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
  })

  it('should handle undefined license value', () => {
    const value = {
      license: undefined,
    }

    expect(generateFeed(value)).toBeUndefined()
  })
})
