import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace ThrNs {
  export type InReplyTo<TStrict extends boolean = false> = Strict<
    {
      ref: Requirable<string> // Required in spec.
      href?: string
      type?: string
      source?: string
    },
    TStrict
  >

  export type Link<TDate> = {
    count?: number
    updated?: TDate
  }

  export type Item<TStrict extends boolean = false> = {
    total?: number
    inReplyTos?: Array<InReplyTo<TStrict>>
  }
}
// #endregion reference
