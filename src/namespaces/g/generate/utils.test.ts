import { describe, expect, it } from 'bun:test'
import {
  generateCertification,
  generateFreeShippingThreshold,
  generateHandlingCutoffTime,
  generateInstallment,
  generateItem,
  generateLoyaltyProgram,
  generateProductDetail,
  generateShipping,
  generateStructuredContent,
  generateSubscriptionCost,
  generateTax,
} from './utils.js'

describe('generateShipping', () => {
  it('should generate shipping with all properties', () => {
    const value = {
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
    }
    const expected = {
      'g:country': 'US',
      'g:region': 'CA',
      'g:postal_code': '90210',
      'g:location_id': '12345',
      'g:location_group_name': 'West Coast',
      'g:service': 'Standard',
      'g:price': '5.99 USD',
      'g:min_handling_time': 0,
      'g:max_handling_time': 1,
      'g:min_transit_time': 2,
      'g:max_transit_time': 5,
      'g:handling_cutoff_time': '1400',
    }

    expect(generateShipping(value)).toEqual(expected)
  })

  it('should generate shipping with minimal properties', () => {
    const value = {
      country: 'US',
      price: '0 USD',
    }
    const expected = {
      'g:country': 'US',
      'g:price': '0 USD',
    }

    expect(generateShipping(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateShipping(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateShipping(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateShipping(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateShipping('string')).toBeUndefined()
  })
})

describe('generateFreeShippingThreshold', () => {
  it('should generate threshold with all properties', () => {
    const value = {
      country: 'US',
      priceThreshold: '50.00 USD',
    }
    const expected = {
      'g:country': 'US',
      'g:price_threshold': '50.00 USD',
    }

    expect(generateFreeShippingThreshold(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateFreeShippingThreshold(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateFreeShippingThreshold(undefined)).toBeUndefined()
  })
})

describe('generateHandlingCutoffTime', () => {
  it('should generate handling cutoff time with all properties', () => {
    const value = {
      cutoffTime: '1400',
      cutoffTimezone: 'America/Los_Angeles',
      country: 'US',
      disableDeliveryAfterCutoff: true,
    }
    const expected = {
      'g:cutoff_time': '1400',
      'g:cutoff_timezone': 'America/Los_Angeles',
      'g:country': 'US',
      'g:disable_delivery_after_cutoff': 'yes',
    }

    expect(generateHandlingCutoffTime(value)).toEqual(expected)
  })

  it('should generate handling cutoff time with boolean false', () => {
    const value = {
      cutoffTime: '0900',
      disableDeliveryAfterCutoff: false,
    }
    const expected = {
      'g:cutoff_time': '0900',
      'g:disable_delivery_after_cutoff': 'no',
    }

    expect(generateHandlingCutoffTime(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateHandlingCutoffTime(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateHandlingCutoffTime(undefined)).toBeUndefined()
  })
})

describe('generateTax', () => {
  it('should generate tax with all properties', () => {
    const value = {
      country: 'US',
      region: 'CA',
      postalCode: '90210',
      locationId: '12345',
      rate: '9.5',
      taxShip: true,
    }
    const expected = {
      'g:country': 'US',
      'g:region': 'CA',
      'g:postal_code': '90210',
      'g:location_id': '12345',
      'g:rate': '9.5',
      'g:tax_ship': 'yes',
    }

    expect(generateTax(value)).toEqual(expected)
  })

  it('should generate tax with tax_ship as no', () => {
    const value = {
      country: 'US',
      taxShip: false,
    }
    const expected = {
      'g:country': 'US',
      'g:tax_ship': 'no',
    }

    expect(generateTax(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateTax(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateTax(undefined)).toBeUndefined()
  })
})

describe('generateInstallment', () => {
  it('should generate installment with all properties', () => {
    const value = {
      months: 12,
      amount: '99.99 BRL',
      downpayment: '199.99 BRL',
      creditType: 'finance',
    }
    const expected = {
      'g:months': 12,
      'g:amount': '99.99 BRL',
      'g:downpayment': '199.99 BRL',
      'g:credit_type': 'finance',
    }

    expect(generateInstallment(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateInstallment(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateInstallment(undefined)).toBeUndefined()
  })
})

describe('generateSubscriptionCost', () => {
  it('should generate subscription cost with all properties', () => {
    const value = {
      period: 'month',
      periodLength: 1,
      amount: '9.99 USD',
    }
    const expected = {
      'g:period': 'month',
      'g:period_length': 1,
      'g:amount': '9.99 USD',
    }

    expect(generateSubscriptionCost(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateSubscriptionCost(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateSubscriptionCost(undefined)).toBeUndefined()
  })
})

describe('generateLoyaltyProgram', () => {
  it('should generate loyalty program with all properties', () => {
    const value = {
      programLabel: 'myrewards',
      tierLabel: 'gold',
      price: '49.99 USD',
      loyaltyPoints: 500,
      memberPriceEffectiveDate: '2024-01-01T00:00:00Z/2024-12-31T23:59:59Z',
      shippingLabel: 'free_member_shipping',
      cashbackForFutureUse: '5.00 USD',
    }
    const expected = {
      'g:program_label': 'myrewards',
      'g:tier_label': 'gold',
      'g:price': '49.99 USD',
      'g:loyalty_points': 500,
      'g:member_price_effective_date': '2024-01-01T00:00:00Z/2024-12-31T23:59:59Z',
      'g:shipping_label': 'free_member_shipping',
      'g:cashback_for_future_use': '5.00 USD',
    }

    expect(generateLoyaltyProgram(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateLoyaltyProgram(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateLoyaltyProgram(undefined)).toBeUndefined()
  })
})

describe('generateProductDetail', () => {
  it('should generate product detail with all properties', () => {
    const value = {
      sectionName: 'Technical Specifications',
      attributeName: 'Screen Size',
      attributeValue: '6.1 inches',
    }
    const expected = {
      'g:section_name': 'Technical Specifications',
      'g:attribute_name': 'Screen Size',
      'g:attribute_value': '6.1 inches',
    }

    expect(generateProductDetail(value)).toEqual(expected)
  })

  it('should generate product detail without section name', () => {
    const value = {
      attributeName: 'Color',
      attributeValue: 'Black',
    }
    const expected = {
      'g:attribute_name': 'Color',
      'g:attribute_value': 'Black',
    }

    expect(generateProductDetail(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateProductDetail(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateProductDetail(undefined)).toBeUndefined()
  })
})

describe('generateCertification', () => {
  it('should generate certification with all properties', () => {
    const value = {
      certificationAuthority: 'European Commission',
      certificationName: 'EPREL',
      certificationCode: '123456',
      certificationValue: 'A++',
    }
    const expected = {
      'g:certification_authority': 'European Commission',
      'g:certification_name': 'EPREL',
      'g:certification_code': '123456',
      'g:certification_value': 'A++',
    }

    expect(generateCertification(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateCertification(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateCertification(undefined)).toBeUndefined()
  })
})

describe('generateStructuredContent', () => {
  it('should generate structured content with all properties', () => {
    const value = {
      digitalSourceType: 'trained_algorithmic_media',
      content: 'AI-generated product title',
    }
    const expected = {
      'g:digital_source_type': 'trained_algorithmic_media',
      'g:content': 'AI-generated product title',
    }

    expect(generateStructuredContent(value)).toEqual(expected)
  })

  it('should generate structured content with only content', () => {
    const value = {
      content: 'Product description',
    }
    const expected = {
      'g:content': 'Product description',
    }

    expect(generateStructuredContent(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateStructuredContent(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateStructuredContent(undefined)).toBeUndefined()
  })
})

describe('generateItem', () => {
  it('should generate item with basic product data', () => {
    const value = {
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
    const expected = {
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

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with identifiers', () => {
    const value = {
      id: 'SKU123',
      gtin: '1234567890123',
      mpn: 'MPN-12345',
      identifierExists: true,
    }
    const expected = {
      'g:id': 'SKU123',
      'g:gtin': '1234567890123',
      'g:mpn': 'MPN-12345',
      'g:identifier_exists': 'yes',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with identifier_exists as no', () => {
    const value = {
      id: 'SKU123',
      identifierExists: false,
    }
    const expected = {
      'g:id': 'SKU123',
      'g:identifier_exists': 'no',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with apparel attributes', () => {
    const value = {
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
    const expected = {
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

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with shipping data', () => {
    const value = {
      id: 'SKU123',
      shippings: [
        { country: 'US', price: '5.99 USD' },
        { country: 'CA', price: '9.99 USD' },
      ],
      shippingLabel: 'standard',
      shippingWeight: '1.5 kg',
      shipsFromCountry: 'US',
    }
    const expected = {
      'g:id': 'SKU123',
      'g:shipping': [
        { 'g:country': 'US', 'g:price': '5.99 USD' },
        { 'g:country': 'CA', 'g:price': '9.99 USD' },
      ],
      'g:shipping_label': 'standard',
      'g:shipping_weight': '1.5 kg',
      'g:ships_from_country': 'US',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with taxes', () => {
    const value = {
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
    const expected = {
      'g:id': 'SKU123',
      'g:tax': [
        {
          'g:country': 'US',
          'g:region': 'CA',
          'g:rate': '9.5',
          'g:tax_ship': 'yes',
        },
      ],
      'g:tax_category': 'Electronics',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with product details', () => {
    const value = {
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
    const expected = {
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

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with shopping campaign data', () => {
    const value = {
      id: 'SKU123',
      adsRedirect: 'https://example.com/track?id=123',
      customLabel0: 'Best Seller',
      customLabel1: 'Summer',
      promotionIds: ['PROMO1', 'PROMO2'],
      excludedDestinations: ['Display_Ads'],
      includedDestinations: ['Shopping_Actions', 'Shopping_Ads'],
    }
    const expected = {
      'g:id': 'SKU123',
      'g:ads_redirect': 'https://example.com/track?id=123',
      'g:custom_label_0': 'Best Seller',
      'g:custom_label_1': 'Summer',
      'g:promotion_id': ['PROMO1', 'PROMO2'],
      'g:excluded_destination': ['Display_Ads'],
      'g:included_destination': ['Shopping_Actions', 'Shopping_Ads'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with bundle and multipack', () => {
    const value = {
      id: 'SKU123',
      multipack: 6,
      isBundle: true,
    }
    const expected = {
      'g:id': 'SKU123',
      'g:multipack': 6,
      'g:is_bundle': 'yes',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with loyalty programs', () => {
    const value = {
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
    const expected = {
      'g:id': 'SKU123',
      'g:loyalty_program': [
        {
          'g:program_label': 'rewards',
          'g:tier_label': 'gold',
          'g:price': '49.99 USD',
          'g:loyalty_points': 500,
        },
        {
          'g:program_label': 'rewards',
          'g:tier_label': 'silver',
          'g:price': '54.99 USD',
          'g:loyalty_points': 300,
        },
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with structured content', () => {
    const value = {
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
    const expected = {
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

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with product types (multiple)', () => {
    const value = {
      id: 'SKU123',
      googleProductCategory: 'Electronics > Phones > Smartphones',
      productTypes: ['Electronics', 'Phones', 'Smartphones'],
    }
    const expected = {
      'g:id': 'SKU123',
      'g:google_product_category': { '#cdata': 'Electronics > Phones > Smartphones' },
      'g:product_type': ['Electronics', 'Phones', 'Smartphones'],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should generate item with additional image links', () => {
    const value = {
      id: 'SKU123',
      imageLink: 'https://example.com/image1.jpg',
      additionalImageLinks: ['https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
    }
    const expected = {
      'g:id': 'SKU123',
      'g:image_link': 'https://example.com/image1.jpg',
      'g:additional_image_link': [
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
      ],
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty strings', () => {
    const value = {
      id: 'SKU123',
      title: '',
      brand: '',
    }
    const expected = {
      'g:id': 'SKU123',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle whitespace-only strings', () => {
    const value = {
      id: 'SKU123',
      title: '   ',
    }
    const expected = {
      'g:id': 'SKU123',
    }

    expect(generateItem(value)).toEqual(expected)
  })

  it('should handle empty object', () => {
    const value = {}

    expect(generateItem(value)).toBeUndefined()
  })

  it('should handle non-object inputs', () => {
    expect(generateItem(undefined)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem(null)).toBeUndefined()
    // @ts-expect-error: This is for testing purposes.
    expect(generateItem('string')).toBeUndefined()
  })
})
