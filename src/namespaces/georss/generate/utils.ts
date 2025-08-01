import type { GenerateFunction } from '@/common/types.js'
import { generateCdataString, generateNumber, isObject, trimObject } from '@/common/utils.js'
import type { Box, ItemOrFeed, Line, Point, Polygon } from '@/namespaces/georss/common/types.js'

export const generateLatLngPairs = (
  points: Array<Point>,
  pairsCount?: { min?: number; max?: number },
): string | undefined => {
  const coordinates: Array<string> = []

  for (const point of points) {
    if (typeof point.lat === 'number' && typeof point.lng === 'number') {
      coordinates.push(`${point.lat} ${point.lng}`)
    }
  }

  if (coordinates.length === 0) {
    return
  }

  const actualPairCount = coordinates.length

  if (
    (pairsCount?.min && actualPairCount < pairsCount.min) ||
    (pairsCount?.max && actualPairCount > pairsCount.max)
  ) {
    return
  }

  return coordinates.join(' ')
}

export const generatePoint: GenerateFunction<Point> = (point) => {
  if (!isObject(point)) {
    return
  }

  return generateLatLngPairs([point], { min: 1, max: 1 })
}

export const generateLine: GenerateFunction<Line> = (line) => {
  if (!isObject(line)) {
    return
  }

  return generateLatLngPairs(line.points, { min: 2 })
}

export const generatePolygon: GenerateFunction<Polygon> = (polygon) => {
  if (!isObject(polygon)) {
    return
  }

  return generateLatLngPairs(polygon.points, { min: 4 })
}

export const generateBox: GenerateFunction<Box> = (box) => {
  if (!isObject(box) || !box.lowerCorner || !box.upperCorner) {
    return
  }

  return generateLatLngPairs([box.lowerCorner, box.upperCorner], { min: 2, max: 2 })
}

export const generateItemOrFeed: GenerateFunction<ItemOrFeed> = (itemOrFeed) => {
  if (!isObject(itemOrFeed)) {
    return
  }

  const value = {
    'georss:point': generatePoint(itemOrFeed.point),
    'georss:line': generateLine(itemOrFeed.line),
    'georss:polygon': generatePolygon(itemOrFeed.polygon),
    'georss:box': generateBox(itemOrFeed.box),
    'georss:featureTypeTag': generateCdataString(itemOrFeed.featureTypeTag),
    'georss:relationshipTag': generateCdataString(itemOrFeed.relationshipTag),
    'georss:featureName': generateCdataString(itemOrFeed.featureName),
    'georss:elev': generateNumber(itemOrFeed.elev),
    'georss:floor': generateNumber(itemOrFeed.floor),
    'georss:radius': generateNumber(itemOrFeed.radius),
  }

  return trimObject(value)
}
