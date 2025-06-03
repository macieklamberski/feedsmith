import type { ParseFunction, Unreliable } from '../../../common/types.js'
import {
  isNonEmptyString,
  isObject,
  isPresent,
  parseArrayOf,
  parseNumber,
  parseSingularOf,
  parseTextNumber,
  parseTextString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { Box, ItemOrFeed, Line, Point, Polygon } from '../common/types.js'

export const parseLatLngPairs = (
  value: Unreliable,
  pairsCount?: { min?: number; max?: number },
): Array<Point> | undefined => {
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

  const points: Array<Point> = []

  for (let i = 0; i < numericParts.length; i += 2) {
    const lat = numericParts[i]
    const lng = numericParts[i + 1]

    if (isPresent(lat) && isPresent(lng)) {
      points.push({ lat, lng })
    }
  }

  return points.length > 0 ? points : undefined
}

export const parsePoint: ParseFunction<Point> = (value) => {
  return parseLatLngPairs(retrieveText(value), { min: 1, max: 1 })?.[0]
}

export const parseLine: ParseFunction<Line> = (value) => {
  const points = parseLatLngPairs(retrieveText(value), { min: 2 })

  if (isPresent(points)) {
    return { points }
  }
}

export const parsePolygon: ParseFunction<Polygon> = (value) => {
  const points = parseLatLngPairs(retrieveText(value), { min: 4 })

  if (isPresent(points)) {
    return { points }
  }
}

export const parseBox: ParseFunction<Box> = (value) => {
  const points = parseLatLngPairs(retrieveText(value), { min: 2, max: 2 })
  const box = {
    lowerCorner: points?.[0],
    upperCorner: points?.[1],
  }

  if (isPresent(box.lowerCorner) && isPresent(box.upperCorner)) {
    return box as Box
  }
}

export const retrieveItemOrFeed: ParseFunction<ItemOrFeed> = (value) => {
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
    featureTypeTag: parseSingularOf(value['georss:featuretypetag'], parseTextString),
    relationshipTag: parseSingularOf(value['georss:relationshiptag'], parseTextString),
    featureName: parseSingularOf(value['georss:featurename'], parseTextString),
    elev: parseSingularOf(value['georss:elev'], parseTextNumber),
    floor: parseSingularOf(value['georss:floor'], parseTextNumber),
    radius: parseSingularOf(value['georss:radius'], parseTextNumber),
  }

  return trimObject(itemOrFeed) as ItemOrFeed
}
