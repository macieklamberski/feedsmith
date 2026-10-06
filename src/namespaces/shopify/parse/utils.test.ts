import { describe, expect, it } from 'bun:test'
import { parsePrice, parseVariant, retrieveItem } from './utils.js'

describe('parsePrice', () => {
  it('should parse price with all properties', () => {
    const value = {
      '@currency': 'USD',
      '#text': '189.00',
    }
    const expected = {
      value: 189,
      currency: 'USD',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should parse price with only value', () => {
    const value = {
      '#text': '24.50',
    }
    const expected = {
      value: 24.5,
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should parse price with only currency', () => {
    const value = {
      '@currency': 'JPY',
    }
    const expected = {
      currency: 'JPY',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should parse price from plain text', () => {
    const value = '12000'
    const expected = {
      value: 12000,
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should handle CDATA sections in value', () => {
    const value = {
      '@currency': 'EUR',
      '#text': '<![CDATA[45.00]]>',
    }
    const expected = {
      value: 45,
      currency: 'EUR',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should ignore non-numeric value', () => {
    const value = {
      '@currency': 'USD',
      '#text': 'free',
    }
    const expected = {
      currency: 'USD',
    }

    expect(parsePrice(value)).toEqual(expected)
  })

  it('should return undefined for empty string value', () => {
    const value = {
      '#text': '',
    }

    expect(parsePrice(value)).toBeUndefined()
  })

  it('should return undefined for whitespace-only value', () => {
    const value = {
      '#text': '   ',
    }

    expect(parsePrice(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parsePrice(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parsePrice(undefined)).toBeUndefined()
    expect(parsePrice(null)).toBeUndefined()
    expect(parsePrice(true)).toBeUndefined()
    expect(parsePrice([])).toBeUndefined()
  })
})

describe('parseVariant', () => {
  it('should parse variant with all properties', () => {
    const value = {
      id: { '#text': 'https://example.com/products/6671437103168' },
      title: { '#text': '6 / Blush Suede' },
      'shopify:price': { '@currency': 'USD', '#text': '189.00' },
      'shopify:sku': { '#text': '26996032' },
      'shopify:grams': { '#text': '454' },
    }
    const expected = {
      id: 'https://example.com/products/6671437103168',
      title: '6 / Blush Suede',
      price: { value: 189, currency: 'USD' },
      sku: '26996032',
      grams: 454,
    }

    expect(parseVariant(value)).toEqual(expected)
  })

  it('should parse variant without #text', () => {
    const value = {
      id: 'https://example.com/products/6671437103168',
      title: '6 / Blush Suede',
      'shopify:price': '189.00',
      'shopify:sku': '26996032',
      'shopify:grams': '454',
    }
    const expected = {
      id: 'https://example.com/products/6671437103168',
      title: '6 / Blush Suede',
      price: { value: 189 },
      sku: '26996032',
      grams: 454,
    }

    expect(parseVariant(value)).toEqual(expected)
  })

  it('should parse variant with only price', () => {
    const value = {
      'shopify:price': { '@currency': 'CRC', '#text': '37250.00' },
    }
    const expected = {
      price: { value: 37250, currency: 'CRC' },
    }

    expect(parseVariant(value)).toEqual(expected)
  })

  it('should parse zero grams', () => {
    const value = {
      'shopify:grams': '0',
    }
    const expected = {
      grams: 0,
    }

    expect(parseVariant(value)).toEqual(expected)
  })

  it('should use first value when elements repeat', () => {
    const value = {
      'shopify:sku': ['26996032', '27061568'],
    }
    const expected = {
      sku: '26996032',
    }

    expect(parseVariant(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      title: { '#text': 'Small &amp; Light' },
    }
    const expected = {
      title: 'Small & Light',
    }

    expect(parseVariant(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'shopify:sku': { '#text': '<![CDATA[AB-KD-600]]>' },
    }
    const expected = {
      sku: 'AB-KD-600',
    }

    expect(parseVariant(value)).toEqual(expected)
  })

  it('should skip empty sku', () => {
    const value = {
      title: 'Default Title',
      'shopify:sku': '',
    }
    const expected = {
      title: 'Default Title',
    }

    expect(parseVariant(value)).toEqual(expected)
  })

  it('should return undefined for whitespace-only values', () => {
    const value = {
      title: '   ',
      'shopify:sku': { '#text': '\t\n' },
    }

    expect(parseVariant(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseVariant(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseVariant('string')).toBeUndefined()
    expect(parseVariant(undefined)).toBeUndefined()
    expect(parseVariant(null)).toBeUndefined()
    expect(parseVariant(123)).toBeUndefined()
    expect(parseVariant([])).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse all Shopify item properties', () => {
    const value = {
      'shopify:type': { '#text': 'Loafer' },
      'shopify:vendor': { '#text': 'Example Shoes' },
      'shopify:tag': [{ '#text': 'Category: Shoe' }, { '#text': 'SP23' }],
      'shopify:variant': [
        {
          id: 'https://example.com/products/6671437103168',
          title: '6 / Blush Suede',
          'shopify:price': { '@currency': 'USD', '#text': '189.00' },
          'shopify:sku': '26996032',
          'shopify:grams': '454',
        },
        {
          id: 'https://example.com/products/6671437103168',
          title: '6.5 / Blush Suede',
          'shopify:price': { '@currency': 'USD', '#text': '189.00' },
          'shopify:sku': '27061568',
          'shopify:grams': '454',
        },
      ],
    }
    const expected = {
      type: 'Loafer',
      vendor: 'Example Shoes',
      tags: ['Category: Shoe', 'SP23'],
      variants: [
        {
          id: 'https://example.com/products/6671437103168',
          title: '6 / Blush Suede',
          price: { value: 189, currency: 'USD' },
          sku: '26996032',
          grams: 454,
        },
        {
          id: 'https://example.com/products/6671437103168',
          title: '6.5 / Blush Suede',
          price: { value: 189, currency: 'USD' },
          sku: '27061568',
          grams: 454,
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse single tag and variant as arrays', () => {
    const value = {
      'shopify:tag': 'All',
      'shopify:variant': {
        title: 'Default Title',
        'shopify:grams': '0',
      },
    }
    const expected = {
      tags: ['All'],
      variants: [{ title: 'Default Title', grams: 0 }],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only type', () => {
    const value = {
      'shopify:type': 'Necklace',
    }
    const expected = {
      type: 'Necklace',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with only vendor', () => {
    const value = {
      'shopify:vendor': 'Example Shop',
    }
    const expected = {
      vendor: 'Example Shop',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should use first type when type repeats', () => {
    const value = {
      'shopify:type': ['Necklace', 'Ring'],
    }
    const expected = {
      type: 'Necklace',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'shopify:vendor': { '#text': 'Smith &amp; Sons' },
    }
    const expected = {
      vendor: 'Smith & Sons',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'shopify:type': { '#text': '<![CDATA[Advertising Services]]>' },
    }
    const expected = {
      type: 'Advertising Services',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should skip empty type', () => {
    const value = {
      'shopify:type': '',
      'shopify:vendor': 'Example Shop',
    }
    const expected = {
      vendor: 'Example Shop',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should skip empty tags and variants', () => {
    const value = {
      'shopify:tag': ['', 'All'],
      'shopify:variant': [{}, { title: 'Default Title' }],
    }
    const expected = {
      tags: ['All'],
      variants: [{ title: 'Default Title' }],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should return undefined for whitespace-only values', () => {
    const value = {
      'shopify:type': '   ',
      'shopify:vendor': { '#text': '\t\n' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined when no Shopify properties are present', () => {
    const value = {
      'some:othertag': { '#text': 'value' },
    }

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(retrieveItem(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(retrieveItem(null)).toBeUndefined()
    expect(retrieveItem(undefined)).toBeUndefined()
    expect(retrieveItem('string')).toBeUndefined()
    expect(retrieveItem(123)).toBeUndefined()
    expect(retrieveItem([])).toBeUndefined()
  })
})
