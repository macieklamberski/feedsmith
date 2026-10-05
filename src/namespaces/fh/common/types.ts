// #region reference
export namespace FhNs {
  export type Feed = {
    complete?: boolean
    archive?: boolean
    /** @deprecated Defined by the Feed History drafts, dropped by RFC 5005. Use `complete` instead. */
    incremental?: boolean
    /** @deprecated Defined by the Feed History drafts. RFC 5005 uses a `prev-archive` link instead. */
    prev?: string
  }
}
// #endregion reference
