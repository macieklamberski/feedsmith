// #region reference
export namespace WikiNs {
  export type Interwiki = {
    value?: string
    link?: string
  }

  export type Feed = {
    interwiki?: Interwiki
  }

  export type Item = {
    host?: string
    version?: string
    status?: string
    importance?: string
    diff?: string
    history?: string
  }
}
// #endregion reference
