import { describe, expect, it } from 'bun:test'
import {
  parseCertification,
  parseFreeShippingThreshold,
  parseHandlingCutoffTime,
  parseInstallment,
  parseLoyaltyProgram,
  parseProductDetail,
  parseShipping,
  parseStructuredContent,
  parseSubscriptionCost,
  parseTax,
  retrieveItem,
} from './utils.js'

describe('parseShipping', () => {
  it('should parse shipping with all properties', () => {
    const value = {
      'g:country': 'US',
      'g:region': 'CA',
      'g:postal_code': '90210',
      'g:location_id': '12345',
      'g:location_group_name': 'West Coast',
      'g:service': 'Standard',
      'g:price': '5.99 USD',
      'g:min_handling_time': '0',
      'g:max_handling_time': '1',
      'g:min_transit_time': '2',
      'g:max_transit_time': '5',
      'g:handling_cutoff_time': '1400',
      'g:handling_cutoff_timezone': 'America/New_York',
    }
    const expected = {
      country: 'US',
      region: 'CA',
      postalCode: '90210',
      locationId: '12345',
      locationGroupName: 'West Coast',
      service: 'Standard',
      price: '5.99 USD',
      minHandlingTime: 0,
      maxHandlingTime: 1,
      minTransitTime: 2,
      maxTransitTime: 5,
      handlingCutoffTime: '1400',
      handlingCutoffTimezone: 'America/New_York',
    }

    expect(parseShipping(value)).toEqual(expected)
  })

  it('should parse shipping with minimal properties', () => {
    const value = {
      'g:country': 'US',
      'g:price': '0 USD',
    }
    const expected = {
      country: 'US',
      price: '0 USD',
    }

    expect(parseShipping(value)).toEqual(expected)
  })

  it('should handle #text wrapper', () => {
    const value = {
      'g:country': { '#text': 'US' },
      'g:price': { '#text': '5.99 USD' },
    }
    const expected = {
      country: 'US',
      price: '5.99 USD',
    }

    expect(parseShipping(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseShipping(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseShipping(null)).toBeUndefined()
    expect(parseShipping(undefined)).toBeUndefined()
    expect(parseShipping('string')).toBeUndefined()
    expect(parseShipping(123)).toBeUndefined()
  })
})

describe('parseFreeShippingThreshold', () => {
  it('should parse threshold with all properties', () => {
    const value = {
      'g:country': 'US',
      'g:price_threshold': '50.00 USD',
    }
    const expected = {
      country: 'US',
      priceThreshold: '50.00 USD',
    }

    expect(parseFreeShippingThreshold(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseFreeShippingThreshold(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseFreeShippingThreshold(null)).toBeUndefined()
    expect(parseFreeShippingThreshold(undefined)).toBeUndefined()
  })
})

describe('parseHandlingCutoffTime', () => {
  it('should parse handling cutoff time with all properties', () => {
    const value = {
      'g:cutoff_time': '1400',
      'g:cutoff_timezone': 'America/Los_Angeles',
      'g:country': 'US',
      'g:disable_delivery_after_cutoff': 'yes',
    }
    const expected = {
      cutoffTime: '1400',
      cutoffTimezone: 'America/Los_Angeles',
      country: 'US',
      disableDeliveryAfterCutoff: true,
    }

    expect(parseHandlingCutoffTime(value)).toEqual(expected)
  })

  it('should parse handling cutoff time with boolean false', () => {
    const value = {
      'g:cutoff_time': '0900',
      'g:disable_delivery_after_cutoff': 'no',
    }
    const expected = {
      cutoffTime: '0900',
      disableDeliveryAfterCutoff: false,
    }

    expect(parseHandlingCutoffTime(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseHandlingCutoffTime(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseHandlingCutoffTime(null)).toBeUndefined()
    expect(parseHandlingCutoffTime(undefined)).toBeUndefined()
  })
})

describe('parseTax', () => {
  it('should parse tax with all properties', () => {
    const value = {
      'g:country': 'US',
      'g:region': 'CA',
      'g:postal_code': '90210',
      'g:location_id': '12345',
      'g:rate': '9.5',
      'g:tax_ship': 'yes',
    }
    const expected = {
      country: 'US',
      region: 'CA',
      postalCode: '90210',
      locationId: '12345',
      rate: '9.5',
      taxShip: true,
    }

    expect(parseTax(value)).toEqual(expected)
  })

  it('should parse tax with tax_ship as no', () => {
    const value = {
      'g:country': 'US',
      'g:tax_ship': 'no',
    }
    const expected = {
      country: 'US',
      taxShip: false,
    }

    expect(parseTax(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseTax(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseTax(null)).toBeUndefined()
    expect(parseTax(undefined)).toBeUndefined()
  })
})

describe('parseInstallment', () => {
  it('should parse installment with all properties', () => {
    const value = {
      'g:months': '12',
      'g:amount': '99.99 BRL',
      'g:downpayment': '199.99 BRL',
      'g:credit_type': 'finance',
    }
    const expected = {
      months: 12,
      amount: '99.99 BRL',
      downpayment: '199.99 BRL',
      creditType: 'finance',
    }

    expect(parseInstallment(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseInstallment(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseInstallment(null)).toBeUndefined()
    expect(parseInstallment(undefined)).toBeUndefined()
  })
})

describe('parseSubscriptionCost', () => {
  it('should parse subscription cost with all properties', () => {
    const value = {
      'g:period': 'month',
      'g:period_length': '1',
      'g:amount': '9.99 USD',
    }
    const expected = {
      period: 'month',
      periodLength: 1,
      amount: '9.99 USD',
    }

    expect(parseSubscriptionCost(value)).toEqual(expected)
  })

  it('should handle different period values', () => {
    const values = ['week', 'month', 'year']

    for (const period of values) {
      const value = { 'g:period': period }
      const expected = { period }

      expect(parseSubscriptionCost(value)).toEqual(expected)
    }
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseSubscriptionCost(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseSubscriptionCost(null)).toBeUndefined()
    expect(parseSubscriptionCost(undefined)).toBeUndefined()
  })
})

describe('parseLoyaltyProgram', () => {
  it('should parse loyalty program with all properties', () => {
    const value = {
      'g:program_label': 'myrewards',
      'g:tier_label': 'gold',
      'g:price': '49.99 USD',
      'g:loyalty_points': '500',
      'g:member_price_effective_date': '2024-01-01T00:00:00Z/2024-12-31T23:59:59Z',
      'g:shipping_label': 'free_member_shipping',
      'g:cashback_for_future_use': '5.00 USD',
    }
    const expected = {
      programLabel: 'myrewards',
      tierLabel: 'gold',
      price: '49.99 USD',
      loyaltyPoints: 500,
      memberPriceEffectiveDate: '2024-01-01T00:00:00Z/2024-12-31T23:59:59Z',
      shippingLabel: 'free_member_shipping',
      cashbackForFutureUse: '5.00 USD',
    }

    expect(parseLoyaltyProgram(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseLoyaltyProgram(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseLoyaltyProgram(null)).toBeUndefined()
    expect(parseLoyaltyProgram(undefined)).toBeUndefined()
  })
})

describe('parseProductDetail', () => {
  it('should parse product detail with all properties', () => {
    const value = {
      'g:section_name': 'Technical Specifications',
      'g:attribute_name': 'Screen Size',
      'g:attribute_value': '6.1 inches',
    }
    const expected = {
      sectionName: 'Technical Specifications',
      attributeName: 'Screen Size',
      attributeValue: '6.1 inches',
    }

    expect(parseProductDetail(value)).toEqual(expected)
  })

  it('should parse product detail without section name', () => {
    const value = {
      'g:attribute_name': 'Color',
      'g:attribute_value': 'Black',
    }
    const expected = {
      attributeName: 'Color',
      attributeValue: 'Black',
    }

    expect(parseProductDetail(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseProductDetail(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseProductDetail(null)).toBeUndefined()
    expect(parseProductDetail(undefined)).toBeUndefined()
  })
})

describe('parseCertification', () => {
  it('should parse certification with all properties', () => {
    const value = {
      'g:certification_authority': 'European Commission',
      'g:certification_name': 'EPREL',
      'g:certification_code': '123456',
      'g:certification_value': 'A++',
    }
    const expected = {
      certificationAuthority: 'European Commission',
      certificationName: 'EPREL',
      certificationCode: '123456',
      certificationValue: 'A++',
    }

    expect(parseCertification(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseCertification(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseCertification(null)).toBeUndefined()
    expect(parseCertification(undefined)).toBeUndefined()
  })
})

describe('parseStructuredContent', () => {
  it('should parse structured content with all properties', () => {
    const value = {
      'g:digital_source_type': 'trained_algorithmic_media',
      'g:content': 'AI-generated product title',
    }
    const expected = {
      digitalSourceType: 'trained_algorithmic_media',
      content: 'AI-generated product title',
    }

    expect(parseStructuredContent(value)).toEqual(expected)
  })

  it('should parse structured content with only content', () => {
    const value = {
      'g:content': 'Product description',
    }
    const expected = {
      content: 'Product description',
    }

    expect(parseStructuredContent(value)).toEqual(expected)
  })

  it('should return undefined for empty object', () => {
    const value = {}

    expect(parseStructuredContent(value)).toBeUndefined()
  })

  it('should return undefined for non-object input', () => {
    expect(parseStructuredContent(null)).toBeUndefined()
    expect(parseStructuredContent(undefined)).toBeUndefined()
  })
})

describe('retrieveItem', () => {
  it('should parse item with basic product data', () => {
    const value = {
      'g:id': 'SKU123',
      'g:title': 'Example Product',
      'g:description': 'A great product',
      'g:link': 'https://example.com/product/123',
      'g:image_link': 'https://example.com/image.jpg',
      'g:price': '19.99 USD',
      'g:availability': 'in_stock',
      'g:brand': 'ExampleBrand',
      'g:condition': 'new',
    }
    const expected = {
      id: 'SKU123',
      title: 'Example Product',
      description: 'A great product',
      link: 'https://example.com/product/123',
      imageLink: 'https://example.com/image.jpg',
      price: '19.99 USD',
      availability: 'in_stock',
      brand: 'ExampleBrand',
      condition: 'new',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with identifiers', () => {
    const value = {
      'g:id': 'SKU123',
      'g:gtin': '1234567890123',
      'g:mpn': 'MPN-12345',
      'g:identifier_exists': 'yes',
    }
    const expected = {
      id: 'SKU123',
      gtin: '1234567890123',
      mpn: 'MPN-12345',
      identifierExists: true,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with apparel attributes', () => {
    const value = {
      'g:id': 'SKU123',
      'g:item_group_id': 'GROUP123',
      'g:color': 'Blue',
      'g:size': 'M',
      'g:size_type': 'regular',
      'g:size_system': 'US',
      'g:gender': 'unisex',
      'g:age_group': 'adult',
      'g:material': 'Cotton',
      'g:pattern': 'Solid',
    }
    const expected = {
      id: 'SKU123',
      itemGroupId: 'GROUP123',
      color: 'Blue',
      size: 'M',
      sizeType: 'regular',
      sizeSystem: 'US',
      gender: 'unisex',
      ageGroup: 'adult',
      material: 'Cotton',
      pattern: 'Solid',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with shipping data', () => {
    const value = {
      'g:id': 'SKU123',
      'g:shipping': [
        {
          'g:country': 'US',
          'g:price': '5.99 USD',
        },
        {
          'g:country': 'CA',
          'g:price': '9.99 USD',
        },
      ],
      'g:shipping_label': 'standard',
      'g:shipping_weight': '1.5 kg',
      'g:ships_from_country': 'US',
    }
    const expected = {
      id: 'SKU123',
      shippings: [
        { country: 'US', price: '5.99 USD' },
        { country: 'CA', price: '9.99 USD' },
      ],
      shippingLabel: 'standard',
      shippingWeight: '1.5 kg',
      shipsFromCountry: 'US',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with taxes', () => {
    const value = {
      'g:id': 'SKU123',
      'g:tax': {
        'g:country': 'US',
        'g:region': 'CA',
        'g:rate': '9.5',
        'g:tax_ship': 'yes',
      },
      'g:tax_category': 'Electronics',
    }
    const expected = {
      id: 'SKU123',
      taxes: [
        {
          country: 'US',
          region: 'CA',
          rate: '9.5',
          taxShip: true,
        },
      ],
      taxCategory: 'Electronics',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with product details', () => {
    const value = {
      'g:id': 'SKU123',
      'g:product_detail': [
        {
          'g:section_name': 'Display',
          'g:attribute_name': 'Screen Size',
          'g:attribute_value': '6.1 inches',
        },
        {
          'g:attribute_name': 'Resolution',
          'g:attribute_value': '1080x2400',
        },
      ],
      'g:product_highlight': ['Feature 1', 'Feature 2', 'Feature 3'],
    }
    const expected = {
      id: 'SKU123',
      productDetails: [
        {
          sectionName: 'Display',
          attributeName: 'Screen Size',
          attributeValue: '6.1 inches',
        },
        {
          attributeName: 'Resolution',
          attributeValue: '1080x2400',
        },
      ],
      productHighlights: ['Feature 1', 'Feature 2', 'Feature 3'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with shopping campaign data', () => {
    const value = {
      'g:id': 'SKU123',
      'g:ads_redirect': 'https://example.com/track?id=123',
      'g:custom_label_0': 'Best Seller',
      'g:custom_label_1': 'Summer',
      'g:promotion_id': ['PROMO1', 'PROMO2'],
      'g:excluded_destination': ['Display_Ads'],
      'g:included_destination': ['Shopping_Actions', 'Shopping_Ads'],
    }
    const expected = {
      id: 'SKU123',
      adsRedirect: 'https://example.com/track?id=123',
      customLabel0: 'Best Seller',
      customLabel1: 'Summer',
      promotionIds: ['PROMO1', 'PROMO2'],
      excludedDestinations: ['Display_Ads'],
      includedDestinations: ['Shopping_Actions', 'Shopping_Ads'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with bundle and multipack', () => {
    const value = {
      'g:id': 'SKU123',
      'g:multipack': '6',
      'g:is_bundle': 'yes',
    }
    const expected = {
      id: 'SKU123',
      multipack: 6,
      isBundle: true,
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with loyalty programs', () => {
    const value = {
      'g:id': 'SKU123',
      'g:loyalty_program': [
        {
          'g:program_label': 'rewards',
          'g:tier_label': 'gold',
          'g:price': '49.99 USD',
          'g:loyalty_points': '500',
        },
        {
          'g:program_label': 'rewards',
          'g:tier_label': 'silver',
          'g:price': '54.99 USD',
          'g:loyalty_points': '300',
        },
      ],
    }
    const expected = {
      id: 'SKU123',
      loyaltyPrograms: [
        {
          programLabel: 'rewards',
          tierLabel: 'gold',
          price: '49.99 USD',
          loyaltyPoints: 500,
        },
        {
          programLabel: 'rewards',
          tierLabel: 'silver',
          price: '54.99 USD',
          loyaltyPoints: 300,
        },
      ],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with structured content', () => {
    const value = {
      'g:id': 'SKU123',
      'g:structured_title': {
        'g:digital_source_type': 'trained_algorithmic_media',
        'g:content': 'AI-Enhanced Product Title',
      },
      'g:structured_description': {
        'g:digital_source_type': 'trained_algorithmic_media',
        'g:content': 'AI-Enhanced Product Description',
      },
    }
    const expected = {
      id: 'SKU123',
      structuredTitle: {
        digitalSourceType: 'trained_algorithmic_media',
        content: 'AI-Enhanced Product Title',
      },
      structuredDescription: {
        digitalSourceType: 'trained_algorithmic_media',
        content: 'AI-Enhanced Product Description',
      },
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with sale price and dates', () => {
    const value = {
      'g:id': 'SKU123',
      'g:price': '29.99 USD',
      'g:sale_price': '19.99 USD',
      'g:sale_price_effective_date': '2024-01-01T00:00:00Z/2024-01-31T23:59:59Z',
      'g:availability_date': '2024-02-01T00:00:00Z',
      'g:expiration_date': '2024-12-31T23:59:59Z',
    }
    const expected = {
      id: 'SKU123',
      price: '29.99 USD',
      salePrice: '19.99 USD',
      salePriceEffectiveDate: '2024-01-01T00:00:00Z/2024-01-31T23:59:59Z',
      availabilityDate: '2024-02-01T00:00:00Z',
      expirationDate: '2024-12-31T23:59:59Z',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with adult and pause flags', () => {
    const value = {
      'g:id': 'SKU123',
      'g:adult': 'no',
      'g:pause': 'ads',
    }
    const expected = {
      id: 'SKU123',
      adult: false,
      pause: 'ads',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should parse item with product types (multiple)', () => {
    const value = {
      'g:id': 'SKU123',
      'g:google_product_category': 'Electronics > Phones > Smartphones',
      'g:product_type': ['Electronics', 'Phones', 'Smartphones'],
    }
    const expected = {
      id: 'SKU123',
      googleProductCategory: 'Electronics > Phones > Smartphones',
      productTypes: ['Electronics', 'Phones', 'Smartphones'],
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle HTML entities in text content', () => {
    const value = {
      'g:id': 'SKU123',
      'g:title': { '#text': 'Product with &amp; special chars' },
      'g:description': { '#text': '&lt;strong&gt;Bold&lt;/strong&gt;' },
    }
    const expected = {
      id: 'SKU123',
      title: 'Product with & special chars',
      description: '<strong>Bold</strong>',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle CDATA sections in text content', () => {
    const value = {
      'g:id': 'SKU123',
      'g:title': { '#text': '<![CDATA[Product with <tags>]]>' },
    }
    const expected = {
      id: 'SKU123',
      title: 'Product with <tags>',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      'g:id': 'SKU123',
      'g:title': '',
      'g:brand': '',
    }
    const expected = {
      id: 'SKU123',
    }

    expect(retrieveItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      'g:id': 'SKU123',
      'g:title': '   ',
    }
    const expected = {
      id: 'SKU123',
    }

    expect(retrieveItem(value)).toEqual(expected)
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
