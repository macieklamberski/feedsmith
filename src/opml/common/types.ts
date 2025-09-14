import type { DateLike, DeepPartial, Unreliable } from '../../common/types.js'

export type Options = {
  extraOutlineAttributes?: Array<string>
}

export type ParsePartialFunction<R> = (
  value: Unreliable,
  options?: Options,
) => DeepPartial<R> | undefined

export type GenerateFunction<V> = (
  value: V | undefined,
  options?: Options,
) => Unreliable | undefined

// #region reference
export type Outline<TDate extends DateLike> = {
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
  outlines?: Array<Outline<TDate>>
  [key: string]: unknown
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

export type Body<TDate extends DateLike> = {
  outlines?: Array<Outline<TDate>>
}

export type Opml<TDate extends DateLike> = {
  head?: Head<TDate>
  body?: Body<TDate>
}
// #endregion reference
