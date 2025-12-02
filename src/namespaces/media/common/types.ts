// #region reference
export namespace MediaNs {
  export type Rating = {
    value?: string // Required in spec.
    scheme?: string
  }

  export type TitleOrDescription = {
    value?: string // Required in spec.
    type?: string
  }

  export type Thumbnail = {
    url?: string // Required in spec.
    height?: number
    width?: number
    time?: string
  }

  export type Category = {
    name?: string // Required in spec.
    scheme?: string
    label?: string
  }

  export type Hash = {
    value?: string // Required in spec.
    algo?: string
  }

  export type Player = {
    url?: string // Required in spec.
    height?: number
    width?: number
  }

  export type Credit = {
    value?: string // Required in spec.
    role?: string
    scheme?: string
  }

  export type Copyright = {
    value?: string // Required in spec.
    url?: string
  }

  export type Text = {
    value?: string // Required in spec.
    type?: string
    lang?: string
    start?: string
    end?: string
  }

  export type Restriction = {
    value?: string // Required in spec.
    relationship?: string // Required in spec.
    type?: string
  }

  export type Community = {
    starRating?: StarRating
    statistics?: Statistics
    tags?: Array<Tag>
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

  export type Tag = {
    name?: string // Required in spec.
    weight?: number
  }

  export type Embed = {
    url?: string // Required in spec.
    width?: number
    height?: number
    params?: Array<Param>
  }

  export type Param = {
    name?: string // Required in spec.
    value?: string // Required in spec.
  }

  export type Status = {
    state?: string // Required in spec.
    reason?: string
  }

  export type Price = {
    type?: string
    info?: string
    price?: number
    currency?: string
  }

  export type License = {
    name?: string // At least one of name or href is required in spec.
    type?: string
    href?: string // At least one of name or href is required in spec.
  }

  export type SubTitle = {
    type?: string
    lang?: string
    href?: string // Required in spec.
  }

  export type PeerLink = {
    type?: string
    href?: string // Required in spec.
  }

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
  export type CommonElements = {
    ratings?: Array<Rating>
    title?: TitleOrDescription
    description?: TitleOrDescription
    keywords?: Array<string>
    thumbnails?: Array<Thumbnail>
    categories?: Array<Category>
    hashes?: Array<Hash>
    player?: Player
    credits?: Array<Credit>
    copyright?: Copyright
    texts?: Array<Text>
    restrictions?: Array<Restriction>
    community?: Community
    comments?: Array<string>
    embed?: Embed
    responses?: Array<string>
    backLinks?: Array<string>
    status?: Status
    prices?: Array<Price>
    licenses?: Array<License>
    subTitles?: Array<SubTitle>
    peerLinks?: Array<PeerLink>
    locations?: Array<Location>
    rights?: Rights
    scenes?: Array<Scene>
  }

  export type Content = {
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
  } & CommonElements

  export type Group = {
    contents?: Array<Content>
  } & CommonElements

  export type ItemOrFeed = {
    groups?: Array<Group>
    contents?: Array<Content>

    /** @deprecated Use `groups` (array) instead. Multiple media:group elements are allowed per specification. */
    group?: Group
  } & CommonElements
}
// #endregion reference
