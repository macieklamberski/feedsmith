import type { DateLike } from '../../../common/types.js'

export type InReplyTo = {
  ref: string
  href?: string
  type?: string
  source?: string
}

export type Link<TDate extends DateLike> = {
  count?: number
  updated?: TDate // Date: RFC 3339/ISO 8601.
}

export type Item = {
  total?: number
  inReplyTos?: Array<InReplyTo>
}
