import type { DateLike } from './common/types.js'
import type { Atom as AtomTypes } from './feeds/atom/common/types.js'
import type { Json as JsonTypes } from './feeds/json/common/types.js'
import type { Rdf as RdfTypes } from './feeds/rdf/common/types.js'
import type { Rss as RssTypes } from './feeds/rss/common/types.js'
import type { Opml as OpmlTypes } from './opml/common/types.js'

export { DetectError, ParseError } from './common/error.js'
export { parse as parseFeed } from './common/parse.js'

/** @deprecated Use `import type { Atom } from 'feedsmith/types'` and access as `Atom.Feed` instead. */
export type AtomFeed<TDate extends DateLike> = AtomTypes.Feed<TDate>
export { detect as detectAtomFeed } from './feeds/atom/detect/index.js'
export { generate as generateAtomFeed } from './feeds/atom/generate/index.js'
export { parse as parseAtomFeed } from './feeds/atom/parse/index.js'

/** @deprecated Use `import type { Json } from 'feedsmith/types'` and access as `Json.Feed` instead. */
export type JsonFeed<TDate extends DateLike> = JsonTypes.Feed<TDate>
export { detect as detectJsonFeed } from './feeds/json/detect/index.js'
export { generate as generateJsonFeed } from './feeds/json/generate/index.js'
export { parse as parseJsonFeed } from './feeds/json/parse/index.js'

/** @deprecated Use `import type { Rdf } from 'feedsmith/types'` and access as `Rdf.Feed` instead. */
export type RdfFeed<TDate extends DateLike> = RdfTypes.Feed<TDate>
export { detect as detectRdfFeed } from './feeds/rdf/detect/index.js'
export { parse as parseRdfFeed } from './feeds/rdf/parse/index.js'

/** @deprecated Use `import type { Rss } from 'feedsmith/types'` and access as `Rss.Feed` instead. */
export type RssFeed<TDate extends DateLike> = RssTypes.Feed<TDate>
export { detect as detectRssFeed } from './feeds/rss/detect/index.js'
export { generate as generateRssFeed } from './feeds/rss/generate/index.js'
export { parse as parseRssFeed } from './feeds/rss/parse/index.js'

/** @deprecated Use `import type { Opml } from 'feedsmith/types'` and access as `Opml.Document` instead. */
export type Opml<
  TDate extends DateLike,
  A extends ReadonlyArray<string> = ReadonlyArray<string>,
> = OpmlTypes.Document<TDate, A>
export { generate as generateOpml } from './opml/generate/index.js'
export { parse as parseOpml } from './opml/parse/index.js'
