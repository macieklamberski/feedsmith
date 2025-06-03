import type { ParseFunction as CommonParseFunction, DateLike } from '../../../common/types.js'
import type { ItemOrFeed as DcItemOrFeed } from '../../../namespaces/dc/common/types.js'
import type { ItemOrFeed as GeoRssItemOrFeed } from '../../../namespaces/georss/common/types.js'
import type {
  Feed as ItunesFeed,
  Item as ItunesItem,
} from '../../../namespaces/itunes/common/types.js'
import type { ItemOrFeed as MediaItemOrFeed } from '../../../namespaces/media/common/types.js'
import type { Item as SlashItem } from '../../../namespaces/slash/common/types.js'
import type { Feed as SyFeed } from '../../../namespaces/sy/common/types.js'
import type { Item as ThrItem, Link as ThrLink } from '../../../namespaces/thr/common/types.js'

export type ParseFunction<R> = CommonParseFunction<R, { prefix?: string; partial?: boolean }>

// For simplicity's sake, a string is used for now, but this may be reconsidered in the future.
export type Text = string

export type Link<TDate extends DateLike> = {
  href: string
  rel?: string
  type?: string
  hreflang?: string
  title?: string
  length?: number
  thr?: ThrLink<TDate>
}

export type Person = {
  name: string
  uri?: string
  email?: string
}

export type Category = {
  term: string
  scheme?: string
  label?: string
}

export type Generator = {
  text: string
  uri?: string
  version?: string
}

export type Source<TDate extends DateLike> = {
  authors?: Array<Person>
  categories?: Array<Category>
  contributors?: Array<Person>
  generator?: Generator
  icon?: string
  id?: string
  links?: Array<Link<TDate>>
  logo?: string
  rights?: Text
  subtitle?: Text
  title?: Text
  updated?: string
}

export type Entry<TDate extends DateLike> = {
  authors?: Array<Person>
  categories?: Array<Category>
  content?: Text
  contributors?: Array<Person>
  id: string
  links?: Array<Link<TDate>>
  published?: string
  rights?: Text
  source?: Source<TDate>
  summary?: Text
  title: Text
  updated?: string
  dc?: DcItemOrFeed<TDate>
  slash?: SlashItem
  itunes?: ItunesItem
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
  thr?: ThrItem
}

export type Feed<TDate extends DateLike> = {
  authors?: Array<Person>
  categories?: Array<Category>
  contributors?: Array<Person>
  generator?: Generator
  icon?: string
  id?: string
  links?: Array<Link<TDate>>
  logo?: string
  rights?: Text
  subtitle?: Text
  title?: Text
  updated?: string
  entries?: Array<Entry<TDate>>
  dc?: DcItemOrFeed<TDate>
  sy?: SyFeed<TDate>
  itunes?: ItunesFeed
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
} & ({ id: string } | { title: Text })
