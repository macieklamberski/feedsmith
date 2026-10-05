// #region reference
export namespace WebfeedsNs {
  export type Cover = {
    image?: string
  }

  export type Related = {
    layout?: string
    target?: string
  }

  export type Analytics = {
    id?: string
    engine?: string
  }

  export type FeaturedImage = {
    url?: string
    type?: string
    width?: number
    height?: number
  }

  export type Feed = {
    cover?: Cover
    icon?: string
    logo?: string
    accentColor?: string
    related?: Related
    analytics?: Analytics
    partial?: boolean
  }

  export type Item = {
    featuredImage?: FeaturedImage
  }
}
// #endregion reference
