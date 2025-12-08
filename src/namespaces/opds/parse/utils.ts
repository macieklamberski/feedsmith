import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { OpdsNs } from '../common/types.js'

export const parsePrice: ParsePartialUtil<OpdsNs.Price> = (value) => {
  if (!isObject(value)) {
    return
  }

  const priceValue = parseNumber(retrieveText(value))
  const currencyCode = parseString(value['@currencycode'])

  if (priceValue === undefined || currencyCode === undefined) {
    return
  }

  return {
    value: priceValue,
    currencyCode,
  }
}

export const parseIndirectAcquisition: ParsePartialUtil<OpdsNs.IndirectAcquisition> = (value) => {
  if (!isObject(value)) {
    return
  }

  const type = parseString(value['@type'])

  if (type === undefined) {
    return
  }

  const indirectAcquisition = {
    type,
    indirectAcquisitions: parseArrayOf(value['opds:indirectacquisition'], parseIndirectAcquisition),
  }

  return trimObject(indirectAcquisition) as OpdsNs.IndirectAcquisition
}

export const retrieveLink: ParsePartialUtil<OpdsNs.Link> = (value) => {
  if (!isObject(value)) {
    return
  }

  const link = {
    prices: parseArrayOf(value['opds:price'], parsePrice),
    indirectAcquisitions: parseArrayOf(value['opds:indirectacquisition'], parseIndirectAcquisition),
    facetGroup: parseString(value['@opds:facetgroup']),
    activeFacet: parseBoolean(value['@opds:activefacet']),
  }

  return trimObject(link)
}
