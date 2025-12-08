import { describe, expect, it } from 'bun:test'
import { parseIndirectAcquisition, parsePrice, retrieveLink } from './utils.js'

describe('parsePrice', () => {
  it('should parse complete price with value and currency code', () => {
    const value = {
      '#text': '9.99',
      '@currencycode': 'USD',
    }
    const expected = {
      value: 9.99,
      currencyCode: 'USD',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should parse price with numeric value', () => {
    const value = {
      '#text': 14.99,
      '@currencycode': 'EUR',
    }
    const expected = {
      value: 14.99,
      currencyCode: 'EUR',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should parse price with zero value', () => {
    const value = {
      '#text': '0',
      '@currencycode': 'USD',
    }
    const expected = {
      value: 0,
      currencyCode: 'USD',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should parse price with various currency codes', () => {
    const values = [
      { '#text': '10.00', '@currencycode': 'GBP' },
      { '#text': '1000', '@currencycode': 'JPY' },
      { '#text': '25.50', '@currencycode': 'CAD' },
    ]
    const expected = [
      { value: 10.0, currencyCode: 'GBP' },
      { value: 1000, currencyCode: 'JPY' },
      { value: 25.5, currencyCode: 'CAD' },
    ]

    expect(parsePrice(values[0])).toEqual(expected[0])
    expect(parsePrice(values[1])).toEqual(expected[1])
    expect(parsePrice(values[2])).toEqual(expected[2])
  })

  it('should parse price without #text wrapper', () => {
    const value = {
      '@currencycode': 'USD',
    }

    expect(parsePrice(value)).toBeUndefined()
  })

  it('should return undefined when currency code is missing', () => {
    const value = {
      '#text': '9.99',
    }

    expect(parsePrice(value)).toBeUndefined()
  })

  it('should return undefined when value is missing', () => {
    const value = {
      '@currencycode': 'USD',
    }

    expect(parsePrice(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parsePrice(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parsePrice('not an object')).toBeUndefined()
    expect(parsePrice(undefined)).toBeUndefined()
    expect(parsePrice(null)).toBeUndefined()
    expect(parsePrice([])).toBeUndefined()
    expect(parsePrice(123)).toBeUndefined()
  })
})

describe('parseIndirectAcquisition', () => {
  it('should parse indirect acquisition with type only', () => {
    const value = {
      '@type': 'application/epub+zip',
    }
    const expected = {
      type: 'application/epub+zip',
    }

    expect(parseIndirectAcquisition(value)).toEqual(expected)
  })

  it('should parse indirect acquisition with nested acquisitions', () => {
    const value = {
      '@type': 'application/epub+zip',
      'opds:indirectacquisition': [
        { '@type': 'application/x-mobipocket-ebook' },
        { '@type': 'application/pdf' },
      ],
    }
    const expected = {
      type: 'application/epub+zip',
      indirectAcquisitions: [
        { type: 'application/x-mobipocket-ebook' },
        { type: 'application/pdf' },
      ],
    }

    expect(parseIndirectAcquisition(value)).toEqual(expected)
  })

  it('should parse deeply nested indirect acquisitions', () => {
    const value = {
      '@type': 'text/html',
      'opds:indirectacquisition': {
        '@type': 'application/epub+zip',
        'opds:indirectacquisition': {
          '@type': 'application/x-mobipocket-ebook',
        },
      },
    }
    const expected = {
      type: 'text/html',
      indirectAcquisitions: [
        {
          type: 'application/epub+zip',
          indirectAcquisitions: [{ type: 'application/x-mobipocket-ebook' }],
        },
      ],
    }

    expect(parseIndirectAcquisition(value)).toEqual(expected)
  })

  it('should filter out invalid nested acquisitions', () => {
    const value = {
      '@type': 'application/epub+zip',
      'opds:indirectacquisition': [
        { '@type': 'application/pdf' },
        {}, // Missing type.
        { '@type': 'application/x-mobipocket-ebook' },
      ],
    }
    const expected = {
      type: 'application/epub+zip',
      indirectAcquisitions: [
        { type: 'application/pdf' },
        { type: 'application/x-mobipocket-ebook' },
      ],
    }

    expect(parseIndirectAcquisition(value)).toEqual(expected)
  })

  it('should return undefined when type is missing', () => {
    const value = {
      'opds:indirectacquisition': [{ '@type': 'application/pdf' }],
    }

    expect(parseIndirectAcquisition(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseIndirectAcquisition(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseIndirectAcquisition('not an object')).toBeUndefined()
    expect(parseIndirectAcquisition(undefined)).toBeUndefined()
    expect(parseIndirectAcquisition(null)).toBeUndefined()
    expect(parseIndirectAcquisition([])).toBeUndefined()
    expect(parseIndirectAcquisition(123)).toBeUndefined()
  })
})

describe('retrieveLink', () => {
  it('should parse link with all OPDS properties', () => {
    const value = {
      'opds:price': [
        { '#text': '9.99', '@currencycode': 'USD' },
        { '#text': '8.99', '@currencycode': 'EUR' },
      ],
      'opds:indirectacquisition': [{ '@type': 'application/epub+zip' }],
      '@opds:facetgroup': 'Price',
      '@opds:activefacet': 'true',
    }
    const expected = {
      prices: [
        { value: 9.99, currencyCode: 'USD' },
        { value: 8.99, currencyCode: 'EUR' },
      ],
      indirectAcquisitions: [{ type: 'application/epub+zip' }],
      facetGroup: 'Price',
      activeFacet: true,
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should parse link with prices only', () => {
    const value = {
      'opds:price': { '#text': '9.99', '@currencycode': 'USD' },
    }
    const expected = {
      prices: [{ value: 9.99, currencyCode: 'USD' }],
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should parse link with indirect acquisitions only', () => {
    const value = {
      'opds:indirectacquisition': {
        '@type': 'application/epub+zip',
        'opds:indirectacquisition': { '@type': 'application/pdf' },
      },
    }
    const expected = {
      indirectAcquisitions: [
        {
          type: 'application/epub+zip',
          indirectAcquisitions: [{ type: 'application/pdf' }],
        },
      ],
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should parse link with facet attributes only', () => {
    const value = {
      '@opds:facetgroup': 'Sort',
      '@opds:activefacet': 'true',
    }
    const expected = {
      facetGroup: 'Sort',
      activeFacet: true,
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should parse activeFacet as false', () => {
    const value = {
      '@opds:facetgroup': 'Author',
      '@opds:activefacet': 'false',
    }
    const expected = {
      facetGroup: 'Author',
      activeFacet: false,
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should parse link with facetGroup only', () => {
    const value = {
      '@opds:facetgroup': 'Category',
    }
    const expected = {
      facetGroup: 'Category',
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should filter out invalid prices', () => {
    const value = {
      'opds:price': [
        { '#text': '9.99', '@currencycode': 'USD' },
        { '#text': '5.99' }, // Missing currency code.
        { '@currencycode': 'EUR' }, // Missing value.
      ],
    }
    const expected = {
      prices: [{ value: 9.99, currencyCode: 'USD' }],
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should handle objects with mixed valid and invalid properties', () => {
    const value = {
      'opds:price': { '#text': '9.99', '@currencycode': 'USD' },
      '@opds:facetgroup': 'Price',
      '@invalid': 'property',
    }
    const expected = {
      prices: [{ value: 9.99, currencyCode: 'USD' }],
      facetGroup: 'Price',
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveLink(value)).toBeUndefined()
  })

  it('should return undefined for objects with only unrelated properties', () => {
    const value = {
      '@unrelated': 'property',
      random: 'value',
    }

    expect(retrieveLink(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveLink('not an object')).toBeUndefined()
    expect(retrieveLink(undefined)).toBeUndefined()
    expect(retrieveLink(null)).toBeUndefined()
    expect(retrieveLink([])).toBeUndefined()
    expect(retrieveLink(123)).toBeUndefined()
  })
})
