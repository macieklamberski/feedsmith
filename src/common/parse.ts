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
import type { DeepPartial, ParseOptions } from './types.js'

export type Parse = (
  value: unknown,
  options?: ParseOptions,
) =>
  | { format: 'rss'; feed: DeepPartial<Rss.Feed<string>> }
  | { format: 'atom'; feed: DeepPartial<Atom.Feed<string>> }
  | { format: 'rdf'; feed: DeepPartial<Rdf.Feed<string>> }
  | { format: 'json'; feed: DeepPartial<Json.Feed<string>> }

export const parse: Parse = (value, options) => {
  if (detectRssFeed(value)) {
    return { format: 'rss', feed: parseRssFeed(value, options) }
  }

  if (detectAtomFeed(value)) {
    return { format: 'atom', feed: parseAtomFeed(value, options) }
  }

  if (detectRdfFeed(value)) {
    return { format: 'rdf', feed: parseRdfFeed(value, options) }
  }

  if (detectJsonFeed(value)) {
    return { format: 'json', feed: parseJsonFeed(value, options) }
  }

  throw new Error(locales.unrecognizedFeedFormat)
}
