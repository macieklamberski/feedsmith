import type { AnyOf } from '../../../common/types.js'

export type Point = {
  lat: number
  lng: number
}

export type Line = {
  points: Array<Point>
}

export type Polygon = {
  points: Array<Point>
}

export type Box = {
  lowerCorner: Point
  upperCorner: Point
}

export type ItemOrFeed = AnyOf<{
  point?: Point
  line?: Line
  polygon?: Polygon
  box?: Box
  featureTypeTag?: string
  relationshipTag?: string
  featureName?: string
  elev?: number
  floor?: number
  radius?: number
}>
