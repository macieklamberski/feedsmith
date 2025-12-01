import type { DateLike } from '../../../common/types.js'
import type { AdminNs } from '../../../namespaces/admin/common/types.js'
import type { AtomNs } from '../../../namespaces/atom/common/types.js'
import type { ContentNs } from '../../../namespaces/content/common/types.js'
import type { DcNs } from '../../../namespaces/dc/common/types.js'
import type { DcTermsNs } from '../../../namespaces/dcterms/common/types.js'
import type { GeoRssNs } from '../../../namespaces/georss/common/types.js'
import type { MediaNs } from '../../../namespaces/media/common/types.js'
import type { SlashNs } from '../../../namespaces/slash/common/types.js'
import type { SyNs } from '../../../namespaces/sy/common/types.js'
import type { WfwNs } from '../../../namespaces/wfw/common/types.js'

// #region reference
export namespace Rdf {
  export type Image = {
    title?: string // Required in spec.
    link?: string // Required in spec.
    url?: string
  }

  export type TextInput = {
    title?: string // Required in spec.
    description?: string // Required in spec.
    name?: string // Required in spec.
    link?: string // Required in spec.
  }

  export type Item<TDate extends DateLike> = {
    title?: string // Required in spec.
    link?: string // Required in spec.
    description?: string
    atom?: AtomNs.Entry<TDate>
    dc?: DcNs.ItemOrFeed<TDate>
    content?: ContentNs.Item
    slash?: SlashNs.Item
    media?: MediaNs.ItemOrFeed
    georss?: GeoRssNs.ItemOrFeed
    dcterms?: DcTermsNs.ItemOrFeed<TDate>
    wfw?: WfwNs.Item
  }

  export type Feed<TDate extends DateLike> = {
    title?: string // Required in spec.
    link?: string // Required in spec.
    description?: string // Required in spec.
    image?: Image
    items?: Array<Item<TDate>>
    textInput?: TextInput
    atom?: AtomNs.Feed<TDate>
    dc?: DcNs.ItemOrFeed<TDate>
    sy?: SyNs.Feed<TDate>
    media?: MediaNs.ItemOrFeed
    georss?: GeoRssNs.ItemOrFeed
    dcterms?: DcTermsNs.ItemOrFeed<TDate>
    admin?: AdminNs.Feed
  }
}
// #endregion reference
