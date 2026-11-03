// #region reference
export namespace FhNs {
  export type Feed = {
    complete?: boolean
    archive?: boolean
    /** @deprecated Defined by the Feed History drafts, dropped by RFC 5005. Use `complete` instead. */
    incremental?: boolean
    /** @deprecated Defined by Feed History drafts 02 and 03, replaced by `incremental` in draft 04. */
    stateful?: boolean
    /** @deprecated Defined by the Feed History drafts. RFC 5005 uses a `prev-archive` link instead. */
    prev?: string
  }
}
// #endregion reference
