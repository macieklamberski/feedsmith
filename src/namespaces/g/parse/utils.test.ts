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
  it('should parse item with all properties', () => {
    const value = {
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
      'g:price': '29.99 USD',
      'g:sale_price': '19.99 USD',
      'g:sale_price_effective_date': '2024-01-01T00:00:00Z/2024-01-31T23:59:59Z',
      'g:cost_of_goods_sold': '10.00 USD',
      'g:maximum_retail_price': '39.99 USD',
      'g:availability': 'in_stock',
      'g:availability_date': '2024-02-01T00:00:00Z',
      'g:expiration_date': '2024-12-31T23:59:59Z',
      'g:pause': 'ads',
      'g:brand': 'ExampleBrand',
      'g:gtin': '1234567890123',
      'g:mpn': 'MPN-12345',
      'g:identifier_exists': 'yes',
      'g:google_product_category': 'Electronics',
      'g:product_type': ['Electronics', 'Phones'],
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
      'g:shipping': [{ 'g:country': 'US', 'g:price': '5.99 USD' }],
      'g:shipping_label': 'standard',
      'g:shipping_weight': '1.5 kg',
      'g:shipping_length': '25 cm',
      'g:shipping_width': '15 cm',
      'g:shipping_height': '10 cm',
      'g:ships_from_country': 'US',
      'g:transit_time_label': 'fast',
      'g:max_handling_time': '3',
      'g:min_handling_time': '1',
      'g:free_shipping_threshold': { 'g:country': 'US', 'g:price_threshold': '50.00 USD' },
      'g:handling_cutoff_time': {
        'g:cutoff_time': '1400',
        'g:cutoff_timezone': 'America/New_York',
        'g:country': 'US',
        'g:disable_delivery_after_cutoff': 'yes',
      },
      'g:shipping_handling_business_days': 'MTWRF',
      'g:shipping_transit_business_days': 'MTWRFS',
      'g:tax': { 'g:country': 'US', 'g:region': 'CA', 'g:rate': '9.5', 'g:tax_ship': 'yes' },
      'g:tax_category': 'Electronics',
      'g:unit_pricing_measure': '750ml',
      'g:unit_pricing_base_measure': '100ml',
      'g:multipack': '6',
      'g:is_bundle': 'yes',
      'g:adult': 'no',
      'g:energy_efficiency_class': 'A+',
      'g:min_energy_efficiency_class': 'A',
      'g:max_energy_efficiency_class': 'A+++',
      'g:certification': {
        'g:certification_authority': 'European Commission',
        'g:certification_name': 'EPREL',
        'g:certification_code': '123456',
        'g:certification_value': 'A++',
      },
      'g:installment': { 'g:months': '12', 'g:amount': '99.99 BRL' },
      'g:subscription_cost': {
        'g:period': 'month',
        'g:period_length': '1',
        'g:amount': '9.99 USD',
      },
      'g:loyalty_program': {
        'g:program_label': 'rewards',
        'g:tier_label': 'gold',
        'g:price': '49.99 USD',
        'g:loyalty_points': '500',
        'g:member_price_effective_date': '2024-01-01T00:00:00Z/2024-12-31T23:59:59Z',
        'g:shipping_label': 'free_member_shipping',
        'g:cashback_for_future_use': '5.00 USD',
      },
      'g:product_highlight': ['Feature 1', 'Feature 2'],
      'g:product_detail': {
        'g:section_name': 'Technical Specs',
        'g:attribute_name': 'Weight',
        'g:attribute_value': '1.5 kg',
      },
      'g:return_policy_label': 'free_returns',
      'g:ads_redirect': 'https://example.com/track?id=123',
      'g:custom_label_0': 'Best Seller',
      'g:custom_label_1': 'Summer',
      'g:custom_label_2': 'Clearance',
      'g:custom_label_3': 'New Arrival',
      'g:custom_label_4': 'Premium',
      'g:promotion_id': ['PROMO1', 'PROMO2'],
      'g:excluded_destination': ['Display_Ads'],
      'g:included_destination': ['Shopping_Actions', 'Shopping_Ads'],
      'g:shopping_ads_excluded_country': ['DE', 'FR'],
      'g:display_ads_id': 'display-123',
      'g:display_ads_title': 'Custom Display Title',
      'g:display_ads_link': 'https://example.com/display/123',
      'g:display_ads_value': '9.99',
      'g:display_ads_similar_id': ['similar1', 'similar2'],
      'g:ads_grouping': 'group1',
      'g:ads_labels': ['label1', 'label2'],
      'g:structured_title': {
        'g:digital_source_type': 'trained_algorithmic_media',
        'g:content': 'AI-Enhanced Title',
      },
      'g:structured_description': {
        'g:digital_source_type': 'trained_algorithmic_media',
        'g:content': 'AI-Enhanced Description',
      },
      'g:pickup_method': 'buy',
      'g:pickup_sla': 'same_day',
      'g:sell_on_google_quantity': '10',
      'g:link_template': 'https://example.com/product/{store_code}/123',
      'g:mobile_link_template': 'https://m.example.com/product/{store_code}/123',
      'g:auto_pricing_min_price': '14.99 USD',
      'g:external_seller_id': 'seller-123',
      'g:virtual_model_link': 'https://example.com/virtual-model/123',
      'g:disclosure_date': '2024-06-01T00:00:00Z',
    }
    const expected = {
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
      price: '29.99 USD',
      salePrice: '19.99 USD',
      salePriceEffectiveDate: '2024-01-01T00:00:00Z/2024-01-31T23:59:59Z',
      costOfGoodsSold: '10.00 USD',
      maximumRetailPrice: '39.99 USD',
      availability: 'in_stock',
      availabilityDate: '2024-02-01T00:00:00Z',
      expirationDate: '2024-12-31T23:59:59Z',
      pause: 'ads',
      brand: 'ExampleBrand',
      gtin: '1234567890123',
      mpn: 'MPN-12345',
      identifierExists: true,
      googleProductCategory: 'Electronics',
      productTypes: ['Electronics', 'Phones'],
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
      shippings: [{ country: 'US', price: '5.99 USD' }],
      shippingLabel: 'standard',
      shippingWeight: '1.5 kg',
      shippingLength: '25 cm',
      shippingWidth: '15 cm',
      shippingHeight: '10 cm',
      shipsFromCountry: 'US',
      transitTimeLabel: 'fast',
      maxHandlingTime: 3,
      minHandlingTime: 1,
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
      unitPricingMeasure: '750ml',
      unitPricingBaseMeasure: '100ml',
      multipack: 6,
      isBundle: true,
      adult: false,
      energyEfficiencyClass: 'A+',
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
      installment: { months: 12, amount: '99.99 BRL' },
      subscriptionCost: { period: 'month', periodLength: 1, amount: '9.99 USD' },
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
      productHighlights: ['Feature 1', 'Feature 2'],
      productDetails: [
        { sectionName: 'Technical Specs', attributeName: 'Weight', attributeValue: '1.5 kg' },
      ],
      returnPolicyLabel: 'free_returns',
      adsRedirect: 'https://example.com/track?id=123',
      customLabel0: 'Best Seller',
      customLabel1: 'Summer',
      customLabel2: 'Clearance',
      customLabel3: 'New Arrival',
      customLabel4: 'Premium',
      promotionIds: ['PROMO1', 'PROMO2'],
      excludedDestinations: ['Display_Ads'],
      includedDestinations: ['Shopping_Actions', 'Shopping_Ads'],
      shoppingAdsExcludedCountries: ['DE', 'FR'],
      displayAdsId: 'display-123',
      displayAdsTitle: 'Custom Display Title',
      displayAdsLink: 'https://example.com/display/123',
      displayAdsValue: 9.99,
      displayAdsSimilarIds: ['similar1', 'similar2'],
      adsGrouping: 'group1',
      adsLabels: ['label1', 'label2'],
      structuredTitle: {
        digitalSourceType: 'trained_algorithmic_media',
        content: 'AI-Enhanced Title',
      },
      structuredDescription: {
        digitalSourceType: 'trained_algorithmic_media',
        content: 'AI-Enhanced Description',
      },
      pickupMethod: 'buy',
      pickupSla: 'same_day',
      sellOnGoogleQuantity: 10,
      linkTemplate: 'https://example.com/product/{store_code}/123',
      mobileLinkTemplate: 'https://m.example.com/product/{store_code}/123',
      autoPricingMinPrice: '14.99 USD',
      externalSellerId: 'seller-123',
      virtualModelLink: 'https://example.com/virtual-model/123',
      disclosureDate: '2024-06-01T00:00:00Z',
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
