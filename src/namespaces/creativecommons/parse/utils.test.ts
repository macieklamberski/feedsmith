import { describe, expect, it } from 'bun:test'
import { retrieveFeed } from './utils.js'

describe('retrieveFeed', () => {
  it('should parse license when present (with #text)', () => {
    const value = {
      'creativecommons:license': { '#text': 'http://creativecommons.org/licenses/by-nc-nd/2.0/' },
    }
    const expected = {
      license: 'http://creativecommons.org/licenses/by-nc-nd/2.0/',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse license when present (without #text)', () => {
    const value = {
      'creativecommons:license': 'http://creativecommons.org/licenses/by-nc-nd/3.0/',
    }
    const expected = {
      license: 'http://creativecommons.org/licenses/by-nc-nd/3.0/',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse license from array (uses first)', () => {
    const value = {
      'creativecommons:license': [
        'http://creativecommons.org/licenses/by/2.0/',
        'http://creativecommons.org/licenses/by-sa/2.0/',
      ],
    }
    const expected = {
      license: 'http://creativecommons.org/licenses/by/2.0/',
    }

    expect(retrieveFeed(value)).toEqual(expected)
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
        license,
      }

      expect(retrieveFeed(value)).toEqual(expected)
    }
  })

  it('should handle HTML entities in license text', () => {
    const value = {
      'creativecommons:license': {
        '#text': 'http://creativecommons.org/licenses?type=by&amp;version=2.0',
      },
    }
    const expected = {
      license: 'http://creativecommons.org/licenses?type=by&version=2.0',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in license', () => {
    const value = {
      'creativecommons:license': {
        '#text': '<![CDATA[http://creativecommons.org/licenses/by-sa/4.0/]]>',
      },
    }
    const expected = {
      license: 'http://creativecommons.org/licenses/by-sa/4.0/',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle missing #text property', () => {
    const value = {
      'creativecommons:license': {},
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle null or undefined license', () => {
    const value = {
      'creativecommons:license': null,
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined when no valid feed properties are present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveFeed(null)).toBeUndefined()
    expect(retrieveFeed(undefined)).toBeUndefined()
    expect(retrieveFeed('string')).toBeUndefined()
    expect(retrieveFeed(123)).toBeUndefined()
    expect(retrieveFeed(true)).toBeUndefined()
    expect(retrieveFeed([])).toBeUndefined()
    expect(retrieveFeed(() => {})).toBeUndefined()
  })

  it('should handle empty string values', () => {
    const value = {
      'creativecommons:license': { '#text': '' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'creativecommons:license': { '#text': '   ' },
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(retrieveFeed(value)).toBeUndefined()
  })
})
