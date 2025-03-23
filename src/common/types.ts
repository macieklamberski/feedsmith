import type { Feed as AtomFeed } from '../feeds/atom/types'
import type { Feed as JsonFeed } from '../feeds/json/types'
import type { Feed as RdfFeed } from '../feeds/rdf/types'
import type { Feed as RssFeed } from '../feeds/rss/types'

// TODO: Try to use: { [key: string]: Unreliable } | undefined for better type safety.
// biome-ignore lint/suspicious/noExplicitAny: Temporary solution until the Unreliable type fixed.
export type Unreliable = any

export type ParseFunction<R, O = unknown> = (value: Unreliable, options?: O) => R | undefined

export type Feed = {
  type: 'json' | 'rss' | 'atom' | 'rdf'
  feed: JsonFeed | RssFeed | AtomFeed | RdfFeed
}
