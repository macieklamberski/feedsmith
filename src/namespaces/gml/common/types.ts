// #region reference
export namespace GmlNs {
  export type Coordinates = {
    lat?: number
    lng?: number
    alt?: number
  }

  export type Position = Coordinates & {
    srsName?: string
    srsDimension?: number
  }

  export type PositionList = {
    points?: Array<Coordinates>
    srsName?: string
    srsDimension?: number
    count?: number
  }

  export type Geometry = {
    id?: string
    srsName?: string
    srsDimension?: number
  }

  export type Point = Geometry & {
    pos?: Position
  }

  export type LineString = Geometry & {
    posList?: PositionList
  }

  export type LinearRing = Geometry & {
    posList?: PositionList
  }

  export type Exterior = {
    linearRing?: LinearRing
  }

  export type Polygon = Geometry & {
    exterior?: Exterior
  }

  export type Envelope = {
    srsName?: string
    srsDimension?: number
    lowerCorner?: Position
    upperCorner?: Position
  }

  export type Radius = {
    value?: number
    uom?: string
  }

  export type CircleByCenterPoint = {
    numArc?: number
    interpolation?: string
    pos?: Position
    radius?: Radius
  }

  export type Where = {
    point?: Point
    lineString?: LineString
    polygon?: Polygon
    envelope?: Envelope
    circleByCenterPoint?: CircleByCenterPoint
  }
}
// #endregion reference
