import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace ThrNs {
  export type InReplyTo = {
    ref?: string // Required in spec.
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
