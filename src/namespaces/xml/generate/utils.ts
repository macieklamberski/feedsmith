import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generatePlainString } from '../../../common/utils.js'
import type { XmlNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<XmlNs.ItemOrFeed> = (itemOrFeed) => {
  if (!isPlainObject(itemOrFeed)) {
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
