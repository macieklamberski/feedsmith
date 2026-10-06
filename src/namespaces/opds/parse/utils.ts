import { isPlainObject, trimObject } from 'trousse'
import type { DateAny, ParseMainOptions, ParseUtilPartial } from '../../../common/types.js'
import {
  parseArrayOf,
  parseBoolean,
  parseDate,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
} from '../../../common/utils.js'
import type { OpdsNs } from '../common/types.js'

export const parsePrice: ParseUtilPartial<OpdsNs.Price> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const price = {
    value: parseNumber(retrieveText(value)),
    currencyCode: parseString(value['@currencycode']),
  }

  return trimObject(price)
}

export const parseIndirectAcquisition: ParseUtilPartial<OpdsNs.IndirectAcquisition> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const indirectAcquisition = {
    type: parseString(value['@type']),
    indirectAcquisitions: parseArrayOf(value['opds:indirectacquisition'], parseIndirectAcquisition),
  }

  return trimObject(indirectAcquisition)
}

// OPDS For Library Patrons names the attributes opds:status, opds:since and so on, while its
// examples write them unprefixed. Both spellings are read, unprefixed first.
export const parseAvailability: ParseUtilPartial<
  OpdsNs.Availability<DateAny>,
  ParseMainOptions<DateAny>
> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const availability = {
    status: parseString(value['@status']) ?? parseString(value['@opds:status']),
    since:
      parseDate(value['@since'], options?.parseDateFn) ??
      parseDate(value['@opds:since'], options?.parseDateFn),
    until:
      parseDate(value['@until'], options?.parseDateFn) ??
      parseDate(value['@opds:until'], options?.parseDateFn),
  }

  return trimObject(availability)
}

export const parseHolds: ParseUtilPartial<OpdsNs.Holds> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const holds = {
    total: parseNumber(value['@total']) ?? parseNumber(value['@opds:total']),
    position: parseNumber(value['@position']) ?? parseNumber(value['@opds:position']),
  }

  return trimObject(holds)
}

export const parseCopies: ParseUtilPartial<OpdsNs.Copies> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const copies = {
    total: parseNumber(value['@total']) ?? parseNumber(value['@opds:total']),
    available: parseNumber(value['@available']) ?? parseNumber(value['@opds:available']),
  }

  return trimObject(copies)
}

export const retrieveLink: ParseUtilPartial<OpdsNs.Link<DateAny>, ParseMainOptions<DateAny>> = (
  value,
  options,
) => {
  if (!isPlainObject(value)) {
    return
  }

  const link = {
    prices: parseArrayOf(value['opds:price'], parsePrice),
    indirectAcquisitions: parseArrayOf(value['opds:indirectacquisition'], parseIndirectAcquisition),
    facetGroup: parseString(value['@opds:facetgroup']),
    activeFacet: parseBoolean(value['@opds:activefacet']),
    availability: parseSingularOf(value['opds:availability'], (value) => {
      return parseAvailability(value, options)
    }),
    holds: parseSingularOf(value['opds:holds'], parseHolds),
    copies: parseSingularOf(value['opds:copies'], parseCopies),
  }

  return trimObject(link)
}
