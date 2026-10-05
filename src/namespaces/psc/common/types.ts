import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace PscNs {
  export type Chapter<TStrict extends boolean = false> = Strict<
    {
      start: Requirable<string> // Required in spec
      title: Requirable<string> // Required in spec
      href?: string
      image?: string
    },
    TStrict
  >

  export type Chapters<TStrict extends boolean = false> = Strict<
    {
      version: Requirable<string> // Required in spec
      items?: Array<Chapter<TStrict>>
    },
    TStrict
  >

  export type Item<TStrict extends boolean = false> = {
    chapters?: Chapters<TStrict>
  }
}
// #endregion reference
