import type {
  GenerateUtil as BaseGenerateUtil,
  ParseMainOptions as BaseParseMainOptions,
  ParseUtilPartial as BaseParseUtilPartial,
  DateAny,
  ExtraFields,
  Requirable,
  Strict,
} from '../../common/types.js'

export type ParseMainOptions<
  TDate,
  TExtra extends ReadonlyArray<string> = ReadonlyArray<string>,
> = BaseParseMainOptions<TDate> & {
  extraOutlineAttributes?: TExtra
}

export type GenerateMainOptions<TExtra extends ReadonlyArray<string> = ReadonlyArray<string>> = {
  extraOutlineAttributes?: TExtra
}

export type ParseUtilPartial<R> = BaseParseUtilPartial<R, ParseMainOptions<DateAny>>

export type GenerateUtil<V> = BaseGenerateUtil<V, GenerateMainOptions>

// #region reference
export namespace Opml {
  // NOTE: BaseOutline contains non-recursive fields wrapped in Strict<>.
  // Outline extends it and adds recursive outlines field separately.
  export type BaseOutline<
    TDate,
    TExtra extends ReadonlyArray<string> = ReadonlyArray<string>,
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
    ExtraFields<TExtra>

  export type Outline<
    TDate,
    TExtra extends ReadonlyArray<string> = ReadonlyArray<string>,
    TStrict extends boolean = false,
  > = BaseOutline<TDate, TExtra, TStrict> & {
    outlines?: Array<Outline<TDate, TExtra, TStrict>>
  }

  export type Head<TDate> = {
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
    TDate,
    TExtra extends ReadonlyArray<string> = ReadonlyArray<string>,
    TStrict extends boolean = false,
  > = {
    outlines?: Array<Outline<TDate, TExtra, TStrict>>
  }

  export type Document<
    TDate,
    TExtra extends ReadonlyArray<string> = ReadonlyArray<string>,
    TStrict extends boolean = false,
  > = {
    head?: Head<TDate>
    body?: Body<TDate, TExtra, TStrict>
  }
}
// #endregion reference
