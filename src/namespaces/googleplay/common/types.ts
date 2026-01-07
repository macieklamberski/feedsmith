import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace GooglePlayNs {
  export type Image<TStrict extends boolean = false> = Strict<
    {
      href: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Item<TStrict extends boolean = false> = {
    author?: string
    description?: string
    explicit?: boolean | 'clean'
    block?: boolean
    image?: Image<TStrict>
  }

  export type Feed<TStrict extends boolean = false> = {
    author?: string
    description?: string
    explicit?: boolean | 'clean'
    block?: boolean
    image?: Image<TStrict>
    newFeedUrl?: string
    email?: string
    categories?: Array<string>
  }
}
// #endregion reference
