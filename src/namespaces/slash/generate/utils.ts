import { isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generateCsvOf,
  generateNumber,
  trimObject,
} from '../../../common/utils.js'
import type { SlashNs } from '../common/types.js'

export const generateItem: GenerateUtil<SlashNs.Item> = (item) => {
  if (!isPlainObject(item)) {
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
