import type { DateLike } from '../../../common/types.js'
import type { Atom } from '../../../feeds/atom/common/types.js'

// #region reference
export namespace AtomNs {
  export type Entry<TDate extends DateLike> = Partial<Atom.Entry<TDate>>

  export type Feed<TDate extends DateLike> = Partial<Atom.Feed<TDate>>
}
// #endregion reference
