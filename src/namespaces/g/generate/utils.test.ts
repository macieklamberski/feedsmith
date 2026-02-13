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
      handlingCutoffTimezone: 'America/New_York',
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
      'g:handling_cutoff_timezone': 'America/New_York',
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
      'g:disable_delivery_after_cutoff': true,
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
      'g:disable_delivery_after_cutoff': false,
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
  it('should generate item with all properties', () => {
    const value = {
      id: 'SKU123',
      title: 'Example Product',
      description: 'A great product',
      link: 'https://example.com/product/123',
      mobileLink: 'https://m.example.com/product/123',
      canonicalLink: 'https://example.com/canonical/product/123',
      imageLink: 'https://example.com/image.jpg',
      additionalImageLinks: ['https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
      lifestyleImageLinks: [
        'https://example.com/lifestyle1.jpg',
        'https://example.com/lifestyle2.jpg',
      ],
      price: '19.99 USD',
      salePrice: '14.99 USD',
      salePriceEffectiveDate: '2024-01-01T00:00:00Z/2024-01-31T23:59:59Z',
      costOfGoodsSold: '8.50 USD',
      maximumRetailPrice: '24.99 USD',
      availability: 'in_stock',
      availabilityDate: '2024-01-15T00:00:00Z',
      expirationDate: '2025-01-15T00:00:00Z',
      pause: 'ads',
      brand: 'ExampleBrand',
      gtin: '1234567890123',
      mpn: 'MPN-12345',
      identifierExists: true,
      googleProductCategory: 'Electronics > Phones > Smartphones',
      productTypes: ['Electronics', 'Phones', 'Smartphones'],
      condition: 'new',
      productLength: '20 cm',
      productWidth: '10 cm',
      productHeight: '5 cm',
      productWeight: '500 g',
      itemGroupId: 'GROUP123',
      color: 'Blue',
      size: 'M',
      sizeType: 'regular',
      sizeSystem: 'US',
      gender: 'unisex',
      ageGroup: 'adult',
      material: 'Cotton',
      pattern: 'Solid',
      shippings: [
        { country: 'US', price: '5.99 USD' },
        { country: 'CA', price: '9.99 USD' },
      ],
      shippingLabel: 'standard',
      shippingWeight: '1.5 kg',
      shippingLength: '30 cm',
      shippingWidth: '20 cm',
      shippingHeight: '10 cm',
      shipsFromCountry: 'US',
      transitTimeLabel: 'express',
      maxHandlingTime: 2,
      minHandlingTime: 0,
      freeShippingThresholds: [{ country: 'US', priceThreshold: '50.00 USD' }],
      handlingCutoffTimes: [
        {
          cutoffTime: '1400',
          cutoffTimezone: 'America/New_York',
          country: 'US',
          disableDeliveryAfterCutoff: true,
        },
      ],
      shippingHandlingBusinessDays: 'MTWRF',
      shippingTransitBusinessDays: 'MTWRFS',
      taxes: [{ country: 'US', region: 'CA', rate: '9.5', taxShip: true }],
      taxCategory: 'Electronics',
      unitPricingMeasure: '100ml',
      unitPricingBaseMeasure: '100ml',
      multipack: 6,
      isBundle: true,
      adult: false,
      energyEfficiencyClass: 'A++',
      minEnergyEfficiencyClass: 'A',
      maxEnergyEfficiencyClass: 'A+++',
      certifications: [
        {
          certificationAuthority: 'European Commission',
          certificationName: 'EPREL',
          certificationCode: '123456',
          certificationValue: 'A++',
        },
      ],
      installment: {
        months: 12,
        amount: '99.99 BRL',
        downpayment: '199.99 BRL',
        creditType: 'finance',
      },
      subscriptionCost: {
        period: 'month',
        periodLength: 1,
        amount: '9.99 USD',
      },
      loyaltyPrograms: [
        {
          programLabel: 'rewards',
          tierLabel: 'gold',
          price: '49.99 USD',
          loyaltyPoints: 500,
          memberPriceEffectiveDate: '2024-01-01T00:00:00Z/2024-12-31T23:59:59Z',
          shippingLabel: 'free_member_shipping',
          cashbackForFutureUse: '5.00 USD',
        },
      ],
      productHighlights: ['Feature 1', 'Feature 2', 'Feature 3'],
      productDetails: [
        {
          sectionName: 'Display',
          attributeName: 'Screen Size',
          attributeValue: '6.1 inches',
        },
      ],
      returnPolicyLabel: '30-day-returns',
      adsRedirect: 'https://example.com/track?id=123',
      customLabel0: 'Best Seller',
      customLabel1: 'Summer',
      customLabel2: 'Clearance',
      customLabel3: 'Premium',
      customLabel4: 'New Arrival',
      promotionIds: ['PROMO1', 'PROMO2'],
      excludedDestinations: ['Display_Ads'],
      includedDestinations: ['Shopping_Actions', 'Shopping_Ads'],
      shoppingAdsExcludedCountries: ['DE', 'FR'],
      displayAdsId: 'display-123',
      displayAdsTitle: 'Custom Display Title',
      displayAdsLink: 'https://example.com/display/123',
      displayAdsValue: 9.99,
      displayAdsSimilarIds: ['similar1', 'similar2'],
      adsGrouping: 'group-electronics',
      adsLabels: ['label1', 'label2'],
      structuredTitle: {
        digitalSourceType: 'trained_algorithmic_media',
        content: 'AI-Enhanced Product Title',
      },
      structuredDescription: {
        digitalSourceType: 'trained_algorithmic_media',
        content: 'AI-Enhanced Product Description',
      },
      pickupMethod: 'buy',
      pickupSla: 'same_day',
      sellOnGoogleQuantity: 10,
      linkTemplate: 'https://example.com/product/{store_code}/123',
      mobileLinkTemplate: 'https://m.example.com/product/{store_code}/123',
      autoPricingMinPrice: '12.99 USD',
      externalSellerId: 'seller-456',
      virtualModelLink: 'https://example.com/virtual-model/123',
      disclosureDate: '2024-06-01T00:00:00Z',
    }
    const expected = {
      'g:id': 'SKU123',
      'g:title': 'Example Product',
      'g:description': 'A great product',
      'g:link': 'https://example.com/product/123',
      'g:mobile_link': 'https://m.example.com/product/123',
      'g:canonical_link': 'https://example.com/canonical/product/123',
      'g:image_link': 'https://example.com/image.jpg',
      'g:additional_image_link': [
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
      ],
      'g:lifestyle_image_link': [
        'https://example.com/lifestyle1.jpg',
        'https://example.com/lifestyle2.jpg',
      ],
      'g:price': '19.99 USD',
      'g:sale_price': '14.99 USD',
      'g:sale_price_effective_date': '2024-01-01T00:00:00Z/2024-01-31T23:59:59Z',
      'g:cost_of_goods_sold': '8.50 USD',
      'g:maximum_retail_price': '24.99 USD',
      'g:availability': 'in_stock',
      'g:availability_date': '2024-01-15T00:00:00Z',
      'g:expiration_date': '2025-01-15T00:00:00Z',
      'g:pause': 'ads',
      'g:brand': 'ExampleBrand',
      'g:gtin': '1234567890123',
      'g:mpn': 'MPN-12345',
      'g:identifier_exists': 'yes',
      'g:google_product_category': { '#cdata': 'Electronics > Phones > Smartphones' },
      'g:product_type': ['Electronics', 'Phones', 'Smartphones'],
      'g:condition': 'new',
      'g:product_length': '20 cm',
      'g:product_width': '10 cm',
      'g:product_height': '5 cm',
      'g:product_weight': '500 g',
      'g:item_group_id': 'GROUP123',
      'g:color': 'Blue',
      'g:size': 'M',
      'g:size_type': 'regular',
      'g:size_system': 'US',
      'g:gender': 'unisex',
      'g:age_group': 'adult',
      'g:material': 'Cotton',
      'g:pattern': 'Solid',
      'g:shipping': [
        { 'g:country': 'US', 'g:price': '5.99 USD' },
        { 'g:country': 'CA', 'g:price': '9.99 USD' },
      ],
      'g:shipping_label': 'standard',
      'g:shipping_weight': '1.5 kg',
      'g:shipping_length': '30 cm',
      'g:shipping_width': '20 cm',
      'g:shipping_height': '10 cm',
      'g:ships_from_country': 'US',
      'g:transit_time_label': 'express',
      'g:max_handling_time': 2,
      'g:min_handling_time': 0,
      'g:free_shipping_threshold': [{ 'g:country': 'US', 'g:price_threshold': '50.00 USD' }],
      'g:handling_cutoff_time': [
        {
          'g:cutoff_time': '1400',
          'g:cutoff_timezone': 'America/New_York',
          'g:country': 'US',
          'g:disable_delivery_after_cutoff': true,
        },
      ],
      'g:shipping_handling_business_days': 'MTWRF',
      'g:shipping_transit_business_days': 'MTWRFS',
      'g:tax': [
        {
          'g:country': 'US',
          'g:region': 'CA',
          'g:rate': '9.5',
          'g:tax_ship': 'yes',
        },
      ],
      'g:tax_category': 'Electronics',
      'g:unit_pricing_measure': '100ml',
      'g:unit_pricing_base_measure': '100ml',
      'g:multipack': 6,
      'g:is_bundle': 'yes',
      'g:adult': 'no',
      'g:energy_efficiency_class': 'A++',
      'g:min_energy_efficiency_class': 'A',
      'g:max_energy_efficiency_class': 'A+++',
      'g:certification': [
        {
          'g:certification_authority': 'European Commission',
          'g:certification_name': 'EPREL',
          'g:certification_code': '123456',
          'g:certification_value': 'A++',
        },
      ],
      'g:installment': {
        'g:months': 12,
        'g:amount': '99.99 BRL',
        'g:downpayment': '199.99 BRL',
        'g:credit_type': 'finance',
      },
      'g:subscription_cost': {
        'g:period': 'month',
        'g:period_length': 1,
        'g:amount': '9.99 USD',
      },
      'g:loyalty_program': [
        {
          'g:program_label': 'rewards',
          'g:tier_label': 'gold',
          'g:price': '49.99 USD',
          'g:loyalty_points': 500,
          'g:member_price_effective_date': '2024-01-01T00:00:00Z/2024-12-31T23:59:59Z',
          'g:shipping_label': 'free_member_shipping',
          'g:cashback_for_future_use': '5.00 USD',
        },
      ],
      'g:product_highlight': ['Feature 1', 'Feature 2', 'Feature 3'],
      'g:product_detail': [
        {
          'g:section_name': 'Display',
          'g:attribute_name': 'Screen Size',
          'g:attribute_value': '6.1 inches',
        },
      ],
      'g:return_policy_label': '30-day-returns',
      'g:ads_redirect': 'https://example.com/track?id=123',
      'g:custom_label_0': 'Best Seller',
      'g:custom_label_1': 'Summer',
      'g:custom_label_2': 'Clearance',
      'g:custom_label_3': 'Premium',
      'g:custom_label_4': 'New Arrival',
      'g:promotion_id': ['PROMO1', 'PROMO2'],
      'g:excluded_destination': ['Display_Ads'],
      'g:included_destination': ['Shopping_Actions', 'Shopping_Ads'],
      'g:shopping_ads_excluded_country': ['DE', 'FR'],
      'g:display_ads_id': 'display-123',
      'g:display_ads_title': 'Custom Display Title',
      'g:display_ads_link': 'https://example.com/display/123',
      'g:display_ads_value': 9.99,
      'g:display_ads_similar_id': ['similar1', 'similar2'],
      'g:ads_grouping': 'group-electronics',
      'g:ads_labels': ['label1', 'label2'],
      'g:structured_title': {
        'g:digital_source_type': 'trained_algorithmic_media',
        'g:content': 'AI-Enhanced Product Title',
      },
      'g:structured_description': {
        'g:digital_source_type': 'trained_algorithmic_media',
        'g:content': 'AI-Enhanced Product Description',
      },
      'g:pickup_method': 'buy',
      'g:pickup_SLA': 'same_day',
      'g:sell_on_google_quantity': 10,
      'g:link_template': 'https://example.com/product/{store_code}/123',
      'g:mobile_link_template': 'https://m.example.com/product/{store_code}/123',
      'g:auto_pricing_min_price': '12.99 USD',
      'g:external_seller_id': 'seller-456',
      'g:virtual_model_link': 'https://example.com/virtual-model/123',
      'g:disclosure_date': '2024-06-01T00:00:00Z',
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
