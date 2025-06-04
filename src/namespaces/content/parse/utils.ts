import type { ParseFunction } from '../../../common/types.js'
import { isObject, parseSingularOf, parseTextString, trimObject } from '../../../common/utils.js'
import type { Item } from '../common/types.js'

export const retrieveItem: ParseFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    encoded: parseSingularOf(value['content:encoded'], parseTextString),
  }

  return trimObject(item) as Item
}
