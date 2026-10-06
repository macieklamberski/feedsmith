import { isPlainObject, trimObject } from 'trousse'
import type { DateLike, GenerateUtil } from '../../../common/types.js'
import {
  generateNumber,
  generatePlainString,
  generateRfc3339Date,
  trimArray,
} from '../../../common/utils.js'
import type { OpdsNs } from '../common/types.js'

export const generatePrice: GenerateUtil<OpdsNs.Price> = (price) => {
  if (!isPlainObject(price)) {
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
  if (!isPlainObject(indirectAcquisition)) {
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

export const generateAvailability: GenerateUtil<OpdsNs.Availability<DateLike>> = (availability) => {
  if (!isPlainObject(availability)) {
    return
  }

  const value = {
    '@status': generatePlainString(availability.status),
    '@since': generateRfc3339Date(availability.since),
    '@until': generateRfc3339Date(availability.until),
  }

  return trimObject(value)
}

export const generateHolds: GenerateUtil<OpdsNs.Holds> = (holds) => {
  if (!isPlainObject(holds)) {
    return
  }

  const value = {
    '@total': generateNumber(holds.total),
    '@position': generateNumber(holds.position),
  }

  return trimObject(value)
}

export const generateCopies: GenerateUtil<OpdsNs.Copies> = (copies) => {
  if (!isPlainObject(copies)) {
    return
  }

  const value = {
    '@total': generateNumber(copies.total),
    '@available': generateNumber(copies.available),
  }

  return trimObject(value)
}

export const generateLink: GenerateUtil<OpdsNs.Link<DateLike>> = (link) => {
  if (!isPlainObject(link)) {
    return
  }

  const value = {
    'opds:price': trimArray(link.prices, generatePrice),
    'opds:indirectAcquisition': trimArray(link.indirectAcquisitions, generateIndirectAcquisition),
    '@opds:facetGroup': generatePlainString(link.facetGroup),
    // OPDS 1.2 allows only "true": an inactive facet omits the attribute.
    '@opds:activeFacet': link.activeFacet === true ? true : undefined,
    'opds:availability': generateAvailability(link.availability),
    'opds:holds': generateHolds(link.holds),
    'opds:copies': generateCopies(link.copies),
  }

  return trimObject(value)
}
