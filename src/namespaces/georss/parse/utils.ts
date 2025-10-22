import type { ParseExactUtil, ParsePartialUtil, Unreliable } from '../../../common/types.js'
import {
  isNonEmptyString,
  isObject,
  isPresent,
  parseArrayOf,
  parseNumber,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { Georss } from '../common/types.js'

export const parseLatLngPairs = (
  value: Unreliable,
  pairsCount?: { min?: number; max?: number },
): Array<Georss.Point> | undefined => {
  if (!isNonEmptyString(value)) {
    return
  }

  const rawParts = value.split(/\s+/)
  const numericParts = parseArrayOf(rawParts, parseNumber)

  if (!numericParts || numericParts.length % 2 !== 0 || rawParts.length !== numericParts.length) {
    return
  }

  const actualPairCount = numericParts.length / 2

  if (
    (pairsCount?.min && actualPairCount < pairsCount?.min) ||
    (pairsCount?.max && actualPairCount > pairsCount?.max)
  ) {
    return
  }

  const points: Array<Georss.Point> = []

  for (let i = 0; i < numericParts.length; i += 2) {
    const lat = numericParts[i]
    const lng = numericParts[i + 1]

    if (isPresent(lat) && isPresent(lng)) {
      points.push({ lat, lng })
    }
  }

  return points.length > 0 ? points : undefined
}

export const parsePoint: ParseExactUtil<Georss.Point> = (value) => {
  return parseLatLngPairs(retrieveText(value), { min: 1, max: 1 })?.[0]
}

export const parseLine: ParseExactUtil<Georss.Line> = (value) => {
  const points = parseLatLngPairs(retrieveText(value), { min: 2 })

  if (isPresent(points)) {
    return { points }
  }
}

export const parsePolygon: ParseExactUtil<Georss.Polygon> = (value) => {
  const points = parseLatLngPairs(retrieveText(value), { min: 4 })

  if (isPresent(points)) {
    return { points }
  }
}

export const parseBox: ParseExactUtil<Georss.Box> = (value) => {
  const points = parseLatLngPairs(retrieveText(value), { min: 2, max: 2 })
  const lowerCorner = points?.[0]
  const upperCorner = points?.[1]

  if (isPresent(lowerCorner) && isPresent(upperCorner)) {
    return { lowerCorner, upperCorner }
  }
}

export const retrieveItemOrFeed: ParsePartialUtil<Georss.ItemOrFeed> = (value) => {
  if (!isObject(value)) {
    return
  }

  const itemOrFeed = {
    point: parseSingularOf(value['georss:point'], parsePoint),
    line: parseSingularOf(value['georss:line'], parseLine),
    polygon: parseSingularOf(value['georss:polygon'], parsePolygon),
    box: parseSingularOf(value['georss:box'], parseBox),
    // TODO: Implement when (or if) GeoRSS-GML and GML namespace are implemented.
    // where: parseSingularOf(value['georss:where'], parseWhere),
    featureTypeTag: parseSingularOf(value['georss:featuretypetag'], (value) =>
      parseString(retrieveText(value)),
    ),
    relationshipTag: parseSingularOf(value['georss:relationshiptag'], (value) =>
      parseString(retrieveText(value)),
    ),
    featureName: parseSingularOf(value['georss:featurename'], (value) =>
      parseString(retrieveText(value)),
    ),
    elev: parseSingularOf(value['georss:elev'], (value) => parseNumber(retrieveText(value))),
    floor: parseSingularOf(value['georss:floor'], (value) => parseNumber(retrieveText(value))),
    radius: parseSingularOf(value['georss:radius'], (value) => parseNumber(retrieveText(value))),
  }

  return trimObject(itemOrFeed)
}
