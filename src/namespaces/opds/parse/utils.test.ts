import { describe, expect, it } from 'bun:test'
import {
  parseAvailability,
  parseCopies,
  parseHolds,
  parseIndirectAcquisition,
  parsePrice,
  retrieveLink,
} from './utils.js'

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

  it('should parse price without currency code', () => {
    const value = {
      '#text': '9.99',
    }
    const expected = {
      value: 9.99,
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should parse price without value', () => {
    const value = {
      '@currencycode': 'USD',
    }
    const expected = {
      currencyCode: 'USD',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should handle CDATA sections in the value', () => {
    const value = {
      '#text': '<![CDATA[12.50]]>',
      '@currencycode': 'GBP',
    }
    const expected = {
      value: 12.5,
      currencyCode: 'GBP',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      '#text': '',
      '@currencycode': '',
    }

    expect(parsePrice(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      '#text': '   ',
      '@currencycode': '\t\n',
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

  it('should parse multiple levels of nested indirect acquisitions', () => {
    const value = {
      '@type': 'text/html',
      'opds:indirectacquisition': {
        '@type': 'application/atom+xml',
        'opds:indirectacquisition': {
          '@type': 'application/epub+zip',
          'opds:indirectacquisition': {
            '@type': 'application/x-mobipocket-ebook',
            'opds:indirectacquisition': {
              '@type': 'application/pdf',
            },
          },
        },
      },
    }
    const expected = {
      type: 'text/html',
      indirectAcquisitions: [
        {
          type: 'application/atom+xml',
          indirectAcquisitions: [
            {
              type: 'application/epub+zip',
              indirectAcquisitions: [
                {
                  type: 'application/x-mobipocket-ebook',
                  indirectAcquisitions: [{ type: 'application/pdf' }],
                },
              ],
            },
          ],
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

  it('should parse indirect acquisition without type', () => {
    const value = {
      'opds:indirectacquisition': [{ '@type': 'application/pdf' }],
    }
    const expected = {
      indirectAcquisitions: [{ type: 'application/pdf' }],
    }

    expect(parseIndirectAcquisition(value)).toEqual(expected)
  })

  it('should handle HTML entities in type', () => {
    const value = {
      '@type': 'application/atom+xml;profile=&quot;opds-catalog&quot;',
    }
    const expected = {
      type: 'application/atom+xml;profile="opds-catalog"',
    }

    expect(parseIndirectAcquisition(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      '@type': '',
    }

    expect(parseIndirectAcquisition(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      '@type': '   ',
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

describe('parseAvailability', () => {
  it('should parse availability with all properties', () => {
    const value = {
      '@status': 'available',
      '@since': '2023-01-01T00:00:00Z',
      '@until': '2023-12-31T23:59:59Z',
    }
    const expected = {
      status: 'available',
      since: '2023-01-01T00:00:00Z',
      until: '2023-12-31T23:59:59Z',
    }

    expect(parseAvailability(value)).toEqual(expected)
  })

  it('should parse availability with prefixed attributes', () => {
    const value = {
      '@opds:status': 'reserved',
      '@opds:since': '2024-03-01T09:00:00Z',
      '@opds:until': '2024-03-22T09:00:00Z',
    }
    const expected = {
      status: 'reserved',
      since: '2024-03-01T09:00:00Z',
      until: '2024-03-22T09:00:00Z',
    }

    expect(parseAvailability(value)).toEqual(expected)
  })

  it('should prefer unprefixed attributes when both spellings are present', () => {
    const value = {
      '@status': 'available',
      '@opds:status': 'reserved',
      '@since': '2024-03-01T09:00:00Z',
      '@opds:since': '2024-02-01T09:00:00Z',
      '@until': '2024-03-22T09:00:00Z',
      '@opds:until': '2024-02-22T09:00:00Z',
    }
    const expected = {
      status: 'available',
      since: '2024-03-01T09:00:00Z',
      until: '2024-03-22T09:00:00Z',
    }

    expect(parseAvailability(value)).toEqual(expected)
  })

  it('should fall back to prefixed attributes when unprefixed ones are empty', () => {
    const value = {
      '@status': '',
      '@opds:status': 'ready',
      '@since': '',
      '@opds:since': '2024-03-01T09:00:00Z',
      '@until': '',
      '@opds:until': '2024-03-04T09:00:00Z',
    }
    const expected = {
      status: 'ready',
      since: '2024-03-01T09:00:00Z',
      until: '2024-03-04T09:00:00Z',
    }

    expect(parseAvailability(value)).toEqual(expected)
  })

  it('should parse availability with status only', () => {
    const value = {
      '@status': 'unavailable',
    }
    const expected = {
      status: 'unavailable',
    }

    expect(parseAvailability(value)).toEqual(expected)
  })

  it('should parse availability with status and since', () => {
    const value = {
      '@status': 'reserved',
      '@since': '2023-06-15T10:00:00Z',
    }
    const expected = {
      status: 'reserved',
      since: '2023-06-15T10:00:00Z',
    }

    expect(parseAvailability(value)).toEqual(expected)
  })

  it('should parse availability with status and until', () => {
    const value = {
      '@status': 'ready',
      '@until': '2023-07-01T00:00:00Z',
    }
    const expected = {
      status: 'ready',
      until: '2023-07-01T00:00:00Z',
    }

    expect(parseAvailability(value)).toEqual(expected)
  })

  it('should parse availability without status', () => {
    const value = {
      '@since': '2023-01-01T00:00:00Z',
      '@until': '2023-12-31T23:59:59Z',
    }
    const expected = {
      since: '2023-01-01T00:00:00Z',
      until: '2023-12-31T23:59:59Z',
    }

    expect(parseAvailability(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      '@status': '',
      '@since': '',
      '@until': '',
    }

    expect(parseAvailability(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      '@status': '   ',
      '@since': '\t\n',
    }

    expect(parseAvailability(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseAvailability(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseAvailability('not an object')).toBeUndefined()
    expect(parseAvailability(undefined)).toBeUndefined()
    expect(parseAvailability(null)).toBeUndefined()
    expect(parseAvailability([])).toBeUndefined()
    expect(parseAvailability(123)).toBeUndefined()
  })
})

describe('parseHolds', () => {
  it('should parse holds with all properties', () => {
    const value = {
      '@total': '10',
      '@position': '3',
    }
    const expected = {
      total: 10,
      position: 3,
    }

    expect(parseHolds(value)).toEqual(expected)
  })

  it('should parse holds with prefixed attributes', () => {
    const value = {
      '@opds:total': '8',
      '@opds:position': '3',
    }
    const expected = {
      total: 8,
      position: 3,
    }

    expect(parseHolds(value)).toEqual(expected)
  })

  it('should prefer unprefixed attributes when both spellings are present', () => {
    const value = {
      '@total': '8',
      '@opds:total': '7',
      '@position': '3',
      '@opds:position': '2',
    }
    const expected = {
      total: 8,
      position: 3,
    }

    expect(parseHolds(value)).toEqual(expected)
  })

  it('should fall back to prefixed attributes when unprefixed ones are invalid', () => {
    const value = {
      '@total': 'many',
      '@opds:total': '8',
      '@position': '',
      '@opds:position': '3',
    }
    const expected = {
      total: 8,
      position: 3,
    }

    expect(parseHolds(value)).toEqual(expected)
  })

  it('should parse holds with total only', () => {
    const value = {
      '@total': '5',
    }
    const expected = {
      total: 5,
    }

    expect(parseHolds(value)).toEqual(expected)
  })

  it('should parse holds with position only', () => {
    const value = {
      '@position': '2',
    }
    const expected = {
      position: 2,
    }

    expect(parseHolds(value)).toEqual(expected)
  })

  it('should parse holds with numeric values', () => {
    const value = {
      '@total': 15,
      '@position': 7,
    }
    const expected = {
      total: 15,
      position: 7,
    }

    expect(parseHolds(value)).toEqual(expected)
  })

  it('should parse holds with zero values', () => {
    const value = {
      '@total': '0',
      '@position': '0',
    }
    const expected = {
      total: 0,
      position: 0,
    }

    expect(parseHolds(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      '@total': '',
      '@position': '',
    }

    expect(parseHolds(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      '@total': '   ',
      '@position': '\t\n',
    }

    expect(parseHolds(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseHolds(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseHolds('not an object')).toBeUndefined()
    expect(parseHolds(undefined)).toBeUndefined()
    expect(parseHolds(null)).toBeUndefined()
    expect(parseHolds([])).toBeUndefined()
    expect(parseHolds(123)).toBeUndefined()
  })
})

describe('parseCopies', () => {
  it('should parse copies with all properties', () => {
    const value = {
      '@total': '20',
      '@available': '5',
    }
    const expected = {
      total: 20,
      available: 5,
    }

    expect(parseCopies(value)).toEqual(expected)
  })

  it('should parse copies with prefixed attributes', () => {
    const value = {
      '@opds:total': '4',
      '@opds:available': '0',
    }
    const expected = {
      total: 4,
      available: 0,
    }

    expect(parseCopies(value)).toEqual(expected)
  })

  it('should prefer unprefixed attributes when both spellings are present', () => {
    const value = {
      '@total': '4',
      '@opds:total': '5',
      '@available': '1',
      '@opds:available': '2',
    }
    const expected = {
      total: 4,
      available: 1,
    }

    expect(parseCopies(value)).toEqual(expected)
  })

  it('should fall back to prefixed attributes when unprefixed ones are invalid', () => {
    const value = {
      '@total': 'four',
      '@opds:total': '4',
      '@available': '',
      '@opds:available': '1',
    }
    const expected = {
      total: 4,
      available: 1,
    }

    expect(parseCopies(value)).toEqual(expected)
  })

  it('should parse copies with total only', () => {
    const value = {
      '@total': '10',
    }
    const expected = {
      total: 10,
    }

    expect(parseCopies(value)).toEqual(expected)
  })

  it('should parse copies with available only', () => {
    const value = {
      '@available': '3',
    }
    const expected = {
      available: 3,
    }

    expect(parseCopies(value)).toEqual(expected)
  })

  it('should parse copies with numeric values', () => {
    const value = {
      '@total': 25,
      '@available': 12,
    }
    const expected = {
      total: 25,
      available: 12,
    }

    expect(parseCopies(value)).toEqual(expected)
  })

  it('should parse copies with zero values', () => {
    const value = {
      '@total': '5',
      '@available': '0',
    }
    const expected = {
      total: 5,
      available: 0,
    }

    expect(parseCopies(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      '@total': '',
      '@available': '',
    }

    expect(parseCopies(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      '@total': '   ',
      '@available': '\t\n',
    }

    expect(parseCopies(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseCopies(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseCopies('not an object')).toBeUndefined()
    expect(parseCopies(undefined)).toBeUndefined()
    expect(parseCopies(null)).toBeUndefined()
    expect(parseCopies([])).toBeUndefined()
    expect(parseCopies(123)).toBeUndefined()
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
      'opds:availability': { '@status': 'available' },
      'opds:holds': { '@total': '5', '@position': '2' },
      'opds:copies': { '@total': '10', '@available': '3' },
    }
    const expected = {
      prices: [
        { value: 9.99, currencyCode: 'USD' },
        { value: 8.99, currencyCode: 'EUR' },
      ],
      indirectAcquisitions: [{ type: 'application/epub+zip' }],
      facetGroup: 'Price',
      activeFacet: true,
      availability: { status: 'available' },
      holds: { total: 5, position: 2 },
      copies: { total: 10, available: 3 },
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

  it('should filter out empty prices', () => {
    const value = {
      'opds:price': [{ '#text': '9.99', '@currencycode': 'USD' }, {}],
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

  it('should handle HTML entities in facetGroup', () => {
    const value = {
      '@opds:facetgroup': 'Science &amp; Nature',
    }
    const expected = {
      facetGroup: 'Science & Nature',
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should handle CDATA sections in prices', () => {
    const value = {
      'opds:price': { '#text': '<![CDATA[4.99]]>', '@currencycode': 'USD' },
    }
    const expected = {
      prices: [{ value: 4.99, currencyCode: 'USD' }],
    }

    expect(retrieveLink(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      '@opds:facetgroup': '',
      '@opds:activefacet': '',
    }

    expect(retrieveLink(value)).toBeUndefined()
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      '@opds:facetgroup': '   ',
      '@opds:activefacet': '\t\n',
    }

    expect(retrieveLink(value)).toBeUndefined()
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
