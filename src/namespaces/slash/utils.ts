import type { ParseFunction } from '../../common/types.js'
import {
  isNonEmptyStringOrNumber,
  isObject,
  parseNumber,
  parseString,
  trimArray,
  trimObject,
} from '../../common/utils.js'
import type { HitParade, Item } from './types.js'

export const parseHitParade: ParseFunction<HitParade> = (value) => {
  if (!isNonEmptyStringOrNumber(value)) {
    return
  }

  return trimArray(
    value
      .toString()
      .split(',')
      .map((subValue) => parseNumber(subValue)),
  )
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = trimObject({
    section: parseString(value['slash:section']?.['#text']),
    department: parseString(value['slash:department']?.['#text']),
    comments: parseNumber(value['slash:comments']?.['#text']),
    hit_parade: parseHitParade(value['slash:hit_parade']?.['#text']),
  })

  return item
}
