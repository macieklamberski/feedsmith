import type { DateLike } from '../../../common/types.js'
import type { AdminNs } from '../../../namespaces/admin/common/types.js'
import type { AtomNs } from '../../../namespaces/atom/common/types.js'
import type { BlogChannelNs } from '../../../namespaces/blogchannel/common/types.js'
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
    name?: string // Required in spec.
    domain?: string
  }

  export type Cloud = {
    domain?: string // Required in spec.
    port?: number // Required in spec.
    path?: string // Required in spec.
    registerProcedure?: string // Required in spec.
    protocol?: string // Required in spec.
  }

  export type Image = {
    url?: string // Required in spec.
    title?: string // Required in spec.
    link?: string // Required in spec.
    description?: string
    height?: number
    width?: number
  }

  export type TextInput = {
    title?: string // Required in spec.
    description?: string // Required in spec.
    name?: string // Required in spec.
    link?: string // Required in spec.
  }

  export type Enclosure = {
    url?: string // Required in spec.
    length?: number // Required in spec.
    type?: string // Required in spec.
  }

  export type SkipHours = Array<number>

  export type SkipDays = Array<string>

  export type Guid = {
    value?: string // Required in spec.
    isPermaLink?: boolean
  }

  export type Source = {
    title?: string // Required in spec.
    url?: string // Required in spec.
  }

  export type Item<TDate extends DateLike, TPerson extends PersonLike = Person> = {
    title?: string // At least one of title or description is required in spec.
    link?: string
    description?: string // At least one of title or description is required in spec.
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
    wfw?: WfwNs.Item
    sourceNs?: SourceNs.Item
    rawvoice?: RawVoiceNs.Item
    spotify?: SpotifyNs.Item
    pingback?: PingbackNs.Item
    trackback?: TrackbackNs.Item
  }

  export type Feed<TDate extends DateLike, TPerson extends PersonLike = Person> = {
    title?: string // Required in spec.
    link?: string // Required in spec (but may be missing when atom:link rel="self" is present).
    description?: string // Required in spec.
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
    creativeCommons?: CreativeCommonsNs.ItemOrFeed
    feedpress?: FeedPressNs.Feed
    opensearch?: OpenSearchNs.Feed
    admin?: AdminNs.Feed
    sourceNs?: SourceNs.Feed
    blogChannel?: BlogChannelNs.Feed
    rawvoice?: RawVoiceNs.Feed<TDate>
    spotify?: SpotifyNs.Feed
    pingback?: PingbackNs.Feed
  }
}
// #endregion reference
