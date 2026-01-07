import type { ParsePartialUtil } from '../../../common/types.js'
import { isObject, parseString, trimObject } from '../../../common/utils.js'
import type { ItemOrFeed } from '../common/types.js'

export const retrieveItemOrFeed: ParsePartialUtil<ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = {
    lang: parseString(value['@xml:lang']),
    base: parseString(value['@xml:base']),
    space: parseString(value['@xml:space']),
    id: parseString(value['@xml:id']),
  }

  return trimObject(itemOrFeed)
}
