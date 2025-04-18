import type { ParseFunction } from '../../common/types.js'
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
} from '../../common/utils.js'
import type { HitParade, Item } from './types.js'

export const parseHitParade: ParseFunction<HitParade> = (value) => {
  if (!isNonEmptyStringOrNumber(value)) {
    return
  }

  const hitParade = parseString(value)?.split(',')

  if (hitParade) {
    return trimArray(hitParade, parseNumber)
  }
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = trimObject({
    section: parseSingularOf(value['slash:section'], parseTextString),
    department: parseSingularOf(value['slash:department'], parseTextString),
    comments: parseSingularOf(value['slash:comments'], parseTextNumber),
    hit_parade: parseSingularOf(value['slash:hit_parade'], (value) =>
      parseHitParade(retrieveText(value)),
    ),
  })

  return item
}
