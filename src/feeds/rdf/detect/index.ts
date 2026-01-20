import { namespaceUris } from '../../../common/config.js'
import { isNonEmptyString } from '../../../common/utils.js'

// RSS 0.9/1.0 namespace URIs (used for detection only, not in namespacePrefixes
// since these elements are the default/unprefixed content in RDF feeds).
const rssNamespaceUris = [
  'http://purl.org/rss/1.0/',
  'https://purl.org/rss/1.0/',
  'http://purl.org/rss/1.0',
  'https://purl.org/rss/1.0',
  'http://channel.netscape.com/rdf/simple/0.9/',
  'https://channel.netscape.com/rdf/simple/0.9/',
  'http://channel.netscape.com/rdf/simple/0.9',
  'https://channel.netscape.com/rdf/simple/0.9',
]

export const detect = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) {
    return false
  }

  const hasRdfElement = /(?:^|[\s>])<(?:\w+:)?rdf[\s>]/im.test(value)

  if (!hasRdfElement) {
    return false
  }

  const hasRdfNamespace = namespaceUris.rdf.some((uri) => value.includes(uri))
  const hasRssNamespace = rssNamespaceUris.some((uri) => value.includes(uri))
  const hasRdfElements = /(<(?:\w+:)?(channel|item|title|link|description)[\s>])/i.test(value)

  return hasRdfNamespace || hasRssNamespace || hasRdfElements
}
