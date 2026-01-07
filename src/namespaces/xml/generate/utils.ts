import type { GenerateUtil } from '../../../common/types.js'
import { generatePlainString, isObject, trimObject } from '../../../common/utils.js'
import type { ItemOrFeed } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<ItemOrFeed> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    '@xml:lang': generatePlainString(itemOrFeed.lang),
    '@xml:base': generatePlainString(itemOrFeed.base),
    '@xml:space': generatePlainString(itemOrFeed.space),
    '@xml:id': generatePlainString(itemOrFeed.id),
  }

  return trimObject(value)
}
