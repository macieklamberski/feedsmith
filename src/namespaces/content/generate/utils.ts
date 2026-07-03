import { isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, trimObject } from '../../../common/utils.js'
import type { ContentNs } from '../common/types.js'

export const generateItem: GenerateUtil<ContentNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'content:encoded': generateCdataString(item?.encoded),
  }

  return trimObject(value)
}
