import { describe, expect, it } from 'bun:test'
import { retrieveItemOrFeed } from './utils.js'

describe('retrieveItemOrFeed', () => {
  it('should parse complete object with all properties', () => {
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

  it('should parse object with partial properties', () => {
    const value = {
      'cc:license': 'https://creativecommons.org/licenses/by/4.0/',
      'cc:attributionname': 'John Doe',
    }
    const expected = {
      license: 'https://creativecommons.org/licenses/by/4.0/',
      attributionName: 'John Doe',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse complete object with rdf:resource attributes', () => {
    const value = {
      'cc:license': {
        '@rdf:resource': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      },
      'cc:morepermissions': {
        '@rdf:resource': 'https://example.com/commercial-license',
      },
      'cc:attributionname': {
        '@rdf:resource': 'https://example.com/author/john-doe',
      },
      'cc:permits': {
        '@rdf:resource': 'https://creativecommons.org/ns#Reproduction',
      },
    }
    const expected = {
      license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      morePermissions: 'https://example.com/commercial-license',
      attributionName: 'https://example.com/author/john-doe',
      permits: 'https://creativecommons.org/ns#Reproduction',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse mixed rdf:resource and element content', () => {
    const value = {
      'cc:license': {
        '@rdf:resource': 'https://creativecommons.org/licenses/by/4.0/',
      },
      'cc:morepermissions': 'https://example.com/permissions',
      'cc:attributionname': { '#text': 'John Doe' },
    }
    const expected = {
      license: 'https://creativecommons.org/licenses/by/4.0/',
      morePermissions: 'https://example.com/permissions',
      attributionName: 'John Doe',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should parse properties from arrays (uses first)', () => {
    const value = {
      'cc:license': [
        'https://creativecommons.org/licenses/by/4.0/',
        'https://creativecommons.org/licenses/by-sa/4.0/',
      ],
      'cc:attributionname': ['John Doe', 'Jane Doe'],
    }
    const expected = {
      license: 'https://creativecommons.org/licenses/by/4.0/',
      attributionName: 'John Doe',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'cc:morepermissions': { '#text': 'https://example.com/license?type=by&amp;version=2.0' },
    }
    const expected = {
      morePermissions: 'https://example.com/license?type=by&version=2.0',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'cc:license': { '#text': '<![CDATA[https://creativecommons.org/licenses/by/4.0/]]>' },
    }
    const expected = {
      license: 'https://creativecommons.org/licenses/by/4.0/',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle missing #text properties', () => {
    const value = {
      'cc:license': {},
      'cc:morepermissions': {},
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should handle empty string values', () => {
    const value = {
      'cc:license': { '#text': '' },
      'cc:attributionname': 'John Doe',
    }
    const expected = {
      attributionName: 'John Doe',
    }

    expect(retrieveItemOrFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only values', () => {
    const value = {
      'cc:license': { '#text': '   ' },
      'cc:attributionname': { '#text': '\t\n' },
    }

    expect(retrieveItemOrFeed(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    expect(retrieveItemOrFeed({})).toBeUndefined()
  })

  it('should return undefined for non-object inputs', () => {
    expect(retrieveItemOrFeed(null)).toBeUndefined()
    expect(retrieveItemOrFeed(undefined)).toBeUndefined()
    expect(retrieveItemOrFeed('string')).toBeUndefined()
    expect(retrieveItemOrFeed(123)).toBeUndefined()
  })
})
