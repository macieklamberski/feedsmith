import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace MediaNs {
  export type Rating<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<string> // Required in spec.
      scheme?: string
    },
    TStrict
  >

  export type TitleOrDescription<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<string> // Required in spec.
      type?: string
    },
    TStrict
  >

  export type Thumbnail<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      height?: number
      width?: number
      time?: string
    },
    TStrict
  >

  export type Category<TStrict extends boolean = false> = Strict<
    {
      name: Requirable<string> // Required in spec.
      scheme?: string
      label?: string
    },
    TStrict
  >

  export type Hash<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<string> // Required in spec.
      algo?: string
    },
    TStrict
  >

  export type Player<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      height?: number
      width?: number
    },
    TStrict
  >

  export type Credit<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<string> // Required in spec.
      role?: string
      scheme?: string
    },
    TStrict
  >

  export type Copyright<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<string> // Required in spec.
      url?: string
    },
    TStrict
  >

  export type Text<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<string> // Required in spec.
      type?: string
      lang?: string
      start?: string
      end?: string
    },
    TStrict
  >

  export type Restriction<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<string> // Required in spec.
      relationship: Requirable<string> // Required in spec.
      type?: string
    },
    TStrict
  >

  export type Community<TStrict extends boolean = false> = {
    starRating?: StarRating
    statistics?: Statistics
    tags?: Array<Tag<TStrict>>
  }

  export type StarRating = {
    average?: number
    count?: number
    min?: number
    max?: number
  }

  export type Statistics = {
    views?: number
    favorites?: number
  }

  export type Tag<TStrict extends boolean = false> = Strict<
    {
      name: Requirable<string> // Required in spec.
      weight?: number
    },
    TStrict
  >

  export type Embed<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      width?: number
      height?: number
      params?: Array<Param<TStrict>>
    },
    TStrict
  >

  export type Param<TStrict extends boolean = false> = Strict<
    {
      name: Requirable<string> // Required in spec.
      value: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Status<TStrict extends boolean = false> = Strict<
    {
      state: Requirable<string> // Required in spec.
      reason?: string
    },
    TStrict
  >

  export type Price = {
    type?: string
    info?: string
    price?: number
    currency?: string
  }

  export type License<TStrict extends boolean = false> = {
    name?: string // At least one of name or href is required in spec.
    type?: string
    href?: string // At least one of name or href is required in spec.
  } & (TStrict extends true ? { name: string } | { href: string } : unknown)

  export type SubTitle<TStrict extends boolean = false> = Strict<
    {
      type?: string
      lang?: string
      href: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type PeerLink<TStrict extends boolean = false> = Strict<
    {
      type?: string
      href: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Rights = {
    status?: string
  }

  export type Scene = {
    title?: string
    description?: string
    startTime?: string
    endTime?: string
  }

  export type Location = {
    description?: string
    start?: string
    end?: string
    lat?: number
    lng?: number
  }

  /** @internal Shared elements available across Content, Group, ItemOrFeed types. */
  export type CommonElements<TStrict extends boolean = false> = {
    ratings?: Array<Rating<TStrict>>
    title?: TitleOrDescription<TStrict>
    description?: TitleOrDescription<TStrict>
    keywords?: Array<string>
    thumbnails?: Array<Thumbnail<TStrict>>
    categories?: Array<Category<TStrict>>
    hashes?: Array<Hash<TStrict>>
    player?: Player<TStrict>
    credits?: Array<Credit<TStrict>>
    copyright?: Copyright<TStrict>
    texts?: Array<Text<TStrict>>
    restrictions?: Array<Restriction<TStrict>>
    community?: Community<TStrict>
    comments?: Array<string>
    embed?: Embed<TStrict>
    responses?: Array<string>
    backLinks?: Array<string>
    status?: Status<TStrict>
    prices?: Array<Price>
    licenses?: Array<License<TStrict>>
    subTitles?: Array<SubTitle<TStrict>>
    peerLinks?: Array<PeerLink<TStrict>>
    locations?: Array<Location>
    rights?: Rights
    scenes?: Array<Scene>
  }

  export type Content<TStrict extends boolean = false> = {
    url?: string
    fileSize?: number
    type?: string
    medium?: string
    isDefault?: boolean
    expression?: string
    bitrate?: number
    framerate?: number
    samplingrate?: number
    channels?: number
    duration?: number
    height?: number
    width?: number
    lang?: string
  } & CommonElements<TStrict>

  export type Group<TStrict extends boolean = false> = {
    contents?: Array<Content<TStrict>>
  } & CommonElements<TStrict>

  export type ItemOrFeed<TStrict extends boolean = false> = {
    groups?: Array<Group<TStrict>>
    contents?: Array<Content<TStrict>>

    /** @deprecated Use `groups` (array) instead. Multiple media:group elements are allowed per specification. */
    group?: Group<TStrict>
  } & CommonElements<TStrict>
}
// #endregion reference
