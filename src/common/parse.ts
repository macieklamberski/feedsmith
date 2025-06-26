import type { Feed as AtomFeed } from '../feeds/atom/common/types.js'
import { detect as detectAtomFeed } from '../feeds/atom/detect/index.js'
import { parse as parseAtomFeed } from '../feeds/atom/parse/index.js'
import type { Feed as JsonFeed } from '../feeds/json/common/types.js'
import { detect as detectJsonFeed } from '../feeds/json/detect/index.js'
import { parse as parseJsonFeed } from '../feeds/json/parse/index.js'
import type { Feed as RdfFeed } from '../feeds/rdf/common/types.js'
import { detect as detectRdfFeed } from '../feeds/rdf/detect/index.js'
import { parse as parseRdfFeed } from '../feeds/rdf/parse/index.js'
import type { Feed as RssFeed } from '../feeds/rss/common/types.js'
import { detect as detectRssFeed } from '../feeds/rss/detect/index.js'
import { parse as parseRssFeed } from '../feeds/rss/parse/index.js'
import { locales } from './config.js'
import type { DeepPartial } from './types.js'

export type Feed =
  | { type: 'json'; feed: DeepPartial<JsonFeed<string>> }
  | { type: 'rss'; feed: DeepPartial<RssFeed<string>> }
  | { type: 'atom'; feed: DeepPartial<AtomFeed<string>> }
  | { type: 'rdf'; feed: DeepPartial<RdfFeed<string>> }

export const parse = (value: unknown): Feed => {
  if (detectAtomFeed(value)) {
    return { type: 'atom', feed: parseAtomFeed(value) }
  }

  if (detectJsonFeed(value)) {
    return { type: 'json', feed: parseJsonFeed(value) }
  }

  if (detectRssFeed(value)) {
    return { type: 'rss', feed: parseRssFeed(value) }
  }

  if (detectRdfFeed(value)) {
    return { type: 'rdf', feed: parseRdfFeed(value) }
  }

  throw new Error(locales.unrecognized)
}
