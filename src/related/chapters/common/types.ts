import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace Chapters {
  export type Location<TStrict extends boolean = false> = Strict<
    {
      name: Requirable<string> // Required in spec.
      geo: Requirable<string> // Required in spec.
      osm?: string
    },
    TStrict
  >

  export type Chapter<TStrict extends boolean = false> = Strict<
    {
      startTime: Requirable<number> // Required in spec.
      title?: string
      img?: string
      url?: string
      toc?: boolean
      endTime?: number
      location?: Location<TStrict>
    },
    TStrict
  >

  export type Document<TStrict extends boolean = false> = Strict<
    {
      chapters: Requirable<Array<Chapter<TStrict>>> // Required in spec.
      author?: string
      title?: string
      podcastName?: string
      description?: string
      fileName?: string
      waypoints?: boolean
    },
    TStrict
  >
}
// #endregion reference
