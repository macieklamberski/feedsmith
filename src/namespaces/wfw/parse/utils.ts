import type { ParsePartialFunction } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { Item } from '../common/types.js'

export const retrieveItem: ParsePartialFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  const item = {
    comment: parseSingularOf(value['wfw:comment'], (value) => parseString(retrieveText(value))),
    commentRss: parseSingularOf(value['wfw:commentrss'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(item)
}
