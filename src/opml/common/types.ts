import type { AnyOf, DateLike } from '../../common/types.js'

export type Outline = AnyOf<{
  text?: string
  type?: string
  isComment?: boolean
  isBreakpoint?: boolean
  created?: string
  category?: string
  description?: string
  xmlUrl?: string
  htmlUrl?: string
  language?: string
  title?: string
  version?: string
  url?: string
  outlines?: Array<Outline>
}>

export type Head<TDate extends DateLike> = AnyOf<{
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
}>

export type Body = AnyOf<{
  outlines?: Array<Outline>
}>

export type Opml<TDate extends DateLike> = AnyOf<{
  head?: Head<TDate>
  body?: Body
}>
