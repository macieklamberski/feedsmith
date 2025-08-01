import type { ParsePartialFunction } from '@/common/types.js'
import { isObject, parseSingularOf, parseString, retrieveText, trimObject } from '@/common/utils.js'
import type { Item } from '@/namespaces/content/common/types.js'

export const retrieveItem: ParsePartialFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    encoded: parseSingularOf(value['content:encoded'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(item)
}
