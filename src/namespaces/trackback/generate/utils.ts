import { isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateCdataString, trimArray, trimObject } from '../../../common/utils.js'
import type { TrackbackNs } from '../common/types.js'

export const generateItem: GenerateUtil<TrackbackNs.Item> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'trackback:ping': generateCdataString(item.ping),
    'trackback:about': trimArray(item.abouts, generateCdataString),
  }

  return trimObject(value)
}
