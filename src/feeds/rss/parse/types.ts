import type { Entry as AtomEntry, Feed as AtomFeed } from '../../../namespaces/atom/types'
import type { Item as ContentItem } from '../../../namespaces/content/types'
import type { ItemOrFeed as DcItemOrFeed } from '../../../namespaces/dc/types'
import type { Feed as ItunesFeed, Item as ItunesItem } from '../../../namespaces/itunes/types'
import type { Item as SlashItem } from '../../../namespaces/slash/types'
import type { Feed as SyFeed } from '../../../namespaces/sy/types'

export type Author = string

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
  authors?: Array<Author>
  categories?: Array<Category>
  comments?: string
  enclosure?: Enclosure
  guid?: Guid
  pubDate?: string
  source?: Source
  atom?: AtomEntry
  content?: ContentItem
  dc?: DcItemOrFeed
  slash?: SlashItem
  itunes?: ItunesItem
}

export type Feed = {
  title?: string
  link?: string
  description?: string
  language?: string
  copyright?: string
  managingEditor?: string
  webMaster?: string
  pubDate?: string
  lastBuildDate?: string
  authors?: Array<Author>
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
}
