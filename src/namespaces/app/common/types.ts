import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace AppNs {
  export type Control = {
    draft?: boolean
  }

  export type Entry<TDate extends DateLike> = {
    edited?: TDate
    control?: Control
  }
}
// #endregion reference
