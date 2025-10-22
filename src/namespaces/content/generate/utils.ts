import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimObject } from '../../../common/utils.js'
import type { Content } from '../common/types.js'

export const generateItem: GenerateUtil<Content.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'content:encoded': generateCdataString(item?.encoded),
  }

  return trimObject(value)
}
