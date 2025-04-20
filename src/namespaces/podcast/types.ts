export type Transcript = {
  url?: string
  type?: string
  language?: string
  rel?: string
}

export type Locked = {
  value?: boolean
  owner?: string
}

export type Funding = {
  url?: string
  display?: string
}

export type Chapters = {
  url?: string
  type?: string
}

export type Soundbite = {
  startTime?: number
  duration?: number
  display?: string
}

export type Person = {
  display?: string // Taken from #text.
  role?: string
  group?: string
  img?: string
  href?: string
}

export type Location = {
  display?: string // Taken from #text.
  geo?: string
  osm?: string
}

export type Season = {
  number?: number // Taken from #text.
  name?: string
}

export type Episode = {
  number?: number
  display?: string
}

export type Trailer = {
  display?: string // Taken from #text.
  url?: string
  pubdate?: string // RFC2822 date.
  length?: number
  type?: string
  season?: number
}

export type License = {
  display?: string
  url?: string
}

export type AlternateEnclosure = {
  type?: string
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
  uri?: string
  contentType?: string
}

export type Integrity = {
  type?: string
  value?: string
}

export type Value = {
  type?: string
  method?: string
  suggested?: number
  valueRecipients?: Array<ValueRecipient>
  valueTimeSplits?: Array<ValueTimeSplit>
}

export type ValueRecipient = {
  name?: string
  customKey?: string
  customValue?: string
  type?: string
  address?: string
  split?: number
  fee?: boolean
}

export type Images = {
  srcset?: string
}

export type LiveItem = Item & {
  status?: string // Spec says: 'pending' | 'live' | 'ended'.
  start?: string // Date in ISO8601.
  end?: string // Date in ISO8601.
  contentlinks?: Array<ContentLink>
}

export type ContentLink = {
  href?: string
  display?: string
}

export type SocialInteract = {
  uri?: string
  protocol?: string
  accountId?: string
  accountUrl?: string
  priority?: number
}

export type Block = {
  value?: boolean
  id?: string
}

export type Txt = {
  display?: string
  purpose?: string
}

export type RemoteItem = {
  feedGuid?: string
  feedUrl?: string
  itemGuid?: string
  medium?: string
}

export type Podroll = {
  remoteItems?: Array<RemoteItem>
}

export type UpdateFrequency = {
  display?: string
  complete?: boolean
  dtstart?: string // Date ISO8601.
  rrule?: string
}

export type Podping = {
  usesPodping?: boolean
}

export type ValueTimeSplit = {
  startTime?: number
  duration?: number
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
  socialInteracts?: Array<SocialInteract>
  txts?: Array<Txt>
}

export type Channel = {
  locked?: Locked
  fundings?: Array<Funding>
  persons?: Array<Person>
  location?: Location
  trailers?: Array<Trailer>
  license?: License
  guid?: string
  value?: Value
  medium?: string
  images?: string // TODO: Convert it to an array of { url, viewport }?
  liveItems?: Array<LiveItem>
  blocks?: Array<Block>
  txts?: Array<Txt>
  remoteItems?: Array<RemoteItem>
  updateFrequency?: UpdateFrequency
  podping?: Podping
}
