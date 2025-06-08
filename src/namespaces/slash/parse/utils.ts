import type { ParsePartialFunction } from '../../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  isObject,
  parseNumber,
  parseSingularOf,
  parseString,
  parseTextNumber,
  parseTextString,
  retrieveText,
  trimArray,
  trimObject,
} from '../../../common/utils.js'
import type { HitParade, Item } from '../common/types.js'

export const parseHitParade: ParsePartialFunction<HitParade> = (value) => {
  if (!isNonEmptyStringOrNumber(value)) {
    return
  }

  const hitParade = parseString(value)?.split(',')

  if (hitParade) {
    return trimArray(hitParade, parseNumber)
  }
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
