import type { ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseCsvOf,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { SlashNs } from '../common/types.js'

export const parseHitParade: ParseUtilPartial<SlashNs.HitParade> = (value) => {
  return parseCsvOf(value, parseNumber)
}

export const retrieveItem: ParseUtilPartial<SlashNs.Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    section: parseSingularOf(value['slash:section'], (value) => parseString(retrieveText(value))),
    department: parseSingularOf(value['slash:department'], (value) =>
      parseString(retrieveText(value)),
    ),
    comments: parseSingularOf(value['slash:comments'], (value) => parseNumber(retrieveText(value))),
    hitParade: parseSingularOf(value['slash:hit_parade'], (value) =>
      parseHitParade(retrieveText(value)),
    ),
  }

  return trimObject(item)
}
