import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace OpenSearchNs {
  export type Query<TStrict extends boolean = false> = Strict<
    {
      role: Requirable<string> // Required in spec
      title?: string
      totalResults?: number
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

  export type Link<TStrict extends boolean = false> = Strict<
    {
      href: Requirable<string> // Required in spec
      rel?: string
      type?: string
      hreflang?: string
    },
    TStrict
  >

  export type Feed<TStrict extends boolean = false> = {
    totalResults?: number
    startIndex?: number
    itemsPerPage?: number
    /** @deprecated Since OpenSearch 1.1 Draft 3. Use atom:link with rel="search" instead. */
    link?: Link<TStrict>
    queries?: Array<Query<TStrict>>
  }
}
// #endregion reference
