import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace OpenSearchNs {
  export type Query<TStrict extends boolean = false> = Strict<
    {
      role: Requirable<string> // Required in spec.
      searchTerms?: string
      count?: number
      startIndex?: number
      startPage?: number
      language?: string
      inputEncoding?: string
      outputEncoding?: string
    },
    TStrict
  >

  export type Feed<TStrict extends boolean = false> = {
    totalResults?: number
    startIndex?: number
    itemsPerPage?: number
    queries?: Array<Query<TStrict>>
  }
}
// #endregion reference
