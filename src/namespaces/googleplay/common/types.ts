// #region reference
export namespace GoogleplayNs {
  export type Image = {
    href: string
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
