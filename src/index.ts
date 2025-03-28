export type { Feed } from './common/parse'
export { parse as parseFeed } from './common/parse'

export type { Feed as AtomFeed } from './feeds/atom/parse/types'
export { parse as parseAtomFeed } from './feeds/atom/parse/index'
export { detect as detectAtomFeed } from './feeds/atom/detect/index'

export type { Feed as JsonFeed } from './feeds/json/parse/types'
export { parse as parseJsonFeed } from './feeds/json/parse/index'
export { generate as generateJsonFeed } from './feeds/json/generate/index'
export { detect as detectJsonFeed } from './feeds/json/detect/index'

export type { Feed as RssFeed } from './feeds/rss/parse/types'
export { parse as parseRssFeed } from './feeds/rss/parse/index'
export { detect as detectRssFeed } from './feeds/rss/detect/index'

export type { Feed as RdfFeed } from './feeds/rdf/parse/types'
export { parse as parseRdfFeed } from './feeds/rdf/parse/index'
export { detect as detectRdfFeed } from './feeds/rdf/detect/index'
