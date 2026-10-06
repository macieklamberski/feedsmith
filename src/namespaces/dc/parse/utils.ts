import { XMLParser } from 'fast-xml-parser'
import { isPlainObject, isPresent, trimObject } from 'trousse'
import { parserConfig } from '../../../common/config.js'
import type {
  DateAny,
  ParseMainOptions,
  ParseUtilPartial,
  Unreliable,
} from '../../../common/types.js'
import {
  parseArrayOf,
  parseDate,
  parseSingular,
  parseString,
  retrieveText,
} from '../../../common/utils.js'
import type { DcNs } from '../common/types.js'

const valueNodeRegex = /^\s*<[a-z_][\w.-]*:[a-z_][\w.-]*[\s/>]/i

// The value is re-parsed because every dc element is a stop node, so its markup arrives raw.
const valueNodeParser = new XMLParser({
  ...parserConfig,
  stopNodes: ['*.rdf:value'],
})

// A DC property in RDF can hold a value node in place of a literal: an rdf:Description or a typed
// node such as foaf:Person. Its value string is in rdf:value, its value URI in rdf:about.
// See: https://web.archive.org/web/20110101182532/http://dublincore.org/documents/dc-rdf/, sections 4.4 and 4.6.
const retrieveValue = (value: Unreliable): Unreliable => {
  const text = retrieveText(value)

  if (typeof text !== 'string' || !valueNodeRegex.test(text)) {
    return text
  }

  let parsed: Unreliable

  try {
    parsed = valueNodeParser.parse(text)
  } catch {
    return text
  }

  const [name] = Object.keys(parsed)
  const node = parseSingular(parsed[name])
  const rdfValue = node?.['rdf:value']

  if (isPresent(rdfValue)) {
    return retrieveText(parseSingular(rdfValue))
  }

  // Markup with a prefixed root, such as Word's <o:p>, is text when it is not a value node.
  if (name !== 'rdf:description') {
    return text
  }

  return node?.['@rdf:about']
}

export const retrieveItemOrFeed: ParseUtilPartial<
  DcNs.ItemOrFeed<DateAny>,
  ParseMainOptions<DateAny>
> = (value, options) => {
  if (!isPlainObject(value)) {
    return
  }

  const itemOrFeed = {
    titles: parseArrayOf(value['dc:title'], (value) => parseString(retrieveValue(value))),
    creators: parseArrayOf(value['dc:creator'], (value) => parseString(retrieveValue(value))),
    subjects: parseArrayOf(value['dc:subject'], (value) => parseString(retrieveValue(value))),
    descriptions: parseArrayOf(value['dc:description'], (value) =>
      parseString(retrieveValue(value)),
    ),
    publishers: parseArrayOf(value['dc:publisher'], (value) => parseString(retrieveValue(value))),
    contributors: parseArrayOf(value['dc:contributor'], (value) =>
      parseString(retrieveValue(value)),
    ),
    dates: parseArrayOf(value['dc:date'], (value) =>
      parseDate(retrieveValue(value), options?.parseDateFn),
    ),
    types: parseArrayOf(value['dc:type'], (value) => parseString(retrieveValue(value))),
    formats: parseArrayOf(value['dc:format'], (value) => parseString(retrieveValue(value))),
    identifiers: parseArrayOf(value['dc:identifier'], (value) => parseString(retrieveValue(value))),
    sources: parseArrayOf(value['dc:source'], (value) => parseString(retrieveValue(value))),
    languages: parseArrayOf(value['dc:language'], (value) => parseString(retrieveValue(value))),
    relations: parseArrayOf(value['dc:relation'], (value) => parseString(retrieveValue(value))),
    coverage: parseArrayOf(value['dc:coverage'], (value) => parseString(retrieveValue(value))),
    rights: parseArrayOf(value['dc:rights'], (value) => parseString(retrieveValue(value))),
  }

  return trimObject(itemOrFeed)
}
