import type { AtomFeed } from '../feeds/atom/common/types.js'
import { parse as parseAtomFeed } from '../feeds/atom/parse/index.js'
import type { JsonFeed } from '../feeds/json/common/types.js'
import { parse as parseJsonFeed } from '../feeds/json/parse/index.js'
import type { RdfFeed } from '../feeds/rdf/common/types.js'
import { parse as parseRdfFeed } from '../feeds/rdf/parse/index.js'
import type { RssFeed } from '../feeds/rss/common/types.js'
import { parse as parseRssFeed } from '../feeds/rss/parse/index.js'
import { locales } from './config.js'
import { detect } from './detect.js'
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
  // A JSON string is parsed once here, so that detecting it and parsing it share the result.
  const input = parseJsonObject(value) ?? value
  const format = detect(input)

  if (format === 'rss') {
    return { format, feed: parseRssFeed(input, options) }
  }

  if (format === 'atom') {
    return { format, feed: parseAtomFeed(input, options) }
  }

  if (format === 'rdf') {
    return { format, feed: parseRdfFeed(input, options) }
  }

  if (format === 'json') {
    return { format, feed: parseJsonFeed(input, options) }
  }

  throw new DetectError(locales.unrecognizedFeedFormat)
}
