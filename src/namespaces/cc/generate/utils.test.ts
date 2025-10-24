import { describe, expect, it } from 'bun:test'
import { generateItemOrFeed } from './utils.js'

describe('generateItemOrFeed', () => {
  it('should generate object with all properties', () => {
    const value = {
      license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      morePermissions: 'https://example.com/commercial-license',
      attributionName: 'John Doe',
      attributionURL: 'https://example.com/author',
      useGuidelines: 'https://example.com/guidelines',
      permits: 'https://creativecommons.org/ns#Reproduction',
      requires: 'https://creativecommons.org/ns#Attribution',
      prohibits: 'https://creativecommons.org/ns#CommercialUse',
      jurisdiction: 'https://creativecommons.org/international/us/',
      legalcode: 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode',
      deprecatedOn: '2023-01-01',
    }
    const expected = {
      'cc:license': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      'cc:morePermissions': 'https://example.com/commercial-license',
      'cc:attributionName': 'John Doe',
      'cc:attributionURL': 'https://example.com/author',
      'cc:useGuidelines': 'https://example.com/guidelines',
      'cc:permits': 'https://creativecommons.org/ns#Reproduction',
      'cc:requires': 'https://creativecommons.org/ns#Attribution',
      'cc:prohibits': 'https://creativecommons.org/ns#CommercialUse',
      'cc:jurisdiction': 'https://creativecommons.org/international/us/',
      'cc:legalcode': 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode',
      'cc:deprecatedOn': '2023-01-01',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate object with only license', () => {
    const value = {
      license: 'https://creativecommons.org/licenses/by/4.0/',
    }
    const expected = {
      'cc:license': 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should generate object with only morePermissions', () => {
    const value = {
      morePermissions: 'https://example.com/additional-permissions',
    }
    const expected = {
      'cc:morePermissions': 'https://example.com/additional-permissions',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should wrap special characters in CDATA', () => {
    const value = {
      license: 'https://example.com?foo=bar&baz=qux',
    }
    const expected = {
      'cc:license': {
        '#cdata': 'https://example.com?foo=bar&baz=qux',
      },
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      license: '',
      morePermissions: 'https://example.com/permissions',
    }
    const expected = {
      'cc:morePermissions': 'https://example.com/permissions',
    }

    expect(generateItemOrFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      license: '   ',
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
})
