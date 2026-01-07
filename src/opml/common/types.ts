import type { DateLike, ExtraFields, ParseOptions, Requirable, Strict } from '../../common/types.js'

export type MainOptions<A extends ReadonlyArray<string> = ReadonlyArray<string>> = ParseOptions & {
  extraOutlineAttributes?: A
}

// #region reference
export namespace Opml {
  // NOTE: BaseOutline contains non-recursive fields wrapped in Strict<>.
  // Outline extends it and adds recursive outlines field separately.
  export type BaseOutline<
    TDate extends DateLike,
    A extends ReadonlyArray<string> = ReadonlyArray<string>,
    TStrict extends boolean = false,
  > = Strict<
    {
      text: Requirable<string> // Required in spec.
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
    },
    TStrict
  > &
    ExtraFields<A>

  export type Outline<
    TDate extends DateLike,
    A extends ReadonlyArray<string> = ReadonlyArray<string>,
    TStrict extends boolean = false,
  > = BaseOutline<TDate, A, TStrict> & {
    outlines?: Array<Outline<TDate, A, TStrict>>
  }

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
    TStrict extends boolean = false,
  > = {
    outlines?: Array<Outline<TDate, A, TStrict>>
  }

  export type Document<
    TDate extends DateLike,
    A extends ReadonlyArray<string> = ReadonlyArray<string>,
    TStrict extends boolean = false,
  > = {
    head?: Head<TDate>
    body?: Body<TDate, A, TStrict>
  }
}
// #endregion reference
