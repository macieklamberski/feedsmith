import type { GenerateFunction } from '../../../common/types.js'
import { isNonEmptyString, isObject, trimObject } from '../../../common/utils.js'
import type { Item } from '../common/types.js'

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  return trimObject({
    'wfw:comment': isNonEmptyString(item.comment) ? item.comment : undefined,
    'wfw:commentRss': isNonEmptyString(item.commentRss) ? item.commentRss : undefined,
  })
}
