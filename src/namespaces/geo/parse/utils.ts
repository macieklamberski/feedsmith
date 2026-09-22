import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import { parseNumber, parseSingularOf, retrieveText } from '../../../common/utils.js'
import type { GeoNs } from '../common/types.js'

export const parsePoint: ParseUtilPartial<GeoNs.ItemOrFeed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const point = {
    lat: parseSingularOf(value['geo:lat'], (value) => parseNumber(retrieveText(value))),
    long: parseSingularOf(value['geo:long'], (value) => parseNumber(retrieveText(value))),
    alt: parseSingularOf(value['geo:alt'], (value) => parseNumber(retrieveText(value))),
  }

  return trimObject(point)
}

// See: https://www.w3.org/2003/01/geo/. Coordinates may also sit inside a geo:Point.
export const retrieveItemOrFeed: ParseUtilPartial<GeoNs.ItemOrFeed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const bare = parsePoint(value)
  const point = parseSingularOf(value['geo:point'], parsePoint)

  const geo = {
    lat: bare?.lat ?? point?.lat,
    long: bare?.long ?? point?.long,
    alt: bare?.alt ?? point?.alt,
  }

  return trimObject(geo)
}
