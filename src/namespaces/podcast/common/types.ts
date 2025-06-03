import type { DateLike } from '../../../common/types.js'

export type Transcript = {
  url: string
  type: string
  language?: string
  rel?: string
}

export type Locked = {
  value: boolean
  owner?: string
}

export type Funding = {
  url: string
  display?: string
}

export type Chapters = {
  url: string
  type: string
}

export type Soundbite = {
  startTime: number
  duration: number
  display?: string
}

export type Person = {
  display: string
  role?: string
  group?: string
  img?: string
  href?: string
}

export type Location = {
  display: string
  geo?: string
  osm?: string
}

export type Season = {
  number: number
  name?: string
}

export type Episode = {
  number: number
  display?: string
}

export type Trailer<TDate extends DateLike> = {
  display: string
  url: string
  pubDate: TDate // Date: RFC 2822.
  length?: number
  type?: string
  season?: number
}

export type License = {
  display: string
  url?: string
}

export type AlternateEnclosure = {
  type: string
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
  uri: string
  contentType?: string
}

export type Integrity = {
  type: string
  value: string
}

export type Value = {
  type: string
  method: string
  suggested?: number
  valueRecipients?: Array<ValueRecipient>
  valueTimeSplits?: Array<ValueTimeSplit>
}

export type ValueRecipient = {
  name?: string
  customKey?: string
  customValue?: string
  type: string
  address: string
  split: number
  fee?: boolean
}

export type Images = {
  srcset?: string
}

export type LiveItem<TDate extends DateLike> = Item & {
  status: string
  start: TDate // Date: ISO 8601.
  end?: TDate // Date: ISO 8601.
  contentlinks?: Array<ContentLink>
}

export type ContentLink = {
  href: string
  display?: string
}

export type SocialInteract = {
  uri?: string
  protocol: string
  accountId?: string
  accountUrl?: string
  priority?: number
}

export type Block = {
  value: boolean
  id?: string
}

export type Txt = {
  display: string
  purpose?: string
}

export type RemoteItem = {
  feedGuid: string
  feedUrl?: string
  itemGuid?: string
  medium?: string
}

export type Podroll = {
  remoteItems?: Array<RemoteItem>
}

export type UpdateFrequency<TDate extends DateLike> = {
  display: string
  complete?: boolean
  dtstart?: TDate // Date: ISO 8601.
  rrule?: string
}

export type Podping = {
  usesPodping?: boolean
}

export type ValueTimeSplit = {
  startTime: number
  duration: number
  remoteStartTime?: number
  remotePercentage?: number
  remoteItem?: RemoteItem
  valueRecipients?: Array<ValueRecipient>
}

export type Item = {
  transcripts?: Array<Transcript>
  chapters?: Chapters
  soundbites?: Array<Soundbite>
  persons?: Array<Person>
  location?: Location
  season?: Season
  episode?: Episode
  license?: License
  alternateEnclosures?: Array<AlternateEnclosure>
  value?: Value
  images?: Images
  socialInteracts?: Array<SocialInteract>
  txts?: Array<Txt>
}

export type Feed<TDate extends DateLike> = {
  locked?: Locked
  fundings?: Array<Funding>
  persons?: Array<Person>
  location?: Location
  trailers?: Array<Trailer<TDate>>
  license?: License
  guid?: string
  value?: Value
  medium?: string
  images?: Images
  liveItems?: Array<LiveItem<TDate>>
  blocks?: Array<Block>
  txts?: Array<Txt>
  remoteItems?: Array<RemoteItem>
  podroll?: Podroll
  updateFrequency?: UpdateFrequency<TDate>
  podping?: Podping
}
