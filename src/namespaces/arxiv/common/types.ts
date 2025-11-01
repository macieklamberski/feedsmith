// #region reference
export namespace ArxivNs {
  export type PrimaryCategory = {
    term?: string
    scheme?: string
    label?: string
  }

  export type Author = {
    affiliation?: string
  }

  export type Entry = {
    comment?: string
    journalRef?: string
    doi?: string
    primaryCategory?: PrimaryCategory
  }
}
// #endregion reference
