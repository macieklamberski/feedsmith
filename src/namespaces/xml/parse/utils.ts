import { isPlainObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseString, trimObject } from '../../../common/utils.js'
import type { XmlNs } from '../common/types.js'

export const retrieveItemOrFeed: ParseUtilPartial<XmlNs.ItemOrFeed> = (value) => {
  if (!isPlainObject(value)) {
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
