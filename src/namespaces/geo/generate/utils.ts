import { isPlainObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateNumber, trimObject } from '../../../common/utils.js'
import type { GeoNs } from '../common/types.js'

export const generateItemOrFeed: GenerateUtil<GeoNs.ItemOrFeed> = (geo) => {
  if (!isPlainObject(geo)) {
    return
  }

  const value = {
    'geo:lat': generateNumber(geo.lat),
    'geo:long': generateNumber(geo.long),
    'geo:alt': generateNumber(geo.alt),
  }

  return trimObject(value)
}
