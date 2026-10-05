import type { AtomFeed } from '../../../feeds/atom/common/types.js'

// #region reference
export namespace ActivityNs {
  export type Person = {
    objectType?: string
  }

  export type Item = {
    verb?: string
    objectType?: string
  }

  export type Entry<TDate> = {
    verb?: string
    objectType?: string
    object?: AtomFeed.Entry<TDate>
    target?: AtomFeed.Entry<TDate>
  }
}
// #endregion reference
