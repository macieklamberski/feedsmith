import type { GenerateFunction } from '../../../common/types.js'
import { generateString, isObject, trimObject } from '../../../common/utils.js'
import type { Item } from '../common/types.js'

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'content:encoded': generateString(item?.encoded),
  }

  return trimObject(value)
}
