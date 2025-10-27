import type { Atom } from '../feeds/atom/common/types.js'
import { detect as detectAtomFeed } from '../feeds/atom/detect/index.js'
import { parse as parseAtomFeed } from '../feeds/atom/parse/index.js'
import type { Json } from '../feeds/json/common/types.js'
import { detect as detectJsonFeed } from '../feeds/json/detect/index.js'
import { parse as parseJsonFeed } from '../feeds/json/parse/index.js'
import type { Rdf } from '../feeds/rdf/common/types.js'
import { detect as detectRdfFeed } from '../feeds/rdf/detect/index.js'
import { parse as parseRdfFeed } from '../feeds/rdf/parse/index.js'
import type { Rss } from '../feeds/rss/common/types.js'
import { detect as detectRssFeed } from '../feeds/rss/detect/index.js'
import { parse as parseRssFeed } from '../feeds/rss/parse/index.js'
import { locales } from './config.js'
import type { DeepPartial } from './types.js'

export type Parse = (
  value: unknown,
) =>
  | { format: 'rss'; feed: DeepPartial<Rss.Feed<string>> }
  | { format: 'atom'; feed: DeepPartial<Atom.Feed<string>> }
  | { format: 'rdf'; feed: DeepPartial<Rdf.Feed<string>> }
  | { format: 'json'; feed: DeepPartial<Json.Feed<string>> }

export const parse: Parse = (value) => {
  if (detectRssFeed(value)) {
    return { format: 'rss', feed: parseRssFeed(value) }
  }

  if (detectAtomFeed(value)) {
    return { format: 'atom', feed: parseAtomFeed(value) }
  }

  if (detectRdfFeed(value)) {
    return { format: 'rdf', feed: parseRdfFeed(value) }
  }

  if (detectJsonFeed(value)) {
    return { format: 'json', feed: parseJsonFeed(value) }
  }

  throw new Error(locales.unrecognizedFeedFormat)
}
