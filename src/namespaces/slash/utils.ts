import type { ParseFunction } from '../../common/types.js'
import {
  hasAnyProps,
  isNonEmptyStringOrNumber,
  isObject,
  omitNullishFromArray,
  omitUndefinedFromObject,
  parseNumber,
  parseString,
} from '../../common/utils.js'
import type { HitParade, Item } from './types.js'

export const parseHitParade: ParseFunction<HitParade> = (value) => {
  if (!isNonEmptyStringOrNumber(value)) {
    return
  }

  const hitParade = omitNullishFromArray(
    value
      .toString()
      .split(',')
      .map((subValue) => parseNumber(subValue)),
  )

  if (hitParade.length > 0) {
    return hitParade
  }
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    section: parseString(value['slash:section']?.['#text']),
    department: parseString(value['slash:department']?.['#text']),
    comments: parseNumber(value['slash:comments']?.['#text']),
    hit_parade: parseHitParade(value['slash:hit_parade']?.['#text']),
  }

  if (hasAnyProps(item, ['section', 'department', 'comments', 'hit_parade'])) {
    return omitUndefinedFromObject(item)
  }
}
