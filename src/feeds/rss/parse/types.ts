import type { Entry as AtomEntry, Feed as AtomFeed } from '../../../namespaces/atom/types.js'
import type { Item as ContentItem } from '../../../namespaces/content/types.js'
import type { ItemOrFeed as DcItemOrFeed } from '../../../namespaces/dc/types.js'
import type { ItemOrFeed as GeoRssItemOrFeed } from '../../../namespaces/georss/types.js'
import type { Feed as ItunesFeed, Item as ItunesItem } from '../../../namespaces/itunes/types.js'
import type { ItemOrFeed as MediaItemOrFeed } from '../../../namespaces/media/types.js'
import type { Feed as PodcastFeed, Item as PodcastItem } from '../../../namespaces/podcast/types.js'
import type { Item as SlashItem } from '../../../namespaces/slash/types.js'
import type { Feed as SyFeed } from '../../../namespaces/sy/types.js'
import type { Item as ThrItem } from '../../../namespaces/thr/types.js'

export type Person = {
  name?: string
  email?: string
  link?: string
}

export type Category = {
  name?: string
  domain?: string
}

export type Cloud = {
  domain?: string
  port?: number
  path?: string
  registerProcedure?: string
  protocol?: string
}

export type Enclosure = {
  url?: string
  length?: number
  type?: string
}

export type Guid = string

export type Source = {
  title?: string
  url?: string
}

export type Image = {
  url?: string
  title?: string
  link?: string
  description?: string
  height?: number
  width?: number
}

export type TextInput = {
  title?: string
  description?: string
  name?: string
  link?: string
}

export type Item = {
  title?: string
  link?: string
  description?: string
  authors?: Array<Person>
  categories?: Array<Category>
  comments?: string
  enclosure?: Enclosure
  guid?: Guid
  pubDate?: string
  source?: Source
  content?: ContentItem
  atom?: AtomEntry
  dc?: DcItemOrFeed
  slash?: SlashItem
  itunes?: ItunesItem
  podcast?: PodcastItem
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
  thr?: ThrItem
}

export type Feed = {
  title?: string
  link?: string
  description?: string
  language?: string
  copyright?: string
  managingEditor?: Person
  webMaster?: Person
  pubDate?: string
  lastBuildDate?: string
  categories?: Array<Category>
  generator?: string
  docs?: string
  cloud?: Cloud
  ttl?: number
  image?: Image
  rating?: string
  textInput?: TextInput
  skipHours?: Array<number>
  skipDays?: Array<string>
  items?: Array<Item>
  atom?: AtomFeed
  dc?: DcItemOrFeed
  sy?: SyFeed
  itunes?: ItunesFeed
  podcast?: PodcastFeed
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
}
