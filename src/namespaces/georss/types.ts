export type Point = {
  lat?: number
  lng?: number
}

export type Line = {
  points?: Array<Point>
}

export type Polygon = {
  points?: Array<Point>
}

export type Box = {
  lowerLeftCorner?: Point
  upperRightCorner?: Point
}

export type Where = {
  // TODO: Implement when GML namespace is implemented.
  gml?: unknown
}

export type ItemOrFeed = {
  point?: Point
  line?: Line
  polygon?: Polygon
  box?: Box
  where?: Where
  featureTypeTag?: string
  relationshipTag?: string
  featureName?: string
  elev?: number
  floor?: number
}
