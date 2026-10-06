import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseNumber, parseSingularOf, retrieveText } from '../../../common/utils.js'
import type { IcbmNs } from '../common/types.js'

export const retrieveItemOrFeed: ParseUtilPartial<IcbmNs.ItemOrFeed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const icbm = {
    latitude: parseSingularOf(value['icbm:latitude'], (value) => parseNumber(retrieveText(value))),
    longitude: parseSingularOf(value['icbm:longitude'], (value) => {
      return parseNumber(retrieveText(value))
    }),
  }

  return trimObject(icbm)
}
