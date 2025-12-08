import type { GenerateUtil } from '../../../common/types.js'
import {
  generateBoolean,
  generateNumber,
  generatePlainString,
  isObject,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { OpdsNs } from '../common/types.js'

export const generatePrice: GenerateUtil<OpdsNs.Price> = (price) => {
  if (!isObject(price)) {
    return
  }

  if (price.value === undefined || price.currencyCode === undefined) {
    return
  }

  const value = {
    '#text': generateNumber(price.value),
    '@currencycode': generatePlainString(price.currencyCode),
  }

  return trimObject(value)
}

export const generateIndirectAcquisition: GenerateUtil<OpdsNs.IndirectAcquisition> = (
  indirectAcquisition,
) => {
  if (!isObject(indirectAcquisition)) {
    return
  }

  if (indirectAcquisition.type === undefined) {
    return
  }

  const value = {
    '@type': generatePlainString(indirectAcquisition.type),
    'opds:indirectAcquisition': trimArray(
      indirectAcquisition.indirectAcquisitions,
      generateIndirectAcquisition,
    ),
  }

  return trimObject(value)
}

export const generateLink: GenerateUtil<OpdsNs.Link> = (link) => {
  if (!isObject(link)) {
    return
  }

  const value = {
    'opds:price': trimArray(link.prices, generatePrice),
    'opds:indirectAcquisition': trimArray(link.indirectAcquisitions, generateIndirectAcquisition),
    '@opds:facetGroup': generatePlainString(link.facetGroup),
    '@opds:activeFacet': generateBoolean(link.activeFacet),
  }

  return trimObject(value)
}
