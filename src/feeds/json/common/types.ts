import type {
  ParseOptions as BaseParseOptions,
  DateLike,
  Requirable,
  Strict,
} from '../../../common/types.js'

export type ExtraFieldNames = ReadonlyArray<`_${string}`>

export type ExtraFields<F extends ExtraFieldNames> = {
  [K in F[number]]?: unknown
}

export type ParsePartialOptions<TExtra extends ExtraFieldNames> = BaseParseOptions & {
  extraFields?: TExtra
}

// #region reference
export namespace Json {
  export type Author<TExtra extends ExtraFieldNames = []> = {
    name?: string
    url?: string
    avatar?: string
  } & ExtraFields<TExtra>

  export type Attachment<
    TStrict extends boolean = false,
    TExtra extends ExtraFieldNames = [],
  > = Strict<
    {
      url: Requirable<string> // Required in spec.
      mime_type: Requirable<string> // Required in spec.
      title?: string
      size_in_bytes?: number
      duration_in_seconds?: number
    },
    TStrict
  > &
    ExtraFields<TExtra>

  export type Item<
    TDate extends DateLike,
    TStrict extends boolean = false,
    TExtra extends ExtraFieldNames = [],
  > = Strict<
    {
      id: Requirable<string> // Required in spec.
      url?: string
      external_url?: string
      title?: string
      content_html?: string // At least one of content_html or content_text is required in spec.
      content_text?: string // At least one of content_html or content_text is required in spec.
      summary?: string
      image?: string
      banner_image?: string
      date_published?: TDate
      date_modified?: TDate
      tags?: Array<string>
      authors?: Array<Author<TExtra>>
      language?: string
      attachments?: Array<Attachment<TStrict, TExtra>>
    },
    TStrict
  > &
    (TStrict extends true ? { content_html: string } | { content_text: string } : unknown) &
    ExtraFields<TExtra>

  export type Hub<TStrict extends boolean = false, TExtra extends ExtraFieldNames = []> = Strict<
    {
      type: Requirable<string> // Required in spec.
      url: Requirable<string> // Required in spec.
    },
    TStrict
  > &
    ExtraFields<TExtra>

  export type Feed<
    TDate extends DateLike,
    TStrict extends boolean = false,
    TExtra extends ExtraFieldNames = [],
  > = Strict<
    {
      title: Requirable<string> // Required in spec.
      home_page_url?: string
      feed_url?: string
      description?: string
      user_comment?: string
      next_url?: string
      icon?: string
      favicon?: string
      language?: string
      expired?: boolean
      hubs?: Array<Hub<TStrict, TExtra>>
      authors?: Array<Author<TExtra>>
      items: Requirable<Array<Item<TDate, TStrict, TExtra>>> // Required in spec.
    },
    TStrict
  > &
    ExtraFields<TExtra>
}
// #endregion reference
