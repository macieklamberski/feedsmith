import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace Thr {
  export type InReplyTo = {
    ref: string
    href?: string
    type?: string
    source?: string
  }

  export type Link<TDate extends DateLike> = {
    count?: number
    updated?: TDate
  }

  export type Item = {
    total?: number
    inReplyTos?: Array<InReplyTo>
  }
}
// #endregion reference
