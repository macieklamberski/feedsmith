import type { Feed as AtomFeed } from '../feeds/atom/types'
import type { Feed as JsonFeed } from '../feeds/json/types'
import type { Feed as RdfFeed } from '../feeds/rdf/types'
import type { Feed as RssFeed } from '../feeds/rss/types'

export type ParseLevel = 'strict' | 'skip' | 'coerce'

export type NonStrictParseLevel = 'skip' | 'coerce'

// biome-ignore lint/suspicious/noExplicitAny: Temporary solution until the Unreliable type fixed.
export type Unreliable = any // Was: { [key: string]: Unreliable } | undefined.

export type ParseFunction<R> = (value: Unreliable, level: NonStrictParseLevel) => R | undefined

export type Feed = {
  type: 'json' | 'rss' | 'atom' | 'rdf'
  feed: JsonFeed | RssFeed | AtomFeed | RdfFeed
}
