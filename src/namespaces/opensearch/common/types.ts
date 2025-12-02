// #region reference
export namespace OpenSearchNs {
  export type Query = {
    role?: string // Required in spec.
    searchTerms?: string
    count?: number
    startIndex?: number
    startPage?: number
    language?: string
    inputEncoding?: string
    outputEncoding?: string
  }

  export type Feed = {
    totalResults?: number
    startIndex?: number
    itemsPerPage?: number
    queries?: Array<Query>
  }
}
// #endregion reference
