// #region reference
export namespace GeoRssNs {
  export type Point = {
    lat?: number // Required in spec.
    lng?: number // Required in spec.
  }

  export type Line = {
    points?: Array<Point> // Required in spec.
  }

  export type Polygon = {
    points?: Array<Point> // Required in spec.
  }

  export type Box = {
    lowerCorner?: Point // Required in spec.
    upperCorner?: Point // Required in spec.
  }

  export type ItemOrFeed = {
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
  }
}
// #endregion reference
