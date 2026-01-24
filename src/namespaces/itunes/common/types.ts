import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace ItunesNs {
  // NOTE: BaseCategory contains non-recursive fields wrapped in Strict<>.
  // Category extends it and adds recursive categories field separately.
  export type BaseCategory<TStrict extends boolean = false> = Strict<
    {
      text: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Category<TStrict extends boolean = false> = BaseCategory<TStrict> & {
    categories?: Array<Category<TStrict>>
  }

  export type Owner = {
    name?: string
    email?: string
  }

  export type Item = {
    duration?: number
    image?: string
    explicit?: boolean
    author?: string
    title?: string
    episode?: number
    season?: number
    episodeType?: string
    block?: boolean
    /** @deprecated Use standard RSS description instead. No longer used by Apple Podcasts. */
    summary?: string
    /** @deprecated No longer used by Apple Podcasts. */
    subtitle?: string
    /** @deprecated No longer used for search in Apple Podcasts. */
    keywords?: Array<string>
  }

  export type Feed<TStrict extends boolean = false> = {
    image?: string
    categories?: Array<Category<TStrict>>
    explicit?: boolean
    author?: string
    title?: string
    type?: string
    newFeedUrl?: string
    block?: boolean
    complete?: boolean
    applePodcastsVerify?: string
    /** @deprecated Use standard RSS description instead. No longer used by Apple Podcasts. */
    summary?: string
    /** @deprecated No longer used by Apple Podcasts. */
    subtitle?: string
    /** @deprecated No longer used for search in Apple Podcasts. */
    keywords?: Array<string>
    /** @deprecated No longer supported by Apple Podcasts. */
    owner?: Owner
  }
}
// #endregion reference
