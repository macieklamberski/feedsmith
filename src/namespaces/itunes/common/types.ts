export type Category = {
  text: string
  categories?: Array<Category>
}

export type Owner = {
  name?: string
  email?: string
}

export type Item = {
  duration?: number
  image?: string
  explicit?: boolean
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

export type Feed = {
  image?: string
  categories?: Array<Category>
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
  /** @deprecated No longer required for submission to Apple Podcasts. */
  owner?: Owner
}
