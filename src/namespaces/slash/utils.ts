import type { ParseFunction } from '../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  isObject,
  parseNumber,
  parseString,
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
    section: parseString(retrieveText(value['slash:section'])),
    department: parseString(retrieveText(value['slash:department'])),
    comments: parseNumber(retrieveText(value['slash:comments'])),
    hit_parade: parseHitParade(retrieveText(value['slash:hit_parade'])),
  })

  return item
}
