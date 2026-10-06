import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateNumber } from '../../../common/utils.js'
import type { IcbmNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<IcbmNs.ItemOrFeed> = (icbm) => {
  if (!isPlainObject(icbm)) {
    return
  }

  const value = {
    'icbm:latitude': generateNumber(icbm.latitude),
    'icbm:longitude': generateNumber(icbm.longitude),
  }

  return trimObject(value)
}
