import { isPlainObject, trimObject } from 'trousse'
import type { ParseUtilPartial } from '../../../common/types.js'
import {
  parseArrayOf,
  parseSingular,
  parseSingularOf,
  parseString,
  retrieveText,
} from '../../../common/utils.js'
import type { WikiNs } from '../common/types.js'

const hostRegex = /<[^>]*\swiki:host\s*=\s*(["'])(.*?)\1/i

// The spec writes the InterWiki moniker either as plain text or as an rdf:Description whose
// rdf:value holds the moniker and whose link attribute holds the InterWiki prefix url. RDF feeds
// carry rdf:Description and rdf:value without the prefix.
export const parseInterwiki: ParseUtilPartial<WikiNs.Interwiki> = (value) => {
  const description = isPlainObject(value)
    ? parseSingular(value['rdf:description'] ?? value.description)
    : undefined

  if (!isPlainObject(description)) {
    return trimObject({ value: parseString(retrieveText(value)) })
  }

  const interwiki = {
    value: parseSingularOf(description['rdf:value'] ?? description.value, (value) =>
      parseString(retrieveText(value)),
    ),
    link: parseString(description['@link']) ?? parseString(description['@rss:link']),
  }

  return trimObject(interwiki)
}

// The spec places wiki:host on the rdf:Description inside dc:contributor. That element is a Dublin
// Core stop node, so the rdf:Description arrives as raw markup.
export const parseHost: ParseUtilPartial<string> = (value) => {
  const text = retrieveText(value)

  if (typeof text !== 'string') {
    return
  }

  return parseString(hostRegex.exec(text)?.[2])
}

export const retrieveHost: ParseUtilPartial<string> = (value) => {
  return parseArrayOf(value, parseHost)?.[0]
}

export const retrieveFeed: ParseUtilPartial<WikiNs.Feed> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const feed = {
    interwiki: parseSingularOf(value['wiki:interwiki'], parseInterwiki),
  }

  return trimObject(feed)
}

export const retrieveItem: ParseUtilPartial<WikiNs.Item> = (value) => {
  if (!isPlainObject(value)) {
    return
  }

  const item = {
    host: retrieveHost(value['dc:contributor']),
    version: parseSingularOf(value['wiki:version'], (value) => parseString(retrieveText(value))),
    status: parseSingularOf(value['wiki:status'], (value) => parseString(retrieveText(value))),
    importance: parseSingularOf(value['wiki:importance'], (value) =>
      parseString(retrieveText(value)),
    ),
    diff: parseSingularOf(value['wiki:diff'], (value) => parseString(retrieveText(value))),
    history: parseSingularOf(value['wiki:history'], (value) => parseString(retrieveText(value))),
  }

  return trimObject(item)
}
