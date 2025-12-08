import { describe, expect, it } from 'bun:test'
import { generateIndirectAcquisition, generateLink, generatePrice } from './utils.js'

describe('generatePrice', () => {
  it('should generate price with all properties', () => {
    const value = {
      value: 9.99,
      currencyCode: 'USD',
    }
    const expected = {
      '#text': 9.99,
      '@currencycode': 'USD',
    }

    expect(generatePrice(value)).toEqual(expected)
  })

  it('should generate price with zero value', () => {
    const value = {
      value: 0,
      currencyCode: 'USD',
    }
    const expected = {
      '#text': 0,
      '@currencycode': 'USD',
    }

    expect(generatePrice(value)).toEqual(expected)
  })

  it('should generate price with various currency codes', () => {
    const values = [
      { value: 10.0, currencyCode: 'GBP' },
      { value: 1000, currencyCode: 'JPY' },
      { value: 25.5, currencyCode: 'CAD' },
    ]
    const expected = [
      { '#text': 10.0, '@currencycode': 'GBP' },
      { '#text': 1000, '@currencycode': 'JPY' },
      { '#text': 25.5, '@currencycode': 'CAD' },
    ]

    expect(generatePrice(values[0])).toEqual(expected[0])
    expect(generatePrice(values[1])).toEqual(expected[1])
    expect(generatePrice(values[2])).toEqual(expected[2])
  })

  it('should return undefined when currency code is missing', () => {
    const value = {
      value: 9.99,
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generatePrice(value)).toBeUndefined()
  })

  it('should return undefined when value is missing', () => {
    const value = {
      currencyCode: 'USD',
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generatePrice(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
    expect(generatePrice(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePrice('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePrice(123)).toBeUndefined()
    expect(generatePrice(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePrice(null)).toBeUndefined()
  })
})

describe('generateIndirectAcquisition', () => {
  it('should generate indirect acquisition with type only', () => {
    const value = {
      type: 'application/epub+zip',
    }
    const expected = {
      '@type': 'application/epub+zip',
    }

    expect(generateIndirectAcquisition(value)).toEqual(expected)
  })

  it('should generate indirect acquisition with nested acquisitions', () => {
    const value = {
      type: 'application/epub+zip',
      indirectAcquisitions: [
        { type: 'application/x-mobipocket-ebook' },
        { type: 'application/pdf' },
      ],
    }
    const expected = {
      '@type': 'application/epub+zip',
      'opds:indirectAcquisition': [
        { '@type': 'application/x-mobipocket-ebook' },
        { '@type': 'application/pdf' },
      ],
    }

    expect(generateIndirectAcquisition(value)).toEqual(expected)
  })

  it('should generate deeply nested indirect acquisitions', () => {
    const value = {
      type: 'text/html',
      indirectAcquisitions: [
        {
          type: 'application/epub+zip',
          indirectAcquisitions: [{ type: 'application/x-mobipocket-ebook' }],
        },
      ],
    }
    const expected = {
      '@type': 'text/html',
      'opds:indirectAcquisition': [
        {
          '@type': 'application/epub+zip',
          'opds:indirectAcquisition': [{ '@type': 'application/x-mobipocket-ebook' }],
        },
      ],
    }

    expect(generateIndirectAcquisition(value)).toEqual(expected)
  })

  it('should filter out invalid nested acquisitions', () => {
    const value = {
      type: 'application/epub+zip',
      indirectAcquisitions: [
        { type: 'application/pdf' },
        {}, // Missing type.
        { type: 'application/x-mobipocket-ebook' },
      ],
    }
    const expected = {
      '@type': 'application/epub+zip',
      'opds:indirectAcquisition': [
        { '@type': 'application/pdf' },
        { '@type': 'application/x-mobipocket-ebook' },
      ],
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateIndirectAcquisition(value)).toEqual(expected)
  })

  it('should return undefined when type is missing', () => {
    const value = {
      indirectAcquisitions: [{ type: 'application/pdf' }],
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateIndirectAcquisition(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    // @ts-expect-error: This is for testing purposes.
    expect(generateIndirectAcquisition(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateIndirectAcquisition('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateIndirectAcquisition(123)).toBeUndefined()
    expect(generateIndirectAcquisition(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateIndirectAcquisition(null)).toBeUndefined()
  })
})

describe('generateLink', () => {
  it('should generate link with all OPDS properties', () => {
    const value = {
      prices: [
        { value: 9.99, currencyCode: 'USD' },
        { value: 8.99, currencyCode: 'EUR' },
      ],
      indirectAcquisitions: [{ type: 'application/epub+zip' }],
      facetGroup: 'Price',
      activeFacet: true,
    }
    const expected = {
      'opds:price': [
        { '#text': 9.99, '@currencycode': 'USD' },
        { '#text': 8.99, '@currencycode': 'EUR' },
      ],
      'opds:indirectAcquisition': [{ '@type': 'application/epub+zip' }],
      '@opds:facetGroup': 'Price',
      '@opds:activeFacet': true,
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should generate link with prices only', () => {
    const value = {
      prices: [{ value: 9.99, currencyCode: 'USD' }],
    }
    const expected = {
      'opds:price': [{ '#text': 9.99, '@currencycode': 'USD' }],
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should generate link with indirect acquisitions only', () => {
    const value = {
      indirectAcquisitions: [
        {
          type: 'application/epub+zip',
          indirectAcquisitions: [{ type: 'application/pdf' }],
        },
      ],
    }
    const expected = {
      'opds:indirectAcquisition': [
        {
          '@type': 'application/epub+zip',
          'opds:indirectAcquisition': [{ '@type': 'application/pdf' }],
        },
      ],
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should generate link with facet attributes only', () => {
    const value = {
      facetGroup: 'Sort',
      activeFacet: true,
    }
    const expected = {
      '@opds:facetGroup': 'Sort',
      '@opds:activeFacet': true,
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should generate link with activeFacet as false', () => {
    const value = {
      facetGroup: 'Author',
      activeFacet: false,
    }
    const expected = {
      '@opds:facetGroup': 'Author',
      '@opds:activeFacet': false,
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should generate link with facetGroup only', () => {
    const value = {
      facetGroup: 'Category',
    }
    const expected = {
      '@opds:facetGroup': 'Category',
    }

    expect(generateLink(value)).toEqual(expected)
  })

  it('should filter out invalid prices', () => {
    const value = {
      prices: [
        { value: 9.99, currencyCode: 'USD' },
        { value: 5.99 }, // Missing currency code.
        { currencyCode: 'EUR' }, // Missing value.
      ],
    }
    const expected = {
      'opds:price': [{ '#text': 9.99, '@currencycode': 'USD' }],
    }

    // @ts-expect-error: This is for testing purposes.
    expect(generateLink(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(generateLink(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateLink('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateLink(123)).toBeUndefined()
    expect(generateLink(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateLink(null)).toBeUndefined()
  })
})
