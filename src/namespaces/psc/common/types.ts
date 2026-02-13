import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace PscNs {
  export type Chapter<TStrict extends boolean = false> = Strict<
    {
      start: Requirable<string> // Required in spec.
      title: Requirable<string> // Required in spec.
      href?: string
      image?: string
    },
    TStrict
  >

  export type Item<TStrict extends boolean = false> = {
    chapters?: Array<Chapter<TStrict>>
  }
}
// #endregion reference
