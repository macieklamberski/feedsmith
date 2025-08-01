import type { GenerateFunction } from '@/common/types.js'
import {
  generateCdataString,
  generateCsvOf,
  generateNumber,
  isObject,
  trimObject,
} from '@/common/utils.js'
import type { Item } from '@/namespaces/slash/common/types.js'

export const generateItem: GenerateFunction<Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'slash:section': generateCdataString(item.section),
    'slash:department': generateCdataString(item.department),
    'slash:comments': generateNumber(item.comments),
    'slash:hit_parade': generateCsvOf(item.hitParade, generateNumber),
  }

  return trimObject(value)
}
