import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateNumber,
  generatePlainString,
  generateYesNoBoolean,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { GNs } from '../common/types.js'

export const generateShipping: GenerateUtil<GNs.Shipping> = (shipping) => {
  if (!isObject(shipping)) {
    return
  }

  const value = {
    'g:country': generateCdataString(shipping.country),
    'g:region': generateCdataString(shipping.region),
    'g:postal_code': generateCdataString(shipping.postalCode),
    'g:location_id': generateCdataString(shipping.locationId),
    'g:location_group_name': generateCdataString(shipping.locationGroupName),
    'g:service': generateCdataString(shipping.service),
    'g:price': generateCdataString(shipping.price),
    'g:min_handling_time': generateNumber(shipping.minHandlingTime),
    'g:max_handling_time': generateNumber(shipping.maxHandlingTime),
    'g:min_transit_time': generateNumber(shipping.minTransitTime),
    'g:max_transit_time': generateNumber(shipping.maxTransitTime),
    'g:handling_cutoff_time': generatePlainString(shipping.handlingCutoffTime),
  }

  return trimObject(value)
}

export const generateFreeShippingThreshold: GenerateUtil<GNs.FreeShippingThreshold> = (
  threshold,
) => {
  if (!isObject(threshold)) {
    return
  }

  const value = {
    'g:country': generateCdataString(threshold.country),
    'g:price_threshold': generateCdataString(threshold.priceThreshold),
  }

  return trimObject(value)
}

export const generateHandlingCutoffTime: GenerateUtil<GNs.HandlingCutoffTime> = (cutoff) => {
  if (!isObject(cutoff)) {
    return
  }

  const value = {
    'g:cutoff_time': generatePlainString(cutoff.cutoffTime),
    'g:cutoff_timezone': generateCdataString(cutoff.cutoffTimezone),
    'g:country': generateCdataString(cutoff.country),
    'g:disable_delivery_after_cutoff': generateYesNoBoolean(cutoff.disableDeliveryAfterCutoff),
  }

  return trimObject(value)
}

export const generateTax: GenerateUtil<GNs.Tax> = (tax) => {
  if (!isObject(tax)) {
    return
  }

  const value = {
    'g:country': generateCdataString(tax.country),
    'g:region': generateCdataString(tax.region),
    'g:postal_code': generateCdataString(tax.postalCode),
    'g:location_id': generateCdataString(tax.locationId),
    'g:rate': generateCdataString(tax.rate),
    'g:tax_ship': generateYesNoBoolean(tax.taxShip),
  }

  return trimObject(value)
}

export const generateInstallment: GenerateUtil<GNs.Installment> = (installment) => {
  if (!isObject(installment)) {
    return
  }

  const value = {
    'g:months': generateNumber(installment.months),
    'g:amount': generateCdataString(installment.amount),
    'g:downpayment': generateCdataString(installment.downpayment),
    'g:credit_type': generateCdataString(installment.creditType),
  }

  return trimObject(value)
}

export const generateSubscriptionCost: GenerateUtil<GNs.SubscriptionCost> = (subscription) => {
  if (!isObject(subscription)) {
    return
  }

  const value = {
    'g:period': generateCdataString(subscription.period),
    'g:period_length': generateNumber(subscription.periodLength),
    'g:amount': generateCdataString(subscription.amount),
  }

  return trimObject(value)
}

export const generateLoyaltyProgram: GenerateUtil<GNs.LoyaltyProgram> = (program) => {
  if (!isObject(program)) {
    return
  }

  const value = {
    'g:program_label': generateCdataString(program.programLabel),
    'g:tier_label': generateCdataString(program.tierLabel),
    'g:price': generateCdataString(program.price),
    'g:loyalty_points': generateNumber(program.loyaltyPoints),
    'g:member_price_effective_date': generateCdataString(program.memberPriceEffectiveDate),
    'g:shipping_label': generateCdataString(program.shippingLabel),
    'g:cashback_for_future_use': generateCdataString(program.cashbackForFutureUse),
  }

  return trimObject(value)
}

export const generateProductDetail: GenerateUtil<GNs.ProductDetail> = (detail) => {
  if (!isObject(detail)) {
    return
  }

  const value = {
    'g:section_name': generateCdataString(detail.sectionName),
    'g:attribute_name': generateCdataString(detail.attributeName),
    'g:attribute_value': generateCdataString(detail.attributeValue),
  }

  return trimObject(value)
}

export const generateCertification: GenerateUtil<GNs.Certification> = (certification) => {
  if (!isObject(certification)) {
    return
  }

  const value = {
    'g:certification_authority': generateCdataString(certification.certificationAuthority),
    'g:certification_name': generateCdataString(certification.certificationName),
    'g:certification_code': generateCdataString(certification.certificationCode),
    'g:certification_value': generateCdataString(certification.certificationValue),
  }

  return trimObject(value)
}

export const generateStructuredContent: GenerateUtil<GNs.StructuredContent> = (structured) => {
  if (!isObject(structured)) {
    return
  }

  const value = {
    'g:digital_source_type': generateCdataString(structured.digitalSourceType),
    'g:content': generateCdataString(structured.content),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<GNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    // Basic product data.
    'g:id': generateCdataString(item.id),
    'g:title': generateCdataString(item.title),
    'g:description': generateCdataString(item.description),
    'g:link': generateCdataString(item.link),
    'g:mobile_link': generateCdataString(item.mobileLink),
    'g:image_link': generateCdataString(item.imageLink),
    'g:additional_image_link': trimArray(item.additionalImageLinks, generateCdataString),

    // Price & availability.
    'g:price': generateCdataString(item.price),
    'g:sale_price': generateCdataString(item.salePrice),
    'g:sale_price_effective_date': generateCdataString(item.salePriceEffectiveDate),
    'g:cost_of_goods_sold': generateCdataString(item.costOfGoodsSold),
    'g:availability': generateCdataString(item.availability),
    'g:availability_date': generateCdataString(item.availabilityDate),
    'g:expiration_date': generateCdataString(item.expirationDate),
    'g:pause': generateCdataString(item.pause),

    // Product identifiers.
    'g:brand': generateCdataString(item.brand),
    'g:gtin': generateCdataString(item.gtin),
    'g:mpn': generateCdataString(item.mpn),
    'g:identifier_exists': generateYesNoBoolean(item.identifierExists),

    // Categories.
    'g:google_product_category': generateCdataString(item.googleProductCategory),
    'g:product_type': trimArray(item.productTypes, generateCdataString),

    // Condition.
    'g:condition': generateCdataString(item.condition),

    // Apparel & variants.
    'g:item_group_id': generateCdataString(item.itemGroupId),
    'g:color': generateCdataString(item.color),
    'g:size': generateCdataString(item.size),
    'g:size_type': generateCdataString(item.sizeType),
    'g:size_system': generateCdataString(item.sizeSystem),
    'g:gender': generateCdataString(item.gender),
    'g:age_group': generateCdataString(item.ageGroup),
    'g:material': generateCdataString(item.material),
    'g:pattern': generateCdataString(item.pattern),

    // Shipping.
    'g:shipping': trimArray(item.shippings, generateShipping),
    'g:shipping_label': generateCdataString(item.shippingLabel),
    'g:shipping_weight': generateCdataString(item.shippingWeight),
    'g:shipping_length': generateCdataString(item.shippingLength),
    'g:shipping_width': generateCdataString(item.shippingWidth),
    'g:shipping_height': generateCdataString(item.shippingHeight),
    'g:ships_from_country': generateCdataString(item.shipsFromCountry),
    'g:transit_time_label': generateCdataString(item.transitTimeLabel),
    'g:max_handling_time': generateNumber(item.maxHandlingTime),
    'g:min_handling_time': generateNumber(item.minHandlingTime),
    'g:free_shipping_threshold': trimArray(
      item.freeShippingThresholds,
      generateFreeShippingThreshold,
    ),

    // Handling cutoff time (standalone top-level attribute).
    'g:handling_cutoff_time': trimArray(item.handlingCutoffTimes, generateHandlingCutoffTime),

    // Shipping business days (simple string values).
    'g:shipping_handling_business_days': generateCdataString(item.shippingHandlingBusinessDays),
    'g:shipping_transit_business_days': generateCdataString(item.shippingTransitBusinessDays),

    // Tax.
    'g:tax': trimArray(item.taxes, generateTax),
    'g:tax_category': generateCdataString(item.taxCategory),

    // Unit pricing.
    'g:unit_pricing_measure': generateCdataString(item.unitPricingMeasure),
    'g:unit_pricing_base_measure': generateCdataString(item.unitPricingBaseMeasure),

    // Bundles & multipacks.
    'g:multipack': generateNumber(item.multipack),
    'g:is_bundle': generateYesNoBoolean(item.isBundle),

    // Adult.
    'g:adult': generateYesNoBoolean(item.adult),

    // Energy efficiency.
    'g:energy_efficiency_class': generateCdataString(item.energyEfficiencyClass),
    'g:min_energy_efficiency_class': generateCdataString(item.minEnergyEfficiencyClass),
    'g:max_energy_efficiency_class': generateCdataString(item.maxEnergyEfficiencyClass),
    'g:certification': trimArray(item.certifications, generateCertification),

    // Installment (Brazil/Mexico).
    'g:installment': generateInstallment(item.installment),

    // Subscription.
    'g:subscription_cost': generateSubscriptionCost(item.subscriptionCost),

    // Loyalty programs (US/JP - array for multiple tiers).
    'g:loyalty_program': trimArray(item.loyaltyPrograms, generateLoyaltyProgram),

    // Product details & highlights.
    'g:product_highlight': trimArray(item.productHighlights, generateCdataString),
    'g:product_detail': trimArray(item.productDetails, generateProductDetail),

    // Return policy.
    'g:return_policy_label': generateCdataString(item.returnPolicyLabel),

    // Shopping campaigns.
    'g:ads_redirect': generateCdataString(item.adsRedirect),
    'g:custom_label_0': generateCdataString(item.customLabel0),
    'g:custom_label_1': generateCdataString(item.customLabel1),
    'g:custom_label_2': generateCdataString(item.customLabel2),
    'g:custom_label_3': generateCdataString(item.customLabel3),
    'g:custom_label_4': generateCdataString(item.customLabel4),
    'g:promotion_id': trimArray(item.promotionIds, generateCdataString),
    'g:excluded_destination': trimArray(item.excludedDestinations, generateCdataString),
    'g:included_destination': trimArray(item.includedDestinations, generateCdataString),
    'g:shopping_ads_excluded_country': trimArray(
      item.shoppingAdsExcludedCountries,
      generateCdataString,
    ),

    // Display ads / dynamic remarketing.
    'g:ads_grouping': generateCdataString(item.adsGrouping),
    'g:ads_labels': trimArray(item.adsLabels, generateCdataString),

    // Structured content (AI disclosure).
    'g:structured_title': generateStructuredContent(item.structuredTitle),
    'g:structured_description': generateStructuredContent(item.structuredDescription),

    // Auto-discounts.
    'g:auto_pricing_min_price': generateCdataString(item.autoPricingMinPrice),

    // External seller.
    'g:external_seller_id': generateCdataString(item.externalSellerId),

    // Virtual model.
    'g:virtual_model_link': generateCdataString(item.virtualModelLink),

    // Disclosure date (YouTube surfaces visibility).
    'g:disclosure_date': generateCdataString(item.disclosureDate),
  }

  return trimObject(value)
}
