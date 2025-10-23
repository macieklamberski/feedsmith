import { describe, expect, it } from 'bun:test'
import { retrieveItemOrFeed } from './utils.js'

describe('retrieveItemOrFeed', () => {
  it('should parse complete item with all properties', () => {
    const value = {
      'cc:license': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      'cc:morepermissions': 'https://example.com/commercial-license',
      'cc:attributionname': 'John Doe',
      'cc:attributionurl': 'https://example.com/author',
      'cc:useguidelines': 'https://example.com/guidelines',
      'cc:permits': 'https://creativecommons.org/ns#Reproduction',
      'cc:requires': 'https://creativecommons.org/ns#Attribution',
      'cc:prohibits': 'https://creativecommons.org/ns#CommercialUse',
      'cc:jurisdiction': 'https://creativecommons.org/international/us/',
      'cc:legalcode': 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode',
      'cc:deprecatedon': '2023-01-01',
    }
    const expected = {
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with only license', () => {
    const value = {
      'cc:license': 'https://creativecommons.org/licenses/by/4.0/',
    }
    const expected = {
      license: 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse item with only morePermissions', () => {
    const value = {
      'cc:morepermissions': 'https://example.com/additional-permissions',
    }
    const expected = {
      morePermissions: 'https://example.com/additional-permissions',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'cc:license': { '#text': 'https://example.com?foo=bar&amp;baz=qux' },
    }
    const expected = {
      license: 'https://example.com?foo=bar&baz=qux',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'cc:license': {
        '#text': '<![CDATA[https://creativecommons.org/licenses/by/4.0/]]>',
      },
    }
    const expected = {
      license: 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'cc:license': '',
      'cc:morepermissions': 'https://example.com/permissions',
    }
    const expected = {
      morePermissions: 'https://example.com/permissions',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'cc:license': '   ',
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed('string')).toBeUndefined()
    expect(retrieveItemOrFeed(123)).toBeUndefined()
  })
})

describe('retrieveItemOrFeed', () => {
  it('should parse complete feed with all properties', () => {
    const value = {
      'cc:license': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      'cc:morepermissions': 'https://example.com/commercial-license',
      'cc:attributionname': 'John Doe',
      'cc:attributionurl': 'https://example.com/author',
      'cc:useguidelines': 'https://example.com/guidelines',
      'cc:permits': 'https://creativecommons.org/ns#Reproduction',
      'cc:requires': 'https://creativecommons.org/ns#Attribution',
      'cc:prohibits': 'https://creativecommons.org/ns#CommercialUse',
      'cc:jurisdiction': 'https://creativecommons.org/international/us/',
      'cc:legalcode': 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode',
      'cc:deprecatedon': '2023-01-01',
    }
    const expected = {
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

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse feed with only license', () => {
    const value = {
      'cc:license': 'https://creativecommons.org/licenses/by/4.0/',
    }
    const expected = {
      license: 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse feed with only morePermissions', () => {
    const value = {
      'cc:morepermissions': 'https://example.com/additional-permissions',
    }
    const expected = {
      morePermissions: 'https://example.com/additional-permissions',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'cc:license': { '#text': 'https://example.com?foo=bar&amp;baz=qux' },
    }
    const expected = {
      license: 'https://example.com?foo=bar&baz=qux',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections', () => {
    const value = {
      'cc:license': {
        '#text': '<![CDATA[https://creativecommons.org/licenses/by/4.0/]]>',
      },
    }
    const expected = {
      license: 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'cc:license': '',
      'cc:morepermissions': 'https://example.com/permissions',
    }
    const expected = {
      morePermissions: 'https://example.com/permissions',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'cc:license': '   ',
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed('string')).toBeUndefined()
    expect(retrieveItemOrFeed(123)).toBeUndefined()
  })
})
