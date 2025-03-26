import { detect as detectAtomFeed } from '../feeds/atom/detect'
import { parse as parseAtomFeed } from '../feeds/atom/parse/index'
import type { Feed as AtomFeed } from '../feeds/atom/parse/types'
import { detect as detectJsonFeed } from '../feeds/json/detect'
import { parse as parseJsonFeed } from '../feeds/json/parse/index'
import type { Feed as JsonFeed } from '../feeds/json/parse/types'
import { detect as detectRdfFeed } from '../feeds/rdf/detect'
import { parse as parseRdfFeed } from '../feeds/rdf/parse'
import type { Feed as RdfFeed } from '../feeds/rdf/types'
import { detect as detectRssFeed } from '../feeds/rss/detect/index'
import { parse as parseRssFeed } from '../feeds/rss/parse/index'
import type { Feed as RssFeed } from '../feeds/rss/parse/types'
import { locales } from './config'

export type Feed =
  | { type: 'json'; feed: JsonFeed }
  | { type: 'rss'; feed: RssFeed }
  | { type: 'atom'; feed: AtomFeed }
  | { type: 'rdf'; feed: RdfFeed }

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
