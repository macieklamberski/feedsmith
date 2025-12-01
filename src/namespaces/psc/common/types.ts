// #region reference
export namespace PscNs {
  export type Chapter = {
    start?: string // Required in spec.
    title?: string // Required in spec.
    href?: string
    image?: string
  }

  export type Item = {
    chapters?: Array<Chapter>
  }
}
// #endregion reference
