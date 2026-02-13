import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseNumber,
  parseSingularOf,
  parseString,
  parseYesNoBoolean,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { GNs } from '../common/types.js'

export const parseShipping: ParsePartialUtil<GNs.Shipping> = (value) => {
  if (!isObject(value)) {
    return
  }

  const shipping = {
    country: parseSingularOf(value['g:country'], (value) => parseString(retrieveText(value))),
    region: parseSingularOf(value['g:region'], (value) => parseString(retrieveText(value))),
    postalCode: parseSingularOf(value['g:postal_code'], (value) =>
      parseString(retrieveText(value)),
    ),
    locationId: parseSingularOf(value['g:location_id'], (value) =>
      parseString(retrieveText(value)),
    ),
    locationGroupName: parseSingularOf(value['g:location_group_name'], (value) =>
      parseString(retrieveText(value)),
    ),
    service: parseSingularOf(value['g:service'], (value) => parseString(retrieveText(value))),
    price: parseSingularOf(value['g:price'], (value) => parseString(retrieveText(value))),
    minHandlingTime: parseSingularOf(value['g:min_handling_time'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    maxHandlingTime: parseSingularOf(value['g:max_handling_time'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    minTransitTime: parseSingularOf(value['g:min_transit_time'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    maxTransitTime: parseSingularOf(value['g:max_transit_time'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    handlingCutoffTime: parseSingularOf(value['g:handling_cutoff_time'], (value) =>
      parseString(retrieveText(value)),
    ),
    handlingCutoffTimezone: parseSingularOf(value['g:handling_cutoff_timezone'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(shipping)
}

export const parseFreeShippingThreshold: ParsePartialUtil<GNs.FreeShippingThreshold> = (value) => {
  if (!isObject(value)) {
    return
  }

  const threshold = {
    country: parseSingularOf(value['g:country'], (value) => parseString(retrieveText(value))),
    priceThreshold: parseSingularOf(value['g:price_threshold'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(threshold)
}

export const parseHandlingCutoffTime: ParsePartialUtil<GNs.HandlingCutoffTime> = (value) => {
  if (!isObject(value)) {
    return
  }

  const cutoff = {
    cutoffTime: parseSingularOf(value['g:cutoff_time'], (value) =>
      parseString(retrieveText(value)),
    ),
    cutoffTimezone: parseSingularOf(value['g:cutoff_timezone'], (value) =>
      parseString(retrieveText(value)),
    ),
    country: parseSingularOf(value['g:country'], (value) => parseString(retrieveText(value))),
    disableDeliveryAfterCutoff: parseSingularOf(value['g:disable_delivery_after_cutoff'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
  }

  return trimObject(cutoff)
}

export const parseTax: ParsePartialUtil<GNs.Tax> = (value) => {
  if (!isObject(value)) {
    return
  }

  const tax = {
    country: parseSingularOf(value['g:country'], (value) => parseString(retrieveText(value))),
    region: parseSingularOf(value['g:region'], (value) => parseString(retrieveText(value))),
    postalCode: parseSingularOf(value['g:postal_code'], (value) =>
      parseString(retrieveText(value)),
    ),
    locationId: parseSingularOf(value['g:location_id'], (value) =>
      parseString(retrieveText(value)),
    ),
    rate: parseSingularOf(value['g:rate'], (value) => parseString(retrieveText(value))),
    taxShip: parseSingularOf(value['g:tax_ship'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),
  }

  return trimObject(tax)
}

export const parseInstallment: ParsePartialUtil<GNs.Installment> = (value) => {
  if (!isObject(value)) {
    return
  }

  const installment = {
    months: parseSingularOf(value['g:months'], (value) => parseNumber(retrieveText(value))),
    amount: parseSingularOf(value['g:amount'], (value) => parseString(retrieveText(value))),
    downpayment: parseSingularOf(value['g:downpayment'], (value) =>
      parseString(retrieveText(value)),
    ),
    creditType: parseSingularOf(value['g:credit_type'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(installment)
}

export const parseSubscriptionCost: ParsePartialUtil<GNs.SubscriptionCost> = (value) => {
  if (!isObject(value)) {
    return
  }

  const subscription = {
    period: parseSingularOf(value['g:period'], (value) => parseString(retrieveText(value))),
    periodLength: parseSingularOf(value['g:period_length'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    amount: parseSingularOf(value['g:amount'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(subscription)
}

export const parseLoyaltyProgram: ParsePartialUtil<GNs.LoyaltyProgram> = (value) => {
  if (!isObject(value)) {
    return
  }

  const program = {
    programLabel: parseSingularOf(value['g:program_label'], (value) =>
      parseString(retrieveText(value)),
    ),
    tierLabel: parseSingularOf(value['g:tier_label'], (value) => parseString(retrieveText(value))),
    price: parseSingularOf(value['g:price'], (value) => parseString(retrieveText(value))),
    loyaltyPoints: parseSingularOf(value['g:loyalty_points'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    memberPriceEffectiveDate: parseSingularOf(value['g:member_price_effective_date'], (value) =>
      parseString(retrieveText(value)),
    ),
    shippingLabel: parseSingularOf(value['g:shipping_label'], (value) =>
      parseString(retrieveText(value)),
    ),
    cashbackForFutureUse: parseSingularOf(value['g:cashback_for_future_use'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(program)
}

export const parseProductDetail: ParsePartialUtil<GNs.ProductDetail> = (value) => {
  if (!isObject(value)) {
    return
  }

  const detail = {
    sectionName: parseSingularOf(value['g:section_name'], (value) =>
      parseString(retrieveText(value)),
    ),
    attributeName: parseSingularOf(value['g:attribute_name'], (value) =>
      parseString(retrieveText(value)),
    ),
    attributeValue: parseSingularOf(value['g:attribute_value'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(detail)
}

export const parseCertification: ParsePartialUtil<GNs.Certification> = (value) => {
  if (!isObject(value)) {
    return
  }

  const certification = {
    certificationAuthority: parseSingularOf(value['g:certification_authority'], (value) =>
      parseString(retrieveText(value)),
    ),
    certificationName: parseSingularOf(value['g:certification_name'], (value) =>
      parseString(retrieveText(value)),
    ),
    certificationCode: parseSingularOf(value['g:certification_code'], (value) =>
      parseString(retrieveText(value)),
    ),
    certificationValue: parseSingularOf(value['g:certification_value'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(certification)
}

export const parseStructuredContent: ParsePartialUtil<GNs.StructuredContent> = (value) => {
  if (!isObject(value)) {
    return
  }

  const structured = {
    content: parseSingularOf(value['g:content'], (value) => parseString(retrieveText(value))),
    digitalSourceType: parseSingularOf(value['g:digital_source_type'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(structured)
}

export const retrieveItem: ParsePartialUtil<GNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    // Basic product data.
    id: parseSingularOf(value['g:id'], (value) => parseString(retrieveText(value))),
    title: parseSingularOf(value['g:title'], (value) => parseString(retrieveText(value))),
    description: parseSingularOf(value['g:description'], (value) =>
      parseString(retrieveText(value)),
    ),
    link: parseSingularOf(value['g:link'], (value) => parseString(retrieveText(value))),
    mobileLink: parseSingularOf(value['g:mobile_link'], (value) =>
      parseString(retrieveText(value)),
    ),
    imageLink: parseSingularOf(value['g:image_link'], (value) => parseString(retrieveText(value))),
    additionalImageLinks: parseArrayOf(value['g:additional_image_link'], (value) =>
      parseString(retrieveText(value)),
    ),

    // Price & availability.
    price: parseSingularOf(value['g:price'], (value) => parseString(retrieveText(value))),
    salePrice: parseSingularOf(value['g:sale_price'], (value) => parseString(retrieveText(value))),
    salePriceEffectiveDate: parseSingularOf(value['g:sale_price_effective_date'], (value) =>
      parseString(retrieveText(value)),
    ),
    costOfGoodsSold: parseSingularOf(value['g:cost_of_goods_sold'], (value) =>
      parseString(retrieveText(value)),
    ),
    availability: parseSingularOf(value['g:availability'], (value) =>
      parseString(retrieveText(value)),
    ),
    availabilityDate: parseSingularOf(value['g:availability_date'], (value) =>
      parseString(retrieveText(value)),
    ),
    expirationDate: parseSingularOf(value['g:expiration_date'], (value) =>
      parseString(retrieveText(value)),
    ),
    pause: parseSingularOf(value['g:pause'], (value) => parseString(retrieveText(value))),

    // Product identifiers.
    brand: parseSingularOf(value['g:brand'], (value) => parseString(retrieveText(value))),
    gtin: parseSingularOf(value['g:gtin'], (value) => parseString(retrieveText(value))),
    mpn: parseSingularOf(value['g:mpn'], (value) => parseString(retrieveText(value))),
    identifierExists: parseSingularOf(value['g:identifier_exists'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),

    // Categories.
    googleProductCategory: parseSingularOf(value['g:google_product_category'], (value) =>
      parseString(retrieveText(value)),
    ),
    productTypes: parseArrayOf(value['g:product_type'], (value) =>
      parseString(retrieveText(value)),
    ),

    // Condition.
    condition: parseSingularOf(value['g:condition'], (value) => parseString(retrieveText(value))),

    // Apparel & variants.
    itemGroupId: parseSingularOf(value['g:item_group_id'], (value) =>
      parseString(retrieveText(value)),
    ),
    color: parseSingularOf(value['g:color'], (value) => parseString(retrieveText(value))),
    size: parseSingularOf(value['g:size'], (value) => parseString(retrieveText(value))),
    sizeType: parseSingularOf(value['g:size_type'], (value) => parseString(retrieveText(value))),
    sizeSystem: parseSingularOf(value['g:size_system'], (value) =>
      parseString(retrieveText(value)),
    ),
    gender: parseSingularOf(value['g:gender'], (value) => parseString(retrieveText(value))),
    ageGroup: parseSingularOf(value['g:age_group'], (value) => parseString(retrieveText(value))),
    material: parseSingularOf(value['g:material'], (value) => parseString(retrieveText(value))),
    pattern: parseSingularOf(value['g:pattern'], (value) => parseString(retrieveText(value))),

    // Shipping.
    shippings: parseArrayOf(value['g:shipping'], parseShipping),
    shippingLabel: parseSingularOf(value['g:shipping_label'], (value) =>
      parseString(retrieveText(value)),
    ),
    shippingWeight: parseSingularOf(value['g:shipping_weight'], (value) =>
      parseString(retrieveText(value)),
    ),
    shippingLength: parseSingularOf(value['g:shipping_length'], (value) =>
      parseString(retrieveText(value)),
    ),
    shippingWidth: parseSingularOf(value['g:shipping_width'], (value) =>
      parseString(retrieveText(value)),
    ),
    shippingHeight: parseSingularOf(value['g:shipping_height'], (value) =>
      parseString(retrieveText(value)),
    ),
    shipsFromCountry: parseSingularOf(value['g:ships_from_country'], (value) =>
      parseString(retrieveText(value)),
    ),
    transitTimeLabel: parseSingularOf(value['g:transit_time_label'], (value) =>
      parseString(retrieveText(value)),
    ),
    maxHandlingTime: parseSingularOf(value['g:max_handling_time'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    minHandlingTime: parseSingularOf(value['g:min_handling_time'], (value) =>
      parseNumber(retrieveText(value)),
    ),
    freeShippingThresholds: parseArrayOf(
      value['g:free_shipping_threshold'],
      parseFreeShippingThreshold,
    ),

    // Handling cutoff time (standalone top-level attribute).
    handlingCutoffTimes: parseArrayOf(value['g:handling_cutoff_time'], parseHandlingCutoffTime),

    // Shipping business days (simple string values).
    shippingHandlingBusinessDays: parseSingularOf(
      value['g:shipping_handling_business_days'],
      (value) => parseString(retrieveText(value)),
    ),
    shippingTransitBusinessDays: parseSingularOf(
      value['g:shipping_transit_business_days'],
      (value) => parseString(retrieveText(value)),
    ),

    // Tax.
    taxes: parseArrayOf(value['g:tax'], parseTax),
    taxCategory: parseSingularOf(value['g:tax_category'], (value) =>
      parseString(retrieveText(value)),
    ),

    // Unit pricing.
    unitPricingMeasure: parseSingularOf(value['g:unit_pricing_measure'], (value) =>
      parseString(retrieveText(value)),
    ),
    unitPricingBaseMeasure: parseSingularOf(value['g:unit_pricing_base_measure'], (value) =>
      parseString(retrieveText(value)),
    ),

    // Bundles & multipacks.
    multipack: parseSingularOf(value['g:multipack'], (value) => parseNumber(retrieveText(value))),
    isBundle: parseSingularOf(value['g:is_bundle'], (value) =>
      parseYesNoBoolean(retrieveText(value)),
    ),

    // Adult.
    adult: parseSingularOf(value['g:adult'], (value) => parseYesNoBoolean(retrieveText(value))),

    // Energy efficiency.
    energyEfficiencyClass: parseSingularOf(value['g:energy_efficiency_class'], (value) =>
      parseString(retrieveText(value)),
    ),
    minEnergyEfficiencyClass: parseSingularOf(value['g:min_energy_efficiency_class'], (value) =>
      parseString(retrieveText(value)),
    ),
    maxEnergyEfficiencyClass: parseSingularOf(value['g:max_energy_efficiency_class'], (value) =>
      parseString(retrieveText(value)),
    ),
    certifications: parseArrayOf(value['g:certification'], parseCertification),

    // Installment (Brazil/Mexico).
    installment: parseSingularOf(value['g:installment'], parseInstallment),

    // Subscription.
    subscriptionCost: parseSingularOf(value['g:subscription_cost'], parseSubscriptionCost),

    // Loyalty programs (US/JP - array for multiple tiers).
    loyaltyPrograms: parseArrayOf(value['g:loyalty_program'], parseLoyaltyProgram),

    // Product details & highlights.
    productHighlights: parseArrayOf(value['g:product_highlight'], (value) =>
      parseString(retrieveText(value)),
    ),
    productDetails: parseArrayOf(value['g:product_detail'], parseProductDetail),

    // Return policy.
    returnPolicyLabel: parseSingularOf(value['g:return_policy_label'], (value) =>
      parseString(retrieveText(value)),
    ),

    // Shopping campaigns.
    adsRedirect: parseSingularOf(value['g:ads_redirect'], (value) =>
      parseString(retrieveText(value)),
    ),
    customLabel0: parseSingularOf(value['g:custom_label_0'], (value) =>
      parseString(retrieveText(value)),
    ),
    customLabel1: parseSingularOf(value['g:custom_label_1'], (value) =>
      parseString(retrieveText(value)),
    ),
    customLabel2: parseSingularOf(value['g:custom_label_2'], (value) =>
      parseString(retrieveText(value)),
    ),
    customLabel3: parseSingularOf(value['g:custom_label_3'], (value) =>
      parseString(retrieveText(value)),
    ),
    customLabel4: parseSingularOf(value['g:custom_label_4'], (value) =>
      parseString(retrieveText(value)),
    ),
    promotionIds: parseArrayOf(value['g:promotion_id'], (value) =>
      parseString(retrieveText(value)),
    ),
    excludedDestinations: parseArrayOf(value['g:excluded_destination'], (value) =>
      parseString(retrieveText(value)),
    ),
    includedDestinations: parseArrayOf(value['g:included_destination'], (value) =>
      parseString(retrieveText(value)),
    ),
    shoppingAdsExcludedCountries: parseArrayOf(value['g:shopping_ads_excluded_country'], (value) =>
      parseString(retrieveText(value)),
    ),

    // Display ads / dynamic remarketing.
    adsGrouping: parseSingularOf(value['g:ads_grouping'], (value) =>
      parseString(retrieveText(value)),
    ),
    adsLabels: parseArrayOf(value['g:ads_labels'], (value) => parseString(retrieveText(value))),

    // Structured content (AI disclosure).
    structuredTitle: parseSingularOf(value['g:structured_title'], parseStructuredContent),
    structuredDescription: parseSingularOf(
      value['g:structured_description'],
      parseStructuredContent,
    ),

    // Auto-discounts.
    autoPricingMinPrice: parseSingularOf(value['g:auto_pricing_min_price'], (value) =>
      parseString(retrieveText(value)),
    ),

    // External seller.
    externalSellerId: parseSingularOf(value['g:external_seller_id'], (value) =>
      parseString(retrieveText(value)),
    ),

    // Virtual model.
    virtualModelLink: parseSingularOf(value['g:virtual_model_link'], (value) =>
      parseString(retrieveText(value)),
    ),

    // Disclosure date (YouTube surfaces visibility).
    disclosureDate: parseSingularOf(value['g:disclosure_date'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(item)
}
