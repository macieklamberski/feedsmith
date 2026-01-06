import type { DateLike, Requirable, Strict } from '../../../common/types.js'
import type { AcastNs } from '../../../namespaces/acast/common/types.js'
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

  export type Category<TStrict extends boolean = false> = Strict<
    {
      name: Requirable<string> // Required in spec.
      domain?: string
    },
    TStrict
  >

  export type Cloud<TStrict extends boolean = false> = Strict<
    {
      domain: Requirable<string> // Required in spec.
      port: Requirable<number> // Required in spec.
      path: Requirable<string> // Required in spec.
      registerProcedure: Requirable<string> // Required in spec.
      protocol: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Image<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      title: Requirable<string> // Required in spec.
      link: Requirable<string> // Required in spec.
      description?: string
      height?: number
      width?: number
    },
    TStrict
  >

  export type TextInput<TStrict extends boolean = false> = Strict<
    {
      title: Requirable<string> // Required in spec.
      description: Requirable<string> // Required in spec.
      name: Requirable<string> // Required in spec.
      link: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Enclosure<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      length: Requirable<number> // Required in spec.
      type: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type SkipHours = Array<number>

  export type SkipDays = Array<string>

  export type Guid<TStrict extends boolean = false> = Strict<
    {
      value: Requirable<string> // Required in spec.
      isPermaLink?: boolean
    },
    TStrict
  >

  export type Source<TStrict extends boolean = false> = Strict<
    {
      title: Requirable<string> // Required in spec.
      url: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Item<
    TDate extends DateLike,
    TPerson extends PersonLike = Person,
    TStrict extends boolean = false,
  > = Strict<
    {
      title?: string // At least one of title or description is required in spec.
      link?: string
      description?: string // At least one of title or description is required in spec.
      authors?: Array<TPerson>
      categories?: Array<Category<TStrict>>
      comments?: string
      enclosures?: Array<Enclosure<TStrict>>
      guid?: Guid<TStrict>
      pubDate?: TDate
      source?: Source<TStrict>
      atom?: AtomNs.Entry<TDate>
      cc?: CcNs.ItemOrFeed
      dc?: DcNs.ItemOrFeed<TDate>
      content?: ContentNs.Item
      creativeCommons?: CreativeCommonsNs.ItemOrFeed
      slash?: SlashNs.Item
      itunes?: ItunesNs.Item
      podcast?: PodcastNs.Item<TStrict>
      psc?: PscNs.Item<TStrict>
      googleplay?: GooglePlayNs.Item<TStrict>
      media?: MediaNs.ItemOrFeed<TStrict>
      georss?: GeoRssNs.ItemOrFeed<TStrict>
      geo?: GeoNs.ItemOrFeed
      thr?: ThrNs.Item<TStrict>
      dcterms?: DcTermsNs.ItemOrFeed<TDate>
      prism?: PrismNs.Item<TDate>
      wfw?: WfwNs.Item
      sourceNs?: SourceNs.Item
      rawvoice?: RawVoiceNs.Item<TStrict>
      spotify?: SpotifyNs.Item<TStrict>
      pingback?: PingbackNs.Item
      trackback?: TrackbackNs.Item
      acast?: AcastNs.Item
    },
    TStrict
  > &
    (TStrict extends true ? { title: string } | { description: string } : unknown)

  export type Feed<
    TDate extends DateLike,
    TPerson extends PersonLike = Person,
    TStrict extends boolean = false,
  > = Strict<
    {
      title: Requirable<string> // Required in spec.
      link: Requirable<string> // Required in spec (but may be missing when atom:link rel="self" is present).
      description: Requirable<string> // Required in spec.
      language?: string
      copyright?: string
      managingEditor?: TPerson
      webMaster?: TPerson
      pubDate?: TDate
      lastBuildDate?: TDate
      categories?: Array<Category<TStrict>>
      generator?: string
      docs?: string
      cloud?: Cloud<TStrict>
      ttl?: number
      image?: Image<TStrict>
      rating?: string
      textInput?: TextInput<TStrict>
      skipHours?: Array<number>
      skipDays?: Array<string>
      items?: Array<Item<TDate, TPerson, TStrict>>
      atom?: AtomNs.Feed<TDate>
      cc?: CcNs.ItemOrFeed
      dc?: DcNs.ItemOrFeed<TDate>
      sy?: SyNs.Feed<TDate>
      itunes?: ItunesNs.Feed<TStrict>
      podcast?: PodcastNs.Feed<TDate, TStrict>
      googleplay?: GooglePlayNs.Feed<TStrict>
      media?: MediaNs.ItemOrFeed<TStrict>
      georss?: GeoRssNs.ItemOrFeed<TStrict>
      geo?: GeoNs.ItemOrFeed
      dcterms?: DcTermsNs.ItemOrFeed<TDate>
      prism?: PrismNs.Feed<TDate>
      creativeCommons?: CreativeCommonsNs.ItemOrFeed
      feedpress?: FeedPressNs.Feed
      opensearch?: OpenSearchNs.Feed<TStrict>
      admin?: AdminNs.Feed
      sourceNs?: SourceNs.Feed<TStrict>
      blogChannel?: BlogChannelNs.Feed
      rawvoice?: RawVoiceNs.Feed<TDate, TStrict>
      spotify?: SpotifyNs.Feed<TStrict>
      pingback?: PingbackNs.Feed
      acast?: AcastNs.Feed
    },
    TStrict
  >
}
// #endregion reference
