import type { DateLike } from '../../../common/types.js'

// #region reference
export namespace Json {
  export type Author = {
    name?: string
    url?: string
    avatar?: string
  }

  export type Attachment = {
    url?: string // Required in spec.
    mime_type?: string // Required in spec.
    title?: string
    size_in_bytes?: number
    duration_in_seconds?: number
  }

  export type Item<TDate extends DateLike> = {
    id?: string // Required in spec.
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
    attachments?: Array<Attachment>
  }

  export type Hub = {
    type?: string // Required in spec.
    url?: string // Required in spec.
  }

  export type Feed<TDate extends DateLike> = {
    title?: string // Required in spec.
    home_page_url?: string
    feed_url?: string
    description?: string
    user_comment?: string
    next_url?: string
    icon?: string
    favicon?: string
    language?: string
    expired?: boolean
    hubs?: Array<Hub>
    authors?: Array<Author>
    items?: Array<Item<TDate>> // Required in spec.
  }
}
// #endregion reference
