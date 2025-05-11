export type InReplyTo = {
  ref?: string
  href?: string
  type?: string
  source?: string
}

export type Link = {
  count?: number
  updated?: string
}

export type Item = {
  total?: number
  inReplyTos?: Array<InReplyTo>
}

export type Feed = {
  total?: number
}
