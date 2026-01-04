// #region reference
export namespace RdfNs {
  export type About = {
    about?: string
  }

  /** @internal General RDF element kept for potential future use when all RDF data is needed. */
  export type Element = {
    about?: string
    resource?: string
    id?: string
    nodeId?: string
    parseType?: string
    datatype?: string
    type?: string
    value?: Array<unknown>
  }
}
// #endregion reference
