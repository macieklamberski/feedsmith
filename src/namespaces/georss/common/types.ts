import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace GeoRssNs {
  export type Point<TStrict extends boolean = false> = Strict<
    {
      lat: Requirable<number> // Required in spec.
      lng: Requirable<number> // Required in spec.
    },
    TStrict
  >

  export type Line<TStrict extends boolean = false> = Strict<
    {
      points: Requirable<Array<Point<TStrict>>> // Required in spec.
    },
    TStrict
  >

  export type Polygon<TStrict extends boolean = false> = Strict<
    {
      points: Requirable<Array<Point<TStrict>>> // Required in spec.
    },
    TStrict
  >

  export type Box<TStrict extends boolean = false> = Strict<
    {
      lowerCorner: Requirable<Point<TStrict>> // Required in spec.
      upperCorner: Requirable<Point<TStrict>> // Required in spec.
    },
    TStrict
  >

  export type ItemOrFeed<TStrict extends boolean = false> = {
    point?: Point<TStrict>
    line?: Line<TStrict>
    polygon?: Polygon<TStrict>
    box?: Box<TStrict>
    featureTypeTag?: string
    relationshipTag?: string
    featureName?: string
    elev?: number
    floor?: number
    radius?: number
  }
}
// #endregion reference
