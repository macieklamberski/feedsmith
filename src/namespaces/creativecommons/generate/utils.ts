import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, isObject, trimArray, trimObject } from '../../../common/utils.js'
import type { CreativecommonsNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<CreativecommonsNs.ItemOrFeed> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'creativeCommons:license': trimArray(itemOrFeed.licenses, generateCdataString),
  }

  return trimObject(value)
}
