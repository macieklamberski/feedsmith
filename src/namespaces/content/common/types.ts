// #region reference
export namespace ContentNs {
  export type ContentItem = {
    about?: string
    format?: string // Required in spec
    encoding?: string
    value?: string // Required in spec if no about is present
  }

  export type Item = {
    encoded?: string
    items?: Array<ContentItem>
  }

  export type Feed = {
    items?: Array<ContentItem>
  }
}
// #endregion reference
