import type { Entry as AtomEntry, Feed as AtomFeed } from '../../../namespaces/atom/types.js'
import type { Item as ContentItem } from '../../../namespaces/content/types.js'
import type { ItemOrFeed as DcItemOrFeed } from '../../../namespaces/dc/types.js'
import type { Feed as ItunesFeed, Item as ItunesItem } from '../../../namespaces/itunes/types.js'
import type { Item as SlashItem } from '../../../namespaces/slash/types.js'
import type { Feed as SyFeed } from '../../../namespaces/sy/types.js'

export type Image = {
  title?: string
  link?: string
  url?: string
}

export type Textinput = {
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
  itunes?: ItunesItem
}

export type Feed = {
  title?: string
  link?: string
  description?: string
  image?: Image
  items?: Array<Item>
  textinput?: Textinput
  atom?: AtomFeed
  dc?: DcItemOrFeed
  sy?: SyFeed
  itunes?: ItunesFeed
}
