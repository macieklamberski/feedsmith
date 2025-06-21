import type { DateLike, DeepPartial, Unreliable } from '../../../common/types.js'
import type { ItemOrFeed as DcItemOrFeed } from '../../../namespaces/dc/common/types.js'
import type { ItemOrFeed as DctermsItemOrFeed } from '../../../namespaces/dcterms/common/types.js'
import type { ItemOrFeed as GeoRssItemOrFeed } from '../../../namespaces/georss/common/types.js'
import type {
  Feed as ItunesFeed,
  Item as ItunesItem,
} from '../../../namespaces/itunes/common/types.js'
import type { ItemOrFeed as MediaItemOrFeed } from '../../../namespaces/media/common/types.js'
import type { Item as SlashItem } from '../../../namespaces/slash/common/types.js'
import type { Feed as SyFeed } from '../../../namespaces/sy/common/types.js'
import type { Item as ThrItem, Link as ThrLink } from '../../../namespaces/thr/common/types.js'

export type ParsePartialFunction<R> = (
  value: Unreliable,
  options?: { prefix?: string; asNamespace?: boolean },
) => DeepPartial<R> | undefined

export type GenerateFunction<V> = (
  value: V | undefined,
  options?: { prefix?: string; asNamespace?: boolean },
) => Unreliable | undefined

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
  updated?: TDate
}

export type Entry<TDate extends DateLike> = {
  authors?: Array<Person>
  categories?: Array<Category>
  content?: Text
  contributors?: Array<Person>
  id: string
  links?: Array<Link<TDate>>
  published?: TDate
  rights?: Text
  source?: Source<TDate>
  summary?: Text
  title: Text
  updated?: TDate
  dc?: DcItemOrFeed<TDate>
  dcterms?: DctermsItemOrFeed<TDate>
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
  id: string
  links?: Array<Link<TDate>>
  logo?: string
  rights?: Text
  subtitle?: Text
  title: Text
  updated: TDate
  entries?: Array<Entry<TDate>>
  dc?: DcItemOrFeed<TDate>
  dcterms?: DctermsItemOrFeed<TDate>
  sy?: SyFeed<TDate>
  itunes?: ItunesFeed
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
}
