import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimObject } from '../../../common/utils.js'
import type { WfwNs } from '../common/types.js'

export const generateItem: GenerateUtil<WfwNs.Item> = (item) => {
  if (!isObject(item)) {
    return
  }

  const value = {
    'wfw:comment': generateCdataString(item.comment),
    'wfw:commentRss': generateCdataString(item.commentRss),
  }

  return trimObject(value)
}
