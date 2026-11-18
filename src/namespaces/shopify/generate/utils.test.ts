import { describe, expect, it } from 'bun:test'
import { generateItem, generatePrice, generateVariant } from './utils.js'

describe('generatePrice', () => {
  it('should generate price with all properties', () => {
    const value = {
      value: 189,
      currency: 'USD',
    }
    const expected = {
      '#text': 189,
      '@currency': 'USD',
    }

    expect(generatePrice(value)).toEqual(expected)
  })

  it('should generate price with only value', () => {
    const value = {
      value: 24.5,
    }
    const expected = {
      '#text': 24.5,
    }

    expect(generatePrice(value)).toEqual(expected)
  })

  it('should generate price with only currency', () => {
    const value = {
      currency: 'JPY',
    }
    const expected = {
      '@currency': 'JPY',
    }

    expect(generatePrice(value)).toEqual(expected)
  })

  it('should generate zero value', () => {
    const value = {
      value: 0,
      currency: 'USD',
    }
    const expected = {
      '#text': 0,
      '@currency': 'USD',
    }

    expect(generatePrice(value)).toEqual(expected)
  })

  it('should handle empty currency', () => {
    const value = {
      value: 45,
      currency: '',
    }
    const expected = {
      '#text': 45,
    }

    expect(generatePrice(value)).toEqual(expected)
  })

  it('should handle whitespace-only currency', () => {
    const value = {
      currency: '   ',
    }

    expect(generatePrice(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generatePrice(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generatePrice('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePrice(123)).toBeUndefined()
    expect(generatePrice(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePrice(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generatePrice([])).toBeUndefined()
  })
})

describe('generateVariant', () => {
  it('should generate variant with all properties', () => {
    const value = {
      id: 'https://example.com/products/6671437103168',
      title: '6 / Blush Suede',
      price: { value: 189, currency: 'USD' },
      sku: '26996032',
      grams: 454,
    }
    const expected = {
      id: 'https://example.com/products/6671437103168',
      title: '6 / Blush Suede',
      'shopify:price': { '#text': 189, '@currency': 'USD' },
      'shopify:sku': '26996032',
      'shopify:grams': 454,
    }

    expect(generateVariant(value)).toEqual(expected)
  })

  it('should generate variant with only title', () => {
    const value = {
      title: 'Default Title',
    }
    const expected = {
      title: 'Default Title',
    }

    expect(generateVariant(value)).toEqual(expected)
  })

  it('should generate zero grams', () => {
    const value = {
      grams: 0,
    }
    const expected = {
      'shopify:grams': 0,
    }

    expect(generateVariant(value)).toEqual(expected)
  })

  it('should wrap text with special characters in CDATA', () => {
    const value = {
      title: 'Small & Light',
    }
    const expected = {
      title: { '#cdata': 'Small & Light' },
    }

    expect(generateVariant(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      title: 'Default Title',
      sku: '',
    }
    const expected = {
      title: 'Default Title',
    }

    expect(generateVariant(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      title: '   ',
      sku: '\t\n',
    }

    expect(generateVariant(value)).toBeUndefined()
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateVariant(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    // @ts-expect-error: This is for testing purposes.
    expect(generateVariant('string')).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateVariant(123)).toBeUndefined()
    expect(generateVariant(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateVariant(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateVariant([])).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with all properties', () => {
    const value = {
      type: 'Loafer',
      vendor: 'Example Shoes',
      tags: ['Category: Shoe', 'SP23'],
      variants: [
        {
          title: '6 / Blush Suede',
          price: { value: 189, currency: 'USD' },
          sku: '26996032',
          grams: 454,
        },
        {
          title: '6.5 / Blush Suede',
          price: { value: 189, currency: 'USD' },
          sku: '27061568',
          grams: 454,
        },
      ],
    }
    const expected = {
      'shopify:type': 'Loafer',
      'shopify:vendor': 'Example Shoes',
      'shopify:tag': ['Category: Shoe', 'SP23'],
      'shopify:variant': [
        {
          title: '6 / Blush Suede',
          'shopify:price': { '#text': 189, '@currency': 'USD' },
          'shopify:sku': '26996032',
          'shopify:grams': 454,
        },
        {
          title: '6.5 / Blush Suede',
          'shopify:price': { '#text': 189, '@currency': 'USD' },
          'shopify:sku': '27061568',
          'shopify:grams': 454,
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only type', () => {
    const value = {
      type: 'Necklace',
    }
    const expected = {
      'shopify:type': 'Necklace',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with only tags', () => {
    const value = {
      tags: ['All'],
    }
    const expected = {
      'shopify:tag': ['All'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should skip empty tags and variants', () => {
    const value = {
      tags: ['', 'All'],
      variants: [{}, { title: 'Default Title' }],
    }
    const expected = {
      'shopify:tag': ['All'],
      'shopify:variant': [{ title: 'Default Title' }],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty arrays', () => {
    const value = {
      type: 'Necklace',
      tags: [],
      variants: [],
    }
    const expected = {
      'shopify:type': 'Necklace',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      type: '',
      vendor: 'Example Shop',
    }
    const expected = {
      'shopify:vendor': 'Example Shop',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      type: '   ',
      vendor: '\t\n',
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
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem([])).toBeUndefined()
  })
})
