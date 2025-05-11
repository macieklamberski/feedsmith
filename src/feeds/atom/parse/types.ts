import type { ParseFunction as CommonParseFunction } from '../../../common/types.js'
import type { ItemOrFeed as DcItemOrFeed } from '../../../namespaces/dc/types.js'
import type { Feed as ItunesFeed, Item as ItunesItem } from '../../../namespaces/itunes/types.js'
import type { Item as SlashItem } from '../../../namespaces/slash/types.js'
import type { Feed as SyFeed } from '../../../namespaces/sy/types.js'
import type { Link as ThrLink } from '../../../namespaces/thr/types.js'

export type ParseFunction<R> = CommonParseFunction<R, { prefix?: string; partial?: boolean }>

// For simplicity's sake, a string is used for now, but this may be reconsidered in the future.
export type Text = string

export type Link = {
  href?: string
  rel?: string
  type?: string
  hreflang?: string
  title?: string
  length?: number
  thr?: ThrLink
}

export type Person = {
  name?: string
  uri?: string
  email?: string
}

export type Category = {
  term?: string
  scheme?: string
  label?: string
}

export type Generator = {
  text?: string
  uri?: string
  version?: string
}

export type Source = {
  authors?: Array<Person>
  categories?: Array<Category>
  contributors?: Array<Person>
  generator?: Generator
  icon?: string
  id?: string
  links?: Array<Link>
  logo?: string
  rights?: Text
  subtitle?: Text
  title?: Text
  updated?: string
}

export type Entry = {
  authors?: Array<Person>
  categories?: Array<Category>
  content?: Text
  contributors?: Array<Person>
  id?: string
  links?: Array<Link>
  published?: string
  rights?: Text
  source?: Source
  summary?: Text
  title?: Text
  updated?: string
  dc?: DcItemOrFeed
  slash?: SlashItem
  itunes?: ItunesItem
}

export type Feed = {
  authors?: Array<Person>
  categories?: Array<Category>
  contributors?: Array<Person>
  generator?: Generator
  icon?: string
  id?: string
  links?: Array<Link>
  logo?: string
  rights?: Text
  subtitle?: Text
  title?: Text
  updated?: string
  entries?: Array<Entry>
  dc?: DcItemOrFeed
  sy?: SyFeed
  itunes?: ItunesFeed
}
