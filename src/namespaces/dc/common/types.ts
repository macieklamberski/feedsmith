import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace DcNs {
  export type ItemOrFeed<TDate extends DateLike> = {
    titles?: Array<string>
    creators?: Array<string>
    subjects?: Array<string>
    descriptions?: Array<string>
    publishers?: Array<string>
    contributors?: Array<string>
    dates?: Array<TDate>
    types?: Array<string>
    formats?: Array<string>
    identifiers?: Array<string>
    sources?: Array<string>
    languages?: Array<string>
    relations?: Array<string>
    coverages?: Array<string>
    rights?: Array<string>

    /** @deprecated Use `titles` (plural) instead. Dublin Core elements are repeatable. */
    title?: string
    /** @deprecated Use `creators` (plural) instead. Dublin Core elements are repeatable. */
    creator?: string
    /** @deprecated Use `subjects` (plural) instead. Dublin Core elements are repeatable. */
    subject?: string
    /** @deprecated Use `descriptions` (plural) instead. Dublin Core elements are repeatable. */
    description?: string
    /** @deprecated Use `publishers` (plural) instead. Dublin Core elements are repeatable. */
    publisher?: string
    /** @deprecated Use `contributors` (plural) instead. Dublin Core elements are repeatable. */
    contributor?: string
    /** @deprecated Use `dates` (plural) instead. Dublin Core elements are repeatable. */
    date?: TDate
    /** @deprecated Use `types` (plural) instead. Dublin Core elements are repeatable. */
    type?: string
    /** @deprecated Use `formats` (plural) instead. Dublin Core elements are repeatable. */
    format?: string
    /** @deprecated Use `identifiers` (plural) instead. Dublin Core elements are repeatable. */
    identifier?: string
    /** @deprecated Use `sources` (plural) instead. Dublin Core elements are repeatable. */
    source?: string
    /** @deprecated Use `languages` (plural) instead. Dublin Core elements are repeatable. */
    language?: string
    /** @deprecated Use `relations` (plural) instead. Dublin Core elements are repeatable. */
    relation?: string
    /** @deprecated Use `coverages` (plural) instead. Dublin Core elements are repeatable. */
    coverage?: string
  }
}
// #endregion reference
