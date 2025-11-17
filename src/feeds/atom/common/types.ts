import type {
  GenerateUtil as BaseGenerateUtil,
  ParsePartialUtil as BaseParsePartialUtil,
  DateLike,
  ParseOptions,
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

  export type Link<TDate extends DateLike> = {
    href: string
    rel?: string
    type?: string
    hreflang?: string
    title?: string
    length?: number
    thr?: ThrNs.Link<TDate>
  }

  export type Person = {
    name: string
    uri?: string
    email?: string
    arxiv?: ArxivNs.Author
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
    updated: TDate
    app?: AppNs.Entry<TDate>
    arxiv?: ArxivNs.Entry
    cc?: CcNs.ItemOrFeed
    dc?: DcNs.ItemOrFeed<TDate>
    slash?: SlashNs.Item
    itunes?: ItunesNs.Item
    googleplay?: GooglePlayNs.Item
    psc?: PscNs.Item
    media?: MediaNs.ItemOrFeed
    georss?: GeoRssNs.ItemOrFeed
    geo?: GeoNs.ItemOrFeed
    thr?: ThrNs.Item
    dcterms?: DcTermsNs.ItemOrFeed<TDate>
    creativeCommons?: CreativeCommonsNs.ItemOrFeed
    wfw?: WfwNs.Item
    yt?: YtNs.Item
    pingback?: PingbackNs.Item
    trackback?: TrackbackNs.Item
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
    cc?: CcNs.ItemOrFeed
    dc?: DcNs.ItemOrFeed<TDate>
    sy?: SyNs.Feed<TDate>
    itunes?: ItunesNs.Feed
    googleplay?: GooglePlayNs.Feed
    media?: MediaNs.ItemOrFeed
    georss?: GeoRssNs.ItemOrFeed
    geo?: GeoNs.ItemOrFeed
    dcterms?: DcTermsNs.ItemOrFeed<TDate>
    creativeCommons?: CreativeCommonsNs.ItemOrFeed
    opensearch?: OpenSearchNs.Feed
    yt?: YtNs.Feed
    admin?: AdminNs.Feed
    pingback?: PingbackNs.Feed
  }
}
// #endregion reference
