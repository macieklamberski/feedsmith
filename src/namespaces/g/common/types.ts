import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace GNs {
  export type Shipping<TStrict extends boolean = false> = Strict<
    {
      country: Requirable<string> // Required in spec.
      region?: string
      postalCode?: string
      locationId?: string
      locationGroupName?: string
      service?: string
      price?: string
      minHandlingTime?: number
      maxHandlingTime?: number
      minTransitTime?: number
      maxTransitTime?: number
      handlingCutoffTime?: string // Simple HHMM sub-attribute variant.
      handlingCutoffTimezone?: string
    },
    TStrict
  >

  export type FreeShippingThreshold = {
    country?: string
    priceThreshold?: string
  }

  export type HandlingCutoffTime = {
    cutoffTime?: string
    cutoffTimezone?: string
    country?: string
    disableDeliveryAfterCutoff?: boolean
  }

  export type Tax = {
    country?: string
    region?: string
    postalCode?: string
    locationId?: string
    rate?: string
    taxShip?: boolean
  }

  export type Installment = {
    months?: number
    amount?: string
    downpayment?: string
    creditType?: string
  }

  export type SubscriptionCost = {
    period?: string
    periodLength?: number
    amount?: string
  }

  export type LoyaltyProgram = {
    programLabel?: string
    tierLabel?: string
    price?: string
    loyaltyPoints?: number
    memberPriceEffectiveDate?: string
    shippingLabel?: string
    cashbackForFutureUse?: string
  }

  export type ProductDetail = {
    sectionName?: string
    attributeName?: string
    attributeValue?: string
  }

  export type Certification = {
    certificationAuthority?: string
    certificationName?: string
    certificationCode?: string
    certificationValue?: string
  }

  export type StructuredContent<TStrict extends boolean = false> = Strict<
    {
      content: Requirable<string> // Required when element exists.
      digitalSourceType?: string
    },
    TStrict
  >

  export type Item<TStrict extends boolean = false> = {
    // Basic product data.
    id?: string
    title?: string
    description?: string
    link?: string
    mobileLink?: string
    canonicalLink?: string
    imageLink?: string
    additionalImageLinks?: Array<string>
    lifestyleImageLinks?: Array<string>

    // Price & availability.
    price?: string
    salePrice?: string
    salePriceEffectiveDate?: string
    costOfGoodsSold?: string
    maximumRetailPrice?: string
    availability?: string
    availabilityDate?: string
    expirationDate?: string
    pause?: string

    // Product identifiers.
    brand?: string
    gtin?: string
    mpn?: string
    identifierExists?: boolean

    // Categories.
    googleProductCategory?: string
    productTypes?: Array<string>

    // Condition.
    condition?: string

    // Product dimensions.
    productLength?: string
    productWidth?: string
    productHeight?: string
    productWeight?: string

    // Apparel & variants.
    itemGroupId?: string
    color?: string
    size?: string
    sizeType?: string
    sizeSystem?: string
    gender?: string
    ageGroup?: string
    material?: string
    pattern?: string

    // Shipping.
    shippings?: Array<Shipping<TStrict>>
    shippingLabel?: string
    shippingWeight?: string
    shippingLength?: string
    shippingWidth?: string
    shippingHeight?: string
    shipsFromCountry?: string
    transitTimeLabel?: string
    maxHandlingTime?: number
    minHandlingTime?: number
    freeShippingThresholds?: Array<FreeShippingThreshold>

    // Handling cutoff time (standalone top-level attribute).
    handlingCutoffTimes?: Array<HandlingCutoffTime>

    // Shipping business days (simple string values).
    shippingHandlingBusinessDays?: string
    shippingTransitBusinessDays?: string

    // Tax.
    /** @deprecated Since July 2025 for US merchants. */
    taxes?: Array<Tax>
    /** @deprecated Since July 2025 for US merchants. */
    taxCategory?: string

    // Unit pricing.
    unitPricingMeasure?: string
    unitPricingBaseMeasure?: string

    // Bundles & multipacks.
    multipack?: number
    isBundle?: boolean

    // Adult.
    adult?: boolean

    // Energy efficiency.
    /** @deprecated In EU countries since April 2025. Use certifications instead. */
    energyEfficiencyClass?: string
    /** @deprecated In EU countries since April 2025. Use certifications instead. */
    minEnergyEfficiencyClass?: string
    /** @deprecated In EU countries since April 2025. Use certifications instead. */
    maxEnergyEfficiencyClass?: string
    certifications?: Array<Certification>

    // Installment (Brazil/Mexico).
    installment?: Installment

    // Subscription.
    subscriptionCost?: SubscriptionCost

    // Loyalty programs (US/JP - array for multiple tiers).
    loyaltyPrograms?: Array<LoyaltyProgram>

    // Product details & highlights.
    productHighlights?: Array<string>
    productDetails?: Array<ProductDetail>

    // Return policy.
    returnPolicyLabel?: string

    // Shopping campaigns.
    adsRedirect?: string
    customLabel0?: string
    customLabel1?: string
    customLabel2?: string
    customLabel3?: string
    customLabel4?: string
    promotionIds?: Array<string>
    excludedDestinations?: Array<string>
    includedDestinations?: Array<string>
    shoppingAdsExcludedCountries?: Array<string>

    // Display ads / dynamic remarketing.
    displayAdsId?: string
    displayAdsTitle?: string
    displayAdsLink?: string
    displayAdsValue?: number
    displayAdsSimilarIds?: Array<string>
    adsGrouping?: string
    adsLabels?: Array<string>

    // Structured content (AI disclosure).
    structuredTitle?: StructuredContent<TStrict>
    structuredDescription?: StructuredContent<TStrict>

    // Local inventory / pickup.
    pickupMethod?: string
    pickupSla?: string
    sellOnGoogleQuantity?: number

    // Link templates (local storefront).
    linkTemplate?: string
    mobileLinkTemplate?: string

    // Auto-discounts.
    autoPricingMinPrice?: string

    // External seller.
    externalSellerId?: string

    // Virtual model.
    virtualModelLink?: string

    // Disclosure date (YouTube surfaces visibility).
    disclosureDate?: string
  }
}
// #endregion reference
