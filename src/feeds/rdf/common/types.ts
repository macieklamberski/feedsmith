import type {
  ParseUtilPartial as BaseParseUtilPartial,
  DateAny,
  ParseMainOptions,
  Requirable,
  Strict,
} from '../../../common/types.js'
import type { AdminNs } from '../../../namespaces/admin/common/types.js'
import type { AtomNs } from '../../../namespaces/atom/common/types.js'
import type { ContentNs } from '../../../namespaces/content/common/types.js'
import type { DcNs } from '../../../namespaces/dc/common/types.js'
import type { DcTermsNs } from '../../../namespaces/dcterms/common/types.js'
import type { GeoRssNs } from '../../../namespaces/georss/common/types.js'
import type { MediaNs } from '../../../namespaces/media/common/types.js'
import type { RdfNs } from '../../../namespaces/rdf/common/types.js'
import type { SlashNs } from '../../../namespaces/slash/common/types.js'
import type { SyNs } from '../../../namespaces/sy/common/types.js'
import type { WfwNs } from '../../../namespaces/wfw/common/types.js'
import type { XmlNs } from '../../../namespaces/xml/common/types.js'

export type ParseUtilPartial<R> = BaseParseUtilPartial<R, ParseMainOptions<DateAny>>

// #region reference
export namespace Rdf {
  export type Image<TStrict extends boolean = false> = Strict<
    {
      title: Requirable<string> // Required in spec.
      link: Requirable<string> // Required in spec.
      url: Requirable<string> // Required in spec.
      rdf?: RdfNs.About
    },
    TStrict
  >

  export type TextInput<TStrict extends boolean = false> = Strict<
    {
      title: Requirable<string> // Required in spec.
      description: Requirable<string> // Required in spec.
      name: Requirable<string> // Required in spec.
      link: Requirable<string> // Required in spec.
      rdf?: RdfNs.About
    },
    TStrict
  >

  export type Item<TDate, TStrict extends boolean = false> = Strict<
    {
      title: Requirable<string> // Required in spec.
      link: Requirable<string> // Required in spec.
      description?: string
      rdf?: RdfNs.About
      atom?: AtomNs.Entry<TDate>
      dc?: DcNs.ItemOrFeed<TDate>
      content?: ContentNs.Item
      slash?: SlashNs.Item
      media?: MediaNs.ItemOrFeed<TStrict>
      georss?: GeoRssNs.ItemOrFeed<TStrict>
      dcterms?: DcTermsNs.ItemOrFeed<TDate>
      wfw?: WfwNs.Item
      xml?: XmlNs.ItemOrFeed
    },
    TStrict
  >

  export type Feed<TDate, TStrict extends boolean = false> = Strict<
    {
      title: Requirable<string> // Required in spec.
      link: Requirable<string> // Required in spec.
      description: Requirable<string> // Required in spec.
      image?: Image<TStrict>
      items?: Array<Item<TDate, TStrict>>
      textInput?: TextInput<TStrict>
      rdf?: RdfNs.About
      atom?: AtomNs.Feed<TDate>
      dc?: DcNs.ItemOrFeed<TDate>
      sy?: SyNs.Feed<TDate>
      media?: MediaNs.ItemOrFeed<TStrict>
      georss?: GeoRssNs.ItemOrFeed<TStrict>
      dcterms?: DcTermsNs.ItemOrFeed<TDate>
      admin?: AdminNs.Feed
      xml?: XmlNs.ItemOrFeed
    },
    TStrict
  >
}
// #endregion reference
