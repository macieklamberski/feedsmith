import type { DcNs } from '../../dc/common/types.js'

// #region reference
export namespace TaxoNs {
  export type Topic<TDate> = {
    about?: string
    link?: string
    topics?: Array<string>
    dc?: DcNs.ItemOrFeed<TDate>
  }

  export type ItemOrFeed = {
    topics?: Array<string>
  }

  export type Feed<TDate> = ItemOrFeed & {
    topicDefinitions?: Array<Topic<TDate>>
  }
}
// #endregion reference
