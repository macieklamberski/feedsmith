import type { ParsedFeed as ParsedJsonFeed } from '../../json/parse/types'
import type { ParsedFeed as ParsedRssFeed } from '../../rss/parse/types'

export type ParseLevel = 'strict' | 'skip' | 'coerce'

export type NonStrictParseLevel = 'skip' | 'coerce'

export type Unreliable = { [key: string]: Unreliable } | undefined

export type ParseFunction<R> = (value: unknown, level: NonStrictParseLevel) => R | undefined

export type ParsedFeed = {
  type: 'json' | 'rss' | 'atom' | 'rdf'
  feed: ParsedJsonFeed | ParsedRssFeed
}
