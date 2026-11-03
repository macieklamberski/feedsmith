import type { Requirable, Strict } from '../../../common/types.js'
import type { AtomFeed } from '../../../feeds/atom/common/types.js'

// #region reference
export namespace AtNs {
  export type DeletedEntry<TDate, TStrict extends boolean = false> = Strict<
    {
      ref: Requirable<string> // Required in spec.
      when: Requirable<TDate> // Required in spec.
      by?: AtomFeed.Person<TStrict>
      comment?: AtomFeed.Text
      links?: Array<AtomFeed.Link<TDate, TStrict>>
      source?: AtomFeed.Source<TDate, TStrict>
    },
    TStrict
  >

  export type Feed<TDate, TStrict extends boolean = false> = {
    deletedEntries?: Array<DeletedEntry<TDate, TStrict>>
  }
}
// #endregion reference
