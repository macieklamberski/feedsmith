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

    /** @deprecated Use `titles` (array) instead. Dublin Core fields are repeatable. */
    title?: string
    /** @deprecated Use `creators` (array) instead. Dublin Core fields are repeatable. */
    creator?: string
    /** @deprecated Use `subjects` (array) instead. Dublin Core fields are repeatable. */
    subject?: string
    /** @deprecated Use `descriptions` (array) instead. Dublin Core fields are repeatable. */
    description?: string
    /** @deprecated Use `publishers` (array) instead. Dublin Core fields are repeatable. */
    publisher?: string
    /** @deprecated Use `contributors` (array) instead. Dublin Core fields are repeatable. */
    contributor?: string
    /** @deprecated Use `dates` (array) instead. Dublin Core fields are repeatable. */
    date?: TDate
    /** @deprecated Use `types` (array) instead. Dublin Core fields are repeatable. */
    type?: string
    /** @deprecated Use `formats` (array) instead. Dublin Core fields are repeatable. */
    format?: string
    /** @deprecated Use `identifiers` (array) instead. Dublin Core fields are repeatable. */
    identifier?: string
    /** @deprecated Use `sources` (array) instead. Dublin Core fields are repeatable. */
    source?: string
    /** @deprecated Use `languages` (array) instead. Dublin Core fields are repeatable. */
    language?: string
    /** @deprecated Use `relations` (array) instead. Dublin Core fields are repeatable. */
    relation?: string
    /** @deprecated Use `coverages` (array) instead. Dublin Core fields are repeatable. */
    coverage?: string
  }
}
// #endregion reference
