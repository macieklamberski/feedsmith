import type { GenerateFunction } from '../../../common/types.js'
import { generateString, isObject, trimObject } from '../../../common/utils.js'
import type { Item } from '../common/types.js'

export const generateItem: GenerateFunction<Item> = (value) => {
  if (!isObject(value)) {
    return
  }

  return trimObject({
    'content:encoded': generateString(value?.encoded),
  })
}
