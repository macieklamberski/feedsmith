import type { DateLike, Requirable, Strict } from '../../../common/types.js'

// #region reference
export namespace Json {
  export type Author = {
    name?: string
    url?: string
    avatar?: string
  }

  export type Attachment<TStrict extends boolean = false> = Strict<
    {
      url: Requirable<string> // Required in spec.
      mime_type: Requirable<string> // Required in spec.
      title?: string
      size_in_bytes?: number
      duration_in_seconds?: number
    },
    TStrict
  >

  export type Item<TDate extends DateLike, TStrict extends boolean = false> = Strict<
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
      authors?: Array<Author>
      language?: string
      attachments?: Array<Attachment<TStrict>>
    },
    TStrict
  > &
    (TStrict extends true ? { content_html: string } | { content_text: string } : unknown)

  export type Hub<TStrict extends boolean = false> = Strict<
    {
      type: Requirable<string> // Required in spec.
      url: Requirable<string> // Required in spec.
    },
    TStrict
  >

  export type Feed<TDate extends DateLike, TStrict extends boolean = false> = Strict<
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
      hubs?: Array<Hub<TStrict>>
      authors?: Array<Author>
      items: Requirable<Array<Item<TDate, TStrict>>> // Required in spec.
    },
    TStrict
  >
}
// #endregion reference
