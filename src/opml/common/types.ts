import type { DateLike, ExtraFields } from '../../common/types.js'

export type Options<A extends ReadonlyArray<string> = ReadonlyArray<string>> = {
  extraOutlineAttributes?: A
}

// #region reference
export type Outline<
  D extends DateLike = DateLike,
  A extends ReadonlyArray<string> = ReadonlyArray<string>,
> = {
  text: string
  type?: string
  isComment?: boolean
  isBreakpoint?: boolean
  created?: D
  category?: string
  description?: string
  xmlUrl?: string
  htmlUrl?: string
  language?: string
  title?: string
  version?: string
  url?: string
  outlines?: Array<Outline<D, A>>
} & ExtraFields<A>

export type Head<D extends DateLike = DateLike> = {
  title?: string
  dateCreated?: D
  dateModified?: D
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
  D extends DateLike = DateLike,
  A extends ReadonlyArray<string> = ReadonlyArray<string>,
> = {
  outlines?: Array<Outline<D, A>>
}

export type Opml<
  D extends DateLike = DateLike,
  A extends ReadonlyArray<string> = ReadonlyArray<string>,
> = {
  head?: Head<D>
  body?: Body<D, A>
}
// #endregion reference
