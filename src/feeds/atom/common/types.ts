import type {
  GenerateUtil as BaseGenerateUtil,
  ParsePartialUtil as BaseParsePartialUtil,
  DateLike,
} from '../../../common/types.js'
import type { CreativecommonsNs } from '../../../namespaces/creativecommons/common/types.js'
import type { DcNs } from '../../../namespaces/dc/common/types.js'
import type { DctermsNs } from '../../../namespaces/dcterms/common/types.js'
import type { GeorssNs } from '../../../namespaces/georss/common/types.js'
import type { ItunesNs } from '../../../namespaces/itunes/common/types.js'
import type { MediaNs } from '../../../namespaces/media/common/types.js'
import type { PscNs } from '../../../namespaces/psc/common/types.js'
import type { SlashNs } from '../../../namespaces/slash/common/types.js'
import type { SyNs } from '../../../namespaces/sy/common/types.js'
import type { ThrNs } from '../../../namespaces/thr/common/types.js'
import type { WfwNs } from '../../../namespaces/wfw/common/types.js'
import type { YtNs } from '../../../namespaces/yt/common/types.js'

export type UtilOptions = {
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
    dc?: DcNs.ItemOrFeed<TDate>
    slash?: SlashNs.Item
    itunes?: ItunesNs.Item
    psc?: PscNs.Item
    media?: MediaNs.ItemOrFeed
    georss?: GeorssNs.ItemOrFeed
    thr?: ThrNs.Item
    dcterms?: DctermsNs.ItemOrFeed<TDate>
    wfw?: WfwNs.Item
    yt?: YtNs.Item
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
    dc?: DcNs.ItemOrFeed<TDate>
    sy?: SyNs.Feed<TDate>
    itunes?: ItunesNs.Feed
    media?: MediaNs.ItemOrFeed
    georss?: GeorssNs.ItemOrFeed
    dcterms?: DctermsNs.ItemOrFeed<TDate>
    creativecommons?: CreativecommonsNs.Feed
    yt?: YtNs.Feed
  }
}
// #endregion reference
