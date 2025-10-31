import { describe, expect, it } from 'bun:test'
import {
  generateEntitlement,
  generateFeed,
  generateFeedAccess,
  generateItem,
  generateItemAccess,
  generateLimit,
  generatePartner,
  generateSandbox,
} from './utils.js'

describe('generateLimit', () => {
  it('should generate limit with recentCount', () => {
    const value = {
      recentCount: 10,
    }
    const expected = {
      '@recentCount': 10,
    }

    expect(generateLimit(value)).toEqual(expected)
  })

  it('should handle missing recentCount', () => {
    const value = {}

    expect(generateLimit(value)).toBeUndefined()
  })

  it('should handle undefined recentCount', () => {
    const value = {
      recentCount: undefined,
    }

    expect(generateLimit(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateLimit('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateLimit(123)).toBeUndefined()
    expect(generateLimit(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateLimit(null)).toBeUndefined()
  })
})

describe('generatePartner', () => {
  it('should generate partner with id', () => {
    const value = {
      id: '2zkvpokj55bj2sCHxCejJs',
    }
    const expected = {
      '@id': '2zkvpokj55bj2sCHxCejJs',
    }

    expect(generatePartner(value)).toEqual(expected)
  })

  it('should handle empty string id', () => {
    const value = {
      id: '',
    }

    expect(generatePartner(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePartner(null)).toBeUndefined()
    expect(generatePartner(undefined)).toBeUndefined()
  })
})

describe('generateSandbox', () => {
  it('should generate sandbox with enabled true', () => {
    const value = {
      enabled: true,
    }
    const expected = {
      '@enabled': true,
    }

    expect(generateSandbox(value)).toEqual(expected)
  })

  it('should generate sandbox with enabled false', () => {
    const value = {
      enabled: false,
    }
    const expected = {
      '@enabled': false,
    }

    expect(generateSandbox(value)).toEqual(expected)
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateSandbox(null)).toBeUndefined()
    expect(generateSandbox(undefined)).toBeUndefined()
  })
})

describe('generateFeedAccess', () => {
  it('should generate feed access with partner and sandbox', () => {
    const value = {
      partner: {
        id: '2zkvpokj55bj2sCHxCejJs',
      },
      sandbox: {
        enabled: true,
      },
    }
    const expected = {
      partner: {
        '@id': '2zkvpokj55bj2sCHxCejJs',
      },
      sandbox: {
        '@enabled': true,
      },
    }

    expect(generateFeedAccess(value)).toEqual(expected)
  })

  it('should generate feed access with only partner', () => {
    const value = {
      partner: {
        id: '2zkvpokj55bj2sCHxCejJs',
      },
    }
    const expected = {
      partner: {
        '@id': '2zkvpokj55bj2sCHxCejJs',
      },
    }

    expect(generateFeedAccess(value)).toEqual(expected)
  })

  it('should generate feed access with only sandbox', () => {
    const value = {
      sandbox: {
        enabled: false,
      },
    }
    const expected = {
      sandbox: {
        '@enabled': false,
      },
    }

    expect(generateFeedAccess(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateFeedAccess(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateFeedAccess(null)).toBeUndefined()
    expect(generateFeedAccess(undefined)).toBeUndefined()
  })
})

describe('generateEntitlement', () => {
  it('should generate entitlement with name', () => {
    const value = {
      name: 'premium_content',
    }
    const expected = {
      '@name': 'premium_content',
    }

    expect(generateEntitlement(value)).toEqual(expected)
  })

  it('should handle empty string name', () => {
    const value = {
      name: '',
    }

    expect(generateEntitlement(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateEntitlement(null)).toBeUndefined()
    expect(generateEntitlement(undefined)).toBeUndefined()
  })
})

describe('generateItemAccess', () => {
  it('should generate item access with entitlement', () => {
    const value = {
      entitlement: {
        name: 'premium_content',
      },
    }
    const expected = {
      entitlement: {
        '@name': 'premium_content',
      },
    }

    expect(generateItemAccess(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateItemAccess(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItemAccess(null)).toBeUndefined()
    expect(generateItemAccess(undefined)).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('should generate feed with all properties', () => {
    const value = {
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
    const expected = {
      'spotify:limit': {
        '@recentCount': 10,
      },
      'spotify:countryOfOrigin': 'US',
      'spotify:access': {
        partner: {
          '@id': '2zkvpokj55bj2sCHxCejJs',
        },
        sandbox: {
          '@enabled': true,
        },
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only limit', () => {
    const value = {
      limit: {
        recentCount: 10,
      },
    }
    const expected = {
      'spotify:limit': {
        '@recentCount': 10,
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should generate feed with only countryOfOrigin', () => {
    const value = {
      countryOfOrigin: 'US',
    }
    const expected = {
      'spotify:countryOfOrigin': 'US',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty strings in countryOfOrigin', () => {
    const value = {
      limit: {
        recentCount: 10,
      },
      countryOfOrigin: '',
    }
    const expected = {
      'spotify:limit': {
        '@recentCount': 10,
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings in countryOfOrigin', () => {
    const value = {
      limit: {
        recentCount: 10,
      },
      countryOfOrigin: '\t\n',
    }
    const expected = {
      'spotify:limit': {
        '@recentCount': 10,
      },
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle object with all undefined properties', () => {
    const value = {
      limit: undefined,
      countryOfOrigin: undefined,
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

  it('should handle country codes correctly', () => {
    const countryCodes = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP']

    for (const code of countryCodes) {
      const value = {
        countryOfOrigin: code,
      }
      const expected = {
        'spotify:countryOfOrigin': code,
      }

      expect(generateFeed(value)).toEqual(expected)
    }
  })

  it('should handle various recentCount limit values', () => {
    const limits = [1, 5, 10, 50, 100]

    for (const count of limits) {
      const value = {
        limit: {
          recentCount: count,
        },
      }
      const expected = {
        'spotify:limit': {
          '@recentCount': count,
        },
      }

      expect(generateFeed(value)).toEqual(expected)
    }
  })

  it('should handle limit with undefined recentCount', () => {
    const value = {
      limit: {
        recentCount: undefined,
      },
      countryOfOrigin: 'US',
    }
    const expected = {
      'spotify:countryOfOrigin': 'US',
    }

    expect(generateFeed(value)).toEqual(expected)
  })

  it('should handle empty limit object', () => {
    const value = {
      limit: {},
      countryOfOrigin: 'US',
    }
    const expected = {
      'spotify:countryOfOrigin': 'US',
    }

    expect(generateFeed(value)).toEqual(expected)
  })
})

describe('generateItem', () => {
  it('should generate item with access and entitlement', () => {
    const value = {
      access: {
        entitlement: {
          name: 'premium_content',
        },
      },
    }
    const expected = {
      'spotify:access': {
        entitlement: {
          '@name': 'premium_content',
        },
      },
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty entitlement name', () => {
    const value = {
      access: {
        entitlement: {
          name: '',
        },
      },
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty access object', () => {
    const value = {
      access: {},
    }

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(123)).toBeUndefined()
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
  })
})
