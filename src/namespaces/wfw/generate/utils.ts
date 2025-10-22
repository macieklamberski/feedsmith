import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimObject } from '../../../common/utils.js'
import type { Wfw } from '../common/types.js'

export const generateItem: GenerateUtil<Wfw.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'wfw:comment': generateCdataString(item.comment),
    'wfw:commentRss': generateCdataString(item.commentRss),
  }

  return trimObject(value)
}
