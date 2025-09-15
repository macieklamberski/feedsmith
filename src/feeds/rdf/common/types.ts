import type { DateLike } from '../../../common/types.js'
import type { Entry as AtomEntry, Feed as AtomFeed } from '../../../namespaces/atom/common/types.js'
import type { Item as ContentItem } from '../../../namespaces/content/common/types.js'
import type { ItemOrFeed as DcItemOrFeed } from '../../../namespaces/dc/common/types.js'
import type { ItemOrFeed as DctermsItemOrFeed } from '../../../namespaces/dcterms/common/types.js'
import type { ItemOrFeed as GeoRssItemOrFeed } from '../../../namespaces/georss/common/types.js'
import type { ItemOrFeed as MediaItemOrFeed } from '../../../namespaces/media/common/types.js'
import type { Item as SlashItem } from '../../../namespaces/slash/common/types.js'
import type { Feed as SyFeed } from '../../../namespaces/sy/common/types.js'
import type { Item as WfwItem } from '../../../namespaces/wfw/common/types.js'

// #region reference
export type Image = {
  title: string
  link: string
  url?: string
}

export type TextInput = {
  title: string
  description: string
  name: string
  link: string
}

export type Item<TDate extends DateLike> = {
  title: string
  link: string
  description?: string
  atom?: AtomEntry<TDate>
  dc?: DcItemOrFeed<TDate>
  content?: ContentItem
  slash?: SlashItem
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
  dcterms?: DctermsItemOrFeed<TDate>
  wfw?: WfwItem
}

export type Feed<TDate extends DateLike> = {
  title: string
  link: string
  description: string
  image?: Image
  items?: Array<Item<TDate>>
  textInput?: TextInput
  atom?: AtomFeed<TDate>
  dc?: DcItemOrFeed<TDate>
  sy?: SyFeed<TDate>
  media?: MediaItemOrFeed
  georss?: GeoRssItemOrFeed
  dcterms?: DctermsItemOrFeed<TDate>
}
// #endregion reference
