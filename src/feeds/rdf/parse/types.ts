import type { Entry as AtomEntry, Feed as AtomFeed } from '../../../namespaces/atom/types.js'
import type { Item as ContentItem } from '../../../namespaces/content/types.js'
import type { ItemOrFeed as DcItemOrFeed } from '../../../namespaces/dc/types.js'
import type { ItemOrFeed as GeoRssItemOrFeed } from '../../../namespaces/georss/types.js'
import type { Feed as ItunesFeed, Item as ItunesItem } from '../../../namespaces/itunes/types.js'
import type { ItemOrFeed as MediaItemOrFeed } from '../../../namespaces/media/types.js'
import type { Item as SlashItem } from '../../../namespaces/slash/types.js'
import type { Feed as SyFeed } from '../../../namespaces/sy/types.js'
import type { Item as ThrItem } from '../../../namespaces/thr/types.js'

export type Image = {
  title?: string
  link?: string
  url?: string
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
  atom?: AtomEntry
  content?: ContentItem
  dc?: DcItemOrFeed
  slash?: SlashItem
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
}

export type Feed = {
  title?: string
  link?: string
  description?: string
  image?: Image
  items?: Array<Item>
  textInput?: TextInput
  atom?: AtomFeed
  dc?: DcItemOrFeed
  sy?: SyFeed
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
}
