import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial, Unreliable } from '../../../common/types.js'
import {
  parseArrayOf,
  parseNumber,
  parseSingular,
  parseSingularOf,
  parseString,
  retrieveText,
} from '../../../common/utils.js'
import type { GmlNs } from '../common/types.js'

const whitespaceRegex = /\s+/

// A position holds latitude then longitude, and a height as a third value when srsDimension is 3.
export const parseCoordinates = (
  value: Unreliable,
  dimension = 2,
): Array<GmlNs.Coordinates> | undefined => {
  const string = parseString(value)

  if (!string || (dimension !== 2 && dimension !== 3)) {
    return
  }

  const rawParts = string.split(whitespaceRegex)
  const numericParts = parseArrayOf(rawParts, parseNumber)

  if (
    !numericParts ||
    rawParts.length !== numericParts.length ||
    numericParts.length % dimension !== 0
  ) {
    return
  }

  const coordinates: Array<GmlNs.Coordinates> = []

  for (let i = 0; i < numericParts.length; i += dimension) {
    const coordinate: GmlNs.Coordinates = { lat: numericParts[i], lng: numericParts[i + 1] }

    if (dimension === 3) {
      coordinate.alt = numericParts[i + 2]
    }

    coordinates.push(coordinate)
  }

  return coordinates
}

// An srsDimension on the position overrides the one inherited from its geometry.
export const parsePosition = (
  value: Unreliable,
  inheritedDimension?: number,
): GmlNs.Position | undefined => {
  const srsDimension = parseNumber(value?.['@srsdimension'])
  const coordinates = parseCoordinates(retrieveText(value), srsDimension ?? inheritedDimension)

  if (coordinates?.length !== 1) {
    return
  }

  const position = {
    ...coordinates[0],
    srsName: parseString(value?.['@srsname']),
    srsDimension,
  }

  return trimObject(position)
}

export const parsePositionList = (
  value: Unreliable,
  inheritedDimension?: number,
): GmlNs.PositionList | undefined => {
  const srsDimension = parseNumber(value?.['@srsdimension'])
  const positionList = {
    points: parseCoordinates(retrieveText(value), srsDimension ?? inheritedDimension),
    srsName: parseString(value?.['@srsname']),
    srsDimension,
    count: parseNumber(value?.['@count']),
  }

  return trimObject(positionList)
}

const parseGeometry = (value: Record<string, Unreliable>): GmlNs.Geometry => {
  return {
    id: parseString(value['@gml:id']),
    srsName: parseString(value['@srsname']),
    srsDimension: parseNumber(value['@srsdimension']),
  }
}

export const parsePoint: ParseUtilPartial<GmlNs.Point> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const geometry = parseGeometry(value)
  const point = {
    ...geometry,
    pos: parsePosition(parseSingular(value['gml:pos']), geometry.srsDimension),
  }

  return trimObject(point)
}

export const parseLineString: ParseUtilPartial<GmlNs.LineString> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const geometry = parseGeometry(value)
  const lineString = {
    ...geometry,
    posList: parsePositionList(parseSingular(value['gml:poslist']), geometry.srsDimension),
  }

  return trimObject(lineString)
}

export const parseLinearRing: ParseUtilPartial<GmlNs.LinearRing> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const geometry = parseGeometry(value)
  const linearRing = {
    ...geometry,
    posList: parsePositionList(parseSingular(value['gml:poslist']), geometry.srsDimension),
  }

  return trimObject(linearRing)
}

export const parseExterior: ParseUtilPartial<GmlNs.Exterior> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const exterior = {
    linearRing: parseSingularOf(value['gml:linearring'], parseLinearRing),
  }

  return trimObject(exterior)
}

export const parsePolygon: ParseUtilPartial<GmlNs.Polygon> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const polygon = {
    ...parseGeometry(value),
    exterior: parseSingularOf(value['gml:exterior'], parseExterior),
  }

  return trimObject(polygon)
}

export const parseEnvelope: ParseUtilPartial<GmlNs.Envelope> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const srsDimension = parseNumber(value['@srsdimension'])
  const envelope = {
    srsName: parseString(value['@srsname']),
    srsDimension,
    lowerCorner: parsePosition(parseSingular(value['gml:lowercorner']), srsDimension),
    upperCorner: parsePosition(parseSingular(value['gml:uppercorner']), srsDimension),
  }

  return trimObject(envelope)
}

export const parseRadius: ParseUtilPartial<GmlNs.Radius> = (value) => {
  const radius = {
    value: parseNumber(retrieveText(value)),
    uom: parseString(value?.['@uom']),
  }

  return trimObject(radius)
}

export const parseCircleByCenterPoint: ParseUtilPartial<GmlNs.CircleByCenterPoint> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const circleByCenterPoint = {
    numArc: parseNumber(value['@numarc']),
    interpolation: parseString(value['@interpolation']),
    pos: parsePosition(parseSingular(value['gml:pos'])),
    radius: parseSingularOf(value['gml:radius'], parseRadius),
  }

  return trimObject(circleByCenterPoint)
}

// GeoRSS allows exactly these five GML geometries inside georss:where.
// See: https://www.ogc.org/standards/georss/.
export const retrieveWhere: ParseUtilPartial<GmlNs.Where> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const where = {
    point: parseSingularOf(value['gml:point'], parsePoint),
    lineString: parseSingularOf(value['gml:linestring'], parseLineString),
    polygon: parseSingularOf(value['gml:polygon'], parsePolygon),
    envelope: parseSingularOf(value['gml:envelope'], parseEnvelope),
    circleByCenterPoint: parseSingularOf(
      value['gml:circlebycenterpoint'],
      parseCircleByCenterPoint,
    ),
  }

  return trimObject(where)
}
