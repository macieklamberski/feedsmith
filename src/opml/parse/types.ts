export type Outline = {
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
}

export type Head = {
  title?: string
  dateCreated?: string
  dateModified?: string
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

export type Body = {
  outlines?: Array<Outline>
}

export type Opml = {
  head?: Head
  body?: Body
}
