import { isPlainObject, trimObject } from 'trousse'
import type { DateLike, GenerateUtil } from '../../../common/types.js'
import { generateCdataString, generateRfc3339Date } from '../../../common/utils.js'
import type { EvNs } from '../common/types.js'

export const generateItem: GenerateUtil<EvNs.Item<DateLike>> = (item) => {
  if (!isPlainObject(item)) {
    return
  }

  const value = {
    'ev:startdate': generateRfc3339Date(item.startDate),
    'ev:enddate': generateRfc3339Date(item.endDate),
    'ev:location': generateCdataString(item.location),
    'ev:organizer': generateCdataString(item.organizer),
    'ev:type': generateCdataString(item.type),
  }

  return trimObject(value)
}
