import { isPlainObject, trimObject } from 'trousse'
import type { GenerateUtil } from '../../../common/types.js'
import { generateNumber, generatePlainString } from '../../../common/utils.js'
import type { GmlNs } from '../common/types.js'

export const generateCoordinates = (
  coordinates: Array<GmlNs.Coordinates> | undefined,
): string | undefined => {
  if (!coordinates) {
    return
  }

  const values: Array<number> = []

  for (const coordinate of coordinates) {
    if (typeof coordinate.lat !== 'number' || typeof coordinate.lng !== 'number') {
      return
    }

    values.push(coordinate.lat, coordinate.lng)

    if (typeof coordinate.alt === 'number') {
      values.push(coordinate.alt)
    }
  }

  if (values.length === 0) {
    return
  }

  return values.join(' ')
}

export const generatePosition: GenerateUtil<GmlNs.Position> = (position) => {
  if (!isPlainObject(position)) {
    return
  }

  const value = {
    '#text': generateCoordinates([position]),
    '@srsName': generatePlainString(position.srsName),
    '@srsDimension': generateNumber(position.srsDimension),
  }

  if (!value['#text']) {
    return
  }

  return trimObject(value)
}

export const generatePositionList: GenerateUtil<GmlNs.PositionList> = (positionList) => {
  if (!isPlainObject(positionList)) {
    return
  }

  const value = {
    '#text': generateCoordinates(positionList.points),
    '@srsName': generatePlainString(positionList.srsName),
    '@srsDimension': generateNumber(positionList.srsDimension),
    '@count': generateNumber(positionList.count),
  }

  if (!value['#text']) {
    return
  }

  return trimObject(value)
}

const generateGeometry = (geometry: GmlNs.Geometry) => {
  return {
    '@gml:id': generatePlainString(geometry.id),
    '@srsName': generatePlainString(geometry.srsName),
    '@srsDimension': generateNumber(geometry.srsDimension),
  }
}

export const generatePoint: GenerateUtil<GmlNs.Point> = (point) => {
  if (!isPlainObject(point)) {
    return
  }

  const value = {
    ...generateGeometry(point),
    'gml:pos': generatePosition(point.pos),
  }

  return trimObject(value)
}

export const generateLineString: GenerateUtil<GmlNs.LineString> = (lineString) => {
  if (!isPlainObject(lineString)) {
    return
  }

  const value = {
    ...generateGeometry(lineString),
    'gml:posList': generatePositionList(lineString.posList),
  }

  return trimObject(value)
}

export const generateLinearRing: GenerateUtil<GmlNs.LinearRing> = (linearRing) => {
  if (!isPlainObject(linearRing)) {
    return
  }

  const value = {
    ...generateGeometry(linearRing),
    'gml:posList': generatePositionList(linearRing.posList),
  }

  return trimObject(value)
}

export const generateExterior: GenerateUtil<GmlNs.Exterior> = (exterior) => {
  if (!isPlainObject(exterior)) {
    return
  }

  const value = {
    'gml:LinearRing': generateLinearRing(exterior.linearRing),
  }

  return trimObject(value)
}

export const generatePolygon: GenerateUtil<GmlNs.Polygon> = (polygon) => {
  if (!isPlainObject(polygon)) {
    return
  }

  const value = {
    ...generateGeometry(polygon),
    'gml:exterior': generateExterior(polygon.exterior),
  }

  return trimObject(value)
}

export const generateEnvelope: GenerateUtil<GmlNs.Envelope> = (envelope) => {
  if (!isPlainObject(envelope)) {
    return
  }

  const value = {
    '@srsName': generatePlainString(envelope.srsName),
    '@srsDimension': generateNumber(envelope.srsDimension),
    'gml:lowerCorner': generatePosition(envelope.lowerCorner),
    'gml:upperCorner': generatePosition(envelope.upperCorner),
  }

  return trimObject(value)
}

export const generateRadius: GenerateUtil<GmlNs.Radius> = (radius) => {
  if (!isPlainObject(radius)) {
    return
  }

  const value = {
    '#text': generateNumber(radius.value),
    '@uom': generatePlainString(radius.uom),
  }

  if (value['#text'] === undefined) {
    return
  }

  return trimObject(value)
}

export const generateCircleByCenterPoint: GenerateUtil<GmlNs.CircleByCenterPoint> = (
  circleByCenterPoint,
) => {
  if (!isPlainObject(circleByCenterPoint)) {
    return
  }

  const value = {
    '@numArc': generateNumber(circleByCenterPoint.numArc),
    '@interpolation': generatePlainString(circleByCenterPoint.interpolation),
    'gml:pos': generatePosition(circleByCenterPoint.pos),
    'gml:radius': generateRadius(circleByCenterPoint.radius),
  }

  return trimObject(value)
}

export const generateWhere: GenerateUtil<GmlNs.Where> = (where) => {
  if (!isPlainObject(where)) {
    return
  }

  const value = {
    'gml:Point': generatePoint(where.point),
    'gml:LineString': generateLineString(where.lineString),
    'gml:Polygon': generatePolygon(where.polygon),
    'gml:Envelope': generateEnvelope(where.envelope),
    'gml:CircleByCenterPoint': generateCircleByCenterPoint(where.circleByCenterPoint),
  }

  return trimObject(value)
}
