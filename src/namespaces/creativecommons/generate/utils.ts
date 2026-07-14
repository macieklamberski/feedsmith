import { isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, trimArray, trimObject } from '../../../common/utils.js'
import type { CreativeCommonsNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<CreativeCommonsNs.ItemOrFeed> = (itemOrFeed) => {
  if (!isPlainObject(itemOrFeed)) {
    return
  }

  const value = {
    'creativeCommons:license': trimArray(itemOrFeed.licenses, generateCdataString),
  }

  return trimObject(value)
}
