// #region reference
export namespace GooglePlayNs {
  export type Image = {
    href?: string // Required in spec.
  }

  export type Item = {
    author?: string
    description?: string
    explicit?: boolean | 'clean'
    block?: boolean
    image?: Image
  }

  export type Feed = {
    author?: string
    description?: string
    explicit?: boolean | 'clean'
    block?: boolean
    image?: Image
    newFeedUrl?: string
    email?: string
    categories?: Array<string>
  }
}
// #endregion reference
