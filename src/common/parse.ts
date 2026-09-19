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
  // A JSON string is read as JSON before the XML detectors see it. They match on markup, and a
  // JSON Feed can carry feed markup inside its content, which would pass for an RSS or Atom feed.
  const input = parseJsonObject(value) ?? value

  if (detectRssFeed(input)) {
    return { format: 'rss', feed: parseRssFeed(input, options) }
  }

  if (detectAtomFeed(input)) {
    return { format: 'atom', feed: parseAtomFeed(input, options) }
  }

  if (detectRdfFeed(input)) {
    return { format: 'rdf', feed: parseRdfFeed(input, options) }
  }

  if (detectJsonFeed(input)) {
    return { format: 'json', feed: parseJsonFeed(input, options) }
  }

  throw new DetectError(locales.unrecognizedFeedFormat)
}
