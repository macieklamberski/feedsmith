import type { DateLike } from '../../../common/types.js'
import type { AtomNs } from '../../../namespaces/atom/common/types.js'
import type { Content } from '../../../namespaces/content/common/types.js'
import type { Dc } from '../../../namespaces/dc/common/types.js'
import type { Dcterms } from '../../../namespaces/dcterms/common/types.js'
import type { Feedpress } from '../../../namespaces/feedpress/common/types.js'
import type { Georss } from '../../../namespaces/georss/common/types.js'
import type { Itunes } from '../../../namespaces/itunes/common/types.js'
import type { Media } from '../../../namespaces/media/common/types.js'
import type { Podcast } from '../../../namespaces/podcast/common/types.js'
import type { Psc } from '../../../namespaces/psc/common/types.js'
import type { Rawvoice } from '../../../namespaces/rawvoice/common/types.js'
import type { Slash } from '../../../namespaces/slash/common/types.js'
import type { Source } from '../../../namespaces/source/common/types.js'
import type { Spotify } from '../../../namespaces/spotify/common/types.js'
import type { Sy } from '../../../namespaces/sy/common/types.js'
import type { Thr } from '../../../namespaces/thr/common/types.js'
import type { Wfw } from '../../../namespaces/wfw/common/types.js'

// #region reference
export namespace Rss {
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
    atom?: AtomNs.Entry<TDate>
    dc?: Dc.ItemOrFeed<TDate>
    content?: Content.Item
    slash?: Slash.Item
    itunes?: Itunes.Item
    podcast?: Podcast.Item
    psc?: Psc.Item
    media?: Media.ItemOrFeed
    georss?: Georss.ItemOrFeed
    thr?: Thr.Item
    dcterms?: Dcterms.ItemOrFeed<TDate>
    wfw?: Wfw.Item
    src?: Source.Item
    rawvoice?: Rawvoice.Item
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
    atom?: AtomNs.Feed<TDate>
    dc?: Dc.ItemOrFeed<TDate>
    sy?: Sy.Feed<TDate>
    itunes?: Itunes.Feed
    podcast?: Podcast.Feed<TDate>
    media?: Media.ItemOrFeed
    georss?: Georss.ItemOrFeed
    dcterms?: Dcterms.ItemOrFeed<TDate>
    feedpress?: Feedpress.Feed
    src?: Source.Feed
    rawvoice?: Rawvoice.Feed<TDate>
    spotify?: Spotify.Feed
  }
}
// #endregion reference
