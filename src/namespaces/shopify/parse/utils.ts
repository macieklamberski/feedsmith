import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  parseArrayOf,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
} from '../../../common/utils.js'
import type { ShopifyNs } from '../common/types.js'

export const parsePrice: ParseUtilPartial<ShopifyNs.Price> = (value) => {
  const price = {
    value: parseNumber(retrieveText(value)),
    currency: parseString(value?.['@currency']),
  }

  return trimObject(price)
}

// The variant's id and title are Atom elements, so they arrive without a prefix.
export const parseVariant: ParseUtilPartial<ShopifyNs.Variant> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const variant = {
    id: parseSingularOf(value.id, (value) => parseString(retrieveText(value))),
    title: parseSingularOf(value.title, (value) => parseString(retrieveText(value))),
    price: parseSingularOf(value['shopify:price'], parsePrice),
    sku: parseSingularOf(value['shopify:sku'], (value) => parseString(retrieveText(value))),
    grams: parseSingularOf(value['shopify:grams'], (value) => parseNumber(retrieveText(value))),
  }

  return trimObject(variant)
}

export const retrieveItem: ParseUtilPartial<ShopifyNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    type: parseSingularOf(value['shopify:type'], (value) => parseString(retrieveText(value))),
    vendor: parseSingularOf(value['shopify:vendor'], (value) => parseString(retrieveText(value))),
    tags: parseArrayOf(value['shopify:tag'], (value) => parseString(retrieveText(value))),
    variants: parseArrayOf(value['shopify:variant'], parseVariant),
  }

  return trimObject(item)
}
