import type { ParseUtilPartial } from '../../../common/types.js'
import {
  isObject,
  parseNumber,
  parseSingularOf,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { GeoNs } from '../common/types.js'

export const retrieveItemOrFeed: ParseUtilPartial<GeoNs.ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const geo = {
    lat: parseSingularOf(value['geo:lat'], (value) => parseNumber(retrieveText(value))),
    long: parseSingularOf(value['geo:long'], (value) => parseNumber(retrieveText(value))),
    alt: parseSingularOf(value['geo:alt'], (value) => parseNumber(retrieveText(value))),
  }

  return trimObject(geo)
}
