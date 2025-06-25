import type { GenerateFunction } from '../../../common/types.js'
import { isObject, trimObject } from '../../../common/utils.js'
import type { Item } from '../common/types.js'

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'wfw:comment': item.comment,
    'wfw:commentRss': item.commentRss,
  }

  return trimObject(value)
}
