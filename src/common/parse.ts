import type { AtomFeed } from '../feeds/atom/common/types.js'
import { detect as detectAtomFeed } from '../feeds/atom/detect/index.js'
import { parse as parseAtomFeed } from '../feeds/atom/parse/index.js'
import type { JsonFeed } from '../feeds/json/common/types.js'
import { detect as detectJsonFeed } from '../feeds/json/detect/index.js'
import { parse as parseJsonFeed } from '../feeds/json/parse/index.js'
import type { RdfFeed } from '../feeds/rdf/common/types.js'
import { detect as detectRdfFeed } from '../feeds/rdf/detect/index.js'
import { parse as parseRdfFeed } from '../feeds/rdf/parse/index.js'
import type { RssFeed } from '../feeds/rss/common/types.js'
import { detect as detectRssFeed } from '../feeds/rss/detect/index.js'
import { parse as parseRssFeed } from '../feeds/rss/parse/index.js'
import { locales } from './config.js'
import { DetectError } from './errors.js'
import type { ParseMainOptions } from './types.js'
import { parseJsonObject } from './utils.js'

export type AnyFeed<TDate = string> =
  | { format: 'rss'; feed: RssFeed.Feed<TDate> }
  | { format: 'atom'; feed: AtomFeed.Feed<TDate> }
  | { format: 'rdf'; feed: RdfFeed.Feed<TDate> }
  | { format: 'json'; feed: JsonFeed.Feed<TDate> }

export const parse = <TDate = string>(
  value: unknown,
  options?: ParseMainOptions<TDate>,
): AnyFeed<TDate> => {
  if (detectRssFeed(value)) {
    return { format: 'rss', feed: parseRssFeed(value, options) }
  }

  if (detectAtomFeed(value)) {
    return { format: 'atom', feed: parseAtomFeed(value, options) }
  }

  if (detectRdfFeed(value)) {
    return { format: 'rdf', feed: parseRdfFeed(value, options) }
  }

  const json = parseJsonObject(value)

  if (detectJsonFeed(json)) {
    return { format: 'json', feed: parseJsonFeed(json, options) }
  }

  throw new DetectError(locales.unrecognizedFeedFormat)
}

/** @deprecated Use `parseAnyFeed` instead. Will be removed in the next major version. */
export const parseFeed = parse
