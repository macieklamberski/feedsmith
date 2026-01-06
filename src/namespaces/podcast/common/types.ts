import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace PodcastNs {
  /** @internal Common properties shared by Item and LiveItem. */
  export type BaseItem = {
    transcripts?: Array<Transcript>
    chapters?: Chapters
    soundbites?: Array<Soundbite>
    persons?: Array<Person>
    locations?: Array<Location>
    season?: Season
    episode?: Episode
    license?: License
    alternateEnclosures?: Array<AlternateEnclosure>
    values?: Array<Value>
    images?: Array<Image>
    socialInteracts?: Array<SocialInteract>
    txts?: Array<Txt>
    chat?: Chat

    /** @deprecated Use `locations` (array) instead. Multiple podcast:location elements are allowed per specification. */
    location?: Location
    /** @deprecated Use `values` (array) instead. Multiple podcast:value elements are allowed per specification. */
    value?: Value
    /** @deprecated Use `chat` (singular) instead. Only one podcast:chat element is allowed per specification. */
    chats?: Array<Chat>
  }

  export type Transcript = {
    url?: string // Required in spec.
    type?: string // Required in spec.
    language?: string
    rel?: string
  }

  export type Locked = {
    value?: boolean // Required in spec.
    owner?: string
  }

  export type Funding = {
    url?: string // Required in spec.
    display?: string
  }

  export type Chapters = {
    url?: string // Required in spec.
    type?: string // Required in spec.
  }

  export type Soundbite = {
    startTime?: number // Required in spec.
    duration?: number // Required in spec.
    display?: string
  }

  export type Person = {
    display?: string // Required in spec.
    role?: string
    group?: string
    img?: string
    href?: string
  }

  export type Location = {
    display?: string // Required in spec.
    rel?: string
    geo?: string
    osm?: string
    country?: string
  }

  export type Season = {
    number?: number // Required in spec.
    name?: string
  }

  export type Episode = {
    number?: number // Required in spec.
    display?: string
  }

  export type Trailer<TDate extends DateLike> = {
    display?: string // Required in spec.
    url?: string // Required in spec.
    pubDate?: TDate // Required in spec.
    length?: number
    type?: string
    season?: number
  }

  export type License = {
    display?: string // Required in spec.
    url?: string
  }

  export type AlternateEnclosure = {
    type?: string // Required in spec.
    length?: number
    bitrate?: number
    height?: number
    lang?: string
    title?: string
    rel?: string
    codecs?: string
    default?: boolean
    sources?: Array<Source>
    integrity?: Integrity
  }

  export type Source = {
    uri?: string // Required in spec.
    contentType?: string
  }

  export type Integrity = {
    type?: string // Required in spec.
    value?: string // Required in spec.
  }

  export type Value = {
    type?: string // Required in spec.
    method?: string // Required in spec.
    suggested?: number
    valueRecipients?: Array<ValueRecipient>
    valueTimeSplits?: Array<ValueTimeSplit>
  }

  export type ValueRecipient = {
    name?: string
    customKey?: string
    customValue?: string
    type?: string // Required in spec.
    address?: string // Required in spec.
    split?: number // Required in spec.
    fee?: boolean
  }

  /** @internal Legacy type for parsing podcast:images with srcset attribute. */
  export type Images = {
    srcset?: string
  }

  export type Image = {
    href?: string // Required in spec.
    alt?: string
    aspectRatio?: string
    width?: number
    height?: number
    type?: string
    purpose?: string
  }

  export type LiveItem<TDate extends DateLike> = BaseItem & {
    status?: string // Required in spec.
    start?: TDate // Required in spec. Date: ISO 8601.
    end?: TDate // Date: ISO 8601.
    contentLinks?: Array<ContentLink>
  }

  export type ContentLink = {
    href?: string // Required in spec.
    display?: string
  }

  export type SocialInteract = {
    // INFO: The specification states that the `uri` is required. However, if the protocol is set
    // to `disabled`, no other attributes are necessary. To bypass the protocol value check, which
    // may be invalid, only the protocol is required to ensure consistent behavior.
    uri?: string
    protocol?: string // Required in spec.
    accountId?: string
    accountUrl?: string
    priority?: number
  }

  export type Chat = {
    server?: string // Required in spec.
    protocol?: string // Required in spec.
    accountId?: string
    space?: string
  }

  export type Block = {
    value?: boolean // Required in spec.
    id?: string
  }

  export type Txt = {
    display?: string // Required in spec.
    purpose?: string
  }

  export type RemoteItem = {
    feedGuid?: string // Required in spec.
    feedUrl?: string
    itemGuid?: string
    medium?: string
    title?: string
  }

  export type Podroll = {
    remoteItems?: Array<RemoteItem>
  }

  export type UpdateFrequency<TDate extends DateLike> = {
    display?: string // Required in spec.
    complete?: boolean
    dtstart?: TDate
    rrule?: string
  }

  export type Podping = {
    usesPodping?: boolean
  }

  export type Publisher = {
    remoteItem?: RemoteItem
  }

  export type ValueTimeSplit = {
    startTime?: number // Required in spec.
    duration?: number // Required in spec.
    remoteStartTime?: number
    remotePercentage?: number
    remoteItem?: RemoteItem
    valueRecipients?: Array<ValueRecipient>
  }

  export type Item = BaseItem

  export type Feed<TDate extends DateLike> = {
    locked?: Locked
    fundings?: Array<Funding>
    persons?: Array<Person>
    locations?: Array<Location>
    trailers?: Array<Trailer<TDate>>
    license?: License
    guid?: string
    values?: Array<Value>
    medium?: string
    images?: Array<Image>
    liveItems?: Array<LiveItem<TDate>>
    blocks?: Array<Block>
    txts?: Array<Txt>
    remoteItems?: Array<RemoteItem>
    podroll?: Podroll
    updateFrequency?: UpdateFrequency<TDate>
    podping?: Podping
    chat?: Chat
    publisher?: Publisher

    /** @deprecated Use `locations` (array) instead. Multiple podcast:location elements are allowed per specification. */
    location?: Location
    /** @deprecated Use `values` (array) instead. Multiple podcast:value elements are allowed per specification. */
    value?: Value
    /** @deprecated Use `chat` (singular) instead. Only one podcast:chat element is allowed per specification. */
    chats?: Array<Chat>
  }
}
// #endregion reference
