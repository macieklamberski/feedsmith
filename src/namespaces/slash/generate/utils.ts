import type { GenerateFunction } from '../../../common/types.js'
import { isObject, trimObject } from '../../../common/utils.js'
import type { Item } from '../common/types.js'

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  return trimObject({
    'slash:section': item.section,
    'slash:department': item.department,
    'slash:comments': item.comments,
    'slash:hit_parade': item.hit_parade?.join(','),
  })
}
