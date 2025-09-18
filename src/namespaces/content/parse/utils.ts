import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { Item } from '../common/types.js'

export const retrieveItem: ParsePartialUtil<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    encoded: parseSingularOf(value['content:encoded'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(item)
}
