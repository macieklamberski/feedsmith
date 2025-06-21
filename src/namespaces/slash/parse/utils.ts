import type { ParsePartialFunction } from '../../../common/types.js'
import {
  isObject,
  parseCsvOf,
  parseNumber,
  parseSingularOf,
  parseTextNumber,
  parseTextString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { HitParade, Item } from '../common/types.js'

export const parseHitParade: ParsePartialFunction<HitParade> = (value) => {
  return parseCsvOf(value, parseNumber)
}

export const retrieveItem: ParsePartialFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    section: parseSingularOf(value['slash:section'], parseTextString),
    department: parseSingularOf(value['slash:department'], parseTextString),
    comments: parseSingularOf(value['slash:comments'], parseTextNumber),
    hit_parade: parseSingularOf(value['slash:hit_parade'], (value) =>
      parseHitParade(retrieveText(value)),
    ),
  }

  return trimObject(item)
}
