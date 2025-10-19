export { parse as parseFeed } from './common/parse.js'

export type { Feed as AtomFeed } from './feeds/atom/common/types.js'
export { detect as detectAtomFeed } from './feeds/atom/detect/index.js'
export { generate as generateAtomFeed } from './feeds/atom/generate/index.js'
export { parse as parseAtomFeed } from './feeds/atom/parse/index.js'

export type { Feed as JsonFeed } from './feeds/json/common/types.js'
export { detect as detectJsonFeed } from './feeds/json/detect/index.js'
export { generate as generateJsonFeed } from './feeds/json/generate/index.js'
export { parse as parseJsonFeed } from './feeds/json/parse/index.js'

export type { Feed as RdfFeed } from './feeds/rdf/common/types.js'
export { detect as detectRdfFeed } from './feeds/rdf/detect/index.js'
export { parse as parseRdfFeed } from './feeds/rdf/parse/index.js'

export type { Feed as RssFeed } from './feeds/rss/common/types.js'
export { detect as detectRssFeed } from './feeds/rss/detect/index.js'
export { generate as generateRssFeed } from './feeds/rss/generate/index.js'
export { parse as parseRssFeed } from './feeds/rss/parse/index.js'

export type { Opml, Outline } from './opml/common/types.js'
export { generate as generateOpml } from './opml/generate/index.js'
export { parse as parseOpml } from './opml/parse/index.js'
