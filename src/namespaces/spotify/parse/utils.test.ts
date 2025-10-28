import { describe, expect, it } from 'bun:test'
import {
  parseEntitlement,
  parseFeedAccess,
  parseItemAccess,
  parseLimit,
  parsePartner,
  parseSandbox,
  retrieveFeed,
  retrieveItem,
} from './utils.js'

describe('parseLimit', () => {
  it('should parse limit with recentCount attribute', () => {
    const value = {
      '@recentcount': 10,
    }
    const expected = {
      recentCount: 10,
    }

    expect(parseLimit(value)).toEqual(expected)
  })

  it('should parse limit with string recentCount attribute', () => {
    const value = {
      '@recentcount': '10',
    }
    const expected = {
      recentCount: 10,
    }

    expect(parseLimit(value)).toEqual(expected)
  })

  it('should handle missing recentCount attribute', () => {
    const value = {}

    expect(parseLimit(value)).toBeUndefined()
  })

  it('should handle invalid numeric values', () => {
    const value = {
      '@recentcount': 'not-a-number',
    }

    expect(parseLimit(value)).toBeUndefined()
  })

  it('should handle null or undefined recentCount', () => {
    const value = {
      '@recentcount': null,
    }

    expect(parseLimit(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseLimit(null)).toBeUndefined()
    expect(parseLimit(undefined)).toBeUndefined()
    expect(parseLimit('string')).toBeUndefined()
    expect(parseLimit(123)).toBeUndefined()
  })
})

describe('parsePartner', () => {
  it('should parse partner with id attribute', () => {
    const value = {
      '@id': '2zkvpokj55bj2sCHxCejJs',
    }
    const expected = {
      id: '2zkvpokj55bj2sCHxCejJs',
    }

    expect(parsePartner(value)).toEqual(expected)
  })

  it('should return undefined when id is missing', () => {
    const value = {}

    expect(parsePartner(value)).toBeUndefined()
  })

  it('should return undefined when id is empty string', () => {
    const value = {
      '@id': '',
    }

    expect(parsePartner(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parsePartner(null)).toBeUndefined()
    expect(parsePartner(undefined)).toBeUndefined()
    expect(parsePartner('string')).toBeUndefined()
  })
})

describe('parseSandbox', () => {
  it('should parse sandbox with enabled true', () => {
    const value = {
      '@enabled': true,
    }
    const expected = {
      enabled: true,
    }

    expect(parseSandbox(value)).toEqual(expected)
  })

  it('should parse sandbox with enabled false', () => {
    const value = {
      '@enabled': false,
    }
    const expected = {
      enabled: false,
    }

    expect(parseSandbox(value)).toEqual(expected)
  })

  it('should parse sandbox with string "true"', () => {
    const value = {
      '@enabled': 'true',
    }
    const expected = {
      enabled: true,
    }

    expect(parseSandbox(value)).toEqual(expected)
  })

  it('should parse sandbox with string "false"', () => {
    const value = {
      '@enabled': 'false',
    }
    const expected = {
      enabled: false,
    }

    expect(parseSandbox(value)).toEqual(expected)
  })

  it('should return undefined when enabled is missing', () => {
    const value = {}

    expect(parseSandbox(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseSandbox(null)).toBeUndefined()
    expect(parseSandbox(undefined)).toBeUndefined()
  })
})

describe('parseFeedAccess', () => {
  it('should parse feed access with partner and sandbox', () => {
    const value = {
      partner: { '@id': '2zkvpokj55bj2sCHxCejJs' },
      sandbox: { '@enabled': true },
    }
    const expected = {
      partner: {
        id: '2zkvpokj55bj2sCHxCejJs',
      },
      sandbox: {
        enabled: true,
      },
    }

    expect(parseFeedAccess(value)).toEqual(expected)
  })

  it('should parse feed access with only partner', () => {
    const value = {
      partner: { '@id': '2zkvpokj55bj2sCHxCejJs' },
    }
    const expected = {
      partner: {
        id: '2zkvpokj55bj2sCHxCejJs',
      },
    }

    expect(parseFeedAccess(value)).toEqual(expected)
  })

  it('should parse feed access with only sandbox', () => {
    const value = {
      sandbox: { '@enabled': false },
    }
    const expected = {
      sandbox: {
        enabled: false,
      },
    }

    expect(parseFeedAccess(value)).toEqual(expected)
  })

  it('should return undefined when no valid sub-elements present', () => {
    const value = {}

    expect(parseFeedAccess(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseFeedAccess(null)).toBeUndefined()
    expect(parseFeedAccess(undefined)).toBeUndefined()
  })
})

describe('parseEntitlement', () => {
  it('should parse entitlement with name attribute', () => {
    const value = {
      '@name': 'premium_content',
    }
    const expected = {
      name: 'premium_content',
    }

    expect(parseEntitlement(value)).toEqual(expected)
  })

  it('should return undefined when name is missing', () => {
    const value = {}

    expect(parseEntitlement(value)).toBeUndefined()
  })

  it('should return undefined when name is empty string', () => {
    const value = {
      '@name': '',
    }

    expect(parseEntitlement(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseEntitlement(null)).toBeUndefined()
    expect(parseEntitlement(undefined)).toBeUndefined()
  })
})

describe('parseItemAccess', () => {
  it('should parse item access with entitlement', () => {
    const value = {
      entitlement: { '@name': 'premium_content' },
    }
    const expected = {
      entitlement: {
        name: 'premium_content',
      },
    }

    expect(parseItemAccess(value)).toEqual(expected)
  })

  it('should return undefined when no entitlement present', () => {
    const value = {}

    expect(parseItemAccess(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseItemAccess(null)).toBeUndefined()
    expect(parseItemAccess(undefined)).toBeUndefined()
  })
})

describe('retrieveFeed', () => {
  const expectedFull = {
    limit: {
      recentCount: 10,
    },
    countryOfOrigin: 'US',
    access: {
      partner: {
        id: '2zkvpokj55bj2sCHxCejJs',
      },
      sandbox: {
        enabled: true,
      },
    },
  }

  it('should parse all Spotify feed properties when present', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
      'spotify:countryoforigin': { '#text': 'US' },
      'spotify:access': {
        partner: { '@id': '2zkvpokj55bj2sCHxCejJs' },
        sandbox: { '@enabled': true },
      },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse limit with string recentCount and countryOfOrigin without #text', () => {
    const value = {
      'spotify:limit': { '@recentcount': '10' },
      'spotify:countryoforigin': 'US',
      'spotify:access': {
        partner: { '@id': '2zkvpokj55bj2sCHxCejJs' },
        sandbox: { '@enabled': 'true' },
      },
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse limit from array of values (uses first)', () => {
    const value = {
      'spotify:limit': [{ '@recentcount': 10 }, { '@recentcount': 20 }],
      'spotify:countryoforigin': ['US', 'GB'],
      'spotify:access': [
        {
          partner: { '@id': '2zkvpokj55bj2sCHxCejJs' },
          sandbox: { '@enabled': true },
        },
        {
          partner: { '@id': 'other_partner' },
          sandbox: { '@enabled': false },
        },
      ],
    }

    expect(retrieveFeed(value)).toEqual(expectedFull)
  })

  it('should parse only limit when countryOfOrigin is missing', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
    }
    const expected = {
      limit: {
        recentCount: 10,
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should parse only countryOfOrigin when limit is missing', () => {
    const value = {
      'spotify:countryoforigin': { '#text': 'US' },
    }
    const expected = {
      countryOfOrigin: 'US',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle HTML entities in countryOfOrigin text content', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
      'spotify:countryoforigin': { '#text': 'US&amp;GB' },
    }
    const expected = {
      limit: {
        recentCount: 10,
      },
      countryOfOrigin: 'US&GB',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle CDATA sections in countryOfOrigin text content', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
      'spotify:countryoforigin': { '#text': '<![CDATA[US]]>' },
    }
    const expected = {
      limit: {
        recentCount: 10,
      },
      countryOfOrigin: 'US',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle limit without valid recentCount', () => {
    const value = {
      'spotify:limit': { '@recentcount': 'invalid' },
      'spotify:countryoforigin': { '#text': 'US' },
    }
    const expected = {
      countryOfOrigin: 'US',
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle missing attributes and #text properties', () => {
    const value = {
      'spotify:limit': {},
      'spotify:countryoforigin': {},
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle null or undefined properties', () => {
    const value = {
      'spotify:limit': null,
      'spotify:countryoforigin': undefined,
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

  it('should return undefined if all parsed properties are undefined', () => {
    const value = {
      'spotify:limit': {},
      'spotify:countryoforigin': null,
    }

    expect(retrieveFeed(value)).toBeUndefined()
  })

  it('should handle empty string values in countryOfOrigin', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
      'spotify:countryoforigin': { '#text': '' },
    }
    const expected = {
      limit: {
        recentCount: 10,
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only values in countryOfOrigin', () => {
    const value = {
      'spotify:limit': { '@recentcount': 10 },
      'spotify:countryoforigin': { '#text': '\t\n' },
    }
    const expected = {
      limit: {
        recentCount: 10,
      },
    }

    expect(retrieveFeed(value)).toEqual(expected)
  })
})

describe('retrieveItem', () => {
  it('should parse item with access and entitlement', () => {
    const value = {
      'spotify:access': {
        entitlement: { '@name': 'premium_content' },
      },
    }
    const expected = {
      access: {
        entitlement: {
          name: 'premium_content',
        },
      },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with access from array (uses first)', () => {
    const value = {
      'spotify:access': [
        { entitlement: { '@name': 'premium_content' } },
        { entitlement: { '@name': 'other_content' } },
      ],
    }
    const expected = {
      access: {
        entitlement: {
          name: 'premium_content',
        },
      },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined when access has no entitlement', () => {
    const value = {
      'spotify:access': {},
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when no access element present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
  })

  it('should return undefined if parsed access is empty', () => {
    const value = {
      'spotify:access': {
        entitlement: { '@name': '' },
      },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })
})
