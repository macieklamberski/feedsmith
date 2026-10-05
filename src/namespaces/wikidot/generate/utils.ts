import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString } from '../../../common/utils.js'
import type { WikidotNs } from '../common/types.js'

export const generateItem: GenerateUtil<WikidotNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'wikidot:authorName': generateCdataString(item.authorName),
    'wikidot:authorUserId': generateCdataString(item.authorUserId),
  }

  return trimObject(value)
}
