import type {
  GenerateUtil as BaseGenerateUtil,
  ParsePartialUtil as BaseParsePartialUtil,
  DateLike,
  ParseOptions,
  Requirable,
  Strict,
} from '../../../common/types.js'
import type { AdminNs } from '../../../namespaces/admin/common/types.js'
import type { AppNs } from '../../../namespaces/app/common/types.js'
import type { ArxivNs } from '../../../namespaces/arxiv/common/types.js'
import type { CcNs } from '../../../namespaces/cc/common/types.js'
import type { CreativeCommonsNs } from '../../../namespaces/creativecommons/common/types.js'
import type { DcNs } from '../../../namespaces/dc/common/types.js'
import type { DcTermsNs } from '../../../namespaces/dcterms/common/types.js'
import type { GeoNs } from '../../../namespaces/geo/common/types.js'
import type { GeoRssNs } from '../../../namespaces/georss/common/types.js'
import type { GooglePlayNs } from '../../../namespaces/googleplay/common/types.js'
import type { ItunesNs } from '../../../namespaces/itunes/common/types.js'
import type { MediaNs } from '../../../namespaces/media/common/types.js'
import type { OpenSearchNs } from '../../../namespaces/opensearch/common/types.js'
import type { PingbackNs } from '../../../namespaces/pingback/common/types.js'
import type { PscNs } from '../../../namespaces/psc/common/types.js'
import type { SlashNs } from '../../../namespaces/slash/common/types.js'
import type { SyNs } from '../../../namespaces/sy/common/types.js'
import type { ThrNs } from '../../../namespaces/thr/common/types.js'
import type { TrackbackNs } from '../../../namespaces/trackback/common/types.js'
import type { WfwNs } from '../../../namespaces/wfw/common/types.js'
import type { XmlNs } from '../../../namespaces/xml/common/types.js'
import type { YtNs } from '../../../namespaces/yt/common/types.js'

export type UtilOptions = ParseOptions & {
  prefix?: string
  asNamespace?: boolean
}

export type ParsePartialUtil<R> = BaseParsePartialUtil<R, UtilOptions>

export type GenerateUtil<V> = BaseGenerateUtil<V, UtilOptions>

// #region reference
export namespace Atom {
  // For simplicity's sake, a string is used for now, but this may be reconsidered in the future.
  export type Text = string

  export type Content = {
    value?: string
    type?: string
    src?: string
    xml?: XmlNs.ItemOrFeed
  }

  export type Link<TDate extends DateLike, TStrict extends boolean = false> = Strict<
    {
      href: Requirable<string> // Required in spec.
      rel?: string
      type?: string
      hreflang?: string
      title?: string
      length?: number
      thr?: ThrNs.Link<TDate>
    },
    TStrict
  >

  export type Person<TStrict extends boolean = false> = Strict<
    {
      name: Requirable<string> // Required in spec.
      uri?: string
      email?: string
      arxiv?: ArxivNs.Author
    },
    TStrict
  >

  export type Category<TStrict extends boolean = false> = Strict<
    {
      term: Requirable<string> // Required in spec.
      scheme?: string
      label?: string
    },
    TStrict
  >

  export type Generator<TStrict extends boolean = false> = Strict<
    {
      text: Requirable<string> // Required in spec.
      uri?: string
      version?: string
    },
    TStrict
  >

  export type Source<TDate extends DateLike, TStrict extends boolean = false> = {
    authors?: Array<Person<TStrict>>
    categories?: Array<Category<TStrict>>
    contributors?: Array<Person<TStrict>>
    generator?: Generator<TStrict>
    icon?: string
    id?: string
    links?: Array<Link<TDate, TStrict>>
    logo?: string
    rights?: Text
    subtitle?: Text
    title?: Text
    updated?: TDate
  }

  export type Entry<TDate extends DateLike, TStrict extends boolean = false> = Strict<
    {
      authors?: Array<Person<TStrict>>
      categories?: Array<Category<TStrict>>
      content?: Content
      contributors?: Array<Person<TStrict>>
      id: Requirable<string> // Required in spec.
      links?: Array<Link<TDate, TStrict>>
      published?: TDate
      rights?: Text
      source?: Source<TDate, TStrict>
      summary?: Text
      title: Requirable<Text> // Required in spec.
      updated: Requirable<TDate> // Required in spec.
      app?: AppNs.Entry<TDate>
      arxiv?: ArxivNs.Entry
      cc?: CcNs.ItemOrFeed
      dc?: DcNs.ItemOrFeed<TDate>
      slash?: SlashNs.Item
      itunes?: ItunesNs.Item
      googleplay?: GooglePlayNs.Item<TStrict>
      psc?: PscNs.Item<TStrict>
      media?: MediaNs.ItemOrFeed<TStrict>
      georss?: GeoRssNs.ItemOrFeed<TStrict>
      geo?: GeoNs.ItemOrFeed
      thr?: ThrNs.Item<TStrict>
      dcterms?: DcTermsNs.ItemOrFeed<TDate>
      creativeCommons?: CreativeCommonsNs.ItemOrFeed
      wfw?: WfwNs.Item
      yt?: YtNs.Item
      pingback?: PingbackNs.Item
      trackback?: TrackbackNs.Item
      xml?: XmlNs.ItemOrFeed
    },
    TStrict
  >

  export type Feed<TDate extends DateLike, TStrict extends boolean = false> = Strict<
    {
      authors?: Array<Person<TStrict>>
      categories?: Array<Category<TStrict>>
      contributors?: Array<Person<TStrict>>
      generator?: Generator<TStrict>
      icon?: string
      id: Requirable<string> // Required in spec.
      links?: Array<Link<TDate, TStrict>>
      logo?: string
      rights?: Text
      subtitle?: Text
      title: Requirable<Text> // Required in spec.
      updated: Requirable<TDate> // Required in spec.
      entries?: Array<Entry<TDate, TStrict>>
      cc?: CcNs.ItemOrFeed
      dc?: DcNs.ItemOrFeed<TDate>
      sy?: SyNs.Feed<TDate>
      itunes?: ItunesNs.Feed<TStrict>
      googleplay?: GooglePlayNs.Feed<TStrict>
      media?: MediaNs.ItemOrFeed<TStrict>
      georss?: GeoRssNs.ItemOrFeed<TStrict>
      geo?: GeoNs.ItemOrFeed
      dcterms?: DcTermsNs.ItemOrFeed<TDate>
      creativeCommons?: CreativeCommonsNs.ItemOrFeed
      opensearch?: OpenSearchNs.Feed<TStrict>
      yt?: YtNs.Feed
      admin?: AdminNs.Feed
      pingback?: PingbackNs.Feed
      xml?: XmlNs.ItemOrFeed
    },
    TStrict
  >
}
// #endregion reference
