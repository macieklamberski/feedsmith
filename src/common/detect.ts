import { detect as detectAtomFeed } from '../feeds/atom/detect/index.js'
import { detect as detectJsonFeed } from '../feeds/json/detect/index.js'
import { detect as detectRdfFeed } from '../feeds/rdf/detect/index.js'
import { detect as detectRssFeed } from '../feeds/rss/detect/index.js'
import type { AnyFeed } from './parse.js'
import { parseJsonObject } from './utils.js'

// The order matters: it is the order the universal parser resolves a format in, so a value
// that two detectors would accept gets the same answer here as it does from parsing.
export const detect = (value: unknown): AnyFeed['format'] | undefined => {
  // A JSON string is parsed into an object here, so the XML detectors, which only accept strings,
  // skip it. Otherwise feed markup inside a JSON Feed's content would pass for RSS or Atom.
  const input = parseJsonObject(value) ?? value

  if (detectRssFeed(input)) {
    return 'rss'
  }

  if (detectAtomFeed(input)) {
    return 'atom'
  }

  if (detectRdfFeed(input)) {
    return 'rdf'
  }

  if (detectJsonFeed(input)) {
    return 'json'
  }
}
