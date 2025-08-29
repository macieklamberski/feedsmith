import type { DateLike } from '../../../common/types.js'
import type { Entry as AtomEntry, Feed as AtomFeed } from '../../../namespaces/atom/common/types.js'
import type { Item as ContentItem } from '../../../namespaces/content/common/types.js'
import type { ItemOrFeed as DcItemOrFeed } from '../../../namespaces/dc/common/types.js'
import type { ItemOrFeed as DctermsItemOrFeed } from '../../../namespaces/dcterms/common/types.js'
import type { ItemOrFeed as GeoRssItemOrFeed } from '../../../namespaces/georss/common/types.js'
import type {
  Feed as ItunesFeed,
  Item as ItunesItem,
} from '../../../namespaces/itunes/common/types.js'
import type { ItemOrFeed as MediaItemOrFeed } from '../../../namespaces/media/common/types.js'
import type {
  Feed as PodcastFeed,
  Item as PodcastItem,
} from '../../../namespaces/podcast/common/types.js'
import type { Item as SlashItem } from '../../../namespaces/slash/common/types.js'
import type { Feed as SyFeed } from '../../../namespaces/sy/common/types.js'
import type { Item as ThrItem } from '../../../namespaces/thr/common/types.js'
import type { Item as WfwItem } from '../../../namespaces/wfw/common/types.js'

// #region reference
export type Person = string

export type Category = {
  name: string
  domain?: string
}

export type Cloud = {
  domain: string
  port: number
  path: string
  registerProcedure: string
  protocol: string
}

export type Image = {
  url: string
  title: string
  link: string
  description?: string
  height?: number
  width?: number
}

export type TextInput = {
  title: string
  description: string
  name: string
  link: string
}

export type Enclosure = {
  url: string
  length: number
  type: string
}

export type SkipHours = Array<number>

export type SkipDays = Array<string>

export type Guid = {
  value: string
  isPermaLink?: boolean
}

export type Source = {
  title: string
  url?: string
}

export type Item<TDate extends DateLike> = {
  title?: string
  link?: string
  description?: string
  authors?: Array<Person>
  categories?: Array<Category>
  comments?: string
  enclosures?: Array<Enclosure>
  guid?: Guid
  pubDate?: TDate
  source?: Source
  content?: ContentItem
  atom?: AtomEntry<TDate>
  dc?: DcItemOrFeed<TDate>
  dcterms?: DctermsItemOrFeed<TDate>
  slash?: SlashItem
  itunes?: ItunesItem
  podcast?: PodcastItem
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
  thr?: ThrItem
  wfw?: WfwItem
} & ({ title: string } | { description: string })

export type Feed<TDate extends DateLike> = {
  title: string
  // INFO: Spec mentions required "link", but the "link" might be missing as well when the
  // atom:link rel="self" is present so that's why the "link" is not required in this type.
  link?: string
  description: string
  language?: string
  copyright?: string
  managingEditor?: Person
  webMaster?: Person
  pubDate?: TDate
  lastBuildDate?: TDate
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
  items?: Array<Item<TDate>>
  atom?: AtomFeed<TDate>
  dc?: DcItemOrFeed<TDate>
  dcterms?: DctermsItemOrFeed<TDate>
  sy?: SyFeed<TDate>
  itunes?: ItunesFeed
  podcast?: PodcastFeed<TDate>
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
}
// #endregion reference
