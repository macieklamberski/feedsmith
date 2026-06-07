import type { Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace AtNs {
  export type Person<TStrict extends boolean = false> = Strict<
    {
      name: Requirable<string> // Required in spec.
      uri?: string
      email?: string
    },
    TStrict
  >

  export type Link<TStrict extends boolean = false> = Strict<
    {
      href: Requirable<string> // Required in spec.
      rel?: string
      type?: string
      hreflang?: string
      title?: string
      length?: number
    },
    TStrict
  >

  export type DeletedEntry<TDate, TStrict extends boolean = false> = Strict<
    {
      ref: Requirable<string> // Required in spec.
      when: Requirable<TDate> // Required in spec.
      by?: Person<TStrict>
      comment?: string
      links?: Array<Link<TStrict>>
    },
    TStrict
  >

  export type Feed<TDate, TStrict extends boolean = false> = {
    deletedEntries?: Array<DeletedEntry<TDate, TStrict>>
  }
}
// #endregion reference
