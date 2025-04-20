import type { ParseFunction } from '../../common/types.js'
import { isObject, parseSingularOf, parseTextString, trimObject } from '../../common/utils.js'
import type { Item } from './types.js'

export const retrieveItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = trimObject({
    encoded: parseSingularOf(value['content:encoded'], parseTextString),
  })

  return item
}
