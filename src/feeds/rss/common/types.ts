import type { DateLike } from '../../../common/types.js'
import type { AdminNs } from '../../../namespaces/admin/common/types.js'
import type { AtomNs } from '../../../namespaces/atom/common/types.js'
import type { CcNs } from '../../../namespaces/cc/common/types.js'
import type { ContentNs } from '../../../namespaces/content/common/types.js'
import type { CreativeCommonsNs } from '../../../namespaces/creativecommons/common/types.js'
import type { DcNs } from '../../../namespaces/dc/common/types.js'
import type { DcTermsNs } from '../../../namespaces/dcterms/common/types.js'
import type { FeedPressNs } from '../../../namespaces/feedpress/common/types.js'
import type { GeoNs } from '../../../namespaces/geo/common/types.js'
import type { GeoRssNs } from '../../../namespaces/georss/common/types.js'
import type { GooglePlayNs } from '../../../namespaces/googleplay/common/types.js'
import type { ItunesNs } from '../../../namespaces/itunes/common/types.js'
import type { MediaNs } from '../../../namespaces/media/common/types.js'
import type { OpenSearchNs } from '../../../namespaces/opensearch/common/types.js'
import type { PingbackNs } from '../../../namespaces/pingback/common/types.js'
import type { PodcastNs } from '../../../namespaces/podcast/common/types.js'
import type { PrismNs } from '../../../namespaces/prism/common/types.js'
import type { PscNs } from '../../../namespaces/psc/common/types.js'
import type { RawVoiceNs } from '../../../namespaces/rawvoice/common/types.js'
import type { SlashNs } from '../../../namespaces/slash/common/types.js'
import type { SourceNs } from '../../../namespaces/source/common/types.js'
import type { SpotifyNs } from '../../../namespaces/spotify/common/types.js'
import type { SyNs } from '../../../namespaces/sy/common/types.js'
import type { ThrNs } from '../../../namespaces/thr/common/types.js'
import type { TrackbackNs } from '../../../namespaces/trackback/common/types.js'
import type { WfwNs } from '../../../namespaces/wfw/common/types.js'

// #region reference
export namespace Rss {
  /** @internal Intermediary type before Person refactoring. Do not use downstream. */
  export type PersonLike = string | { name?: string; email?: string }

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

  export type Item<TDate extends DateLike, TPerson extends PersonLike = Person> = {
    title?: string
    link?: string
    description?: string
    authors?: Array<TPerson>
    categories?: Array<Category>
    comments?: string
    enclosures?: Array<Enclosure>
    guid?: Guid
    pubDate?: TDate
    source?: Source
    atom?: AtomNs.Entry<TDate>
    cc?: CcNs.ItemOrFeed
    dc?: DcNs.ItemOrFeed<TDate>
    content?: ContentNs.Item
    creativeCommons?: CreativeCommonsNs.ItemOrFeed
    slash?: SlashNs.Item
    itunes?: ItunesNs.Item
    podcast?: PodcastNs.Item
    psc?: PscNs.Item
    googleplay?: GooglePlayNs.Item
    media?: MediaNs.ItemOrFeed
    georss?: GeoRssNs.ItemOrFeed
    geo?: GeoNs.ItemOrFeed
    thr?: ThrNs.Item
    dcterms?: DcTermsNs.ItemOrFeed<TDate>
    prism?: PrismNs.Item<TDate>
    wfw?: WfwNs.Item
    sourceNs?: SourceNs.Item
    rawvoice?: RawVoiceNs.Item
    spotify?: SpotifyNs.Item
    pingback?: PingbackNs.Item
    trackback?: TrackbackNs.Item
  } & ({ title: string } | { description: string })

  export type Feed<TDate extends DateLike, TPerson extends PersonLike = Person> = {
    title: string
    // INFO: Spec mentions required "link", but the "link" might be missing as well when the
    // atom:link rel="self" is present so that's why the "link" is not required in this type.
    link?: string
    description: string
    language?: string
    copyright?: string
    managingEditor?: TPerson
    webMaster?: TPerson
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
    items?: Array<Item<TDate, TPerson>>
    atom?: AtomNs.Feed<TDate>
    cc?: CcNs.ItemOrFeed
    dc?: DcNs.ItemOrFeed<TDate>
    sy?: SyNs.Feed<TDate>
    itunes?: ItunesNs.Feed
    podcast?: PodcastNs.Feed<TDate>
    googleplay?: GooglePlayNs.Feed
    media?: MediaNs.ItemOrFeed
    georss?: GeoRssNs.ItemOrFeed
    geo?: GeoNs.ItemOrFeed
    dcterms?: DcTermsNs.ItemOrFeed<TDate>
    prism?: PrismNs.Feed<TDate>
    creativeCommons?: CreativeCommonsNs.ItemOrFeed
    feedpress?: FeedPressNs.Feed
    opensearch?: OpenSearchNs.Feed
    admin?: AdminNs.Feed
    sourceNs?: SourceNs.Feed
    rawvoice?: RawVoiceNs.Feed<TDate>
    spotify?: SpotifyNs.Feed
    pingback?: PingbackNs.Feed
  }
}
// #endregion reference
