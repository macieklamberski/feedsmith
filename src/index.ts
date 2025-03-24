export { parse as parseFeed } from './common/parse'
export type { Feed } from './common/parse'

export { parse as parseAtomFeed } from './feeds/atom/parse'
export { detect as detectAtomFeed } from './feeds/atom/detect'
export type { Feed as AtomFeed } from './feeds/atom/types'

export { parse as parseJsonFeed } from './feeds/json/parse'
export { detect as detectJsonFeed } from './feeds/json/detect'
export type { Feed as JsonFeed } from './feeds/json/types'

export { parse as parseRssFeed } from './feeds/rss/parse'
export { detect as detectRssFeed } from './feeds/rss/detect'
export type { Feed as RssFeed } from './feeds/rss/types'

export { parse as parseRdfFeed } from './feeds/rdf/parse'
export { detect as detectRdfFeed } from './feeds/rdf/detect'
export type { Feed as RdfFeed } from './feeds/rdf/types'
