import {
  type Feed as AtomFeed,
  detect as detectAtom,
  parse as parseAtom,
} from '../feeds/atom/index'
import {
  type Feed as JsonFeed,
  detect as detectJson,
  parse as parseJson,
} from '../feeds/json/index'
import { type Feed as RdfFeed, detect as detectRdf, parse as parseRdf } from '../feeds/rdf/index'
import { type Feed as RssFeed, detect as detectRss, parse as parseRss } from '../feeds/rss/index'

export type Feed =
  | { type: 'json'; feed: JsonFeed }
  | { type: 'rss'; feed: RssFeed }
  | { type: 'atom'; feed: AtomFeed }
  | { type: 'rdf'; feed: RdfFeed }

export const parse = (value: unknown): Feed | undefined => {
  if (detectAtom(value)) {
    const feed = parseAtom(value)
    return feed ? { type: 'atom', feed } : undefined
  }

  if (detectJson(value)) {
    const feed = parseJson(value)
    return feed ? { type: 'json', feed } : undefined
  }

  if (detectRss(value)) {
    const feed = parseRss(value)
    return feed ? { type: 'rss', feed } : undefined
  }

  if (detectRdf(value)) {
    const feed = parseRdf(value)
    return feed ? { type: 'rdf', feed } : undefined
  }
}
