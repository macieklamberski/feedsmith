import type { DateLike } from '../../../common/types.js'
import type { AtomNs } from '../../../namespaces/atom/common/types.js'
import type { Content } from '../../../namespaces/content/common/types.js'
import type { Dc } from '../../../namespaces/dc/common/types.js'
import type { Dcterms } from '../../../namespaces/dcterms/common/types.js'
import type { Georss } from '../../../namespaces/georss/common/types.js'
import type { Media } from '../../../namespaces/media/common/types.js'
import type { Slash } from '../../../namespaces/slash/common/types.js'
import type { Sy } from '../../../namespaces/sy/common/types.js'
import type { Wfw } from '../../../namespaces/wfw/common/types.js'

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
    dc?: Dc.ItemOrFeed<TDate>
    content?: Content.Item
    slash?: Slash.Item
    media?: Media.ItemOrFeed
    georss?: Georss.ItemOrFeed
    dcterms?: Dcterms.ItemOrFeed<TDate>
    wfw?: Wfw.Item
  }

  export type Feed<TDate extends DateLike> = {
    title: string
    link: string
    description: string
    image?: Image
    items?: Array<Item<TDate>>
    textInput?: TextInput
    atom?: AtomNs.Feed<TDate>
    dc?: Dc.ItemOrFeed<TDate>
    sy?: Sy.Feed<TDate>
    media?: Media.ItemOrFeed
    georss?: Georss.ItemOrFeed
    dcterms?: Dcterms.ItemOrFeed<TDate>
  }
}
// #endregion reference
