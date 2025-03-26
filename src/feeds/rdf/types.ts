import type { Entry as AtomEntry, Feed as AtomFeed } from '../../namespaces/atom/types'
import type { Item as ContentItem } from '../../namespaces/content/types'
import type { ItemOrFeed as DcItemOrFeed } from '../../namespaces/dc/types'
import type { Feed as SyFeed } from '../../namespaces/sy/types'

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
}
