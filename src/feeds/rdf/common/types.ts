import type { DateLike } from '../../../common/types.js'
import type { AdminNs } from '../../../namespaces/admin/common/types.js'
import type { AtomNs } from '../../../namespaces/atom/common/types.js'
import type { ContentNs } from '../../../namespaces/content/common/types.js'
import type { DcNs } from '../../../namespaces/dc/common/types.js'
import type { DctermsNs } from '../../../namespaces/dcterms/common/types.js'
import type { GeorssNs } from '../../../namespaces/georss/common/types.js'
import type { MediaNs } from '../../../namespaces/media/common/types.js'
import type { SlashNs } from '../../../namespaces/slash/common/types.js'
import type { SyNs } from '../../../namespaces/sy/common/types.js'
import type { WfwNs } from '../../../namespaces/wfw/common/types.js'

// #region reference
export namespace Rdf {
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
    atom?: AtomNs.Entry<TDate>
    dc?: DcNs.ItemOrFeed<TDate>
    content?: ContentNs.Item
    slash?: SlashNs.Item
    media?: MediaNs.ItemOrFeed
    georss?: GeorssNs.ItemOrFeed
    dcterms?: DctermsNs.ItemOrFeed<TDate>
    wfw?: WfwNs.Item
    admin?: AdminNs.Feed
  }

  export type Feed<TDate extends DateLike> = {
    title: string
    link: string
    description: string
    image?: Image
    items?: Array<Item<TDate>>
    textInput?: TextInput
    atom?: AtomNs.Feed<TDate>
    dc?: DcNs.ItemOrFeed<TDate>
    sy?: SyNs.Feed<TDate>
    media?: MediaNs.ItemOrFeed
    georss?: GeorssNs.ItemOrFeed
    dcterms?: DctermsNs.ItemOrFeed<TDate>
    admin?: AdminNs.Feed
  }
}
// #endregion reference
