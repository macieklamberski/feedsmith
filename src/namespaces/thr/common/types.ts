import type { AnyOf, DateLike } from '../../../common/types.js'

export type InReplyTo = {
  ref: string
  href?: string
  type?: string
  source?: string
}

export type Link<TDate extends DateLike> = AnyOf<{
  count?: number
  updated?: TDate // Date: RFC 3339/ISO 8601.
}>

export type Item = AnyOf<{
  total?: number
  inReplyTos?: Array<InReplyTo>
}>

export type Feed = AnyOf<{
  total?: number
}>
