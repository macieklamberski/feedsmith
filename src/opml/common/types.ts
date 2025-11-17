import type { DateLike, ExtraFields, ParseOptions } from '../../common/types.js'

export type MainOptions<A extends ReadonlyArray<string> = ReadonlyArray<string>> = ParseOptions & {
  extraOutlineAttributes?: A
}

// #region reference
export namespace Opml {
  export type Outline<
    TDate extends DateLike,
    A extends ReadonlyArray<string> = ReadonlyArray<string>,
  > = {
    text: string
    type?: string
    isComment?: boolean
    isBreakpoint?: boolean
    created?: TDate
    category?: string
    description?: string
    xmlUrl?: string
    htmlUrl?: string
    language?: string
    title?: string
    version?: string
    url?: string
    outlines?: Array<Outline<TDate, A>>
  } & ExtraFields<A>

  export type Head<TDate extends DateLike> = {
    title?: string
    dateCreated?: TDate
    dateModified?: TDate
    ownerName?: string
    ownerEmail?: string
    ownerId?: string
    docs?: string
    expansionState?: Array<number>
    vertScrollState?: number
    windowTop?: number
    windowLeft?: number
    windowBottom?: number
    windowRight?: number
  }

  export type Body<
    TDate extends DateLike,
    A extends ReadonlyArray<string> = ReadonlyArray<string>,
  > = {
    outlines?: Array<Outline<TDate, A>>
  }

  export type Document<
    TDate extends DateLike,
    A extends ReadonlyArray<string> = ReadonlyArray<string>,
  > = {
    head?: Head<TDate>
    body?: Body<TDate, A>
  }
}
// #endregion reference
