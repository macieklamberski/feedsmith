export { parse as parseFeed } from './common/parse'
export type { Feed } from './common/parse'

export { parse as parseAtomFeed } from './feeds/atom/parse'
export type { Feed as AtomFeed } from './feeds/atom/types'
export { detect as detectAtomFeed } from './feeds/atom/detect'

export { parse as parseJsonFeed } from './feeds/json/parse/index'
export type { Feed as JsonFeed } from './feeds/json/parse/types'
export { detect as detectJsonFeed } from './feeds/json/detect/index'

export { parse as parseRssFeed } from './feeds/rss/parse'
export type { Feed as RssFeed } from './feeds/rss/types'
export { detect as detectRssFeed } from './feeds/rss/detect'

export { parse as parseRdfFeed } from './feeds/rdf/parse'
export type { Feed as RdfFeed } from './feeds/rdf/types'
export { detect as detectRdfFeed } from './feeds/rdf/detect'
