import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateNumber,
  generatePlainString,
  trimArray,
} from '../../../common/utils.js'
import type { ShopifyNs } from '../common/types.js'

export const generatePrice: GenerateUtil<ShopifyNs.Price> = (price) => {
  if (!isPlainObject(price)) {
    return
  }

  const value = {
    '#text': generateNumber(price.value),
    '@currency': generatePlainString(price.currency),
  }

  return trimObject(value)
}

export const generateVariant: GenerateUtil<ShopifyNs.Variant> = (variant) => {
  if (!isPlainObject(variant)) {
    return
  }

  const value = {
    id: generateCdataString(variant.id),
    title: generateCdataString(variant.title),
    'shopify:price': generatePrice(variant.price),
    'shopify:sku': generateCdataString(variant.sku),
    'shopify:grams': generateNumber(variant.grams),
  }

  return trimObject(value)
}

export const generateItem: GenerateUtil<ShopifyNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'shopify:type': generateCdataString(item.type),
    'shopify:vendor': generateCdataString(item.vendor),
    'shopify:tag': trimArray(item.tags, generateCdataString),
    'shopify:variant': trimArray(item.variants, generateVariant),
  }

  return trimObject(value)
}
