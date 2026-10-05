// #region reference
export namespace PingbackNs {
  export type Feed = {
    /** @deprecated Not defined by the Pingback module. Will be removed in v4. */
    to?: string
  }

  export type Item = {
    server?: string
    target?: string
    abouts?: Array<string>
  }
}
// #endregion reference
