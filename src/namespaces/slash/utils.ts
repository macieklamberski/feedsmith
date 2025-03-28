import type { ParseFunction } from '../../common/types'
import {
  hasAnyProps,
  isNonEmptyStringOrNumber,
  isObject,
  omitNullishFromArray,
  omitUndefinedFromObject,
  parseNumber,
  parseString,
} from '../../common/utils'
import type { HitParade, Item } from './types'

export const parseHitParade: ParseFunction<HitParade> = (value) => {
  if (!isNonEmptyStringOrNumber(value)) {
    return
  }

  const hitParade = omitNullishFromArray(value.toString().split(',').map(parseNumber))

  if (hitParade.length > 0) {
    return hitParade
  }
}

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = omitUndefinedFromObject({
    section: parseString(value['slash:section']?.['#text']),
    department: parseString(value['slash:department']?.['#text']),
    comments: parseNumber(value['slash:comments']?.['#text']),
    hit_parade: parseHitParade(value['slash:hit_parade']?.['#text']),
  })

  if (hasAnyProps(item, ['section', 'department', 'comments', 'hit_parade'])) {
    return item
  }
}
