import type { ParsedFeed as ParsedJsonFeed } from '../../json/parse/types'
import type { ParsedFeed as ParsedRssFeed } from '../../rss/parse/types'

export type ParseLevel = 'strict' | 'skip' | 'coerce'

export type NonStrictParseLevel = 'skip' | 'coerce'

// biome-ignore lint/suspicious/noExplicitAny: Temporary solution until the Unreliable type fixed.
export type Unreliable = any // Was: { [key: string]: Unreliable } | undefined.

export type ParseFunction<R> = (value: Unreliable, level: NonStrictParseLevel) => R | undefined

export type ParsedFeed = {
  type: 'json' | 'rss' | 'atom' | 'rdf'
  feed: ParsedJsonFeed | ParsedRssFeed
}
