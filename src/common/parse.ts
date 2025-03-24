import { detect as detectAtom } from '../feeds/atom/detect'
import { parse as parseAtom } from '../feeds/atom/parse'
import type { Feed as AtomFeed } from '../feeds/atom/types'
import { detect as detectJson } from '../feeds/json/detect'
import { parse as parseJson } from '../feeds/json/parse'
import type { Feed as JsonFeed } from '../feeds/json/types'
import { detect as detectRdf } from '../feeds/rdf/detect'
import { parse as parseRdf } from '../feeds/rdf/parse'
import type { Feed as RdfFeed } from '../feeds/rdf/types'
import { detect as detectRss } from '../feeds/rss/detect'
import { parse as parseRss } from '../feeds/rss/parse'
import type { Feed as RssFeed } from '../feeds/rss/types'

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
