import type { AnyOf, DateLike } from '../../../common/types.js'

export type Author = AnyOf<{
  name?: string
  url?: string
  avatar?: string
}>

export type Attachment = {
  url: string
  mime_type: string
  title?: string
  size_in_bytes?: number
  duration_in_seconds?: number
}

export type Item<TDate extends DateLike> = {
  id: string
  url?: string
  external_url?: string
  title?: string
  content_html?: string
  content_text?: string
  summary?: string
  image?: string
  banner_image?: string
  date_published?: TDate
  date_modified?: TDate
  tags?: Array<string>
  authors?: Array<Author>
  language?: string
  attachments?: Array<Attachment>
} & ({ content_html: string } | { content_text: string })

export type Hub = {
  type: string
  url: string
}

export type Feed<TDate extends DateLike> = {
  title: string
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
  items: Array<Item<TDate>>
}
