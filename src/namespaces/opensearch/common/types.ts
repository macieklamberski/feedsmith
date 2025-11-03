// #region reference
export namespace OpensearchNs {
  export type Query = {
    role: string
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
