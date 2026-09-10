import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace PodcastNs {
  /** @internal Common properties shared by Item and LiveItem. */
  export type BaseItem<TStrict extends boolean = false> = {
    transcripts?: Array<Transcript<TStrict>>
    chapters?: Chapters<TStrict>
    soundbites?: Array<Soundbite<TStrict>>
    persons?: Array<Person<TStrict>>
    locations?: Array<Location<TStrict>>
    season?: Season<TStrict>
    episode?: Episode<TStrict>
    license?: License<TStrict>
    alternateEnclosures?: Array<AlternateEnclosure<TStrict>>
    values?: Array<Value<TStrict>>
    images?: Array<Image<TStrict>>
    socialInteracts?: Array<SocialInteract<TStrict>>
    txts?: Array<Txt<TStrict>>
    chat?: Chat<TStrict>
  }

  export type Transcript<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      type: Requirable<string> // Required in spec.
      language?: string
      rel?: string
    },
    TStrict
  >

  export type Locked<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<boolean> // Required in spec.
      owner?: string
    },
    TStrict
  >

  export type Funding<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      display?: string
    },
    TStrict
  >

  export type Chapters<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      type: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Soundbite<TStrict extends boolean = false> = Strict<
    {
      startTime: Requirable<number> // Required in spec.
      duration: Requirable<number> // Required in spec.
      display?: string
    },
    TStrict
  >

  export type Person<TStrict extends boolean = false> = Strict<
    {
      display: Requirable<string> // Required in spec.
      role?: string
      group?: string
      img?: string
      href?: string
    },
    TStrict
  >

  export type Location<TStrict extends boolean = false> = Strict<
    {
      display: Requirable<string> // Required in spec.
      rel?: string
      geo?: string
      osm?: string
      country?: string
    },
    TStrict
  >

  export type Season<TStrict extends boolean = false> = Strict<
    {
      number: Requirable<number> // Required in spec.
      name?: string
    },
    TStrict
  >

  export type Episode<TStrict extends boolean = false> = Strict<
    {
      number: Requirable<number> // Required in spec.
      display?: string
    },
    TStrict
  >

  export type Trailer<TDate, TStrict extends boolean = false> = Strict<
    {
      display: Requirable<string> // Required in spec.
      url: Requirable<string> // Required in spec.
      pubDate: Requirable<TDate> // Required in spec.
      length?: number
      type?: string
      season?: number
    },
    TStrict
  >

  export type License<TStrict extends boolean = false> = Strict<
    {
      display: Requirable<string> // Required in spec.
      url?: string
    },
    TStrict
  >

  export type AlternateEnclosure<TStrict extends boolean = false> = Strict<
    {
      type: Requirable<string> // Required in spec.
      length?: number
      bitrate?: number
      height?: number
      lang?: string
      title?: string
      rel?: string
      codecs?: string
      default?: boolean
      sources?: Array<Source<TStrict>>
      integrity?: Integrity<TStrict>
    },
    TStrict
  >

  export type Source<TStrict extends boolean = false> = Strict<
    {
      uri: Requirable<string> // Required in spec.
      contentType?: string
    },
    TStrict
  >

  export type Integrity<TStrict extends boolean = false> = Strict<
    {
      type: Requirable<string> // Required in spec.
      value: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Value<TStrict extends boolean = false> = Strict<
    {
      type: Requirable<string> // Required in spec.
      method: Requirable<string> // Required in spec.
      suggested?: number
      valueRecipients?: Array<ValueRecipient<TStrict>>
      valueTimeSplits?: Array<ValueTimeSplit<TStrict>>
    },
    TStrict
  >

  export type ValueRecipient<TStrict extends boolean = false> = Strict<
    {
      name?: string
      customKey?: string
      customValue?: string
      type: Requirable<string> // Required in spec.
      address: Requirable<string> // Required in spec.
      split: Requirable<number> // Required in spec.
      fee?: boolean
    },
    TStrict
  >

  /** @internal Legacy type for parsing podcast:images with srcset attribute. */
  export type Images = {
    srcset?: string
  }

  export type Image<TStrict extends boolean = false> = Strict<
    {
      href: Requirable<string> // Required in spec.
      alt?: string
      aspectRatio?: string
      width?: number
      height?: number
      type?: string
      purpose?: string
    },
    TStrict
  >

  export type LiveItem<TDate, TStrict extends boolean = false> = BaseItem<TStrict> &
    Strict<
      {
        status: Requirable<string> // Required in spec.
        start: Requirable<TDate> // Required in spec. Date: ISO 8601.
        end?: TDate // Date: ISO 8601.
        contentLinks?: Array<ContentLink<TStrict>>
      },
      TStrict
    >

  export type ContentLink<TStrict extends boolean = false> = Strict<
    {
      href: Requirable<string> // Required in spec.
      display?: string
    },
    TStrict
  >

  export type SocialInteract<TStrict extends boolean = false> = Strict<
    {
      // INFO: The specification states that the `uri` is required. However, if the protocol is set
      // to `disabled`, no other attributes are necessary. To bypass the protocol value check, which
      // may be invalid, only the protocol is required to ensure consistent behavior.
      uri?: string
      protocol: Requirable<string> // Required in spec.
      accountId?: string
      accountUrl?: string
      priority?: number
    },
    TStrict
  >

  export type Chat<TStrict extends boolean = false> = Strict<
    {
      server: Requirable<string> // Required in spec.
      protocol: Requirable<string> // Required in spec.
      accountId?: string
      space?: string
    },
    TStrict
  >

  export type Block<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<boolean> // Required in spec.
      id?: string
    },
    TStrict
  >

  export type Txt<TStrict extends boolean = false> = Strict<
    {
      display: Requirable<string> // Required in spec.
      purpose?: string
    },
    TStrict
  >

  export type RemoteItem<TStrict extends boolean = false> = Strict<
    {
      feedGuid: Requirable<string> // Required in spec.
      feedUrl?: string
      itemGuid?: string
      medium?: string
      title?: string
    },
    TStrict
  >

  export type Podroll<TStrict extends boolean = false> = {
    remoteItems?: Array<RemoteItem<TStrict>>
  }

  export type UpdateFrequency<TDate, TStrict extends boolean = false> = Strict<
    {
      display: Requirable<string> // Required in spec.
      complete?: boolean
      dtstart?: TDate
      rrule?: string
    },
    TStrict
  >

  export type Podping = {
    usesPodping?: boolean
  }

  export type Publisher<TStrict extends boolean = false> = {
    remoteItem?: RemoteItem<TStrict>
  }

  export type ValueTimeSplit<TStrict extends boolean = false> = Strict<
    {
      startTime: Requirable<number> // Required in spec.
      duration: Requirable<number> // Required in spec.
      remoteStartTime?: number
      remotePercentage?: number
      remoteItem?: RemoteItem<TStrict>
      valueRecipients?: Array<ValueRecipient<TStrict>>
    },
    TStrict
  >

  export type Item<TStrict extends boolean = false> = BaseItem<TStrict>

  export type Feed<TDate, TStrict extends boolean = false> = {
    locked?: Locked<TStrict>
    fundings?: Array<Funding<TStrict>>
    persons?: Array<Person<TStrict>>
    locations?: Array<Location<TStrict>>
    trailers?: Array<Trailer<TDate, TStrict>>
    license?: License<TStrict>
    guid?: string
    values?: Array<Value<TStrict>>
    medium?: string
    images?: Array<Image<TStrict>>
    liveItems?: Array<LiveItem<TDate, TStrict>>
    blocks?: Array<Block<TStrict>>
    txts?: Array<Txt<TStrict>>
    remoteItems?: Array<RemoteItem<TStrict>>
    podroll?: Podroll<TStrict>
    updateFrequency?: UpdateFrequency<TDate, TStrict>
    podping?: Podping
    chat?: Chat<TStrict>
    publisher?: Publisher<TStrict>
  }
}
// #endregion reference
