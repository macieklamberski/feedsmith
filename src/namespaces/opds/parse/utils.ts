import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseArrayOf,
  parseBoolean,
  parseNumber,
  parseSingularOf,
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

export const parseAvailability: ParsePartialUtil<OpdsNs.Availability> = (value) => {
  if (!isObject(value)) {
    return
  }

  const status = parseString(value['@status'])

  if (status === undefined) {
    return
  }

  const availability = {
    status,
    since: parseString(value['@since']),
    until: parseString(value['@until']),
  }

  return trimObject(availability) as OpdsNs.Availability
}

export const parseHolds: ParsePartialUtil<OpdsNs.Holds> = (value) => {
  if (!isObject(value)) {
    return
  }

  const holds = {
    total: parseNumber(value['@total']),
    position: parseNumber(value['@position']),
  }

  return trimObject(holds)
}

export const parseCopies: ParsePartialUtil<OpdsNs.Copies> = (value) => {
  if (!isObject(value)) {
    return
  }

  const copies = {
    total: parseNumber(value['@total']),
    available: parseNumber(value['@available']),
  }

  return trimObject(copies)
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
    availability: parseSingularOf(value['opds:availability'], parseAvailability),
    holds: parseSingularOf(value['opds:holds'], parseHolds),
    copies: parseSingularOf(value['opds:copies'], parseCopies),
  }

  return trimObject(link)
}
