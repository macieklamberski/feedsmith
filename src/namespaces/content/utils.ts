import type { ParseFunction } from '../../common/types.js'
import { isObject, parseString, trimObject } from '../../common/utils.js'
import type { Item } from './types.js'

export const parseItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = trimObject({
    encoded: parseString(value['content:encoded']?.['#text']),
  })

  return item
}
